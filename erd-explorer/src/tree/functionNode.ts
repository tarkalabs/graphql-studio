/*
import * as path from 'path';
import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { INode } from 'src/interfaces/INode';
import { IConnection } from '@tarkalabs/pg-db-utils'

export class FunctionNode implements INode {
  constructor(public readonly connection: IConnection
    , public readonly func: string
    , public readonly args: string[]
    , public readonly ret: string
    , public readonly schema?: string
    , public readonly description?: string)
  {}

  public getTreeItem(): TreeItem | Promise<TreeItem> {
    let label = `${this.func}(${this.args.join(', ')}) : ${this.ret}`;
    let tooltip = label;
    if (this.description != null) {
      tooltip += '\n' + this.description;
    }
    return {
      label: label,
      tooltip: tooltip,
      collapsibleState: TreeItemCollapsibleState.None,
      contextValue: 'erd-explorer.tree.function',
      iconPath: {
        light: path.join(__dirname, `../../resources/light/function.svg`),
        dark: path.join(__dirname, `../../resources/dark/function.svg`)
      }
    };
  }
  
  public getChildren(): INode[] | Promise<INode[]> {
    return [];
  }
}
/*/