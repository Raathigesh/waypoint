export interface ImportSpecifier {
  name: string;
  references: {
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
