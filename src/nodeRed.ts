import * as vscode from "vscode";
import { NodeRedServer } from "./nodeRedServer";
import { NodeRedWebview } from "./nodeRedWebview";

export class NodeRed {
  private nodeRedServer: NodeRedServer;

  constructor(context: vscode.ExtensionContext) {
    this.nodeRedServer = new NodeRedServer(context);
  }

  public async start() {
    await this.nodeRedServer.start();
  }

  public async open(toSide: boolean) {
    const panel = vscode.window.createWebviewPanel(
      "nodeRed", // Identifies the type of the webview. Used internally
      "Node-RED", // Title of the panel displayed to the user
      toSide ? vscode.ViewColumn.Two : vscode.ViewColumn.One, // Editor column to show the new webview panel in.
      {
        enableScripts: true, // Enable javascript in the webview
      }
    );

    const webview = new NodeRedWebview(this.nodeRedServer.Port);
    const previewUri: vscode.Uri = vscode.Uri.parse(
      "extension-leaderboard://authority/show-extension-leaderboard"
    );
    vscode.workspace.registerTextDocumentContentProvider(
      "extension-leaderboard",
      webview
    );
    panel.webview.html = await webview.provideTextDocumentContent(previewUri);
  }
}
