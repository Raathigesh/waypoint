require("module-alias/register");
import * as vscode from "vscode";
import ContentProvider from "./ContentProvider";
import { join, resolve } from "path";
import { ChildProcess, spawn } from "child_process";
import { executeQuery } from "common/messaging/graphql";
import gql from "graphql-tag";
import { getUIMessenger } from "common/messaging/ui";
import Services from "./services";
import { startApiServer } from "./api";
import { Container } from "typedi";

let serverProcess: ChildProcess | null = null;

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("insight.showPanel", () => {
    initialize(context);
  });

  if (process.env.dev) {
    initialize(context);
  }
  context.subscriptions.push(disposable);
}

export function deactivate() {
  if (serverProcess) {
    serverProcess.kill();
  }
}

async function initialize(context: vscode.ExtensionContext) {
  Container.set("extension-context", context);
  if (vscode.workspace.rootPath) {
    process.env.projectRoot = vscode.workspace.rootPath;
  }

  await startApiServer();
  const uiMessenger = getUIMessenger();
  Services.forEach(Service => new Service(context, uiMessenger));

  const query = gql`
    mutation {
      reindex
    }
  `;
  // executeQuery(query, undefined);

  const contentProvider = new ContentProvider();
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  const outputChannel = vscode.window.createOutputChannel("Insight");
  outputChannel.show();

  currentPanel = vscode.window.createWebviewPanel(
    "insight",
    "Code bubbles",
    vscode.ViewColumn.Two,
    {
      enableScripts: true,
      retainContextWhenHidden: true
    }
  );

  currentPanel.webview.html = contentProvider.getContent(context);

  const root = join(context.extensionPath, "icons");
  currentPanel.iconPath = {
    dark: vscode.Uri.file(join(root, "icon-light.png")),
    light: vscode.Uri.file(join(root, "icon-dark.png"))
  };

  currentPanel.onDidDispose(
    () => {
      currentPanel = undefined;
    },
    null,
    context.subscriptions
  );
}
