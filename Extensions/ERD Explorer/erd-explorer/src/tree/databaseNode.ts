import * as path from 'path';
import { INode } from 'src/interfaces/INode';
import { IConnection } from '@tarkalabs/pg-db-utils'
import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { SchemaNode } from './schemaNode';
import { InfoNode } from './infoNode';
import { getStructure } from '@tarkalabs/pg-db-utils'
import { ErdModel } from '@tarkalabs/pg-db-utils'
import { ConnectionNode } from './connectionNode';

export class DatabaseNode implements INode {
  public isTable = false;
  public name = "";
  public parent: INode = null;
  private schema: ErdModel;

  constructor(private readonly connection: IConnection, private readonly connectionNode: ConnectionNode) {
    this.parent = connectionNode;

    getStructure(connectionNode.getConnection()).then(new_schema => {
      if (new_schema) {
        this.schema = new_schema
        console.log(this.schema);
      } else {
        console.error("Dbms Structure was not parsed correctly.");
      }
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