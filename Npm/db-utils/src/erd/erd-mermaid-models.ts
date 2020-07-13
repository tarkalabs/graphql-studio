'use strict';

import { CoreSchema, CoreRelationship, CoreTable, CoreColumn, CoreRelationshipTypes } from "./erd-core-models";
import { getTextWidth, ERD_Model, ErdConstants } from "./erd-core-utils";
import {readFileSync} from "fs";

/*
 * TODO: Identifying Relationships
*/
const enum leftSideRelationships {
    ZeroN = "}o",
    ZeroOne = "|o",
    OneOnly = "||",
    OneN = "}|"
}
const enum rightSideRelationships {
    ZeroN = "o{",
    ZeroOne = "o|",
    OneOnly = "||",
    OneN = "|{"
}
export enum CddoreRelationshipTypes {
    ZeroOneN = "ZeroOneN",
    ZeroOne = "ZeroOne",
    ZeroN = "ZeroN",
    OneOnly = "OneOnly",
    OneN = "OneN",
    One = "One",
    N = "N"
}
/**
 * Mermaid specific implementations of the Core Models
 * primary responsability is to format the data into the Mermaid format
 */
export class MermaidSchema extends CoreSchema {
    stringify(model: ERD_Model) {
       //console.log(model);
        let out = "erDiagram\n";
        if (this.relationships) {
            this.relationships.map((relationship)=>{
                let startTable = model.tableName[relationship.startId].name;
                let endTable = model.tableName[relationship.endId].name;
                switch (relationship.relationshipType) {
                    case CoreRelationshipTypes.N:
                    case CoreRelationshipTypes.ZeroN:
                        out += "\t" + startTable.replace("_", "") + " " + leftSideRelationships.OneOnly + ".." + rightSideRelationships.ZeroN + " " + endTable.replace("_", "") + " : \"\"";
                        break;
                    case CoreRelationshipTypes.ZeroOne:
                    case CoreRelationshipTypes.One:
                        out += "\t" + startTable.replace("_", "") + " " + leftSideRelationships.OneOnly + ".." + rightSideRelationships.ZeroOne + " " + endTable.replace("_", "") + " : \"\"";
                        break;
                    case CoreRelationshipTypes.OneOnly:
                        out += "\t" + startTable.replace("_", "") + " " + leftSideRelationships.OneOnly + ".." + rightSideRelationships.ZeroOne + " " + endTable.replace("_", "") + " : \"\"";
                        break;
                    case CoreRelationshipTypes.ZeroOneN:
                    case CoreRelationshipTypes.OneN:
                        out += "\t" + startTable.replace("_", "") + " " + leftSideRelationships.OneOnly + ".." + rightSideRelationships.OneN + " " + endTable.replace("_", "") + " : \"\"";
                        break;
                }
                out += "\n";
            });
        }

        return out;
    }

    htmlify(model: ERD_Model) {
        return readFileSync(__dirname + "/../../html/ERD.html").toString();
    }
}

export class MermaidTable extends CoreTable {
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


export class MermaidColumn extends CoreColumn {
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

export class MermaidRelationship extends CoreRelationship {
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