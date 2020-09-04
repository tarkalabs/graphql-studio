import * as path from 'path';
import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { INode } from 'src/interfaces/INode';
import { IConnection } from '@tarkalabs/pg-db-utils'
import { IColumn } from 'src/interfaces/IColumn';
import { SchemaNode } from './schemaNode';
import { TableNode } from './tableNode';

export class ColumnNode implements INode {
  public isTable = false;
  public name = "";
  public parent: INode = null;

  constructor(private readonly connection: IConnection, private readonly schemaNode: SchemaNode, private readonly tableNode: TableNode, private readonly column: IColumn) {
    this.parent = tableNode;
  }

  public getSchema() {
    return this.schemaNode.getSchema();
  }

  public async getChildren(): Promise<INode[]> { return []; }
  public getTreeItem(): TreeItem {
    let icon = 'column';
    let label = `${this.column.columnName} : ${this.column.data_type}`;
    let tooltip = label;

    if (this.column.pk) icon = 'p-key';
    if (this.column.fk) {
      icon = 'f-key';
      tooltip += '\n' + this.column.fk.constraint;
      tooltip += ' -> ' + this.column.fk.table + '.' + this.column.fk.column;
    }

    return {
      label,
      tooltip,
      collapsibleState: TreeItemCollapsibleState.None,
      contextValue: 'vscode-postgres.tree.column',
      iconPath: {
        light: path.join(__dirname, `../../resources/light/${icon}.svg`),
        dark: path.join(__dirname, `../../resources/dark/${icon}.svg`)
      }
    };
  }

}