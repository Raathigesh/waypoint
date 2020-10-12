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
    let disposableAddSymbolToStage = vscode.commands.registerCommand(
        'waypoint.addSymbol',
        e => {
            pubSub.publish('waypoint.addSymbol', 'waypoint.addSymbol');
        }
    );

    initialize(context);
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

    const provider = new WaypointViewProvider();
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            WaypointViewProvider.viewType,
            provider
        )
    );
}

class WaypointViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'waypoint.search';

    private _view?: vscode.WebviewView;

    constructor() {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
        };

        const contentProvider = new ContentProvider();
        webviewView.webview.html = contentProvider.getContent(port);
    }
}
