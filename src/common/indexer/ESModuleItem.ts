import ExportStatus from "./ExportStatus";

export default class ESModuleItem {
  public name: string = "";
  public exportStatus: ExportStatus = "none";
  public location?: {
    start: {
      line: number;
      column: number;
    };
    end: {
      line: number;
      column: number;
    };
  };
}
