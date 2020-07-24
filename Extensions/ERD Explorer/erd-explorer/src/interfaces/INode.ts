import * as vscode from 'vscode';
import { CoreSchema } from 'db-utils/out/erd/erd-core-models';

export interface INode {
  isTable: boolean;
  name: string;

  getTreeItem(): Promise<vscode.TreeItem> | vscode.TreeItem;
  getChildren(): Promise<INode[]> | INode[];
  getSchema(): CoreSchema;
}