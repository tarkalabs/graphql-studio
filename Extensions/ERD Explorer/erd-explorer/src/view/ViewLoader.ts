import * as vscode from "vscode";
import * as path from "path";
import { MermaidModel } from "db-utils/out/erd/mermaid-utils";
import { getStructure} from "db-utils";
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
                        console.log(MermaidModel.getERD(treeNode.getSchema()));
                        this._panel?.webview.postMessage({
                            command: 'loadERD',
                            text: MermaidModel.getERD(treeNode.getSchema())
                        });
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
                        <meta http-equiv="Content-Security-Policy"
                            content="default-src 'none';
                            img-src https:;
                            script-src 'unsafe-eval' 'unsafe-inline' vscode-resource:;
                            style-src vscode-resource: 'unsafe-inline';">
                        <script>
                            window.acquireVsCodeApi = acquireVsCodeApi;
                        </script>
                    </head>
                    <body>
                    <script crossorigin src="${reactAppUri}"></script>
                        <div>
                            <div>${this.treeNode.name}</div>
                            <div class="dropdown">
                            <button class="dropbtn">Roots</button>
                            <ol #roots class="dropdown-content">
                                <li onclick="clicked('full')">Full ERD</li>
                            </ol>
                            </div>
                            <div class="mermaid" id="mermaid">
                                
                            </div>
                        </div>
                    </body>
                </html>`;
    }
}