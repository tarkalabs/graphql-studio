import * as vscode from 'vscode';
import { ErdModel } from 'db-utils/out/structure/utils';

export interface INode {
  isTable: boolean;
  name: string;
  parent: INode;

  getTreeItem(): Promise<vscode.TreeItem> | vscode.TreeItem;
  getChildren(): Promise<INode[]> | INode[];
  getSchema(): ErdModel;
}