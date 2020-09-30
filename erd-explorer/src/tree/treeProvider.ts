import * as vscode from 'vscode';
import { INode } from '../interfaces/INode';
import { ConnectionNode } from './connectionNode';
import { IConnection, Connection } from '@tarkalabs/pg-db-utils';
import { InfoNode } from './infoNode';
import { Constants } from '../common/constants';
import { Global } from '../common/global';
var parse = require('pg-connection-string').parse;

export class PostgreSQLTreeDataProvider implements vscode.TreeDataProvider<INode> {

  public _onDidChangeTreeData: vscode.EventEmitter<INode> = new vscode.EventEmitter<INode>();
  public readonly onDidChangeTreeData: vscode.Event<INode> = this._onDidChangeTreeData.event;
  private static _instance: PostgreSQLTreeDataProvider;

  constructor(public context: vscode.ExtensionContext){ this.refresh(); }

  public static getInstance(context?: vscode.ExtensionContext): PostgreSQLTreeDataProvider {
    if (context && !this._instance) {
      this._instance = new PostgreSQLTreeDataProvider(context);
      context.subscriptions.push(vscode.window.registerTreeDataProvider("tarkalabs-postgres", this._instance));
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
    const ConnectionNodes: INode[] = [];

    let conn: IConnection;
    if (process.env.DATABASE_URL) {
      conn = parse(process.env.DATABASE_URL);
    } else {
      conn = {
        label: process.env.PGLABEL,
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        port: parseInt(process.env.PGPORT),
        database: process.env.PGDATABASE
      }
    }

    let connection: Connection = new Connection(conn);
    if (!(conn.host === '' || conn.user === '' || conn.port === NaN || conn.database === '')) {
      if (!await connection.testConnection()) {
        ConnectionNodes.push(new InfoNode("Failed To Connect To env:" + conn.label + ":" + conn.database, null));
      } else {
        conn.label = "(env) " + conn.label;
        ConnectionNodes.push(new ConnectionNode("default", connection, conn));
      }
    }
    
    const connections = this.context.globalState.get<{[key: string]: IConnection}>(Constants.GlobalStateKey);
    if (connections) {
      for (const id of Object.keys(connections)) {
        conn = Object.assign({}, connections[id]);
        if (conn.hasPassword || !connection.hasOwnProperty('hasPassword')) {
          conn.password = await Global.keytar.getPassword(Constants.ExtensionId, id);
        }
        connection = new Connection(conn);
        if (!await connection.testConnection()) {
          ConnectionNodes.push(new InfoNode("Failed To Connect To " + conn.label + ":" + conn.database, null));
        } else {
          ConnectionNodes.push(new ConnectionNode(id, connection, conn));
        }
      }
    }


    return ConnectionNodes;
  }
}