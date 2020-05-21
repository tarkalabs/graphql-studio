import BaseCommand from "../common/baseCommand";
import * as vscode from 'vscode';
import { Database } from "../common/database";
import * as path from 'path';
import * as fs from 'fs';

'use strict';

let uniqueOtherId = 0;
let uniqueTableId = 0;
let uniqueColumnId = 0;
let uniqueRelationshipId = 0;

let tableIdMap = {};
let relationshipMap = {};
let relationshipIndexMap = {};
let relationshipObjects = [];
let toDoRelationships = [];

let charSizes = {
  period : 3.5,
  underscore : 7.1,
  other: 7.1
}

let RowResult = {
  dbms(row: Array<any>) {return row[0]},
  table_catalog(row: Array<any>) {return row[1]},
  table_schema(row: Array<any>) {return row[2]},
  table_name(row: Array<any>) {return row[3]},
  column_name(row: Array<any>) {return row[4]},
  ordinal_position(row: Array<any>) {return row[5]},
  data_type(row: Array<any>) {return row[6]},
  character_maximum_length(row: Array<any>) {return row[7]},
  constraint_type(row: Array<any>) {return row[8]},
  fk_table_schema(row: Array<any>) {return row[9]},
  fk_table_name(row: Array<any>) {return row[10]},
  fk_column_name(row: Array<any>) {return row[12]}
}

interface SchemaResults {
  rowCount: number,
  rows: Array<Array<any>>
}

interface VuerdTableDefenition {
  name: string,
  comment: string,
  columns: Array<VuerdColumnDefenition>,
  ui: {
    active: boolean,
    left: number,
    top: number,
    zIndex: number,
    widthName: number,
    widthComment: number,
  },
  id: string
}

interface VuerdColumnDefenition {
  name: string,
  comment: string,
  dataType: string,
  default: string,
  ordinal_position: number,
  option: {
    autoIncrement: boolean,
    primaryKey: boolean,
    unique: boolean,
    notNull: boolean,
  },
  ui: {
    active: boolean,
    pk: boolean,
    fk: boolean,
    pfk: boolean,
    widthName: number,
    widthComment: number,
    widthDataType: number,
    widthDefault: number,
  },
  id: string
}

enum VuerdRelationshipType {
  ZeroOneN = "ZeroOneN",
  ZeroOne = "ZeroOne",
  ZeroN = "ZeroN",
  OneOnly = "OneOnly",
  OneN = "OneN",
  One = "One",
  N = "N"
}

enum VuerdRelationshipDirection {
  top = "top",
  bottom = "bottom",
  left = "left",
  right = "right"
}

interface VuerdRelationship {
  identification: boolean,
  start: {
    tableId: string,
    columnIds: Array<string>,
    x: number,
    y: number,
    direction: VuerdRelationshipDirection
  },
  end: {
    tableId: string,
    columnIds: Array<string>,
    x: number,
    y: number,
    direction: VuerdRelationshipDirection
  },
  id: string,
  relationshipType: VuerdRelationshipType
}

export class generateERDCommand extends BaseCommand {
  async run(treeNode: any) {
    this.initDictionaries();

    if (!treeNode || !treeNode.connection) {
      vscode.window.showWarningMessage('No PostgreSQL Server or Database selected');
      return;
    }

    let connection = treeNode.connection;
    let editor = vscode.window.activeTextEditor;
    let querySelection = null;

    let sql = fs.readFileSync(path.join(__dirname, '/../../resources/erd-fields.psql'), "utf8");

    return Database.runQuery_ext(sql, editor, connection, this.dbReturn.bind(this));
  }

  async dbReturn(sqlResults) {    
    let results: SchemaResults = sqlResults[1];

    let index = 0;
    let tables: Array<VuerdTableDefenition> = [];
    results.rows.forEach(element => {
      let tableIndex = -1;
      for (let i=0; i<tables.length; i++) {
        if (tables[i].name === element[3]) {
          tableIndex = i;
          break;
        }
      }

      if (tableIndex == -1) {
        tables.push(this.newTable(results, index));
      } else {
        let column_new = this.newColumn(results, index);
        let columnIndex = 0;
        tables[tableIndex].columns.every(column => {
          if (column_new.name == "film_id") {
            console.log(column_new.name);
          }
          if (column_new.name == column.name) {
            this.updateColumn(column, column_new);
            console.log(column);
            columnIndex = -1;
            return false;
          }
          if (column_new.ordinal_position > column.ordinal_position) {
            columnIndex++;
          }
          return true;
        });
        if (columnIndex != -1) {
          tables[tableIndex].columns.splice(columnIndex, 0, column_new);
        }
      }
      index++;
    });    

    toDoRelationships.forEach((relationship) => {
      this.newRelationship(relationship.results, relationship.index);
    })
    console.log(relationshipObjects);

    let vuerdFile = {
      "canvas": {
        "width": 2000,
        "height": 2000,
        "scrollTop": 0,
        "scrollLeft": 0,
        "show": {
          "tableComment": true,
          "columnComment": false,
          "columnDataType": true,
          "columnDefault": false,
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
        "relationships": relationshipObjects
      }
    };

    if (fs.existsSync(path.join(vscode.workspace.rootPath, 'ERD.vuerd.json'))) {
      fs.unlinkSync(path.join(vscode.workspace.rootPath, 'ERD.vuerd.json'));
    }
    const newFile = vscode.Uri.parse('untitled:' + path.join(vscode.workspace.rootPath, 'ERD.vuerd.json'));

    vscode.workspace.openTextDocument(newFile).then(document => {
      const edit = new vscode.WorkspaceEdit();
      edit.insert(newFile, new vscode.Position(0, 0), JSON.stringify(vuerdFile));
      vscode.workspace.applyEdit(edit).then(success => {
        if (success) {
            document.save();
            vscode.window.showTextDocument(document);
        } else {
            vscode.window.showInformationMessage('Error!');
        }
      });
    });
  }

  newTable(results : SchemaResults, index : number) {
    let name = results.rows[index][3];
    let comment = results.rows[index][1] + "." + results.rows[index][2];
    let id = name + ":" + uniqueTableId++;

    tableIdMap[name] = {
      id: id, 
      columns: {}
    };

    return {
      "name": name,
      "comment": comment,
      "columns": [
        this.newColumn(results, index)
      ],
      "ui": {
        "active": true,
        "left": 120.5,
        "top": 126.5,
        "zIndex": 101,
        "widthName": (name.length - name.replace(/\./gi, "").length) * charSizes.period + 
                      (name.length - name.replace(/_/gi, "").length) * charSizes.underscore + 
                      (name.length - name.replace(/[^._]/gi, "").length) * charSizes.other,
        "widthComment": (comment.length - comment.replace(/\./gi, "").length) * charSizes.period + 
                      (comment.length - comment.replace(/_/gi, "").length) * charSizes.underscore + 
                      (comment.length - comment.replace(/[^._]/gi, "").length) * charSizes.other
      },
      "id": id
    }
  }
  
  newColumn(results : SchemaResults, index : number) {
    let name = results.rows[index][4];
    let tableName = results.rows[index][3];
    let dataType = results.rows[index][6];
    let id = tableName + "." + name + ":" + uniqueColumnId++;

    tableIdMap[results.rows[index][3]].columns[name] = id;

    if (results.rows[index][8] == "FOREIGN KEY") {
      toDoRelationships.push({results, index}); //this.newRelationship(results, index);
    }

    return {
      "name": name,
      "comment": "",
      "dataType": dataType,
      "default": "",
      "ordinal_position": results.rows[index][5],
      "option": {
        "autoIncrement": false,
        "primaryKey": results.rows[index][8] == "PRIMARY KEY",
        "unique": results.rows[index][8] == "UNIQUE",
        "notNull": results.rows[index][12]
      },
      "ui": {
        "active": false,
        "pk": results.rows[index][8] == "PRIMARY KEY",
        "fk": results.rows[index][8] == "FOREIGN KEY",
        "pfk": false,
        "widthName": (name.length - name.replace(/\./gi, "").length) * charSizes.period + 
                      (name.length - name.replace(/_/gi, "").length) * charSizes.underscore + 
                      (name.length - name.replace(/[^._]/gi, "").length) * charSizes.other,
        "widthComment": 60,
        "widthDataType": (dataType.length - dataType.replace(/\./gi, "").length) * charSizes.period + 
                      (dataType.length - dataType.replace(/_/gi, "").length) * charSizes.underscore + 
                      (dataType.length - dataType.replace(/[^._]/gi, "").length) * charSizes.other,
        "widthDefault": 60
      },
      "id": id
    };
  }

  updateColumn(column: VuerdColumnDefenition, column_new: VuerdColumnDefenition) {
    if ((column.ui.fk && column_new.ui.pk) || (column.ui.pk && column_new.ui.fk)) {
      column.ui.pk = false;
      column.ui.fk = false;
      column.ui.pfk = true;
    }
    column.option.unique = column_new.option.unique;
    column.option.notNull = column_new.option.notNull;
    column.option.autoIncrement =  column_new.option.autoIncrement;
    column.option.primaryKey = column_new.option.primaryKey;
  }

  newRelationship(results : SchemaResults, index : number) {
    let startTableName = results.rows[index][3];
    let endTableName = results.rows[index][10];
    let startColumnName = results.rows[index][4];
    let endColumnName = results.rows[index][11];

    let startId = tableIdMap[startTableName].id;
    let endId = tableIdMap[endTableName].id;

    let startColumnId = tableIdMap[startTableName].columns[startColumnName]
    let endColumnId = tableIdMap[endTableName].columns[endColumnName];

    let id = startTableName + "." + startColumnName + "=>" + endTableName + "." + endColumnName + ":" + uniqueRelationshipId++;
    
    if (!startColumnId || !endColumnId) {
      console.log("undefined: " + startColumnName + ":" + endColumnName);
    } else {
      if (relationshipMap[endId] && relationshipMap[endId] == startId) {
        let relationship = relationshipObjects[relationshipIndexMap[endId]] as VuerdRelationship;
        relationship.relationshipType = VuerdRelationshipType.One;
      } else {
        relationshipMap[startId] = endId;
        relationshipIndexMap[startId] = relationshipObjects.length;
        relationshipObjects.push({
          identification: false,
          start: {
            tableId: startId,
            columnIds: [startColumnId],
            x: 100,
            y: 100,
            direction: VuerdRelationshipDirection.bottom
          },
          end: {
            tableId: endId,
            columnIds: [endColumnId],
            x: 100,
            y: 100,
            direction: VuerdRelationshipDirection.top
          },
          id: id,
          relationshipType: VuerdRelationshipType.ZeroN
        });
      }
    }
  }

  initDictionaries() {
    uniqueOtherId = 0;
    uniqueTableId = 0;
    uniqueColumnId = 0;
    uniqueRelationshipId = 0;

    tableIdMap = {};
    relationshipMap = {};
    relationshipIndexMap = {};
    relationshipObjects = [];
    toDoRelationships = [];
  }
}