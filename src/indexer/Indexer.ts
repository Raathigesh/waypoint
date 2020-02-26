const recursiveReadDir = require("recursive-readdir");
const fuzzysort = require("fuzzysort");
import { promisify } from "util";
import { Service } from "typedi";
import Project from "./Project";
import SourceFile from "./SourceFile";
import { getFileType } from "indexer/util";
import ESModuleItem, { Marker } from "./ESModuleItem";
import { readFile, Stats } from "fs";
import { findAbsoluteFilePathWhichExists } from "./fileResolver";
import { dirname, join } from "path";

@Service()
export default class Indexer {
  public files: { [path: string]: SourceFile } = {};
  public status: "none" | "indexed" | "indexing" = "none";
  public project: Project | undefined;
  public totalFiles: number = 0;
  public indexedFileCount: number = 0;

  public async parse(project: Project) {
    this.status = "indexing";
    this.project = project;

    const files = await this.readProjectFiles(project.root);
    this.totalFiles = files.length;

    const supportedFiles = files.filter(
      filePath => getFileType(filePath) !== "UNSUPPORTED"
    );

    this.relaxedIndexer(supportedFiles);
  }

  public relaxedIndexer(filesToIndex: string[]) {
    if (filesToIndex.length === 0) {
      this.status = "indexed";
      return;
    }

    const currentFile = filesToIndex.pop();
    const sourceFile = new SourceFile();

    if (this.project && currentFile) {
      const parsePromise = sourceFile.parse(
        currentFile,
        this.project.pathAlias,
        this.project.root
      );
      this.files[currentFile] = sourceFile;
      this.indexedFileCount += 1;
      setTimeout(() => {
        this.relaxedIndexer(filesToIndex);
      }, 0);
    }
  }

  public indexFile(path: string) {
    if (!this.project) {
      return;
    }

    const sourceFile = new SourceFile();
    this.files[path] = sourceFile;
    sourceFile.parse(path, this.project.pathAlias, this.project.root);
  }

  public search(query: string) {
    try {
      const queryTokens = query.split(/\s+/);
      let queryType: string | null = null;
      let searchQuery = query;
      if (queryTokens.length > 1) {
        queryType = queryTokens[0];
        searchQuery = queryTokens[1];
      }

      let results: ESModuleItem[] = [];
      Object.entries(this.files).forEach(([, file]) => {
        file.symbols.forEach(symbol => {
          if (
            queryType === null ||
            (queryType === "func" && symbol.kind === "FunctionDeclaration") ||
            (queryType === "type" && symbol.kind === "TypeAlias") ||
            (queryType === "var" && symbol.kind === "VariableDeclaration") ||
            (queryType === "class" && symbol.kind === "ClassDeclaration")
          ) {
            results.push({
              ...symbol,
              path: file.path
            });
          }
        });
      });

      const filteredResults = fuzzysort.go(searchQuery, results, {
        key: "name",
        limit: 100
      });

      return filteredResults;
    } catch (e) {
      return [];
    }
  }

  public searchFile(query: string) {
    const filteredResults = fuzzysort.go(query, Object.keys(this.files), {
      limit: 100
    });
    return filteredResults;
  }

  public getSymbolWithMarkers(path: string, name: string) {
    const file = this.files[path];
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
              location: symbol.location
            });
          }
        });
      });
    });
    return markers;
  }

  public async getCode(path: string, name: string) {
    const file = this.files[path];
    if (file) {
      let symbol: ESModuleItem | null | undefined = file.symbols.find(
        symbol => symbol.name === name
      );
      if (!symbol || !symbol.location) {
        symbol = this.getReExportedSymbol(name, path, file);
        if (!symbol || !symbol.location) {
          return "";
        }
      }

      const content = await promisify(readFile)(symbol.path);
      const code = content.toString();
      const lines = code.split("\n");

      const {
        start = { line: 0, column: 0 },
        end = { line: 0, column: 0 }
      } = symbol.location;

      const results: string[] = [];

      lines.forEach((line, index) => {
        if (index >= start.line - 1 && index <= end.line - 1) {
          results.push(line);
        }
      });

      return results.reduce((acc, line) => {
        return acc + line + "\n";
      }, "");
    }
  }

  private async readProjectFiles(root: string) {
    if (this.project) {
      const indexableDirectories = this.project.directories.map(directory =>
        join(this.project?.root || "", directory)
      );

      function ignoreFunc(file: string, stats: Stats) {
        return (
          indexableDirectories.find(dir => file.includes(dir)) === undefined ||
          file.includes("node_modules")
        );
      }

      return new Promise<string[]>((resolve, reject) => {
        recursiveReadDir(root, [ignoreFunc], (err: Error, files: string[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(files);
          }
        });
      });
    }

    return [];
  }

  private getReExportedSymbol(name: string, path: string, file: SourceFile) {
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
      return actualFile.symbols.find(
        symbol => symbol.name === actualSymbolName
      );
    }
  }
}
