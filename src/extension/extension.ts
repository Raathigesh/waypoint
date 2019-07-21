import * as vscode from "vscode";
import ContentProvider from "./ContentProvider";
import { join } from "path";
import Project from "../common/indexer/Project";
import { startApiServer } from "./api";
import { Container } from "typedi";
import blocks from "../blocks/extension-register";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("insight.showPanel", () => {
    initialize(context);
  });
  context.subscriptions.push(disposable);
}

export function deactivate() {}

function initialize(context: vscode.ExtensionContext) {
  const contentProvider = new ContentProvider();
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

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

  for (const block of blocks) {
    block.services.forEach(WorkspaceState => {
      if (currentPanel) {
        new WorkspaceState(currentPanel.webview, context);
      }
    });
  }

  if (vscode.workspace.rootPath) {
    const project: Project = {
      root: vscode.workspace.rootPath
    };
    Container.set("project", project);
  }

  startApiServer();

  currentPanel.onDidDispose(
    () => {
      currentPanel = undefined;
    },
    null,
    context.subscriptions
  );
}
