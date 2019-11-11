import SourceFile from "../SourceFile";
import { resolve } from "path";

describe("SourceFile", () => {
  it("should have named exports", async () => {
    const sourceFile = new SourceFile();
    await sourceFile.parse(
      resolve(__dirname, "./project/query/items.js"),
      {},
      ""
    );

    expect(sourceFile.symbols.map(symbol => ({ ...symbol, id: "" })))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "",
          "kind": "FunctionDeclaration",
          "location": SourceLocation {
            "end": Position {
              "column": 29,
              "line": 1,
            },
            "start": Position {
              "column": 0,
              "line": 1,
            },
          },
          "name": "getItems",
          "path": "",
        },
        Object {
          "id": "",
          "kind": "FunctionDeclaration",
          "location": SourceLocation {
            "end": Position {
              "column": 36,
              "line": 2,
            },
            "start": Position {
              "column": 0,
              "line": 2,
            },
          },
          "name": "getInStockCount",
          "path": "",
        },
      ]
    `);

    expect(sourceFile.importStatements).toMatchInlineSnapshot(`Array []`);
  });
});
