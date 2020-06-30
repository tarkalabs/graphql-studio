import * as vscode from "vscode";
import * as path from "path";


export default class ViewLoader {
    private readonly _panel: vscode.WebviewPanel | undefined;
    private readonly _extensionPath: string;
    private _disposables: vscode.Disposable[] = [];

    constructor(extensionPath: string) {
        this._extensionPath = extensionPath;

        this._panel = vscode.window.createWebviewPanel(
            "ERDViewer",
            "ERD View",
            vscode.ViewColumn.One,
            {
                enableScripts: true,

                localResourceRoots: [
                    vscode.Uri.file(path.join(extensionPath, "erdViewer"))
                ]
            }
        );

        this._panel.webview.html = this.getWebviewContent();
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
                        <div id="root"></div>
                        <script crossorigin src="${reactAppUri}"></script>
                    </body>
                </html>`;
    }
}