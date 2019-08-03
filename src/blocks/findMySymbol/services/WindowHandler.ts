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
import { Messenger } from "common/messaging/type";

export class WindowHandler {
  constructor(
    public context: vscode.ExtensionContext,
    public messenger: Messenger
  ) {
    messenger.addSubscriber(
      Events.Window.ShowTextDocument,
      (event: WebviewMessageEvent) => {
        const { path, location } = event.payload;
        window.showTextDocument(Uri.file(path), {
          viewColumn: ViewColumn.One,
          selection: new Selection(
            new Position(location.start.line, location.start.column),
            new Position(location.end.line, location.end.column)
          )
        });
      }
    );
  }
}
