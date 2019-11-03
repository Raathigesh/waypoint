import ESModuleItem from "./ESModuleItem";

export default class ImportStatement {
  public path: string = "";
  public defaultImportName: string | null = null;
  public namedImports: {
    name: string;
    aliasName?: string;
  }[] = [];
  public usages: ESModuleItem[] = [];
}
