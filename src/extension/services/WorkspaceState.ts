import vscode from "vscode";
import { Events } from "common/Events";
import { Messenger } from "common/messaging/type";

export class WorkspaceState {
  constructor(
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
