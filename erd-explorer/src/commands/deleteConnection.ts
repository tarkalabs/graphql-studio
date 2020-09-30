
import * as vscode from 'vscode';
import { ConnectionNode } from "../tree/connectionNode";
import { PostgreSQLTreeDataProvider } from "../tree/treeProvider";
import { Constants } from "../common/constants";
import { Global } from "../common/global";
import { IConnection } from '@tarkalabs/pg-db-utils';

'use strict';

export class deleteConnectionCommand {
  async run(connectionNode: ConnectionNode) {
    let connections = Global.context.globalState.get<{ [key: string]: IConnection }>(Constants.GlobalStateKey);
    if (!connections) connections = {};

    if (connectionNode) {
      if (connectionNode.id === "default") {
        vscode.window.showWarningMessage('You cannot delete a connection defined in the environment.');
        return;
      }
      await deleteConnectionCommand.deleteConnection(connections, connectionNode.id);
      return;
    }
    
    let hosts = [];
    for (const k in connections) {
      if (connections.hasOwnProperty(k)) {
        hosts.push({
          label: connections[k].label || connections[k].host,
          connection_key: k
        });
      }
    }

    const hostToDelete = await vscode.window.showQuickPick(hosts, {placeHolder: 'Select a connection to delete', matchOnDetail: false});
    if (!hostToDelete) return;

    await deleteConnectionCommand.deleteConnection(connections, hostToDelete.connection_key);
  }

  private static async deleteConnection(connections: { [key: string]: IConnection }, key: string) {
    delete connections[key];
    
    await Global.context.globalState.update(Constants.GlobalStateKey, connections);
    await Global.keytar.deletePassword(Constants.ExtensionId, key);

    PostgreSQLTreeDataProvider.getInstance().refresh();
    vscode.window.showInformationMessage('Connection Deleted');
  }
}