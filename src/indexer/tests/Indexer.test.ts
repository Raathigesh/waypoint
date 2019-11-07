import Indexer from "../Indexer";
import { resolve } from "path";

describe("Indexer", () => {
  it("should index files", async () => {
    const indexer = new Indexer();
    await indexer.parse({
      root: resolve(__dirname, "./project")
    });

    const references = indexer.findReferences(
      resolve(__dirname, "./project/module-b.js"),
      "getDate"
    );
    expect(references).toMatchInlineSnapshot(`
      Array [
        Object {
          "filePath": "D:\\\\projects\\\\insight\\\\src\\\\indexer\\\\tests\\\\project\\\\module-a.js",
          "kind": "FunctionDeclaration",
          "name": "Hello",
        },
        Object {
          "filePath": "D:\\\\projects\\\\insight\\\\src\\\\indexer\\\\tests\\\\project\\\\module-a.js",
          "kind": "FunctionDeclaration",
          "name": "AnotherFunction",
        },
        Object {
          "filePath": "D:\\\\projects\\\\insight\\\\src\\\\indexer\\\\tests\\\\project\\\\module-a.js",
          "kind": "FunctionDeclaration",
          "name": "AnotherUtil",
        },
      ]
    `);
  });
});
