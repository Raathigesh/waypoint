import vscode, {
  workspace,
  WorkspaceEdit,
  Uri,
  Position,
  window,
  ViewColumn
} from "vscode";
import * as tmp from "tmp";
import { WebviewMessageEvent, Events } from "../../events/Events";

export class WindowHandler {
  constructor(
    public webview: vscode.Webview,
    public context: vscode.ExtensionContext
  ) {
    webview.onDidReceiveMessage((event: WebviewMessageEvent) => {
      if (event.type === Events.Window.ShowTextDocument) {
        const { path, range } = event.payload;
        window.showTextDocument(Uri.file(path), {
          viewColumn: ViewColumn.One
        });
      }
    }, context.subscriptions);
  }
}
