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
      ]
    `);

    expect(sourceFile.importStatements).toMatchInlineSnapshot(`
      Array [
        Object {
          "defaultImportName": "getDate",
          "namedImports": Array [
            Object {
              "name": "templates",
            },
          ],
          "path": "./date",
          "usages": Array [],
        },
      ]
    `);
  });
});
