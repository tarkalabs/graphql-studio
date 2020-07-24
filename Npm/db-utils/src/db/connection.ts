'use strict'

import * as fs from 'fs';
import { ClientConfig, Client } from "pg";
import { IConnection } from './IConnection';
import { erdFieldsSql } from '../sql/erd-fields';

export interface RowResult {
  dbms: string,
  table_catalog: string,
  table_schema: string,
  table_name: string,
  column_name: string,
  ordinal_position: number,
  data_type: string,
  character_maximum_length: number,
  constraint_type: string,
  nullable: string
}

export interface FieldInfo {
  columnID: number;
  dataTypeID: number;
  dataTypeModifier: number;
  dataTypeSize: number;
  format: string;
  name: string;
  tableID: number;
  display_type?: string;
};

export interface QueryResults {
  rowCount: number;
  command: string;
  rows?: any[];
  fields?: FieldInfo[];
  flaggedForDeletion?: boolean;
  message?: string;
};

export interface TypeResult {
  oid: number;
  typname: string;
  display_type?: string;
};

export interface TypeResults {
  rowCount: number;
  command: string;
  rows?: TypeResult[];
  fields?: FieldInfo[];
}

export class Connection {
    private static client: Client;
    private static connectionOptions: IConnection;

    public static setup(connectionOptions: IConnection) {
      Connection.connectionOptions = connectionOptions;
    }
    
    private static disconnect() {
      if (Connection.client) {
        Connection.client.end();
      }
    }

    //"postgres://dev:1234@127.0.0.1:5432/example";
    private static async connect() {
      Connection.client = new Client(Connection.connectionOptions);

      await Connection.client.connect();
    }

    public static async runQuery<T>(query: string) {
      Connection.connect();
      try {
        const res: QueryResults | QueryResults[] = await Connection.client.query({ text: query });
        const results: QueryResults[] = Array.isArray(res) ? res : [res];

        return results
      } catch (e) {
        console.error(e);
      } finally {
        Connection.disconnect();
      }
    }
    
    public static async getStructure() {
      let results: QueryResults;

      try {
        const query = erdFieldsSql;
        results = (await Connection.runQuery(query))[1];
      } catch (e) {
        console.error(e);
      } finally {
        return results;
      }
    }   
}