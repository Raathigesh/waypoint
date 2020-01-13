const recursiveReadDir = require("recursive-readdir");
const fuzzysort = require("fuzzysort");
import { promisify } from "util";
import { Service } from "typedi";
import Project from "./Project";
import SourceFile from "./SourceFile";
import { getFileType } from "indexer/util";
import ESModuleItem from "./ESModuleItem";
import { readFile } from "fs";
import { findAbsoluteFilePathWhichExists } from "./fileResolver";
import { dirname } from "path";

@Service()
export default class Indexer {
  public files: { [path: string]: SourceFile } = {};
  public status: "none" | "indexed" | "indexing" = "none";
  public project: Project | undefined;

  public async parse(project: Project) {
    this.status = "indexing";
    this.project = project;

    const files = await this.readProjectFiles(project.root);

    const promises: any = [];

    try {
      files
        .filter(filePath => getFileType(filePath) !== "UNSUPPORTED")
        .forEach(filePath => {
          const sourceFile = new SourceFile();
          const parsePromise = sourceFile.parse(
            filePath,
            project.pathAlias,
            project.root
          );
          promises.push(parsePromise);
          this.files[filePath] = sourceFile;
        });

      await Promise.all(promises);
    } catch (e) {
      console.log("Error in indexer", e);
    } finally {
      this.status = "indexed";
      console.log("Marking indexer status", this.status);
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
      const results: ESModuleItem[] = [];
      Object.entries(this.files).forEach(([, file]) => {
        file.symbols.forEach(symbol => {
          results.push({
            ...symbol,
            path: file.path
          });
        });
      });

      const filteredResults = fuzzysort.go(query, results, {
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
    return symbol;
  }

  public getSymbolsForPath(path: string) {
    const file = this.files[path];
    if (!file) {
      return [];
    }

    return file.symbols;
  }

  public async getCode(path: string, id: string) {
    const file = this.files[path];
    if (file) {
      const symbol = file.symbols.find(symbol => symbol.id === id);
      if (!symbol || !symbol.location) {
        return "";
      }

      const content = await promisify(readFile)(path);
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
    return new Promise<string[]>((resolve, reject) => {
      recursiveReadDir(
        root,
        ["**/node_modules/**"],
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
}
