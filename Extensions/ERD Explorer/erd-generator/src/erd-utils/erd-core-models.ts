'use strict';

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
    database: string
    databaseName: string
    tables: Array<CoreTable>
    relationships: Array<CoreRelationship>

    abstract stringify() : string;
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