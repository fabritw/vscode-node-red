import * as vscode from "vscode";
import { NodeRed } from "./nodeRed";

export function activate(context: vscode.ExtensionContext) {
  const nodeRed = new NodeRed(context);
  nodeRed.start();

  const open = vscode.commands.registerCommand("node-red.open", () => {
    nodeRed.open(false);
  });

  const openToSide = vscode.commands.registerCommand(
    "node-red.openToSide",
    () => {
      nodeRed.open(true);
    }
  );

  context.subscriptions.push(open, openToSide);
}

export function deactivate() {}
