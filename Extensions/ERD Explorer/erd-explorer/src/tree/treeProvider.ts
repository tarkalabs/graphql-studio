import * as vscode from 'vscode';
import { INode } from '../interfaces/INode';
import { IConnection } from 'db-utils/out/db/IConnection';
import { ConnectionNode } from './connectionNode';
import { Global } from 'src/common/Global';
import { Connection } from 'db-utils/out/db/connection';

export class PostgreSQLTreeDataProvider implements vscode.TreeDataProvider<INode> {

  public _onDidChangeTreeData: vscode.EventEmitter<INode> = new vscode.EventEmitter<INode>();
  public readonly onDidChangeTreeData: vscode.Event<INode> = this._onDidChangeTreeData.event;
  private static _instance: PostgreSQLTreeDataProvider;

  constructor(public context: vscode.ExtensionContext){ this.refresh(); }

  public static getInstance(context?: vscode.ExtensionContext): PostgreSQLTreeDataProvider {
    if (context && !this._instance) {
      this._instance = new PostgreSQLTreeDataProvider(context);
      context.subscriptions.push(vscode.window.registerTreeDataProvider("postgres", this._instance));
    }
    return this._instance;
  }
  
  public refresh(element?: INode): void {
    this._onDidChangeTreeData.fire(element);
  }

  public getTreeItem(element: INode): Promise<vscode.TreeItem> | vscode.TreeItem {
    return element.getTreeItem();
  }

  public getChildren(element?: INode): Promise<INode[]> | INode[] {
    if (!element) {
      return this.getConnectionNodes();
    }
    return element.getChildren();
  }

  private async getConnectionNodes(): Promise<INode[]> {
    //const connections = this.context.globalState.get<{[key: string]: IConnection}>("postgresql.connections");
    const ConnectionNodes = [];
    /*if (connections) {
      for (const id of Object.keys(connections)) {
        let connection: IConnection = Object.assign({}, connections[id]);
        if (connection.hasPassword || !connection.hasOwnProperty('hasPassword')) {
          connection.password = await Global.keytar.getPassword("vscode-postgres", id);
        }
        ConnectionNodes.push(new ConnectionNode(id, connection));
      }
    }*/

    ConnectionNodes.push(new ConnectionNode("1", {
      label:"Localhost",
      host:"127.0.0.1",
      user:"dev",
      password:"1234",
      port:5432,
      database:"StackExchange"
    }));

    return ConnectionNodes;
  }
}