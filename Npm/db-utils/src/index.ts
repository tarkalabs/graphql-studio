import {Client, QueryResult } from "pg";
import {readFileSync} from "fs";
import { QueryResults, Connection } from "./db/connection";
import { IConnection } from "./db/IConnection";
import { Generate_ERD_File, getERDContent, getHtmlContent, CoreUtils } from "./erd/erd-core-utils";
import { MermaidUtils } from "./erd/erd-mermaid-utils";
import { MermaidSchema } from "./erd/erd-mermaid-models";
import { DefaultSchema } from "./erd/erd-core-models";

export const getStructure = async () => {
  let structure = await Connection.getStructure();

  return structure;
}

export const getSchema = async () => {
  let structure = await getStructure();

  let schema = new DefaultSchema();
  await Generate_ERD_File.getSchema(schema, new CoreUtils(), structure);

  return schema;
}

export const getTreeSchema = async () => {
  let schema = await getSchema();

  let tree: {
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
  } = {
    schemas: []
  };

  schema.tables.forEach(table => {
    let newTable = {
      tableName: table.name,
      isTable: true,
      columns: table.columns.map(column => {
        return {
          columnName: column.name,
          pk: column.option.primaryKey,
          fk: column.option.foreignKey,
          data_type: column.data_type
        }
      })
    };

    let newSchema = true;
    tree.schemas.forEach(schema => {
      if (schema.schemaName == table.catalog.substr(table.catalog.indexOf('.') + 1)) {
        newSchema = false;
        schema.tables.push(newTable);
      }
    });
    if (newSchema) {
      tree.schemas.push({
        schemaName: table.catalog.substr(table.catalog.indexOf('.') + 1),
        tables: [newTable],
        functions: []
      });
    }
  });

  schema.tree = tree;

  return schema;
}


export { Generate_ERD_File, MermaidUtils, MermaidSchema, getHtmlContent, getERDContent };

//export const Generate_ERD_File = Generate_ERD_File;