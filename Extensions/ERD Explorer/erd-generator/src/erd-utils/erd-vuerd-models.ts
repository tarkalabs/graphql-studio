'use strict';

import { CoreSchema, CoreRelationship, CoreTable, CoreColumn } from "../erd-utils/erd-core-models";
import { getTextWidth } from "./erd-core-utils";
import { ErdConstants } from "../common/constants";

/**
 * Vuerd specific implementations of the Core Models
 * primary responsability is to format the data into the vuerd json format
 */
export class VuerdSchema extends CoreSchema {
    stringify() {
        return JSON.stringify({
            canvas: {
                width: ErdConstants.width,
                height: ErdConstants.height,
                scrollTop: 0,
                scrollLeft: 0,
                show: {
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
                database: this.database,
                databaseName: this.databaseName,
                canvasType: "ERD",
                language: "GraphQL",
                tableCase: "pascalCase",
                columnCase: "camelCase"
            },
            table: {
                "tables": this.tables.map((table)=>table.jsonify())
            },
            memo: {
                "memos": []
            },
            relationship: {
                "relationships": this.relationships.map((relationship)=>relationship.jsonify())
            }
        });
    }
}

export class VuerdTable extends CoreTable {
    jsonify() {
        return {
            name: this.name,
            comment: this.catalog,
            columns: this.columns.map((column)=>column.jsonify()),
            ui: {
              active: false,
              left: ErdConstants.columnWidth * Math.floor(this.ordinal_position%ErdConstants.columnCount) + 50,
              top: ErdConstants.rowHeight * Math.floor(this.ordinal_position/ErdConstants.columnCount) + 50,
              zIndex: 101,
              widthName: getTextWidth(this.name),
              widthComment: getTextWidth(this.catalog)
            },
            id: this.id
          }
    }
}


export class VuerdColumn extends CoreColumn {
    jsonify() {
        return {
            name: this.name,
            dataType: this.data_type,
            default: this.default,
            ordinal_position: this.ordinal_position,
            option: {
                autoIncrement: this.option.autoIncrement,
                primaryKey: this.option.primaryKey,
                unique: this.option.unique,
                notNull: this.option.notNull,
            },
            ui: {
                active: false,
                pk: (this.option.primaryKey && !this.option.foreignKey),
                fk: (!this.option.primaryKey && this.option.foreignKey),
                pfk: (this.option.primaryKey && this.option.foreignKey),
                widthName: getTextWidth(this.name),
                widthDataType: getTextWidth(this.data_type),
            },
            id: this.id
        }
    }
}

export class VuerdRelationship extends CoreRelationship {
    jsonify() {
        return {
            identification: false,
            start: {
                tableId: this.startId,
                columnIds: this.startColumnIds,
                x: 0,
                y: 0,
                direction: "top"
            },
            end: {
                tableId: this.endId,
                columnIds: this.endColumnIds,
                x: 0,
                y: 0,
                direction: "top"
            },
            relationshipType: this.relationshipType,
            id: this.id
        }
    }
}