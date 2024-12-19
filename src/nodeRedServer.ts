const express = require("express");
const { getPort } = require("get-port-please");
const http = require("http");
const RED = require("node-red");
const embeddedStart = require("node-red-embedded-start");
import * as vscode from "vscode";

export class NodeRedServer {
  private isStarted = false;
  private port!: number;
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  private getStoragePath() {
    return this.context.globalStorageUri.fsPath;
  }

  get Port() {
    return this.port;
  }

  public async start() {
    if (this.isStarted) {
      return;
    }

    this.isStarted = true;

    // Create an Express app
    const app = express();

    // Add a simple route for static content served from 'public'
    app.use("/", express.static("public"));

    // Create a server
    const server = http.createServer(app);

    // Create the settings object - see default settings.js file for other options
    const userSetteings = vscode.workspace
      .getConfiguration("vscode-node-red")
      .get("settings.js");

    const userDir = this.getStoragePath();
    let settings = {
      httpAdminRoot: "/red",
      httpNodeRoot: "/api",
      functionGlobalContext: {}, // enables global context
      userDir: userDir,
    };
    settings = Object.assign(settings, userSetteings);

    // Initialise the runtime with a server and settings
    (RED as any).init(server, settings);

    // Serve the editor UI from /red
    app.use(settings.httpAdminRoot, (RED as any).httpAdmin);

    // Serve the http nodes UI from /api
    app.use(settings.httpNodeRoot, (RED as any).httpNode);

    this.port = await getPort({ port: 8008 });
    await (RED as any).start();
    await embeddedStart(RED);
    server.listen(this.port);
    // tslint:disable-next-line:no-console
    console.log("port:" + this.port);

    // Start the runtime
    await (RED as any).start();
    await embeddedStart(RED);
  }
}
