/*const vscode = window.acquireVsCodeApi();

// Handle the message inside the webview
window.addEventListener('message', event => {
    const message = event.data; // The JSON data our extension sent

    switch (message.command) {
        case 'loadERD':
            currentERD = message.text;
            erdRaw = message.text;
            erd = parse(message.text);
            log(message.table)
            clicked({target: {id: message.table}});
            break;
    }
});

window.onerror = function(message, source, lineno, colno, error) {
    vscode.postMessage({
        command: 'error',
        error: {
        message, 
        source, 
        lineno, 
        colno, 
        error
        }
    });
} 

export function log(message) {
    vscode.postMessage({
        command: 'log',
        message: message
    })
}*/