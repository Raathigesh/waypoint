import ExportStatus from "./ExportStatus";

export interface SymbolLocation {
  start: {
    line: number;
    column: number;
  };
  end: {
    line: number;
    column: number;
  };
}

export default class ESModuleItem {
  public id: string = "";
  public name: string = "";
  public exportStatus: ExportStatus = "none";
  public location?: SymbolLocation;
}
