// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import ViewLoader from './view/ViewLoader';
import { PostgreSQLTreeDataProvider } from './tree/treeProvider';
import { Global } from './common/global';
import { INode } from './interfaces/INode';
//import { config } from 'dotenv';
require('dotenv').config();
import {inject} from 'dotenvrc/envrc';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	inject({filename: vscode.workspace.rootPath + "/.envrc"});	

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "erd-explorer" is now active!');

	let treeProvider: PostgreSQLTreeDataProvider = PostgreSQLTreeDataProvider.getInstance(context);

	let disposable = vscode.commands.registerCommand(
		"erd-explorer.viewERD",
		(treeNode?: INode) => {
			let openDialogOptions: vscode.OpenDialogOptions = {
				canSelectFiles: true,
				canSelectFolders: false,
				canSelectMany: false,
				filters: {
					Json: ["json"]
				}
			};

			const view = new ViewLoader(context, treeNode);
		}
	);
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('vscode-postgres.refresh', async (treeNode: INode) => {
		const tree = PostgreSQLTreeDataProvider.getInstance();
		tree.refresh(treeNode);
	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
