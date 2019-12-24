require("module-alias/register");
import * as vscode from "vscode";
import ContentProvider from "./ContentProvider";
import { join } from "path";
import { getUIMessenger } from "common/messaging/ui";
import { Container } from "typedi";
import Services from "./services";
import { startApiServer } from "./api";

let isServerRunning = false;

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "js-bubbles.showPanel",
    () => {
      initialize(context);
    }
  );

  if (process.env.dev) {
    initialize(context);
  }
  context.subscriptions.push(disposable);
}

export function deactivate() {}

async function initialize(context: vscode.ExtensionContext) {
  Container.set("extension-context", context);
  if (vscode.workspace.rootPath) {
    process.env.projectRoot = vscode.workspace.rootPath;
  }

  if (!isServerRunning) {
    await startApiServer();
    isServerRunning = true;
  }

  const uiMessenger = getUIMessenger();
  Services.forEach(Service => new Service(context, uiMessenger));

  const contentProvider = new ContentProvider();
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  const outputChannel = vscode.window.createOutputChannel("Insight");
  outputChannel.show();

  currentPanel = vscode.window.createWebviewPanel(
    "js-bubbles",
    "JS bubbles",
    vscode.ViewColumn.Two,
    {
      enableScripts: true,
      retainContextWhenHidden: true
    }
  );

  currentPanel.webview.html = contentProvider.getContent(context);

  const root = join(context.extensionPath, "icons");
  currentPanel.iconPath = {
    dark: vscode.Uri.file(join(root, "bubbles.png")),
    light: vscode.Uri.file(join(root, "bubbles.png"))
  };

  currentPanel.onDidDispose(
    () => {
      currentPanel = undefined;
    },
    null,
    context.subscriptions
  );
}
