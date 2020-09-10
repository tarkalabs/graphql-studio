// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import ViewLoader from './view/ViewLoader';
import { PostgreSQLTreeDataProvider } from './tree/treeProvider';
import { INode } from './interfaces/INode';
import {inject} from 'dotenvrc/envrc';
import * as fs from 'fs';
import * as dotenv from 'dotenv'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    if (fs.existsSync(vscode.workspace.rootPath + "/.env")) {
        let result = dotenv.config({path: vscode.workspace.rootPath + "/.env"});
        console.log(JSON.stringify(result.parsed));
        if (result.error) {
            throw result.error
          }
    }
    if (fs.existsSync(vscode.workspace.rootPath + "/.envrc")) {
        inject({filename: vscode.workspace.rootPath + "/.envrc"});
    }
    
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

        const editor = vscode.window.activeTextEditor;
        console.log(editor.document.uri.fsPath);
        console.log(editor.selection.active);
        vscode.commands.executeCommand("editor.action.showReferences", editor.document.uri.fsPath, editor.selection.active, []);
    });
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
