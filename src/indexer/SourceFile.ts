import {
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  Identifier
} from "babel-types";
import { readFile } from "fs";
import { promisify } from "util";
const nanoid = require("nanoid");
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import { transformSync } from "@babel/core";
import { NodePath } from "babel-traverse";
import { getFileType } from "common/utils/file";
import ImportStatement, { ImportSpecifier } from "./ImportStatement";
import ESModuleItem from "./ESModuleItem";
import { ImportDeclaration } from "@babel/types";
import generate from "@babel/generator";
import { resolve, isAbsolute, dirname } from "path";
import { findAbsoluteFilePathWhichExists } from "./fileResolver";
import { Location } from "entities/Location";

export default class SourceFile {
  public path: string = "";
  public symbols: ESModuleItem[] = [];
  public importStatements: ImportStatement[] = [];

  public async parse(
    filePath: string,
    pathAliasMap: { [alias: string]: string },
    root: string
  ) {
    try {
      this.path = filePath;

      const content = await promisify(readFile)(filePath);
      const ast = this.getAST(content.toString(), filePath);

      traverse(ast, {
        ExportNamedDeclaration: (path: NodePath<ExportNamedDeclaration>) => {
          this.extractExport(path, content.toString());
        },
        ExportDefaultDeclaration: (
          path: NodePath<ExportDefaultDeclaration>
        ) => {
          this.extractExport(path, content.toString());
        },
        ImportDeclaration: (path: NodePath<ImportDeclaration>) => {
          this.extractImport(path, pathAliasMap, root);
        }
      });
    } catch (e) {
      console.log("Parsing failed", filePath, e);
    }
  }

  private extractExport(
    path: NodePath<ExportDefaultDeclaration | ExportNamedDeclaration>,
    content: string
  ) {
    const declaration = path.node.declaration;
    if (declaration) {
      let name = "none";

      if (
        declaration.type === "FunctionDeclaration" ||
        declaration.type === "ClassDeclaration" ||
        declaration.type === "TypeAlias"
      ) {
        name = declaration.id && declaration.id.name;
      } else if (declaration.type === "VariableDeclaration") {
        name =
          declaration.declarations[0] &&
          declaration.declarations[0].id &&
          (declaration.declarations[0].id as any).name;
      }

      const symbol = new ESModuleItem();
      symbol.id = nanoid();
      symbol.name = name;
      symbol.kind = declaration.type as any;
      symbol.location = path.node.loc;
      symbol.code = this.getCode(content, path.node.loc);
      this.importStatements.forEach(importStatement => {
        importStatement.specifiers.forEach(specifier => {
          specifier.references.forEach(reference => {
            if (
              reference.location &&
              this.isInLocation(path.node.loc, reference.location)
            ) {
              symbol.markers.push({
                filePath: importStatement.path,
                name: specifier.name,
                location: this.adjustLocation(
                  path.node.loc,
                  reference.location
                ) as any
              });
            }
          });
        });
      });
      this.symbols.push(symbol);
    }
  }

  private extractImport(
    path: NodePath<ImportDeclaration>,
    pathAliasMap: { [alias: string]: string },
    root: string
  ) {
    const importPath = path.node.source.value;
    let absoluteImportPath = importPath;
    try {
      absoluteImportPath = findAbsoluteFilePathWhichExists(
        root,
        dirname(this.path),
        importPath,
        pathAliasMap
      );
      console.log("found path ", absoluteImportPath);
    } catch (e) {
      console.log("Path not resolved ", importPath);
    }

    const importDeclaration: ImportStatement = {
      path: absoluteImportPath,
      specifiers: []
    };

    path.node.specifiers.forEach(specifierPath => {
      const referencePaths =
        path.scope.bindings[specifierPath.local.name].referencePaths;

      const defaultSpecifier: ImportSpecifier = {
        isDefault: true,
        name: specifierPath.local.name,
        references: referencePaths.map(referencePath => {
          let containerName = "";
          const functionParent = referencePath.getFunctionParent();
          if (!functionParent) {
            return {
              containerName,
              containerType: "Not Found"
            };
          }

          if (functionParent.type === "ArrowFunctionExpression") {
            containerName =
              (functionParent.parent as any).id &&
              (functionParent.parent as any).id.name;
          } else if (functionParent.type === "FunctionDeclaration") {
            containerName =
              (functionParent.node.id && functionParent.node.id.name) || "";
          }

          return {
            containerName,
            containerType: "FunctionDeclaration",
            location: referencePath.node.loc,
            code: ""
          };
        })
      };
      importDeclaration.specifiers.push(defaultSpecifier);
    });
    this.importStatements.push(importDeclaration);
  }

  private getAST(content: string, path: string) {
    const fileType = getFileType(path);

    const isTS = fileType === "TSX";
    const additionalPlugin = isTS ? "typescript" : "flow";

    return parser.parse(content, {
      sourceType: "module",
      plugins: ["jsx", "classProperties", "dynamicImport", additionalPlugin]
    });
  }

  private isInLocation(locationA: Location, locationB: Location) {
    const {
      start: locAStart = { line: 0, column: 0 },
      end: locAEnd = { line: 0, column: 0 }
    } = locationA;

    const {
      start: locBStart = { line: 0, column: 0 },
      end: locBEnd = { line: 0, column: 0 }
    } = locationB;

    let isStartWithIn = false;
    if (locBStart.line > locAStart.line) {
      isStartWithIn = true;
    } else if (locBStart.line === locAStart.line) {
      isStartWithIn = locBStart.column >= locAStart.column;
    }

    let isEndWithIn = false;
    if (locBEnd.line < locAEnd.line) {
      isEndWithIn = true;
    } else if (locBEnd.line === locAEnd.line) {
      isEndWithIn = locBEnd.column <= locAEnd.column;
    }

    return isStartWithIn && isEndWithIn;
  }

  private adjustLocation(functionLocation: Location, markerLocation: Location) {
    const {
      start: functionStart = { line: 0, column: 0 },
      end: functionEnd = { line: 0, column: 0 }
    } = functionLocation;

    const {
      start: markerStart = { line: 0, column: 0 },
      end: markerEnd = { line: 0, column: 0 }
    } = markerLocation;

    const newLocation: Location = {
      start: {
        line: markerStart.line - functionStart.line,
        column: markerStart.column
      },
      end: {
        line: markerEnd.line - functionStart.line,
        column: markerEnd.column
      }
    };

    return newLocation;
  }

  private getCode(code: string, location: Location) {
    const lines = code.split("\n");

    const {
      start = { line: 0, column: 0 },
      end = { line: 0, column: 0 }
    } = location;

    const results: string[] = [];

    lines.forEach((line, index) => {
      if (index >= start.line - 1 && index <= end.line - 1) {
        results.push(line);
      }
    });

    return results.reduce((acc, line) => {
      return acc + line + "\n";
    }, "");
  }
}
