import {
  FunctionDeclaration,
  VariableDeclaration,
  ClassDeclaration,
  TypeAlias,
  SourceLocation,
  Identifier,
  Program,
  ExportNamedDeclaration,
  ExportDefaultDeclaration
} from "babel-types";
import { readFile } from "fs";
import { promisify } from "util";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import { NodePath, Scope } from "babel-traverse";
import { getFileType } from "indexer/util";
import ImportStatement, { ImportSpecifier } from "./ImportStatement";
import ESModuleItem from "./ESModuleItem";
import { ImportDeclaration } from "@babel/types";
import { dirname } from "path";
import {
  findAbsoluteFilePathWhichExists,
  getAliasPathForAbsolutePath
} from "./fileResolver";
import { GqlLocation } from "entities/GqlLocation";
import { santizePath } from "./util";
import ExportStatement from "./ExportStatement";

export interface ParseFailure {
  filePath: string;
  error: string;
}

export default class SourceFile {
  public path: string = "";
  public symbols: ESModuleItem[] = [];
  public importStatements: ImportStatement[] = [];
  public exportStatements: ExportStatement[] = [];
  public programScope: Scope | undefined;
  public root: string = "";
  public pathAliasMap: { [alias: string]: string } = {};

  public async parse(
    filePath: string,
    pathAliasMap: { [alias: string]: string },
    root: string
  ): Promise<ParseFailure | null> {
    try {
      this.path = filePath;
      this.root = root;
      this.pathAliasMap = pathAliasMap;

      const content = await promisify(readFile)(filePath);
      const size = content.byteLength;

      // if the file is too big, don't try to parse it
      if (size === 500000) {
        return {
          filePath,
          error: "File is too big to parse. Ignoring."
        };
      }

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
        },
        ExportDefaultDeclaration: (
          path: NodePath<ExportDefaultDeclaration>
        ) => {
          this.extractDefaultExportDeclaration(path);
        }
      });
      this.linkLocalSymbols(root, pathAliasMap);
    } catch (e) {
      console.log("Parsing failed", filePath, e);
      return {
        filePath,
        error: e.toString()
      };
    }
    return null;
  }

  public getSymbolInPosition(position: GqlLocation) {
    return this.symbols.find(
      sym => sym.location && this.isInLocation(sym.location, position)
    );
  }

  public async insertImportStatement(symbol: string, path: string) {
    try {
      const content = await promisify(readFile)(this.path);
      const ast = this.getAST(content.toString(), this.path);

      const importDeclarationPaths: NodePath<ImportDeclaration>[] = [];

      traverse(ast, {
        ImportDeclaration: (path: NodePath<ImportDeclaration>) => {
          importDeclarationPaths.push(path);
        }
      });

      const lastImportDeclaration = importDeclarationPaths.pop();
      if (lastImportDeclaration) {
        const aliasedPath = getAliasPathForAbsolutePath(
          this.root,
          path,
          this.pathAliasMap
        );
        return {
          position: {
            line: (lastImportDeclaration.node.loc?.end.line || 0) + 1,
            column: 0
          },
          content: `import {${symbol}} from '${aliasedPath}' \n`
        };
      }

      return null;
    } catch (e) {
      console.log("Parsing failed", this.path, e);
    }
  }

  private extractFunctionDeclaration(path: NodePath<FunctionDeclaration>) {
    const name = path.node.id.name;
    const isParentDefaultExport =
      path.parent.type === "ExportDefaultDeclaration";
    this.createSymbol(
      name,
      path.node.type,
      path.node.loc,
      isParentDefaultExport
    );
  }

  private extractVariableDeclaration(path: NodePath<VariableDeclaration>) {
    if (
      path.parent.type !== "Program" &&
      path.parent.type !== "ExportNamedDeclaration"
    ) {
      return;
    }

    const name = (path.node.declarations[0].id as Identifier).name;
    this.createSymbol(name, path.node.type, path.node.loc);
  }

  private extractClassDeclaration(path: NodePath<ClassDeclaration>) {
    const name = path.node.id.name;
    const isParentDefaultExport =
      path.parent.type === "ExportDefaultDeclaration";
    this.createSymbol(
      name,
      path.node.type,
      path.node.loc,
      isParentDefaultExport
    );
  }

  private extractTypeAlias(path: NodePath<TypeAlias>) {
    const name = path.node.id.name;
    const isParentDefaultExport =
      path.parent.type === "ExportDefaultDeclaration";
    this.createSymbol(
      name,
      path.node.type,
      path.node.loc,
      isParentDefaultExport
    );
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
        })),
        isDefault: false
      };
      this.exportStatements.push(exportStatement);
    }
  }

  private extractDefaultExportDeclaration(
    path: NodePath<ExportDefaultDeclaration>
  ) {}

  private btoa(stringToEncode: string) {
    return Buffer.from(stringToEncode).toString("base64");
  }

  private createSymbol(
    name: string,
    kind: string,
    location: SourceLocation,
    isDefaultExport: boolean = false
  ) {
    const symbol = new ESModuleItem();
    symbol.id = this.btoa(`${name}:${santizePath(this.root, this.path)}`);
    symbol.name = name;
    symbol.kind = kind;
    symbol.location = location;
    symbol.path = this.path;
    symbol.isDefaultExport = isDefaultExport;
    this.importStatements.forEach(importStatement => {
      importStatement.specifiers.forEach(specifier => {
        specifier.references.forEach(reference => {
          if (
            reference.location &&
            this.isInLocation(location, reference.location)
          ) {
            symbol.markers.push({
              filePath: findAbsoluteFilePathWhichExists(
                this.root,
                dirname(this.path),
                importStatement.path,
                this.pathAliasMap
              ),
              name: specifier.name,
              location: this.adjustLocation(
                location,
                reference.location
              ) as any,
              isFromDefaultImport: specifier.isDefault
            });
          }
        });
      });
    });
    this.symbols.push(symbol);
  }

  private linkLocalSymbols(
    root: string,
    pathAliasMap: { [alias: string]: string }
  ) {
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
                filePath: findAbsoluteFilePathWhichExists(
                  root,
                  dirname(this.path),
                  symbol.path,
                  pathAliasMap
                ),
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
        isDefault: specifierPath.type === "ImportDefaultSpecifier",
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
      plugins: [
        "jsx",
        "classProperties",
        "dynamicImport",
        "nullishCoalescingOperator",
        "optionalChaining",
        additionalPlugin
      ]
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
