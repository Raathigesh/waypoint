import ESModuleItem from "./ESModuleItem";

export interface ImportSpecifier {
  name: string;
  isDefault: boolean;
  references: {
    containerName: string;
    containerType: string;
    location?: {
      start: {
        line: number;
        column: number;
      };
      end: {
        line: number;
        column: number;
      };
    };
  }[];
}

export default interface ImportStatement {
  path: string;
  specifiers: ImportSpecifier[];
}
