import * as path from 'path';
import * as vscode from 'vscode';
import { TreeItemCollapsibleState } from 'vscode';
import { INode } from 'src/interfaces/INode';

export class InfoNode implements INode {
  public isTable = true;
  public name = "";

  constructor(private readonly label: string) {}

  public getSchema(): any {
    return null;
  }
  
  public getTreeItem(): vscode.TreeItem {
    return {
      label: this.label.toString(),
      collapsibleState: TreeItemCollapsibleState.None,
      contextValue: 'vscode-postgres.tree.error',
      iconPath: {
        light: path.join(__dirname, '../../resources/light/error.svg'),
        dark: path.join(__dirname, '../../resources/dark/error.svg')
      }
    };
  }
  public getChildren(): INode[] { return []; }
}