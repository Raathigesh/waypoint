import { FunctionDeclaration, ClassDeclaration } from "babel-types";

export default class SourceFile {
  public functions: FunctionDeclaration[] = [];
  public classes: ClassDeclaration[] = [];
}
