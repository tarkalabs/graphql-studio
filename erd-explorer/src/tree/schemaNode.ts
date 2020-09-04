import * as path from 'path';
import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { IConnection } from '@tarkalabs/pg-db-utils'
import { INode } from 'src/interfaces/INode';
import { TableNode } from './tableNode';
import { InfoNode } from './infoNode';
import { DatabaseNode } from './databaseNode';

export class SchemaNode implements INode {
  public isTable = false;
  public name = "";
  public parent: INode = null;

  constructor(private readonly connection: IConnection, private readonly databaseNode: DatabaseNode, private readonly treeSchema: any) {
    this.parent = databaseNode;
    this.name = this.treeSchema.schemaName;
  }
  
  public getSchema() {
    return this.databaseNode.getSchema();
  }
  
  public getTreeItem(): TreeItem {
    return {
      label: this.treeSchema.schemaName,
      collapsibleState: TreeItemCollapsibleState.Collapsed,
      contextValue: 'vscode-postgres.tree.schema',
      command: {
        title: 'select-database',
        command: 'vscode-postgres.setActiveConnection',
        arguments: [ this.connection ]
      },
      iconPath: {
        light: path.join(__dirname, '../../resources/light/schema.svg'),
        dark: path.join(__dirname, '../../resources/dark/schema.svg')
      }
    };
  }

  public async getChildren(): Promise<INode[]> {
    //const configVirtFolders = Global.Configuration.get<Array<string>>("virtualFolders");

    try {
      let children = [];
      /*if (configVirtFolders != null)
      {
        if (configVirtFolders.indexOf("functions") !== -1) {
          children.push(new FunctionFolderNode(this.connection, this.schema.schemaName));
        }
      }
      /*/
      // Append tables under virtual folders
      return this.treeSchema.tables.map((table: any) => {
        return new TableNode(this.connection, this, table);
      });
    } catch(err) {
      return [new InfoNode(err, this)];
    } finally {
    }
  }
}