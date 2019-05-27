import * as vscode from "vscode";
import ContentProvider from "./ContentProvider";
import { join } from "path";
import Project from "./indexer/Project";
import { startApiServer } from "./api";
import { Container } from "typedi";
import { WorkspaceState } from "./services/WorkspaceState";

export function activate(context: vscode.ExtensionContext) {
  const contentProvider = new ContentProvider();
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  // let disposable = vscode.commands.registerCommand("insight.showPanel", () => {
  // });
  // context.subscriptions.push(disposable);

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

  const workplaceState = new WorkspaceState(currentPanel.webview, context);

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

export function deactivate() {}
