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

export class TempFileHandler {
  constructor(
    public webview: vscode.Webview,
    public context: vscode.ExtensionContext
  ) {
    webview.onDidReceiveMessage((event: WebviewMessageEvent) => {
      if (event.type === Events.TempFile.CreateTempFile) {
        const tmpObj = tmp.fileSync({ postfix: ".js" });
        const tempTextDocument = workspace.openTextDocument(tmpObj.name);

        webview.postMessage({
          type: Events.TempFile.CreatedTempFile,
          payload: event.payload
        });

        tempTextDocument.then(doc => {
          window.showTextDocument(doc, ViewColumn.One);
          const edit = new WorkspaceEdit();
          edit.insert(Uri.file(tmpObj.name), new Position(0, 0), event.payload);
          workspace.applyEdit(edit);

          workspace.onDidSaveTextDocument(savedDoc => {
            if (savedDoc.fileName === doc.fileName) {
              webview.postMessage({
                type: Events.TempFile.UpdatedTempFile,
                payload: savedDoc.getText()
              });
            }
          });
        });
      }
    }, context.subscriptions);
  }
}
