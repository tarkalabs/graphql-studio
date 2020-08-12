import * as vscode from 'vscode';
import * as path from 'path';
import { INode } from 'src/interfaces/INode';
import { IConnection } from 'db-utils/out/db/IConnection';
import { DatabaseNode } from './databaseNode';
import { InfoNode } from './infoNode';

export class ConnectionNode implements INode {
  public isTable = false;
  public name = "";
  public parent: INode = null;

  constructor(public readonly id: string, private readonly connection: IConnection) {}

  public getSchema(): any {
    return null;
  }

  public getTreeItem(): vscode.TreeItem {
    return {
      label: this.connection.label || this.connection.host,
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      contextValue: "vscode-postgres.tree.connection",
      command: {
        title: 'select-database',
        command: 'vscode-postgres.setActiveConnection',
        arguments: [ this.connection ]
      },
      iconPath: {
        light: path.join(__dirname, '../../resources/light/server.svg'),
        dark: path.join(__dirname, '../../resources/dark/server.svg')
      }
    };
  }

  public async getChildren(): Promise<INode[]> {
    if (this.connection.database) {
      return [new DatabaseNode(this.connection, this.connection.database, this)];
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
        return [new DatabaseNode(this.connection, this.connection.database, this)];
      //});
    } catch(err) {
      return [new InfoNode(err, this)];
    } finally {
    }
  }
}