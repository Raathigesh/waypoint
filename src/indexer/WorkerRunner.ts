import { join } from "path";
import { fork } from "child_process";
import SourceFile, { ParseResult } from "./SourceFile";

function partition(array: string[], n: number): any {
  const internalArray = [...array];
  const results: any = [];
  let currentIndex = 0;

  while (internalArray.length) {
    const currentItem = internalArray.pop();
    if (!results[currentIndex]) {
      results[currentIndex] = [];
    }

    results[currentIndex].push(currentItem);
    if (currentIndex === n - 1) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }
  }

  return results;
}

function runInWorker(
  filePaths: string[],
  pathAlias: { [key: string]: string },
  root: string,
  cb: (file: SourceFile) => void
) {
  return new Promise(resolve => {
    const worker = fork(join(__dirname, "Worker.js"), [], { silent: true });
    worker.on("message", (result: ParseResult) => {
      const file = new SourceFile();
      file.path = result.path;
      file.exportStatements = result.exportStatements;
      file.importStatements = result.importStatements;
      file.symbols = result.symbols;

      cb(file);
    });

    worker.on("exit", () => {
      resolve();
    });

    worker.stdout.on("data", data => {
      console.log(data.toString());
    });
    worker.stderr.on("data", data => {
      console.log(data.toString());
    });
    worker.send({
      files: filePaths,
      pathAlias: pathAlias,
      root: root
    });
  });
}

export async function run(
  data: {
    files: string[];
    pathAlias: { [key: string]: string };
    root: string;
  },
  cb: (file: SourceFile) => void
) {
  try {
    const workerPromises: any = [];

    const fileChunks = partition(data.files, 12);
    fileChunks.forEach((chunk: string[]) => {
      const promise = runInWorker(chunk, data.pathAlias, data.root, cb);
      workerPromises.push(promise);
    });

    return Promise.all(workerPromises);
  } catch (e) {
    console.log(e);
  }
}
