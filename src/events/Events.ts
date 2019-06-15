export const Events = {
  GetWorkspaceState: "GetWorkspaceState",
  SaveWorkspaceState: "SaveWorkspaceState",
  TempFile: {
    CreateTempFile: "CreateTeamFile",
    CreatedTempFile: "CreatedTempFile",
    UpdatedTempFile: "UpdatedTempFile"
  }
};

export interface WebviewMessageEvent {
  type: string;
  payload: any;
}
