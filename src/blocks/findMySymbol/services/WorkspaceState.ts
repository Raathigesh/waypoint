import vscode from "vscode";
import { Events } from "../Events";
import { Messenger } from "common/messaging/type";

export class WorkspaceState {
  constructor(
    public webview: vscode.Webview,
    public context: vscode.ExtensionContext,
    public messenger: Messenger
  ) {
    messenger.addSubscriber(Events.GetWorkspaceState, () => {
      const state = context.workspaceState.get("InsightWorkspaceState");
      messenger.send(Events.GetWorkspaceState, state);
    });

    messenger.addSubscriber(Events.SaveWorkspaceState, (state: any) => {
      context.workspaceState.update("InsightWorkspaceState", state);
    });
  }
}
