export const Events = {
  GetWorkspaceState: "GetWorkspaceState",
  SaveWorkspaceState: "SaveWorkspaceState",
  TempFile: {
    CreateTempFile: "CreateTeamFile",
    CreatedTempFile: "CreatedTempFile",
    UpdatedTempFile: "UpdatedTempFile"
  },
  Window: {
    ShowTextDocument: "ShowTextDocument"
  }
};

export interface WebviewMessageEvent {
  type: string;
  payload: any;
}
