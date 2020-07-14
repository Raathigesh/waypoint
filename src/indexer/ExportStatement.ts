export default interface ExportStatement {
    path: string;
    isDefault: boolean;
    specifiers: {
        exported: string;
        local: string;
    }[];
}
