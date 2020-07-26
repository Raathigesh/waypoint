require('module-alias/register');
import * as vscode from 'vscode';
import ContentProvider from './ContentProvider';
import { join } from 'path';
import { Container } from 'typedi';
import { startApiServer } from './api';
import { pubSub } from 'common/pubSub';
const getPort = require('get-port');
import TelemetryReporter from 'vscode-extension-telemetry';
const packageJSON = require('../../package.json');

let isServerRunning = false;
let port = 0;

const extensionId = 'waypoint';
const extensionVersion = packageJSON.version;
const key = '46773bdf-6391-4142-91b2-471574b947eb';

// telemetry reporter
let reporter: any;

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand(
        'waypoint.showPanel',
        () => {
            initialize(context);
        }
    );

    let disposableAddSymbolToStage = vscode.commands.registerCommand(
        'waypoint.addSymbol',
        e => {
            pubSub.publish('waypoint.addSymbol', 'waypoint.addSymbol');
        }
    );

    if (process.env.dev) {
        initialize(context);
    }
    context.subscriptions.push(disposable);
    context.subscriptions.push(disposableAddSymbolToStage);

    reporter = new TelemetryReporter(extensionId, extensionVersion, key);
    if (!process.env.dev) {
        reporter.sendTelemetryEvent('activate');
    }
    context.subscriptions.push(reporter);
}

export function deactivate() {
    // This will ensure all pending events get flushed
    if (reporter) {
        reporter.dispose();
    }
}

async function initialize(context: vscode.ExtensionContext) {
    Container.set('extension-context', context);
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
        'waypoint',
        'Waypoint',
        vscode.ViewColumn.Beside,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
        }
    );

    currentPanel.webview.html = contentProvider.getContent(context, port);

    const root = join(context.extensionPath, 'icons');
    currentPanel.iconPath = {
        dark: vscode.Uri.file(join(root, 'bubbles.png')),
        light: vscode.Uri.file(join(root, 'bubbles.png')),
    };

    currentPanel.onDidDispose(
        () => {
            currentPanel = undefined;
        },
        null,
        context.subscriptions
    );
}
