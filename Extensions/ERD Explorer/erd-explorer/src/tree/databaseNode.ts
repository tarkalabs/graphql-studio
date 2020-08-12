import * as path from 'path';
import { INode } from 'src/interfaces/INode';
import { IConnection } from 'db-utils/out/db/IConnection';
import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { SchemaNode } from './schemaNode';
import { InfoNode } from './infoNode';
import { getStructure } from 'db-utils';
import { ErdModel } from 'db-utils/out/structure/utils';
import { Connection } from 'db-utils/out/db/connection';
import { ConnectionNode } from './connectionNode';

export class DatabaseNode implements INode {
  public isTable = false;
  public name = "";
  private schema: ErdModel;
  public parent: INode = null;

  constructor(private readonly connection: IConnection, private readonly dbName: string, private readonly connectionNode: ConnectionNode) {
    Connection.setup({
      label: connection.label,
      host: connection.host,
      user: connection.user,
      password: connection.password,
      port: connection.port,
      database: dbName
    });
    this.parent = connectionNode;
    getStructure().then(schema => {
      this.schema = schema;
    });
  }

  public getSchema() {
    return this.schema;
  }
  
  public getTreeItem(): TreeItem {
    return {
      label: this.connection.database,
      collapsibleState: TreeItemCollapsibleState.Collapsed,
      contextValue: 'vscode-postgres.tree.database',
      command: {
        title: 'select-database',
        command: 'vscode-postgres.setActiveConnection',
        arguments: [ this.connection ]
      },
      iconPath: {
        light: path.join(__dirname, '../../resources/light/database.svg'),
        dark: path.join(__dirname, '../../resources/dark/database.svg')
      }
    }
  }

  public async getChildren(): Promise<INode[]> {
    try {
      return this.schema.tree.schemas.map(schema => {
        return new SchemaNode(this.connection, this, schema);
      });
    } catch(err) {
      return [new InfoNode(err, this)];
    }
  }
}