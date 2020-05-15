import BaseCommand from "../common/baseCommand";
import * as vscode from 'vscode';
import { IConnection } from "../common/IConnection";
import { EditorState } from "../common/editorState";
import { Database } from "../common/database";

'use strict';

interface SchemaDefenition {
  command: string,
  rowCount: number,
  rows: Array<Array<any>>,
  fields: Array<Object>
}

interface VuerdTableDefenition {
  name: string,
  columns: Array<VuerdColumnDefenition>
}

interface SchemaColumnDefenition {
  ordinal_position: number
}

interface VuerdColumnDefenition {
  ordinal_position: number
}

let uniqueId = 0;

export class generateERDCommand extends BaseCommand {
  async run() {
    let connection = EditorState.connection;
    if (!connection) {
      vscode.window.showWarningMessage('No PostgreSQL Server or Database selected');
      return;
    }

    let editor = vscode.window.activeTextEditor;
    let querySelection = null;

    /*
    // Calculate the selection if we have a selection, otherwise we'll use null to indicate
    // the entire document is the selection
    if (!editor.selection.isEmpty) {
      let selection = editor.selection;
      querySelection = {
        startLine: selection.start.line,
        startColumn: selection.start.character,
        endLine: selection.end.line,
        endColumn: selection.end.character
      }
    } else {
      querySelection = {
        startLine: 0,
        startColumn: 0,
        endLine: editor.document.lineCount
        //endColumn: editor.document.lineAt(editor.document.lineCount).range.end.
      }
    }

    // Trim down the selection. If it is empty after selecting, then we don't execute
    let selectionToTrim = editor.selection.isEmpty ? undefined : editor.selection;
    if (editor.document.getText(selectionToTrim).trim().length === 0) {
      vscode.window.showWarningMessage('No SQL found to run');
      return;
    }
    //*/

    // let sql = editor.document.getText(selectionToTrim);

    let sql = `SET enable_nestloop=0;
    SELECT 'postgresql' AS dbms,
        t.table_catalog,
        t.table_schema,
        t.table_name,
        c.column_name,
        c.ordinal_position,
        c.data_type,
        c.character_maximum_length,
        n.constraint_type,
        k2.table_schema,
        k2.table_name,
        k2.column_name 
      FROM information_schema.tables t 
      NATURAL LEFT JOIN information_schema.columns c 
      LEFT JOIN(
        information_schema.key_column_usage k 
        NATURAL JOIN information_schema.table_constraints n 
        NATURAL LEFT JOIN information_schema.referential_constraints r)
      ON 
        c.table_catalog=k.table_catalog AND 
        c.table_schema=k.table_schema AND 
        c.table_name=k.table_name AND 
        c.column_name=k.column_name 
        LEFT JOIN information_schema.key_column_usage k2 ON 
          k.position_in_unique_constraint=k2.ordinal_position AND 
          r.unique_constraint_catalog=k2.constraint_catalog AND 
          r.unique_constraint_schema=k2.constraint_schema AND 
          r.unique_constraint_name=k2.constraint_name 
        WHERE 
          t.TABLE_TYPE='BASE TABLE' AND 
          t.table_schema 
        NOT IN('information_schema','pg_catalog');`;

    return Database.runQuery_ext(sql, editor, connection, this.dbReturn.bind(this));
  }

  async dbReturn(sqlResults) {    
    let results: SchemaDefenition = sqlResults[1];
    console.log(results);

    let index = 0;
    let tables: Array<VuerdTableDefenition> = [];
    console.log(1);
    results.rows.forEach(element => {
      let tableIndex = -1;
      for (let i=0; i<tables.length; i++) {
        if (tables[i].name === element[3]) {
          tableIndex = i;
          break;
        }
      }

      console.log(2);
      if (tableIndex == -1) {
        tables.push(this.newTable(results, index))
      } else {
        let column_new = this.newColumn(results, index);
        let columnIndex = 0;
        tables[tableIndex].columns.forEach(column => {
          if (column_new.ordinal_position < column.ordinal_position) {
            tables[tableIndex].columns.splice(columnIndex, 0, column_new);
            return;
          }
          columnIndex++;
        });
      }
      index++;
    });    

    console.log(1);
    let vuerdFile = {
      "canvas": {
        "width": 2000,
        "height": 2000,
        "scrollTop": 0,
        "scrollLeft": 0,
        "show": {
          "tableComment": true,
          "columnComment": true,
          "columnDataType": true,
          "columnDefault": true,
          "columnAutoIncrement": true,
          "columnPrimaryKey": true,
          "columnUnique": true,
          "columnNotNull": true,
          "relationship": true
        },
        "database": "PostgreSQL",
        "databaseName": results.rows[0][1],
        "canvasType": "ERD",
        "language": "GraphQL",
        "tableCase": "pascalCase",
        "columnCase": "camelCase"
      },
      "table": {
        "tables": tables
      },
      "memo": {
        "memos": []
      },
      "relationship": {
        "relationships": []
      }
    };

    console.log(1);
    const textDocument = await vscode.workspace.openTextDocument({content: JSON.stringify(vuerdFile), language: 'postgres'});
    await vscode.window.showTextDocument(textDocument);
    console.log(vuerdFile);
  }

  newTable(results : SchemaDefenition, index : number) {
    return {
      "name": results.rows[index][3],
      "comment": "",
      "columns": [
        this.newColumn(results, index)
      ],
      "ui": {
        "active": true,
        "left": 120.5,
        "top": 126.5,
        "zIndex": 101,
        "widthName": 60,
        "widthComment": 60
      },
      "id": uniqueId++ + ""
    }
  }
  
  newColumn(results : SchemaDefenition, index : number) {
    return {
      "name": results.rows[index][4],
      "comment": "",
      "dataType": results.rows[index][6],
      "default": "",
      "ordinal_position": results.rows[index][5],
      "option": {
        "autoIncrement": false,
        "primaryKey": results.rows[index][8] && (results.rows[index][8] as string).indexOf("PRIMARY KEY") != -1,
        "unique": results.rows[index][8] && (results.rows[index][8] as string).indexOf("UNIQUE") != -1,
        "notNull": false
      },
      "ui": {
        "active": false,
        "pk": results.rows[index][8] && (results.rows[index][8] as string).indexOf("PRIMARY KEY") != -1,
        "fk": results.rows[index][8] && (results.rows[index][8] as string).indexOf("FOREIGN KEY") != -1,
        "pfk": false,
        "widthName": 60,
        "widthComment": 60,
        "widthDataType": 60,
        "widthDefault": 60
      },
      "id": uniqueId++ + ""
    };
  }
}