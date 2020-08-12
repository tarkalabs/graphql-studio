import * as vscode from "vscode";
import * as path from "path";
import { MermaidModel } from "db-utils/out/erd/mermaid-utils";
import { getStructure} from "db-utils";
import { INode } from "src/interfaces/INode";
import { TableNode } from "src/tree/tableNode";

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
                        this._panel?.webview.postMessage({
                            command: 'loadERD',
                            text: MermaidModel.getERD(treeNode.getSchema()),
                            table: (treeNode.isTable)? treeNode.parent.name + "-" + treeNode.name: 'full'
                        });
                        return;
                    case 'error':
                        console.log(message.error);
                        return;
                    case 'log':
                        console.log(message.message);
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

        const bootstrapStylesPath = vscode.Uri.file(
            //path.join(this._extensionPath, "node_modules", "bootstrao", "dist", "css", "bootstrap.min.css")
            path.join(this._extensionPath, "erdViewer", "test.css")
        );
        const bootstrapStylesUri = bootstrapStylesPath.with({ scheme: "vscode-resource" });

        console.log(bootstrapStylesUri);

        return `<!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>ERD View</title>
                        <!--meta http-equiv="Content-Security-Policy"
                            content="default-src 'none';
                            img-src https:;
                            script-src 'unsafe-eval' 'unsafe-inline' vscode-resource:;
                            style-src vscode-resource: 'unsafe-inline';"-->
                        <script>
                            window.acquireVsCodeApi = acquireVsCodeApi;
                        </script>
                        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu" crossorigin="anonymous">
                    </head>
                    <body>
                        <div>
                            <div class="dropdown">
                                <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Roots</button>
                                <ol #roots class="dropdown-menu">
                                </ol>
                            </div>
                            <div class="mermaid" id="mermaid">
                                
                            </div>
                        </div>
                        <script crossorigin src="${reactAppUri}"></script>
                    </body>
                </html>`;
    }
}