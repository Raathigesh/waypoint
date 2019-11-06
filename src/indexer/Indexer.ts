import recursiveReadDir from "recursive-readdir";
import { Service } from "typedi";
import Project from "./Project";
import SourceFile from "./SourceFile";
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";
import { getFileType } from "common/utils/file";

@Service()
export default class Indexer {
  public files: { [path: string]: SourceFile } = {};

  public async parse(project: Project) {
    const files = await this.readProjectFiles(project.root);

    const promises: any = [];

    files
      .filter(filePath => getFileType(filePath) !== "UNSUPPORTED")
      .forEach(filePath => {
        const sourceFile = new SourceFile();
        const parsePromise = sourceFile.parse(filePath);
        promises.push(parsePromise);
        this.files[filePath] = sourceFile;
      });

    await Promise.all(promises);
  }

  public findReferences(path: string, symbolName: string) {
    const references: GqlSymbolInformation[] = [];

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
              filePath: file.path,
              kind: reference.containerType,
              name: reference.containerName
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
