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
import { NodePath } from "babel-traverse";
import { getFileType } from "common/utils/file";
import ImportStatement, { ImportSpecifier } from "./ImportStatement";
import ESModuleItem from "./ESModuleItem";
import { ImportDeclaration } from "@babel/types";
import { resolve, isAbsolute, dirname } from "path";
import { findAbsoluteFilePathWhichExists } from "./fileResolver";

export default class SourceFile {
  public path: string = "";
  public symbols: ESModuleItem[] = [];
  public importStatements: ImportStatement[] = [];

  public async parse(
    filePath: string,
    pathAliasMap: { [alias: string]: string },
    root: string
  ) {
    this.path = filePath;

    const content = await promisify(readFile)(filePath);
    const ast = this.getAST(content.toString(), filePath);

    traverse(ast, {
      ExportNamedDeclaration: (path: NodePath<ExportNamedDeclaration>) => {
        this.extractExport(path, "named");
      },
      ExportDefaultDeclaration: (path: NodePath<ExportDefaultDeclaration>) => {
        this.extractExport(path, "default");
      },
      ImportDeclaration: (path: NodePath<ImportDeclaration>) => {
        this.extractImport(path, pathAliasMap, root);
      }
    });
  }

  private extractExport(
    path: NodePath<ExportDefaultDeclaration | ExportNamedDeclaration>,
    mode: "default" | "named"
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
}
