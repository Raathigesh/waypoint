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

    expect(
      sourceFile.symbols.map(symbol => ({ ...symbol, id: "" }))
    ).toMatchSnapshot();

    expect(sourceFile.importStatements).toMatchSnapshot();
  });

  it.only("should identify markers", async () => {
    const sourceFile = new SourceFile();
    await sourceFile.parse(
      resolve(__dirname, "./project/store/Root.js"),
      {},
      ""
    );

    expect(sourceFile.symbols.map(symbol => ({ ...symbol, id: "" })))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "code": "export default function Store() {
        const items = getItems();
        const stockCount = getInStockCount();
      }
      ",
          "id": "",
          "kind": "FunctionDeclaration",
          "location": SourceLocation {
            "end": Position {
              "column": 1,
              "line": 7,
            },
            "start": Position {
              "column": 0,
              "line": 4,
            },
          },
          "markers": Array [
            Object {
              "filePath": "D:\\\\projects\\\\insight\\\\src\\\\indexer\\\\tests\\\\project\\\\query\\\\items.js",
              "location": Object {
                "end": Object {
                  "column": 24,
                  "line": 1,
                },
                "start": Object {
                  "column": 16,
                  "line": 1,
                },
              },
              "name": "getItems",
            },
            Object {
              "filePath": "project/query/items",
              "location": Object {
                "end": Object {
                  "column": 36,
                  "line": 2,
                },
                "start": Object {
                  "column": 21,
                  "line": 2,
                },
              },
              "name": "getInStockCount",
            },
          ],
          "name": "Store",
          "path": "",
        },
      ]
    `);

    expect(sourceFile.importStatements).toMatchInlineSnapshot(`
      Array [
        Object {
          "path": "D:\\\\projects\\\\insight\\\\src\\\\indexer\\\\tests\\\\project\\\\query\\\\items.js",
          "specifiers": Array [
            Object {
              "isDefault": true,
              "name": "getItems",
              "references": Array [
                Object {
                  "code": "",
                  "containerName": "Store",
                  "containerType": "FunctionDeclaration",
                  "location": SourceLocation {
                    "end": Position {
                      "column": 24,
                      "line": 5,
                    },
                    "identifierName": "getItems",
                    "start": Position {
                      "column": 16,
                      "line": 5,
                    },
                  },
                },
              ],
            },
          ],
        },
        Object {
          "path": "project/query/items",
          "specifiers": Array [
            Object {
              "isDefault": true,
              "name": "getInStockCount",
              "references": Array [
                Object {
                  "code": "",
                  "containerName": "Store",
                  "containerType": "FunctionDeclaration",
                  "location": SourceLocation {
                    "end": Position {
                      "column": 36,
                      "line": 6,
                    },
                    "identifierName": "getInStockCount",
                    "start": Position {
                      "column": 21,
                      "line": 6,
                    },
                  },
                },
              ],
            },
          ],
        },
      ]
    `);
  });
});
