import * as vscode from "vscode";
import { Events } from "../Events";
import { Messenger } from "common/messaging/type";
import { getUIMessenger } from "common/messaging/ui";
import gql from "graphql-tag";
import { pipe, subscribe } from "wonka";

export class WindowSelectionWatcher {
  constructor(
    public context: vscode.ExtensionContext,
    public messenger: Messenger
  ) {
    const uiMessenger = getUIMessenger();
    const query = gql`
      mutation ResolveActiveSymbol(
        $path: String!
        $line: Float!
        $column: Float!
      ) {
        resolveActiveSymbol(path: $path, line: $line, column: $column)
      }
    `;

    vscode.window.onDidChangeTextEditorSelection(
      ({ selections, textEditor }) => {
        const firstSelection = selections[0];

        const workspace = vscode.workspace.workspaceFolders;

        if (workspace && workspace.length) {
          pipe(
            uiMessenger.query(query, {
              path: textEditor.document.uri.fsPath,
              line: firstSelection.active.line + 1,
              column: firstSelection.active.character + 1
            }),
            subscribe((err: any) => {})
          );
        }
      }
    );
    messenger.addSubscriber(Events.TextSelectionChanged, () => {});
  }
}
