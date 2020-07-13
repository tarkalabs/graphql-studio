import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { MermaidUtils, MermaidSchema, getHtmlContent, getStructure, getERDContent } from "db-utils";
import { Connection } from "db-utils/out/db/connection";

'use strict';

export class generateERDCommand {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand("erd-explorer.generateERD", this.run, this);
    context.subscriptions.push(disposable);
    this.context = context;
  }

	async run() {
		Connection.setup({
			label:"Localhost",
			host:"127.0.0.1",
			user:"dev",
			password:"1234",
			port:5432,
			database:"example"
		  });
		  
		// Get the structure of the DB
		let results = getStructure();

		// if (vscode.window.registerWebviewPanelSerializer) {
    //   const self = this; // TODO: Get rid of self
      
		// 	// Make sure we register a serializer in activation event
		// 	vscode.window.registerWebviewPanelSerializer("ERD", {
		// 		async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
		// 			console.log(`Got state: ${state}`);
		// 			return ERDPanel.revive(webviewPanel, self.context.extensionPath, HTML); //await this.getHtml(results));
		// 		}
		// 	});
		// }

		// Display the webview
		return await getERDContent(new MermaidSchema(), new MermaidUtils(), results); //this.showERD(results);
	}

		// Save ERD in a file
	async showERD(sqlResults: any) {
		let html = ""; //HTML; //await this.getHtml(sqlResults);

		ERDPanel.createOrShow(this.context.extensionPath, html);
	}

	async getHtml(sqlResults: any) {
		return await getHtmlContent(new MermaidSchema(), new MermaidUtils(), sqlResults)
	}
}

 class ERDPanel {
	public static currentPanel: ERDPanel | undefined;

	public static readonly viewType = 'catCoding';

	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionPath: string;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(extensionPath: string, html: string) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (ERDPanel.currentPanel) {
			ERDPanel.currentPanel._panel.reveal(column);
			ERDPanel.currentPanel.setContent(html);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			ERDPanel.viewType,
			'ERD',
			column || vscode.ViewColumn.One,
			{
				// Enable javascript in the webview
				enableScripts: true,

				// And restrict the webview to only loading content from our extension's `media` directory.
				localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'media'))]
			}
		);

		ERDPanel.currentPanel = new ERDPanel(panel, extensionPath, html);
	}

	public static revive(panel: vscode.WebviewPanel, extensionPath: string, html: string) {
		ERDPanel.currentPanel = new ERDPanel(panel, extensionPath, html);
	}

	private constructor(panel: vscode.WebviewPanel, extensionPath: string, html: string) {
		this._panel = panel;
		this._extensionPath = extensionPath;

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'alert':
						vscode.window.showErrorMessage(message.text);
						return;
				}
			},
			null,
			this._disposables
		);

		this.setContent(html);
	}

	public sendMessage() {
		// Send a message to the webview webview.
		// You can send any JSON serializable data.
		this._panel.webview.postMessage({ command: 'MyJsCommand' });
	}

	public dispose() {
		ERDPanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	public setContent(html: string) {
		console.log(html);
		this._panel.webview.html = html;
	}
}