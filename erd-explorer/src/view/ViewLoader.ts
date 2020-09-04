import * as vscode from "vscode";
import * as path from "path";
import { INode } from "src/interfaces/INode";

export default class ViewLoader {
    private readonly _panel: vscode.WebviewPanel | undefined;
    private readonly _extensionPath: string;
    private _disposables: vscode.Disposable[] = [];

    constructor(context: vscode.ExtensionContext, private treeNode: INode) {
        this._extensionPath = context.extensionPath;

        this._panel = vscode.window.createWebviewPanel(
            "ERDViewer",
            "ERD View",
            vscode.ViewColumn.One,
            {
                enableScripts: true,

                localResourceRoots: [
                    vscode.Uri.file(path.join(this._extensionPath, "erdViewer"))
                ]
            }
        );

        this._panel.webview.html = this.getWebviewContent();
          
        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'getERD':
                        console.log(treeNode.getSchema());
                        this._panel?.webview.postMessage({
                            command: 'loadERD',
                            model: treeNode.getSchema(),
                            target: (treeNode.isTable)? treeNode.parent.name + "-" + treeNode.name: 'full',
                            persistDiagram: (process.env.PERSIST_ER_DIAGRAM == 'true')? true: false
                        });
                        return;
                    case 'error':
                        console.log(message.error);
                        return;
                    case 'log':
                        console.log(message.message);
                        return;
                    case 'explore':
                        console.log("Explore table: " + message.tableName);
                        return;
                }
            },
            undefined,
            context.subscriptions
        );
    }
    
    private getWebviewContent(): string {
        // Local path to main script run in the webview
        const reactAppPathOnDisk = vscode.Uri.file(
            path.join(this._extensionPath, "erdViewer", "erdViewer.js")
        );
        const reactAppUri = reactAppPathOnDisk.with({ scheme: "vscode-resource" });

        return `<!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>ERD View</title>
                        <script>
                            window.acquireVsCodeApi = acquireVsCodeApi;
                        </script>
                        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu" crossorigin="anonymous">
                    </head>
                    <body>
                        <div>
                            <div class="dropdown">
                                <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><span class="erd-dropdown">Roots</span></button>
                                <ol #roots class="dropdown-menu">
                                </ol>
                            </div>
                            <div class="mermaid" id="mermaid">
                                erDiagram
                                A ||..|| B : "ASD"
                            </div>
                        </div>
                        <script crossorigin src="${reactAppUri}"></script>
                    </body>
                </html>`;
    }
}