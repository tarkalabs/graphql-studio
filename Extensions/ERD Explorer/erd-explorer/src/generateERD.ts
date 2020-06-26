import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { MermaidUtils, MermaidSchema, getHtmlContent, getStructure } from "db-utils";
import { Connection } from "db-utils/out/db/connection";

'use strict';

let HTML = `<!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <style>
      .dropbtn {
        background-color: #4CAF50;
        color: white;
        padding: 2px 10px 10px 20px;
        font-size: 16px;
        height: 30px;
        border: none;
        text-align: center;
      }

      .dropdown {
        position: absolute;
        display: inline-block;
      }

      .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f1f1f1;
        min-width: 100px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        padding: 0px 0px 0px 10px;
        z-index: 1;
        cursor: default;
      }

      .dropdown-content a {
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
      }

      .mermaidContainer {
        width: 100%;
        text-align: center;
      }

      .dropdown-content a:hover {
        background-color: #ddd;
      }

      .dropdown:hover .dropdown-content {
        display: block;
      }

      .dropdown:hover .dropbtn {
        background-color: #3e8e41;
      }

    </style>
  </head>

  <body>
    <div>
      <div class="dropdown">
        <button class="dropbtn">Roots</button>
        <ol #roots class="dropdown-content">
          <li onclick="clicked('full')">Full ERD</li>
        </ol>
      </div>
      <div class="mermaidContainer">
        <div class="mermaid">
        </div>
      </div>


	</div>
    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
	<script src="mermaid.js"></script>
    <script>
      $(document).ready(function() {
        clicked("full");
      });
      mermaid.initialize({
        startOnLoad: false
      });
      var flip = {
        "||..|{": "}|..||",
        "}|..||": "||..|{",
        "||..||": "||..||"
      }

      var parse = function(str) {
        var erd = {

        }
        str.split("\n").forEach((e) => {
          var f = e.trim();
          var elems = f.split(" ");
          if (erd[elems[0]]) {
            erd[elems[0]].push({
              name: elems[2],
              relationship: elems[1]
            });
          } else {
            $('ol').append("<li onclick=\"clicked('" + elems[0] + "')\">" + elems[0] + "</li>");
            erd[elems[0]] = [{
              name: elems[2],
              relationship: elems[1]
            }];
          }

          if (erd[elems[2]]) {
            erd[elems[2]].push({
              name: elems[0],
              relationship: flip[elems[1]]
            });
          } else {
            $('ol').append("<li onclick=\"clicked('" + elems[2] + "')\">" + elems[2] + "</li>");
            erd[elems[2]] = [{
              name: elems[0],
              relationship: flip[elems[1]]
            }];
          }
        });
        return erd;
      }
      var root = "address";
      var erdRaw = \`language ||..|{ film : "a"
        city ||..|{ address : "a"
        country ||..|{ city : "a"
        address ||..|{ customer : "a"
        film ||..|{ filmactor : "a"
        actor ||..|{ filmactor : "a"
        film ||..|{ filmcategory : "a"
        category ||..|{ filmcategory : "a"
        film ||..|{ inventory : "a"
        staff ||..|{ rental : "a"
        inventory ||..|{ rental : "a"
        customer ||..|{ rental : "a"
        address ||..|{ staff : "a"
        staff ||..|{ store : "a"
        address ||..|{ store : "a"
        staff ||..|{ payment : "a"
        rental ||..|{ payment : "a"
        customer ||..|{ payment : "a"\`;
      var erd = parse(erdRaw);
      var currentERD = "";
      var getMermaid = function(name) {
        var out = "erDiagram\n";
        erd[name].forEach((e) => {
          out += name + " " + e.relationship + " " + e.name + " : \"\"\n";
        });
        currentERD = out;
        return out;
      }
      var expand = function(id) {
        erd[id].forEach((e) => {
          var str = id + " " + e.relationship + " " + e.name + " : \"\"\n";
          var str2 = e.name + " " + flip[e.relationship] + " " + id + " : \"\"\n";
          if (currentERD.indexOf(str) == -1 && currentERD.indexOf(str2) == -1) {
            currentERD += str;
          }
        });
      }
      var reload = function(content) {
        $('.mermaid').html(content).removeAttr('data-processed');
        mermaid.init(undefined, $(".mermaid"));
        $("g").click(function(e) {
          console.log(e.currentTarget.id);
          expand(e.currentTarget.id);
          console.log(currentERD);
          console.log(erd);
          reload(currentERD);
        });
      }
      var clicked = function(id) {
        if (id == "full") {
          currentERD = "erDiagram " + erdRaw;
          reload(currentERD);
        } else {
          reload(getMermaid(id));
        }
      }

    </script>
  </body>

</html>`;
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
		let results = undefined; //getStructure();

		if (vscode.window.registerWebviewPanelSerializer) {
      const self = this; // TODO: Get rid of self
      
			// Make sure we register a serializer in activation event
			vscode.window.registerWebviewPanelSerializer("ERD", {
				async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
					console.log(`Got state: ${state}`);
					return ERDPanel.revive(webviewPanel, self.context.extensionPath, HTML); //await this.getHtml(results));
				}
			});
		}

		// Display the webview
		return this.showERD(results);
	}

		// Save ERD in a file
	async showERD(sqlResults: any) {
		let html = HTML; //await this.getHtml(sqlResults);

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