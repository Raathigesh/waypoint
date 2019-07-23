import * as vscode from "vscode";
import ContentProvider from "./ContentProvider";
import { join } from "path";
import Project from "../common/indexer/Project";
import { Container } from "typedi";
import blocks from "../blocks/extension-register";
import { spawn, ChildProcess } from "child_process";

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
    process.env.projectRoot = vscode.workspace.rootPath;
  }

  if (process.env.dev) {
    require("./api").startApiServer();
  } else {
    console.log("Spawning API server");
    serverProcess = spawn(
      "node",
      [join(context.extensionPath, "./out/extension/api/index.js")],
      {
        env: {
          projectRoot: vscode.workspace.rootPath
        }
      }
    );
    serverProcess.stdout &&
      serverProcess.stdout.on("data", (data: string) => {
        console.log(data.toString().trim());
      });

    serverProcess.stderr &&
      serverProcess.stderr.on("data", (data: string) => {
        console.log(data.toString().trim());
      });
  }

  currentPanel.onDidDispose(
    () => {
      currentPanel = undefined;
    },
    null,
    context.subscriptions
  );
}
