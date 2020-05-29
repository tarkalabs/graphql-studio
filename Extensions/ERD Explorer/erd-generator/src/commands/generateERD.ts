import BaseCommand from "../common/baseCommand";
import * as vscode from 'vscode';
import { Database } from "../common/database";
import * as path from 'path';
import * as fs from 'fs';

import { ERD_Model, RowResult } from "../erd-utils/erd-core-utils";
import { CoreSchema } from "../erd-utils/erd-core-models";

import { ERD_FILE_EXTENSION, VuerdUtils as Utils } from "../erd-utils/erd-vuerd-utils";
import { VuerdSchema as Schema } from "../erd-utils/erd-vuerd-models";

'use strict';

let model: ERD_Model;
let utils: Utils;

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
  
  async dbReturn(sqlResults) {    
    model.rows = sqlResults[1].rows;
    
    this.parseRows();

    this.finalizeRelationships();

    let schema : CoreSchema = new Schema(model.jsonify());

    this.saveFile(schema); 
  }

  parseRows() {
    model.rows.forEach(row => {
      let tableIndex = this.getTableIndex(row);

      if (!model.tableId[RowResult.table_name(row)]) {
        tableIndex = model.tables.length;
        model.tables.push(utils.newTable(row, model));
      }

      let columnIndex = this.getColumnIndex(tableIndex, row);
      
      if (columnIndex != -1) {
        let column_new = utils.newColumn(row, model);
        model.tables[tableIndex].columns.splice(columnIndex, 0, column_new);
      }
    }); 
  }

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

  finalizeRelationships() {
    model.toDoRelationships.forEach((row) => {
      utils.newRelationship(row, model);
    })
  }

  saveFile(schema : CoreSchema) {
    let newFile = null;
    
    if (fs.existsSync(path.join(vscode.workspace.rootPath, 'ERD.' + ERD_FILE_EXTENSION))) {
      newFile = vscode.Uri.parse(path.join(vscode.workspace.rootPath, 'ERD.' + ERD_FILE_EXTENSION));
    } else {
      newFile = vscode.Uri.parse('untitled:' + path.join(vscode.workspace.rootPath, 'ERD.' + ERD_FILE_EXTENSION));
    }

    vscode.workspace.openTextDocument(newFile).then(document => {
      const edit = new vscode.WorkspaceEdit();
      edit.replace(newFile, new vscode.Range(0, 0, 999999, 999999), schema.stringify()); //document.lineCount + 1, document.eol
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


}