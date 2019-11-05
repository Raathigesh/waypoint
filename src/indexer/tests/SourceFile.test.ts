import SourceFile from "../SourceFile";
import { resolve } from "path";

describe("SourceFile", () => {
  it("should have named exports", async () => {
    const sourceFile = new SourceFile();
    await sourceFile.parse(resolve(__dirname, "./javascript.js"));

    expect(sourceFile.symbols).toMatchInlineSnapshot(`
      Array [
        ESModuleItem {
          "exportStatus": "named",
          "id": "",
          "location": SourceLocation {
            "end": Position {
              "column": 1,
              "line": 5,
            },
            "start": Position {
              "column": 0,
              "line": 3,
            },
          },
          "name": "Hello",
          "type": "FunctionDeclaration",
        },
        ESModuleItem {
          "exportStatus": "named",
          "id": "",
          "location": SourceLocation {
            "end": Position {
              "column": 1,
              "line": 9,
            },
            "start": Position {
              "column": 0,
              "line": 7,
            },
          },
          "name": "AnotherFunction",
          "type": "FunctionDeclaration",
        },
        ESModuleItem {
          "exportStatus": "named",
          "id": "",
          "location": SourceLocation {
            "end": Position {
              "column": 2,
              "line": 13,
            },
            "start": Position {
              "column": 0,
              "line": 11,
            },
          },
          "name": "AnotherUtil",
          "type": "VariableDeclaration",
        },
      ]
    `);

    expect(sourceFile.importStatements).toMatchInlineSnapshot(`
      Array [
        Object {
          "path": "./date",
          "specifiers": Array [
            Object {
              "isDefault": true,
              "name": "getDate",
              "references": Array [
                Object {
                  "containerName": "Hello",
                  "containerType": "FunctionDeclaration",
                },
                Object {
                  "containerName": "AnotherFunction",
                  "containerType": "FunctionDeclaration",
                },
                Object {
                  "containerName": "AnotherUtil",
                  "containerType": "FunctionDeclaration",
                },
              ],
            },
          ],
        },
      ]
    `);
  });
});
