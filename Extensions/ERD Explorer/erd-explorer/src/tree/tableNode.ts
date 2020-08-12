import { INode } from "src/interfaces/INode";
import { IConnection } from "db-utils/out/db/IConnection";
import { TreeItem, TreeItemCollapsibleState } from "vscode";
import path = require("path");
import { ColumnNode } from "./columnNode";
import { InfoNode } from "./infoNode";
import { SchemaNode } from "./schemaNode";


export class TableNode implements INode {
  public isTable = true;
  public name = "";
  public parent: INode = null;

  constructor(public readonly connection: IConnection
            , public readonly schemaNode: SchemaNode
            , public readonly table: any)
  {
    this.name = this.table.tableName;
    this.parent = schemaNode;
  }

  public getSchema() {
    return this.schemaNode.getSchema();
  }
  
  public getTreeItem(): TreeItem {
    return {
      label: this.table.tableName,
      collapsibleState: TreeItemCollapsibleState.Collapsed,
      contextValue: 'vscode-postgres.tree.table',
      iconPath: {
        light: path.join(__dirname, `../../resources/light/${this.table.is_table ? 'table' : 'view'}.svg`),
        dark: path.join(__dirname, `../../resources/dark/${this.table.is_table ? 'table' : 'view'}.svg`)
      }
    };
  }

  public async getChildren(): Promise<INode[]> {
    try {
      return this.table.columns.map((column: any) => {
        return new ColumnNode(this.connection, this.schemaNode, this, column);
      });
    } catch(err) {
      return [new InfoNode(err, this)];
    } finally {
    }
  }
}