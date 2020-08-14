const recursiveReadDir = require('recursive-readdir');
const fuzzysort = require('fuzzysort');
import { promisify } from 'util';
import { Service } from 'typedi';
import Project from './Project';
import SourceFile, { ParseFailure, ParseResult } from './SourceFile';
import { getFileType } from 'indexer/util';
import ESModuleItem, { Marker } from './ESModuleItem';
import { readFile, Stats, statSync } from 'fs';
import { findAbsoluteFilePathWhichExists } from './fileResolver';
import { dirname, join, relative, isAbsolute, sep } from 'path';
import { WorkerRunner } from './WorkerRunner';

@Service()
export default class Indexer {
    public files: { [path: string]: SourceFile } = {};
    public status: 'needs_indexing' | 'indexed' | 'indexing' = 'needs_indexing';
    public project: Project | undefined;
    public totalFiles: number = 0;
    public indexedFileCount: number = 0;
    public failures: ParseFailure[] = [];
    public workerJSFile: string | undefined;
    public workerRunner: WorkerRunner;

    constructor() {
        this.workerRunner = new WorkerRunner();
    }

    public async parse(
        project: Project,
        cache?: { [path: string]: ParseResult }
    ) {
        this.status = 'indexing';
        this.project = project;
        this.failures = [];

        const files = await this.readProjectFiles(project.root);

        let supportedFiles = files.filter(
            filePath => getFileType(filePath) !== 'UNSUPPORTED'
        );

        if (cache) {
            supportedFiles = this.getModifiedFilesForIndexing(
                supportedFiles,
                cache,
                project
            );
        }
        this.totalFiles = supportedFiles.length;

        this.indexedFileCount = 0;
        return this.relaxedIndexer(supportedFiles, project);
    }

    public getModifiedFilesForIndexing(
        allSupportedFiles: string[],
        cache: { [path: string]: ParseResult },
        project: Project
    ) {
        const fileToIndex: string[] = [];

        allSupportedFiles.forEach(filePath => {
            if (cache[filePath]) {
                const cachedFile = cache[filePath];
                const stat = statSync(cachedFile.path);

                if (!cachedFile.lastIndexedTime) {
                    fileToIndex.push(filePath);
                } else if (stat.mtimeMs > cachedFile.lastIndexedTime) {
                    fileToIndex.push(filePath);
                } else {
                    // add cached file to index
                    const fileObj = SourceFile.getFileFromJSON(
                        cachedFile,
                        project.root,
                        project.pathAlias
                    );
                    this.files[filePath] = fileObj;
                }
            } else {
                fileToIndex.push(filePath);
            }
        });

        return fileToIndex;
    }

    public async relaxedIndexer(filesToIndex: string[], project: Project) {
        if (filesToIndex.length === 0) {
            this.status = 'indexed';
            return;
        }

        if (this.project) {
            await this.workerRunner.run(
                {
                    files: filesToIndex,
                    pathAlias: this.project?.pathAlias,
                    root: this.project?.root,
                },
                (file: SourceFile) => {
                    this.indexedFileCount += 1;
                    file.root = project.root;
                    file.pathAliasMap = project.pathAlias;
                    this.files[file.path] = file;
                },
                this.workerJSFile
            );
            this.status = 'indexed';
        }
    }

    public indexFile(path: string) {
        if (!this.project) {
            return;
        }

        const sourceFile = new SourceFile(
            path,
            this.project.pathAlias,
            this.project.root
        );
        this.files[path] = sourceFile;
        sourceFile.parse();
    }

    public search(query: string, queryType: string) {
        try {
            let searchTokens = query
                .split(/(\s+)/)
                .filter(item => item.trim() !== '');

            const searchQuery =
                searchTokens.length === 1 ? query : searchTokens[0];
            const folderQuery =
                searchTokens.length > 1 ? searchTokens[1] : null;
            const queryTypes = queryType.split(':');

            let results: ESModuleItem[] = [];
            Object.entries(this.files)
                .filter(([, file]) => {
                    if (folderQuery === null) {
                        return true;
                    } else {
                        return file.path.includes(folderQuery);
                    }
                })
                .forEach(([, file]) => {
                    file.symbols.forEach(symbol => {
                        if (
                            queryType === '' ||
                            (queryTypes.includes('func') &&
                                symbol.kind === 'FunctionDeclaration') ||
                            (queryTypes.includes('type') &&
                                (symbol.kind === 'TypeAlias' ||
                                    symbol.kind ===
                                        'TSInterfaceDeclaration')) ||
                            (queryTypes.includes('var') &&
                                symbol.kind === 'VariableDeclaration') ||
                            (queryTypes.includes('class') &&
                                symbol.kind === 'ClassDeclaration')
                        ) {
                            results.push({
                                ...symbol,
                                path: file.path,
                            });
                        }
                    });
                });

            const filteredResults = fuzzysort.go(searchQuery, results, {
                key: 'name',
                limit: 100,
            });

            return filteredResults;
        } catch (e) {
            return [];
        }
    }

    public searchFile(query: string) {
        const filteredResults = fuzzysort.go(query, Object.keys(this.files), {
            limit: 100,
        });
        return filteredResults;
    }

    public getSymbolWithMarkers(path: string, name: string) {
        const shouldGetDefaultExport = name === '@@DEFAULT_EXPORT@@';
        const file = this.files[path];

        if (shouldGetDefaultExport) {
            return file.symbols.find(symbol => symbol.isDefaultExport === true);
        }

        const symbol = file.symbols.find(symbol => symbol.name === name);

        if (!symbol && this.project) {
            const reExportedSymbol = this.getReExportedSymbol(name, path, file);
            if (reExportedSymbol) {
                return reExportedSymbol;
            }
        }
        return symbol;
    }

    public getSymbolsForPath(path: string) {
        const file = this.files[path];
        if (!file) {
            return [];
        }

        return file.symbols;
    }

    public findReference(name: string, path: string) {
        const markers: Marker[] = [];
        Object.values(this.files).forEach(file => {
            const symbols = file.symbols;
            symbols.forEach(symbol => {
                symbol.markers.forEach(marker => {
                    if (
                        marker.filePath === path &&
                        marker.name === name &&
                        symbol.location
                    ) {
                        markers.push({
                            name: symbol.name,
                            filePath: symbol.path,
                            location: symbol.location,
                        });
                    }
                });
            });
        });
        return markers;
    }

    public async getCode(path: string, name: string) {
        const shouldGetDefaultExport = name === '@@DEFAULT_EXPORT@@';
        const file = this.files[path];
        if (file) {
            let symbol: ESModuleItem | null | undefined;

            if (shouldGetDefaultExport) {
                symbol = file.symbols.find(
                    symbol => symbol.isDefaultExport === true
                );
            }

            if (!symbol) {
                symbol = file.symbols.find(symbol => symbol.name === name);
            }

            if (!symbol || !symbol.location) {
                symbol = this.getReExportedSymbol(name, path, file);
                if (!symbol || !symbol.location) {
                    return '';
                }
            }

            const content = await promisify(readFile)(symbol.path);
            const code = content.toString();
            const lines = code.split('\n');

            const {
                start = { line: 0, column: 0 },
                end = { line: 0, column: 0 },
            } = symbol.location;

            const results: string[] = [];

            lines.forEach((line, index) => {
                if (index >= start.line - 1 && index <= end.line - 1) {
                    results.push(line);
                }
            });

            return results.reduce((acc, line) => {
                return acc + line + '\n';
            }, '');
        }
    }

    public killAllWorkers() {
        this.workerRunner.kilAll();

        setTimeout(() => {
            this.status = 'needs_indexing';
            this.indexedFileCount = 0;
            this.totalFiles = 0;
            this.failures = [];
        }, 1000);
    }

    public getCache() {
        return Object.values(this.files).reduce(
            (acc: { [path: string]: ParseResult }, file) => {
                acc[file.path] = file.asJSON();
                return acc;
            },
            {}
        );
    }

    private isChildOf(child: string, parent: string) {
        if (child === parent) return true;
        const parentTokens = parent.split(sep).filter(i => i.length);
        return parentTokens.every(
            (t, i) => child.split(sep).filter(i => i.length)[i] === t
        );
    }

    private isPathLiesInProvidedDirectories(
        path: string,
        stats: Stats,
        directories: string[]
    ) {
        if (stats.isDirectory()) {
            return directories.some(directory =>
                this.isChildOf(path, directory)
            );
        }

        return directories.some(dir => path.includes(dir));
    }

    public getIgnoreFunc(
        indexableDirectories: string[],
        excludedDirectories: string[]
    ) {
        return (path: string, stats: Stats) => {
            // if no directories are configured, just ignore node_modules
            if (
                indexableDirectories.length === 0 &&
                excludedDirectories.length === 0
            ) {
                // if it's a file from node_modules, return true so it will be ignored
                return path.includes('node_modules');
            }

            // when the directories are provided, still we return true if the file is in node_modules
            if (path.includes('node_modules')) {
                return true;
            }

            if (
                this.isPathLiesInProvidedDirectories(
                    path,
                    stats,
                    indexableDirectories
                )
            ) {
                // even if the file belongs to a director which should be indexed, it should not belong to a directory which is excluded
                return this.isPathLiesInProvidedDirectories(
                    path,
                    stats,
                    excludedDirectories
                );
            }

            return true;
        };
    }

    private async readProjectFiles(root: string) {
        if (this.project) {
            const indexableDirectories = this.project.directories.map(
                directory => join(this.project?.root || '', directory)
            );

            const excludedDirectories = this.project.excludedDirectories.map(
                directory => join(this.project?.root || '', directory)
            );

            const ignoreFunc = this.getIgnoreFunc(
                indexableDirectories,
                excludedDirectories
            );

            return new Promise<string[]>((resolve, reject) => {
                recursiveReadDir(
                    root,
                    [ignoreFunc],
                    (err: Error, files: string[]) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(files);
                        }
                    }
                );
            });
        }

        return [];
    }

    private getReExportedSymbol(
        name: string,
        path: string,
        file: SourceFile
    ): ESModuleItem | null | undefined {
        if (!this.project) {
            return null;
        }

        let actualSymbolName = name;
        const exportStatement = file.exportStatements.find(s => {
            const specifier = s.specifiers.find(
                specifier => specifier.exported === name
            );
            if (specifier) {
                actualSymbolName = specifier?.local;
            }
            return specifier;
        });

        if (exportStatement) {
            const pathOfTheFile = exportStatement.path;
            const absolutePath = findAbsoluteFilePathWhichExists(
                this.project?.root,
                dirname(path),
                pathOfTheFile,
                this.project.pathAlias
            );
            const actualFile = this.files[absolutePath];
            const symbolFromActualFile = actualFile.symbols.find(
                symbol => symbol.name === actualSymbolName
            );

            if (symbolFromActualFile) {
                return symbolFromActualFile;
            }

            return this.getReExportedSymbol(name, absolutePath, actualFile);
        }
    }
}
