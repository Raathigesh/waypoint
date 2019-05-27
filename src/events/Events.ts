export const Events = {
  GetWorkspaceState: "GetWorkspaceState",
  SaveWorkspaceState: "SaveWorkspaceState"
};

export interface WebviewMessageEvent {
  type: string;
  payload: any;
}
