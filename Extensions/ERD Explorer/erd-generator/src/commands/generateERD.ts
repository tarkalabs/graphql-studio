import BaseCommand from "../common/baseCommand";
import * as vscode from 'vscode';
import { Database } from "../common/database";
import * as path from 'path';
import * as fs from 'fs';
import * as puppeteer from 'puppeteer';

import { ERD_Model, RowResult } from "../erd-utils/erd-core-utils";
import { CoreSchema } from "../erd-utils/erd-core-models";

//import { ERD_FILE_EXTENSION, VuerdUtils as Utils } from "../erd-utils/erd-vuerd-utils";
//import { VuerdSchema as Schema } from "../erd-utils/erd-vuerd-models";

import { ERD_FILE_EXTENSION, MermaidUtils as Utils } from "../erd-utils/erd-mermaid-utils";
import { MermaidSchema as Schema } from "../erd-utils/erd-mermaid-models";
import * as child from 'child_process';

'use strict';

interface MermaidInterface {
  mermaidAPI: any;
}

let model: ERD_Model;
let utils: Utils;

declare global {
  interface Window { mermaid: any; }
  interface HTMLStyleElement { styleSheet: any; }
}

export class generateERDCommand extends BaseCommand {
  async run(treeNode: any) {
    model = new ERD_Model();
    utils = new Utils();

    // Check that the treeNode has a db connection
    if (!treeNode || !treeNode.connection) {
      vscode.window.showWarningMessage('No PostgreSQL Server or Database selected');
      return;
    }

    // Get Connection and erd-fields query    
    let connection = treeNode.connection;
    let editor = vscode.window.activeTextEditor;
    let sql = fs.readFileSync(path.join(__dirname, '/../../resources/erd-fields.psql'), "utf8");

    // Query DB then generate the ERD
    return Database.runQuery_ext(sql, editor, connection, this.dbReturn.bind(this));
  }
  
  // Callback after db query
  async dbReturn(sqlResults) {    
    model.rows = sqlResults[1].rows;
    
    // parse results into Core Models
    this.parseRows();

    // After every table/column is parsed then finalize the relationships
    this.finalizeRelationships();

    // Instantiate Partial CoreSchema to the desired Schema (Vuerd, Mermaid, etc)
    let schema : CoreSchema = new Schema(model.jsonify());

    // Save and display file
    this.saveFile(schema.stringify(model)); 
    //this.generateSvg(schema);
  }

  parseRows() {
    model.rows.forEach(row => {
      // Find tables index in tables array
      let tableIndex = this.getTableIndex(row);

      // If table is not in the tableId map create a new one
      if (!model.tableId[RowResult.table_name(row)]) {
        tableIndex = model.tables.length;
        model.tables.push(utils.newTable(row, model));
      }

      // parse the column into the table defined by the row\
      // If columnIndex is -1 then the column exists and has been altered
      // else it is a new column
      let columnIndex = this.getColumnIndex(tableIndex, row);
      
      if (columnIndex != -1) {
        let column_new = utils.newColumn(row, model);

        // Add column at the correct position
        model.tables[tableIndex].columns.splice(columnIndex, 0, column_new);
      }
    }); 
  }

  // Returns the table index if it exists
  getTableIndex(row) {
    let tableIndex = -1;

    for (let i=0; i<model.tables.length; i++) {
      if (model.tables[i].name === RowResult.table_name(row)) {
        tableIndex = i;
        break;
      }
    }

    return tableIndex;
  }

  // gets columns index in the table if it exists
  // otherwise return -1 if column exists and was altered
  getColumnIndex(tableIndex, row) {
    let columnIndex = 0;

    let name = RowResult.column_name(row);
    let ordinal_position = RowResult.ordinal_position(row);

    model.tables[tableIndex].columns.every(column => {
      if (name == column.name) {
        utils.updateColumn(column, row);
        columnIndex = -1;
        return false;
      }
      if (ordinal_position > column.ordinal_position) {
        columnIndex++;
      }
      return true;
    });

    return columnIndex;
  }

  // Finalize relationships after dependencies have been parsed
  finalizeRelationships() {
    model.toDoRelationships.forEach((row) => {
      utils.newRelationship(row, model);
    })
  }

  // Save ERD in a file
  saveFile(contents: string) {
    let newFile = null;
    
    // Check if file exists then select it
    if (fs.existsSync(path.join(vscode.workspace.rootPath, 'ERD.' + ERD_FILE_EXTENSION))) {
      newFile = vscode.Uri.parse(path.join(vscode.workspace.rootPath, 'ERD.' + ERD_FILE_EXTENSION));
    } else {
      newFile = vscode.Uri.parse('untitled:' + path.join(vscode.workspace.rootPath, 'ERD.' + ERD_FILE_EXTENSION));
    }

    // Open the file
    vscode.workspace.openTextDocument(newFile).then(document => {
      // Replace every char in the file with the stringified schema
      const edit = new vscode.WorkspaceEdit();
      edit.replace(newFile, new vscode.Range(0, 0, 999999, 999999), contents); //document.lineCount + 1, document.eol

      // Apply edits and save if successful
      vscode.workspace.applyEdit(edit).then(success => {
        if (success) {
          vscode.window.showTextDocument(document).then(() => {
            document.save();
          });
        } else {
            vscode.window.showInformationMessage('Error!');
        }
      });
    });
  }
/*
  async generateSvg(schema : CoreSchema) {
    var config = vscode.workspace.getConfiguration( 'mermaid-export' );
    var editor = vscode.window.activeTextEditor;

    const definition = schema.stringify(model);

    var filename = editor.document.uri.fsPath;
    var outputFilename = filename + ".svg";

    var workspaceFolder = vscode.workspace.getWorkspaceFolder( editor.document.uri );
    var cwd = workspaceFolder ? workspaceFolder.uri.fsPath : "/";

    var command = workspaceFolder.uri + "/node_modules/.bin/mmdc -t " + config.get( 'theme' );

    var configFile = config.get( 'config' ) as string;
    if( configFile )
    {
        if( path.isAbsolute( configFile ) === false )
        {
            configFile = path.join( workspaceFolder.uri.fsPath, configFile );
        }
        command += " -c \"" + configFile + "\"";
    }

    command += " -i \"" + filename + '\"';
    command += " -o \"" + outputFilename + '\"';
    if( config.get( 'outputWidth' ) > 0 )
    {
        command += " -w " + config.get( 'outputWidth' );
    }
    if( config.get( 'outputHeight' ) > 0 )
    {
        command += " -H " + config.get( 'outputHeight' );
    }

    var process = child.exec( command, { cwd: cwd } );
    var results = "";

    process.stdout.on( 'data', function( data )
    {
        results += data;
    } );

    process.stderr.on( 'data', function( error )
    {
        console.error( error );
    });

    process.on( 'close', function( code )
    {
        if( results )
        {
            console.log( results );
        }
    } );
  }*/
}