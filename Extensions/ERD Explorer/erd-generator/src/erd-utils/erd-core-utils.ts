'use strict';

import { CoreTable, CoreColumn, CoreRelationship, CoreRelationshipTypes, CoreSchema } from "./erd-core-models";

export interface ERDFile {
    json: Object;
}

export class ERD_Model {    
    index: number;
    uniqueTableId: number;
    uniqueColumnId: number;
    uniqueRelationshipId: number;
    positionIndex: number;

    tableId : {
        [name: string]: {
            id: string, 
            columnId: {
                [name: string]: string
            }
        }
    };

    relationshipMap : {
        [id: string]: string
    };

    relationshipIndex : {
        [id : string] : number
    };

    toDoRelationships: Array<SchemaRow>;

    rows: Array<Array<any>>;
    tables: Array<CoreTable>;
    relationships: Array<CoreRelationship>;

    constructor() {
        this.index = 0;
        this.uniqueTableId = 0;
        this.uniqueColumnId = 0;
        this.uniqueRelationshipId = 0;
        this.positionIndex = 0;

        this.tableId = {};
        this.relationshipMap = {};
        this.relationshipIndex = {};
        this.toDoRelationships = [];

        this.rows = [];
        this.tables = [];
        this.relationships = [];
    }

    public jsonify(): Partial<CoreSchema> {
        return {
            database: "PostgreSQL",
            databaseName: RowResult.table_catalog(this.rows[0]),
            tables: this.tables,
            relationships: this.relationships
        };
    }
}

export function getTextWidth(text: string) {
    return (text.length - text.replace(/\./gi, "").length) * charSizes.period + 
    (text.length - text.replace(/_/gi, "").length) * charSizes.underscore + 
    (text.length - text.replace(/[^._]/gi, "").length) * charSizes.other;
}

export type SchemaRow = Array<any>

export interface SchemaResults {
    rowCount: number,
    rows: Array<SchemaRow>
}

export enum charSizes {
    period = 3.5,
    underscore = 7.1,
    other = 7.1
}

export class RowResult {
    public static dbms(row: Array<any>) {return row[0]}
    public static table_catalog(row: Array<any>) {return row[1]}
    public static table_schema(row: Array<any>) {return row[2]}
    public static table_name(row: Array<any>) {return row[3]}
    public static column_name(row: Array<any>) {return row[4]}
    public static ordinal_position(row: Array<any>) {return row[5]}
    public static data_type(row: Array<any>) {return row[6]}
    public static character_maximum_length(row: Array<any>) {return row[7]}
    public static constraint(row: Array<any>) {return row[8]}
    public static constraint_pk(row: Array<any>) {return row[8] == "PRIMARY KEY"}
    public static constraint_fk(row: Array<any>) {return row[8] == "FOREIGN KEY"}
    public static constraint_unique(row: Array<any>) {return row[8] == "UNIQUE"}
    public static fk_table_schema(row: Array<any>) {return row[9]}
    public static fk_table_name(row: Array<any>) {return row[10]}
    public static fk_column_name(row: Array<any>) {return row[11]}
    public static notnull(row: Array<any>) {return row[12]}
}

export class CoreUtils {
    newTable(row, model): Partial<CoreTable> {
        let name = RowResult.table_name(row);
        let id = name + ":" + model.uniqueTableId++;

        model.tableId[name] = {
            id: id, 
            columnId: {}
        };

        return {
            name: name,
            catalog: RowResult.table_catalog(row) + "." + RowResult.table_schema(row),
            columns: [],
            ordinal_position: model.positionIndex++,
            id: id
        }
    }

    newColumn(row, model): Partial<CoreColumn> {
        let tableName = RowResult.table_name(row);
        let name = RowResult.column_name(row);
        let id = tableName + "." + name + ":" + model.uniqueColumnId++
        let fk = RowResult.constraint_fk(row);
        
        model.tableId[tableName].columnId[name] = id;

        if (fk) {
            model.toDoRelationships.push(row);
        }

        return {
            name: name,
            data_type: RowResult.data_type(row),
            default: "",
            ordinal_position: RowResult.ordinal_position(row),
            option: {
                autoIncrement: false,
                primaryKey: RowResult.constraint_pk(row),
                foreignKey: fk,
                unique: RowResult.constraint_unique(row),
                notNull: RowResult.notnull(row)
            },
            id: id
        }
    }

    updateColumn(column: CoreColumn, row) : void {
        column.option.unique = RowResult.constraint_unique(row);
        column.option.notNull = RowResult.notnull(row);
        column.option.autoIncrement =  false;
        column.option.primaryKey = column.option.primaryKey || RowResult.constraint_pk(row);
        column.option.foreignKey = column.option.foreignKey || RowResult.constraint_fk(row);
    }

    newRelationship(row, model): Partial<CoreRelationship> {
        let startTableName = RowResult.fk_table_name(row);
        let endTableName = RowResult.table_name(row);
        let startColumnName = RowResult.fk_column_name(row);
        let endColumnName = RowResult.column_name(row);

        let startId = model.tableId[startTableName].id;
        let endId = model.tableId[endTableName].id;

        let startColumnId = model.tableId[startTableName].columnId[startColumnName]
        let endColumnId = model.tableId[endTableName].columnId[endColumnName];

        let id = startTableName + "." + startColumnName + "=>" + endTableName + "." + endColumnName + ":" + model.uniqueRelationshipId++;
        
        if (model.relationshipMap[endId] && model.relationshipMap[endId] == startId) {
            let relationship = model.relationships[model.relationshipIndex[endId]] as CoreRelationship;
            relationship.endId = relationship.startId;
            relationship.endColumnIds = relationship.startColumnIds;
            relationship.startId = endId;
            relationship.startColumnIds = [endColumnId];
            relationship.relationshipType = CoreRelationshipTypes.OneN;
            model.relationships[model.relationshipIndex[endId]] = relationship;
            return null;
        } else {
            model.relationshipMap[startId] = endId;
            model.relationshipIndex[startId] = model.relationships.length;
            return {
                startId: startId,
                startColumnIds: [startColumnId],
                endId: endId,
                endColumnIds: [endColumnId],
                relationshipType: (RowResult.notnull(row))? CoreRelationshipTypes.OneN: CoreRelationshipTypes.ZeroN,
                id: id
            }
        }
    }
}