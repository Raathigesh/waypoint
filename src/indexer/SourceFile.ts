import {
  FunctionDeclaration,
  VariableDeclaration,
  ClassDeclaration,
  TypeAlias,
  SourceLocation,
  Identifier,
  Program,
  ExportNamedDeclaration
} from "babel-types";
import { readFile } from "fs";
import { promisify } from "util";
const nanoid = require("nanoid");
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import { NodePath, Scope } from "babel-traverse";
import { getFileType } from "indexer/util";
import ImportStatement, { ImportSpecifier } from "./ImportStatement";
import ESModuleItem from "./ESModuleItem";
import { ImportDeclaration } from "@babel/types";
import { dirname } from "path";
import { findAbsoluteFilePathWhichExists } from "./fileResolver";
import { GqlLocation } from "entities/GqlLocation";
import ExportStatement from "./ExportStatement";

export default class SourceFile {
  public path: string = "";
  public symbols: ESModuleItem[] = [];
  public importStatements: ImportStatement[] = [];
  public exportStatements: ExportStatement[] = [];
  public programScope: Scope | undefined;

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
        Program: (path: NodePath<Program>) => {
          this.programScope = path.scope;
        },
        FunctionDeclaration: (path: NodePath<FunctionDeclaration>) => {
          this.extractFunctionDeclaration(path);
        },
        VariableDeclaration: (path: NodePath<VariableDeclaration>) => {
          this.extractVariableDeclaration(path);
        },
        ClassDeclaration: (path: NodePath<ClassDeclaration>) => {
          this.extractClassDeclaration(path);
        },
        TypeAlias: (path: NodePath<TypeAlias>) => {
          this.extractTypeAlias(path);
        },
        ImportDeclaration: (path: NodePath<ImportDeclaration>) => {
          this.extractImport(path, pathAliasMap, root);
        },
        ExportNamedDeclaration: (path: NodePath<ExportNamedDeclaration>) => {
          this.extractExportNamedDeclaration(path);
        }
      });
      this.linkLocalSymbols();
    } catch (e) {
      console.log("Parsing failed", filePath, e);
    }
  }

  public getSymbolInPosition(position: GqlLocation) {
    return this.symbols.find(
      sym => sym.location && this.isInLocation(sym.location, position)
    );
  }

  private extractFunctionDeclaration(path: NodePath<FunctionDeclaration>) {
    const name = path.node.id.name;
    this.createSymbol(name, path.node.type, path.node.loc);
  }

  private extractVariableDeclaration(path: NodePath<VariableDeclaration>) {
    if (
      path.parent.type !== "Program" &&
      path.parent.type !== "ExportNamedDeclaration"
    ) {
      return;
    }
    path.getStatementParent;
    const name = (path.node.declarations[0].id as Identifier).name;
    this.createSymbol(name, path.node.type, path.node.loc);
  }

  private extractClassDeclaration(path: NodePath<ClassDeclaration>) {
    const name = path.node.id.name;
    this.createSymbol(name, path.node.type, path.node.loc);
  }

  private extractTypeAlias(path: NodePath<TypeAlias>) {
    const name = path.node.id.name;
    this.createSymbol(name, path.node.type, path.node.loc);
  }

  private extractExportNamedDeclaration(
    path: NodePath<ExportNamedDeclaration>
  ) {
    if (path.node.source && path.node.specifiers.length) {
      const exportStatement: ExportStatement = {
        path: path.node.source.value,
        specifiers: path.node.specifiers.map(specifier => ({
          local: specifier.local.name,
          exported: specifier.exported.name
        }))
      };
      this.exportStatements.push(exportStatement);
    }
  }

  private createSymbol(name: string, kind: string, location: SourceLocation) {
    const symbol = new ESModuleItem();
    symbol.id = nanoid();
    symbol.name = name;
    symbol.kind = kind;
    symbol.location = location;
    symbol.path = this.path;
    this.importStatements.forEach(importStatement => {
      importStatement.specifiers.forEach(specifier => {
        specifier.references.forEach(reference => {
          if (
            reference.location &&
            this.isInLocation(location, reference.location)
          ) {
            symbol.markers.push({
              filePath: importStatement.path,
              name: specifier.name,
              location: this.adjustLocation(location, reference.location) as any
            });
          }
        });
      });
    });
    this.symbols.push(symbol);
  }

  private linkLocalSymbols() {
    if (!this.programScope) {
      return;
    }

    const bindings = Object.entries(this.programScope.bindings);
    bindings.forEach(([name, binding]) => {
      binding.referencePaths.forEach(reference => {
        this.symbols.forEach(symbol => {
          if (
            reference.node.loc &&
            symbol.location &&
            this.isInLocation(symbol.location, reference.node.loc)
          ) {
            const existingMarker = symbol.markers.find(
              marker => marker.name === name
            );

            if (!existingMarker) {
              symbol.markers.push({
                filePath: symbol.path,
                name,
                location: this.adjustLocation(
                  symbol.location,
                  reference.node.loc
                ) as any
              });
            }
          }
        });
      });
    });
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
      return;
    }

    const importDeclaration: ImportStatement = {
      path: absoluteImportPath,
      specifiers: []
    };

    path.node.specifiers.forEach(specifierPath => {
      const referencePaths =
        path.scope.bindings[specifierPath.local.name].referencePaths;
      const defaultSpecifier: ImportSpecifier = {
        name:
          ((specifierPath as any).imported &&
            (specifierPath as any).imported.name) ||
          specifierPath.local.name,
        references: referencePaths.map(referencePath => {
          return {
            location: referencePath.node.loc
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

  private isInLocation(locationA: GqlLocation, locationB: GqlLocation) {
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

  private adjustLocation(
    functionLocation: GqlLocation,
    markerLocation: GqlLocation
  ) {
    const {
      start: functionStart = { line: 0, column: 0 },
      end: functionEnd = { line: 0, column: 0 }
    } = functionLocation;

    const {
      start: markerStart = { line: 0, column: 0 },
      end: markerEnd = { line: 0, column: 0 }
    } = markerLocation;

    const newLocation: GqlLocation = {
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
}
