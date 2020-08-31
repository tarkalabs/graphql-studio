import * as vscode from 'vscode';
import { INode } from '../interfaces/INode';
import { ConnectionNode } from './connectionNode';
import { IConnection, Connection } from '@tarkalabs/pg-db-utils';
import { InfoNode } from './infoNode';
var parse = require('pg-connection-string').parse;

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
    if (!await connection.testConnection()) {
      ConnectionNodes.push(new InfoNode("Failed To Connect To Database", null));
    } else {
      ConnectionNodes.push(new ConnectionNode("1", connection, conn));
    }

    return ConnectionNodes;
  }
}