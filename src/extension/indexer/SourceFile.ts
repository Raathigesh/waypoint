import { ExportDefaultDeclaration, ExportNamedDeclaration } from "babel-types";
import { readFile } from "fs";
import { promisify } from "util";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import { NodePath } from "babel-traverse";
import FunctionDefinition from "./FunctionDefinition";
import ClassDefinition from "./classDefinition";
import { getFileType } from "../utils/file";
import VariableDeclaration from "./VariableDeclaration";

export default class SourceFile {
  public functions: FunctionDefinition[] = [];
  public classes: ClassDefinition[] = [];
  public variables: VariableDeclaration[] = [];

  public async parse(filePath: string) {
    const content = await promisify(readFile)(filePath);
    const ast = this.getAST(content.toString(), filePath);

    traverse(ast, {
      ExportNamedDeclaration: (path: NodePath<ExportNamedDeclaration>) => {
        const declaration = path.node.declaration;
        if (declaration && declaration.type === "FunctionDeclaration") {
          const functionDefinition = new FunctionDefinition();
          functionDefinition.name =
            (declaration.id && declaration.id.name) || "";
          functionDefinition.exportStatus = "named";
          this.functions.push(functionDefinition);
        } else if (declaration && declaration.type === "ClassDeclaration") {
          const classDefinition = new ClassDefinition();
          classDefinition.name = (declaration.id && declaration.id.name) || "";
          classDefinition.exportStatus = "named";
          this.classes.push(classDefinition);
        } else if (declaration && declaration.type === "VariableDeclaration") {
          const variableDeclaration = new VariableDeclaration();
          variableDeclaration.name =
            (declaration.declarations[0] &&
              declaration.declarations[0].id &&
              (declaration.declarations[0].id as any).name) ||
            "";
          variableDeclaration.exportStatus = "named";
          this.variables.push(variableDeclaration);
        }
      },
      ExportDefaultDeclaration: (path: NodePath<ExportDefaultDeclaration>) => {
        const declaration = path.node.declaration;
        if (declaration && declaration.type === "FunctionDeclaration") {
          const functionDefinition = new FunctionDefinition();
          functionDefinition.name =
            (declaration.id && declaration.id.name) || "";
          functionDefinition.exportStatus = "default";
          this.functions.push(functionDefinition);
        } else if (declaration && declaration.type === "ClassDeclaration") {
          const classDefinition = new ClassDefinition();
          classDefinition.name = (declaration.id && declaration.id.name) || "";
          classDefinition.exportStatus = "default";
          this.classes.push(classDefinition);
        } else if (declaration && declaration.type === "VariableDeclaration") {
          const variableDeclaration = new VariableDeclaration();
          variableDeclaration.name =
            (declaration.declarations[0] &&
              declaration.declarations[0].id &&
              (declaration.declarations[0].id as any).name) ||
            "";
          variableDeclaration.exportStatus = "default";
          this.variables.push(variableDeclaration);
        }
      }
    });
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
