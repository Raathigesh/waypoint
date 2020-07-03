import { resolve } from "path";
import SourceFile from "indexer/SourceFile";
import { santizePath } from "indexer/util";

const waitForIndexer = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });

describe("SourceFile", () => {
  it("should insert import statement", async () => {
    const sourceFile = new SourceFile();
    await waitForIndexer();

    sourceFile.parse(
      resolve(__dirname, "./project/a.js"),
      {
        "views/item": "./"
      },
      resolve(__dirname, "./project")
    );

    const results = await sourceFile.insertImportStatement(
      "functionB",
      resolve(__dirname, "./project/b.js")
    );
    expect(results?.content).toEqual(
      "import {functionB} from 'views/item/b';\n"
    );
  });

  it("should insert import statement 2", async () => {
    const sourceFile = new SourceFile();
    await waitForIndexer();

    sourceFile.parse(
      resolve(__dirname, "./project/a.js"),
      {
        "views/item": "./"
      },
      resolve(__dirname, "./project")
    );

    const results = await sourceFile.insertImportStatement(
      "functionB",
      resolve(__dirname, "./project/components/b.js")
    );
    expect(results?.content).toEqual(
      "import {functionB} from 'views/item/components/b';\n"
    );
  });
});
