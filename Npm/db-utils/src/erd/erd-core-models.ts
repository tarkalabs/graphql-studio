'use strict';

import { ERD_Model } from "./erd-core-utils";

/**
 * Core models used to store all data returned from
 * the SQL query.
 * Once extended the data can be transformed to the correct output
 * format by implementing the jsonify/stringify methods  
 */

export enum CoreRelationshipTypes {
    ZeroOneN = "ZeroOneN",
    ZeroOne = "ZeroOne",
    ZeroN = "ZeroN",
    OneOnly = "OneOnly",
    OneN = "OneN",
    One = "One",
    N = "N"
}

abstract class CoreObject {
    public constructor(init?: Partial<CoreObject>) {
        Object.assign(this, init);
    }
}

export abstract class CoreSchema extends CoreObject {
    model: ERD_Model
    database: string
    databaseName: string
    tables: Array<CoreTable>
    relationships: Array<CoreRelationship>
    tree?: {
        schemas: {
            schemaName: string,
            tables: {
            tableName: string,
            isTable: boolean,
            columns: {
                columnName: string
                pk: boolean,
                fk: boolean,
                data_type: string
            }[]
            }[],
            functions: {
            functionName: string
            }[]
        }[]
    };

    public create(init?: Partial<CoreObject>) {
        Object.assign(this, init);
    }

    abstract stringify(...model) : string;
    abstract htmlify(...model) : string;
}

export abstract class CoreTable extends CoreObject {
    name: string
    catalog: string
    columns: Array<CoreColumn>
    ordinal_position: number
    id: string
    
    abstract jsonify() : Object;
}

export abstract class CoreColumn extends CoreObject {
    name: string
    data_type: string
    default: string
    ordinal_position: number
    option: CoreColumnOptions
    id: string

    abstract jsonify() : Object;
}

export abstract class CoreColumnOptions extends CoreObject {
    autoIncrement: boolean
    primaryKey: boolean
    foreignKey: boolean
    unique: boolean
    notNull: boolean
}

export abstract class CoreRelationship extends CoreObject {
    startId: string
    startColumnIds: Array<string>
    endId: string
    endColumnIds: Array<string>
    relationshipType: CoreRelationshipTypes
    id: string

    abstract jsonify() : Object;
}

export class DefaultSchema extends CoreSchema {
    stringify(...model) {
        return JSON.stringify(this);
    }
    htmlify(...model) {
        return "<html><head/><body>" + JSON.stringify(model) + "</body></html>"
    }
}

export class DefaultTable extends CoreTable {
    jsonify() {
        return {
            name: this.name,
            catalog: this.catalog,
            columns: this.columns,
            ordinal_position: this.ordinal_position,
            id: this.id
        }
    }
}

export class DefaultColumn extends CoreColumn {
    jsonify() {
        return {
            name: this.name,
            data_type: this.data_type,
            default: this.default,
            ordinal_position: this.ordinal_position,
            option: this.option,
            id: this.id
        }
    }
}

export class DefaultColumnOptions extends CoreColumnOptions {
    jsonify() {
        return {
            autoIncrement: this.autoIncrement,
            primaryKey: this.primaryKey,
            foreignKey: this.foreignKey,
            unique: this.unique,
            notNull: this.notNull
        }
    }
}

export class DefaultRelationship extends CoreRelationship {
    jsonify() {
        return {
            startId: this.startId,
            startColumnIds: this.startColumnIds,
            endId: this.endId,
            endColumnIds: this.endColumnIds,
            relationshipType: this.relationshipType,
            id: this.id
        }
    }
}