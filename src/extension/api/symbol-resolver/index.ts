import {
    Arg,
    Mutation,
    Query,
    Resolver,
    Args,
    Subscription,
    Root,
} from 'type-graphql';
import { ContainerInstance, Service } from 'typedi';
import Indexer from 'indexer/Indexer';
import Project from 'indexer/Project';
import { GqlSearchResult } from '../../../entities/GqlSearchResult';
import {
    GqlSymbolInformation,
    GqlMarkers,
} from 'entities/GqlSymbolInformation';
import ESModuleItem, { Marker } from 'indexer/ESModuleItem';
import { ReIndexArgs } from './ReIndexArgs';
import { sep } from 'path';
import * as vscode from 'vscode';
import { GqlProjectInfo } from 'entities/GqlProjectInfo';
import { existsSync } from 'fs';
import { GqlFile } from 'entities/GqlFile';
import { GqlLocation } from 'entities/GqlLocation';
import { GqlIndexerStatus } from 'entities/GqlIndexerStatus';
import { Uri } from 'vscode';
import { OpenFileArgs } from './OpenFileArgs';
import ConfigResolver from '../ConfigResolver';
import SourceFile, { isInLocation } from 'indexer/SourceFile';
import { pubSub } from 'common/pubSub';

@Service()
@Resolver(GqlSearchResult)
export default class SymbolsResolver {
    private activeEditorPath: string | undefined;
    private activeEditor: vscode.TextEditor | undefined;
    private configResolver: ConfigResolver;
    private workspaceFiles: { [path: string]: boolean } = {};

    constructor(
        private readonly container: ContainerInstance,
        private readonly indexer: Indexer
    ) {
        vscode.window.onDidChangeActiveTextEditor(e => {
            if (e && existsSync(e.document.fileName)) {
                this.activeEditorPath = e.document.fileName;
                this.activeEditor = e;
            }
        });
        vscode.workspace.onDidSaveTextDocument(e => {
            indexer.indexFile(e.fileName);
        });

        vscode.workspace.textDocuments.forEach(doc => {
            this.workspaceFiles[doc.fileName] = true;
        });

        vscode.workspace.onDidCloseTextDocument(e => {
            delete this.workspaceFiles[e.fileName];
            pubSub.publish(
                'waypoint.didChangeOpenTextDocuments',
                'waypoint.didChangeOpenTextDocuments'
            );
        });
        vscode.workspace.onDidOpenTextDocument(e => {
            this.workspaceFiles[e.fileName] = true;
            pubSub.publish(
                'waypoint.didChangeOpenTextDocuments',
                'waypoint.didChangeOpenTextDocuments'
            );
        });

        this.configResolver = new ConfigResolver();
        const pathMap = JSON.parse(this.configResolver.getPathMap() || '{}');
        const directories = JSON.parse(this.configResolver.getDirectories());
        const excludedDirectories = JSON.parse(
            this.configResolver.getExcludedDirectories()
        );
        const preference = JSON.parse(this.configResolver.getPreference());

        if (preference.startIndexingOnStarUp) {
            this.reindex({
                items: pathMap.items,
                directories,
                excludedDirectories,
                ignoreCache: false,
            });
        }
    }

    @Mutation(returns => String)
    public async reindex(
        @Args()
        { items, directories, excludedDirectories, ignoreCache }: ReIndexArgs
    ) {
        const indexCache = ignoreCache ? {} : this.configResolver.getCache();

        let pathAlias = {};
        if (items) {
            pathAlias = items.reduce(
                (acc, item) => ({
                    ...acc,
                    [item.alias || '']: item.path,
                }),
                {}
            );
        }

        const filteredDirectories = directories.filter(
            item => item.trim() !== ''
        );
        const filteredExcludedDirectories = excludedDirectories.filter(
            item => item.trim() !== ''
        );

        const project: Project = {
            root: process.env.projectRoot || '',
            pathAlias,
            directories: filteredDirectories,
            excludedDirectories: filteredExcludedDirectories,
        };
        await this.indexer.parse(project, indexCache);
        this.configResolver.setCache(this.indexer.getCache());
        return 'OK';
    }

    @Query(returns => String)
    public stopReIndex() {
        this.indexer.killAllWorkers();
        return 'Ok';
    }

    @Query(returns => GqlIndexerStatus)
    public indexingStatus() {
        const status = new GqlIndexerStatus();
        status.status = this.indexer.status;
        status.indexedFileCount = this.indexer.indexedFileCount;
        status.totalFiles = this.indexer.totalFiles;
        status.failures = this.indexer.failures;
        return status;
    }

    @Query(returns => GqlProjectInfo)
    public project() {
        const info = new GqlProjectInfo();
        info.separator = sep;
        info.root = process.env.projectRoot || '';
        info.fontFamily =
            vscode.workspace.getConfiguration('editor').get('fontFamily') || '';
        info.fontSize =
            vscode.workspace.getConfiguration('editor').get('fontSize') || 0;
        return info;
    }

    @Mutation(returns => GqlSearchResult)
    public async search(
        @Arg('query') query: string,
        @Arg('type') type: string
    ) {
        try {
            const result = new GqlSearchResult();
            const items = this.indexer.search(query, type);
            result.items = items.map(({ obj }: { obj: ESModuleItem }) => {
                const item = new GqlSymbolInformation();
                item.filePath = obj.path;
                item.kind = obj.kind;
                item.name = obj.name;
                item.id = obj.id;
                item.location = obj.location;

                return item;
            });
            return result;
        } catch (e) {
            const result = new GqlSearchResult();
            result.errorMessage = e.stack;
            return result;
        }
    }

    @Mutation(returns => [String])
    public async searchFile(@Arg('query') query: string) {
        return this.indexer.searchFile(query).map((item: any) => item.target);
    }

    @Query(returns => GqlSymbolInformation)
    public async getSymbolWithMarkers(
        @Arg('path') path: string,
        @Arg('name') name: string
    ) {
        const symbol = this.indexer.getSymbolWithMarkers(path, name);

        const item = new GqlSymbolInformation();
        if (symbol) {
            item.filePath = symbol.path;
            item.kind = symbol.kind;
            item.name = symbol.name;
            item.id = symbol.id;
            item.markers = symbol.markers;
            item.location = symbol.location;
        }

        return item;
    }

    @Query(returns => [GqlMarkers])
    public async getReferences(
        @Arg('path') path: string,
        @Arg('name') name: string
    ) {
        const markers = this.indexer.findReference(name, path);
        return markers;
    }

    @Query(returns => [GqlSymbolInformation])
    public async getSymbolsForActiveFile() {
        if (this.activeEditorPath) {
            return this.indexer
                .getSymbolsForPath(this.activeEditorPath)
                .map((symbol: ESModuleItem) => {
                    const item = new GqlSymbolInformation();
                    item.filePath = symbol.path;
                    item.kind = symbol.kind;
                    item.name = symbol.name;
                    item.id = symbol.id;
                    return item;
                });
        }
        return [];
    }

    @Query(returns => GqlFile)
    public async getActiveFile() {
        const gqlFile = new GqlFile();
        if (!this.activeEditorPath) {
            return gqlFile;
        }

        const file = this.indexer.files[this.activeEditorPath];
        if (file) {
            gqlFile.filePath = file.path;
            gqlFile.symbols = file.symbols.map(symbol => {
                const item = new GqlSymbolInformation();
                item.filePath = symbol.path;
                item.kind = symbol.kind;
                item.name = symbol.name;
                item.id = symbol.id;
                return item;
            });
        }

        return gqlFile;
    }

    @Query(returns => GqlSymbolInformation)
    public async getActiveSymbolForFile() {
        const item = new GqlSymbolInformation();
        if (this.activeEditorPath && this.activeEditor?.selection.active) {
            let activeFile = this.indexer.files[this.activeEditorPath];

            if (!activeFile) {
                // if the file is not available, try to index this file
                this.indexer.indexFile(this.activeEditorPath);
                activeFile = this.indexer.files[this.activeEditorPath];
            }

            const location: GqlLocation = {
                start: {
                    line: this.activeEditor?.selection.active.line,
                    column: this.activeEditor?.selection.active.character,
                },
                end: {
                    line: this.activeEditor?.selection.active.line,
                    column: this.activeEditor?.selection.active.character,
                },
            };
            const symbol = activeFile.getSymbolInPosition(location);
            if (symbol) {
                item.filePath = symbol.path;
                item.kind = symbol.kind;
                item.name = symbol.name;
                item.id = symbol.id;
            }
        }
        return item;
    }

    @Query(returns => GqlFile)
    public async getFile(@Arg('path') path: string) {
        const gqlFile = new GqlFile();
        const file = this.indexer.files[path];
        if (file) {
            gqlFile.filePath = path;
            gqlFile.symbols = file.symbols.map(symbol => {
                const item = new GqlSymbolInformation();
                item.filePath = symbol.path;
                item.kind = symbol.kind;
                item.name = symbol.name;
                item.id = symbol.id;
                return item;
            });
        }

        return gqlFile;
    }

    @Query(returns => String)
    public async getCode(@Arg('path') path: string, @Arg('name') name: string) {
        return this.indexer.getCode(path, name);
    }

    @Subscription(() => String, {
        topics: ['waypoint.addSymbol', 'waypoint.didChangeOpenTextDocuments'],
    })
    events(@Root() eventName: string) {
        return eventName;
    }

    @Query(returns => [String])
    public async getAllOpenTextDocuments() {
        return Object.keys(this.workspaceFiles);
    }

    @Query(returns => String)
    public openFile(@Args() { path, location }: OpenFileArgs) {
        vscode.window.showTextDocument(Uri.file(path), {
            viewColumn: vscode.ViewColumn.One,
            selection: new vscode.Selection(
                new vscode.Position(
                    location.startLine - 1,
                    location.startColumn
                ),
                new vscode.Position(location.endLine - 1, location.endColumn)
            ),
        });

        return 'OK';
    }

    @Mutation(returns => String)
    public async insertImport(
        @Arg('symbol') symbol: string,
        @Arg('path') path: string
    ) {
        if (this.activeEditorPath) {
            const currentFile = this.indexer.files[this.activeEditorPath];
            const result = await currentFile.insertImportStatement(
                symbol,
                path
            );

            if (result) {
                return result.content;
            }
        }

        return '';
    }

    @Query(returns => String)
    public async getItemAtPosition(
        @Arg('path') path: string,
        @Arg('line') line: number,
        @Arg('column') column: number
    ) {
        const file = this.indexer.files[path];

        let markerInLocation: Marker | null = null;

        for (const symbol of file.symbols) {
            for (const marker of symbol.markers) {
                const inLocation = isInLocation(marker.location, {
                    start: {
                        line,
                        column,
                    },
                    end: {
                        line,
                        column,
                    },
                });

                if (inLocation) {
                    markerInLocation = marker;
                    break;
                }
            }
        }

        if (markerInLocation) {
            return {
                code: this.getCode(
                    markerInLocation.filePath,
                    markerInLocation.name
                ),
            };
        }

        return '';
    }

    @Mutation(returns => String)
    public async openURL(@Arg('url') url: string) {
        vscode.env.openExternal(vscode.Uri.parse(url));
        return 'OK';
    }
}
