import * as vscode from 'vscode';
import * as path from 'path';
import { INode } from 'src/interfaces/INode';
import { IConnection, Connection } from '@tarkalabs/pg-db-utils'
import { DatabaseNode } from './databaseNode';
import { InfoNode } from './infoNode';

export class ConnectionNode implements INode {
  public isTable = false;
  public name = "";
  public parent: INode = null;

  constructor(public readonly id: string, private readonly connection: Connection, private readonly connectionOptions: IConnection) {
  }

  public getSchema(): any {
    return null;
  }

  public getConnection(): Connection {
    return this.connection;
  }

  public getTreeItem(): vscode.TreeItem {
    let label = (this.connectionOptions.label || this.connectionOptions.host);
    return {
      label: label,
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      contextValue: "tarkalabs-postgresql.tree.connection",
      command: {
        title: 'select-database',
        command: 'tarkalabs-postgresql.setActiveConnection',
        arguments: [ this.connection ]
      },
      iconPath: {
        light: path.join(__dirname, '../../resources/light/server.svg'),
        dark: path.join(__dirname, '../../resources/dark/server.svg')
      },
      tooltip: "ERROR: Cannot Connect To Database"
    };
  }

  public async getChildren(): Promise<INode[]> {
    if (this.connectionOptions.database) {
      return [new DatabaseNode(this.connectionOptions, this)];
    }

    // GET ALL DATABASES
    try {
      /*
      // Get all database where permission was granted
      const res = await connection.query(`
      SELECT datname
      FROM pg_database
      WHERE
        datistemplate = false
        AND has_database_privilege(datname, 'TEMP, CONNECT') = true
      ORDER BY datname;`);
      /*/
      
    //  return res.rows.map<DatabaseNode>(database => {
        return [new DatabaseNode(this.connectionOptions, this)];
      //});
    } catch(err) {
      return [new InfoNode(err, this)];
    } finally {
    }
  }
}