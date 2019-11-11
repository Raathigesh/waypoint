const recursiveReadDir = require("recursive-readdir");
const fuzzysort = require("fuzzysort");
const nanoid = require("nanoid");
import { Service } from "typedi";
import Project from "./Project";
import SourceFile from "./SourceFile";
import { getFileType } from "common/utils/file";
import ESModuleItem from "./ESModuleItem";

@Service()
export default class Indexer {
  public files: { [path: string]: SourceFile } = {};
  public status: "none" | "indexed" | "indexing" = "none";

  public async parse(project: Project) {
    this.status = "indexing";

    const files = await this.readProjectFiles(project.root);

    const promises: any = [];

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
    this.status = "indexed";
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
              location: reference.location
            });
          });
        }
      });
    });
    return references;
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
