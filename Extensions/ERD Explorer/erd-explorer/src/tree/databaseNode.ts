import * as path from 'path';
import { INode } from 'src/interfaces/INode';
import { IConnection } from 'db-utils/out/db/IConnection';
import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { SchemaNode } from './schemaNode';
import { InfoNode } from './infoNode';
import { Connection, QueryResults } from 'db-utils/out/db/connection';
import { getStructure, getTreeSchema } from 'db-utils';
import { CoreSchema } from 'db-utils/out/erd/erd-core-models';

export class DatabaseNode implements INode {
  public isTable = true;
  public name = "";
  private schema: CoreSchema;

  constructor(private readonly connection: IConnection, private readonly dbName: string) {
    Connection.setup({
      label: connection.label,
      host: connection.host,
      user: connection.user,
      password: connection.password,
      port: connection.port,
      database: dbName
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
      this.schema = await getTreeSchema();

      return this.schema.tree.schemas.map(schema => {
        return new SchemaNode(this.connection, this, schema);
      });
    } catch(err) {
      return [new InfoNode(err)];
    }
  }
}