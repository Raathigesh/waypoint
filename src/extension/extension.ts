require("module-alias/register");
import * as vscode from "vscode";
import ContentProvider from "./ContentProvider";
import { join } from "path";
import blocks from "../blocks/extension-register";
import { spawn, ChildProcess } from "child_process";
import { getClient } from "common/messaging/graphql-client";
import gql from "graphql-tag";
import { pipe, subscribe } from "wonka";
import { createRequest } from "urql";
import { getUIMessenger } from "common/messaging/ui";

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

function initialize(context: vscode.ExtensionContext) {
  const contentProvider = new ContentProvider();
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  const outputChannel = vscode.window.createOutputChannel("Insight");
  outputChannel.show();

  if (!process.env.HIDE_WEB_VIEW) {
    currentPanel = vscode.window.createWebviewPanel(
      "insight",
      "Insight",
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

  if (vscode.workspace.rootPath) {
    process.env.projectRoot = vscode.workspace.rootPath;
  }

  if (process.env.dev) {
    outputChannel.appendLine("Starting API server in-process");
    require("./api").startApiServer();
  } else {
    const APIServerEntryPath = join(
      context.extensionPath,
      "./out/extension/api/index.js"
    );
    outputChannel.appendLine(`Spawning API server : ${APIServerEntryPath}`);
    serverProcess = spawn("node", [APIServerEntryPath], {
      env: {
        projectRoot: vscode.workspace.rootPath
      }
    });
    serverProcess.stdout &&
      serverProcess.stdout.on("data", (data: string) => {
        outputChannel.appendLine(data.toString().trim());
      });

    serverProcess.stderr &&
      serverProcess.stderr.on("data", (data: string) => {
        outputChannel.appendLine(data.toString().trim());
      });
  }

  const uiMessenger = getUIMessenger();
  for (const block of blocks) {
    block.services.forEach(Service => {
      new Service(context, uiMessenger);
    });
  }
}
