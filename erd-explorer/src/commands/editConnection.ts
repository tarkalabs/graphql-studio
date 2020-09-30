import * as vscode from 'vscode';
import { Global } from "../common/global";
import { Constants } from "../common/constants";
import { IConnection } from '@tarkalabs/pg-db-utils';

'use strict';

export class editConnectionCommand {
  async run(treeNode: any) {
    // let selectedConnection: IConnection = null;
    let selectedConnId: any = null;

    let connections = Global.context.globalState.get<{ [key: string]: IConnection }>(Constants.GlobalStateKey);
    if (!connections) {
      vscode.window.showWarningMessage('There are no connections available to rename');
      return;
    }

    if (treeNode && treeNode.connection) {
      selectedConnId = treeNode.id;
      if (selectedConnId === "default") {
        vscode.window.showWarningMessage('You cannot modify a connection defined in the environment.');
        return;
      }
    } else {
      let hosts = [];
      for (const k in connections) {
        if (connections.hasOwnProperty(k))
          hosts.push({ label: connections[k].label || connections[k].host, connection_key: k });
      }

      const hostToSelect = await vscode.window.showQuickPick(hosts, {placeHolder: 'Select a connection', matchOnDetail: false});
      if (!hostToSelect) return;

      selectedConnId = hostToSelect.connection_key;
    }

    const configDocument = await vscode.workspace.openTextDocument(vscode.Uri.parse(`postgres-config:/${selectedConnId}.json`));
    await vscode.window.showTextDocument(configDocument);
    // const label = await vscode.window.showInputBox({ prompt: "The display name of the database connection", placeHolder: "label", ignoreFocusOut: true });
    // selectedConnection.label = label;
    
    // connections[selectedConnId] = selectedConnection;

    // const tree = PostgreSQLTreeDataProvider.getInstance();
    // await tree.context.globalState.update(Constants.GlobalStateKey, connections);
    // tree.refresh();
  }
}