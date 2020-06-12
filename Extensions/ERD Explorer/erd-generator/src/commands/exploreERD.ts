import BaseCommand from "../common/baseCommand";
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

'use strict';

export class exploreERDCommand extends BaseCommand {
    private migrations = path.join(vscode.workspace.rootPath, '/migrations');

    async run() {    
        this.getQueries();
    }

    getQueries() {
        let migrations = fs.readFileSync(this.migrations, "utf8");

    }
}