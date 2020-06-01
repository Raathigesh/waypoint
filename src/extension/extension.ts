require("module-alias/register");
import * as vscode from "vscode";
import ContentProvider from "./ContentProvider";
import { join } from "path";
import { Container } from "typedi";
import { startApiServer } from "./api";
import { pubSub } from "common/pubSub";
const getPort = require("get-port");

let isServerRunning = false;
let port = 0;

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "js-bubbles.showPanel",
    () => {
      initialize(context);
    }
  );

  let disposableAddToStage = vscode.commands.registerCommand(
    "js-bubbles.addFile",
    e => {
      pubSub.publish("js-bubbles.addFile", "js-bubbles.addFile");
    }
  );

  let disposableAddSymbolToStage = vscode.commands.registerCommand(
    "js-bubbles.addSymbol",
    e => {
      pubSub.publish("js-bubbles.addSymbol", "js-bubbles.addSymbol");
    }
  );

  if (process.env.dev) {
    initialize(context);
  }
  context.subscriptions.push(disposable);
  context.subscriptions.push(disposableAddToStage);
  context.subscriptions.push(disposableAddSymbolToStage);
}

export function deactivate() {}

async function initialize(context: vscode.ExtensionContext) {
  Container.set("extension-context", context);
  if (vscode.workspace.rootPath) {
    process.env.projectRoot = vscode.workspace.rootPath;
  }

  if (!isServerRunning) {
    port = await getPort({ port: 4545 });
    await startApiServer(port);
    isServerRunning = true;
  }

  const contentProvider = new ContentProvider();
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  currentPanel = vscode.window.createWebviewPanel(
    "js-bubbles",
    "JS bubbles",
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      retainContextWhenHidden: true
    }
  );

  currentPanel.webview.html = contentProvider.getContent(context, port);

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
