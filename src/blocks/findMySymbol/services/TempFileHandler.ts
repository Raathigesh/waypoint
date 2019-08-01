import vscode, {
  workspace,
  WorkspaceEdit,
  Uri,
  Position,
  window,
  ViewColumn
} from "vscode";
import * as tmp from "tmp";
import { Events } from "../Events";
import { WebviewMessageEvent } from "common/types";
import { Messenger } from "common/messaging/type";

export class TempFileHandler {
  constructor(
    public webview: vscode.Webview,
    public context: vscode.ExtensionContext,
    public messenger: Messenger
  ) {
    messenger.addSubscriber(
      Events.TempFile.CreateTempFile,
      (event: WebviewMessageEvent) => {
        const tmpObj = tmp.fileSync({ postfix: ".js" });
        const tempTextDocument = workspace.openTextDocument(tmpObj.name);

        messenger.send(Events.TempFile.CreatedTempFile, event.payload);

        tempTextDocument.then(doc => {
          window.showTextDocument(doc, ViewColumn.One);
          const edit = new WorkspaceEdit();
          edit.insert(Uri.file(tmpObj.name), new Position(0, 0), event.payload);
          workspace.applyEdit(edit);

          workspace.onDidSaveTextDocument(savedDoc => {
            if (savedDoc.fileName === doc.fileName) {
              messenger.send(
                Events.TempFile.UpdatedTempFile,
                savedDoc.getText()
              );
            }
          });
        });
      }
    );
  }
}
