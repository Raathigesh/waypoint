import vscode, {
  workspace,
  WorkspaceEdit,
  Uri,
  Position,
  window,
  ViewColumn,
  Selection
} from "vscode";

import { Events } from "../Events";
import { WebviewMessageEvent } from "common/types";

export class WindowHandler {
  constructor(
    public webview: vscode.Webview,
    public context: vscode.ExtensionContext
  ) {
    webview.onDidReceiveMessage((event: WebviewMessageEvent) => {
      if (event.type === Events.Window.ShowTextDocument) {
        const { path, location } = event.payload;
        window.showTextDocument(Uri.file(path), {
          viewColumn: ViewColumn.One,
          selection: new Selection(
            new Position(location.start.line, location.start.column),
            new Position(location.end.line, location.end.column)
          )
        });
      }
    }, context.subscriptions);
  }
}
