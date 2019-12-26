export default interface ExportStatement {
  path: string;
  specifiers: {
    exported: string;
    local: string;
  }[];
}
