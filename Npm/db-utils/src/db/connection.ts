'use strict'

import * as fs from 'fs';
import { ClientConfig, Client } from "pg";
import { IConnection } from './IConnection';
import {readFileSync} from "fs";

export interface QueryResults {
  rowCount: number;
  rows?: RowResult[];
};

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
      let results = {rowCount:0, rows:[]};

      try {
        Connection.connect(); 
        results = await Connection.client.query(query);
      } catch (e) {
        console.error(e);
      } finally {
        Connection.disconnect();
        return results;
      }
    }

    public static async getStructure() {
      let results: QueryResults = {rowCount:0, rows:[]};

      try {
        const query = readFileSync(__dirname + "/../../sql/erd-fields.sql").toString();
        Connection.connect(); 
        results = (await Connection.client.query(query))[1];
      } catch (e) {
        console.error(e);
      } finally {
        Connection.disconnect();
        return results;
      }
    }   
}