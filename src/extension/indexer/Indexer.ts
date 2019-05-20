import * as recursiveReadDir from "recursive-readdir";
import Project from "./Project";
import SourceFile from "./SourceFile";
import { getFileType } from "../utils/file";

export default class Indexer {
  public files: { [path: string]: SourceFile } = {};

  public async parse(project: Project) {
    const files = await this.readProjectFiles(project.root);
    files
      .filter(filePath => getFileType(filePath) !== "UNSUPPORTED")
      .forEach(filePath => {
        const sourceFile = new SourceFile();
        sourceFile.parse(filePath);
        this.files[filePath] = sourceFile;
      });
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
