const recursiveReadDir = require("recursive-readdir");
const fuzzysort = require("fuzzysort");
import { promisify } from "util";
const nanoid = require("nanoid");
import { Service } from "typedi";
import Project from "./Project";
import SourceFile from "./SourceFile";
import { getFileType } from "common/utils/file";
import ESModuleItem from "./ESModuleItem";
import { readFile } from "fs";

@Service()
export default class Indexer {
  public files: { [path: string]: SourceFile } = {};
  public status: "none" | "indexed" | "indexing" = "none";

  public async parse(project: Project) {
    this.status = "indexing";

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

  public getSymbolWithMarkers(path: string, name: string) {
    const file = this.files[path];
    const symbol = file.symbols.find(symbol => symbol.name === name);
    return symbol;
  }

  public getSymbolsForPath(path: string) {
    const file = this.files[path];
    if (!file) {
      return [];
    }

    return file.symbols;
  }

  public findReferences(path: string, symbolName: string) {
    const references: ESModuleItem[] = [];

    Object.entries(this.files).forEach(([, file]) => {
      file.importStatements.forEach(importStatement => {
        const specifier =
          importStatement.path === path &&
          importStatement.specifiers.find(
            specifier => specifier.name === symbolName
          );

        if (specifier) {
          specifier.references.forEach(reference => {
            references.push({
              path: file.path,
              kind: reference.containerType,
              name: reference.containerName,
              id: nanoid(),
              location: reference.location,
              markers: []
            });
          });
        }
      });
    });
    return references;
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
