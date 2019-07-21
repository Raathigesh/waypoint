import * as recursiveReadDir from "recursive-readdir";
import { Service } from "typedi";
import Project from "./Project";
import SourceFile from "./SourceFile";
import { getFileType } from "../../extension/utils/file";

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
