import {Client, QueryResult } from "pg";
import {readFileSync} from "fs";
import { QueryResults, Connection } from "./db/connection";
import { IConnection } from "./db/IConnection";
import { Generate_ERD_File, getERDContent, getHtmlContent } from "./erd/erd-core-utils";
import { MermaidUtils } from "./erd/erd-mermaid-utils";
import { MermaidSchema } from "./erd/erd-mermaid-models";

export const getStructure = async () => {
  return await Connection.getStructure();
}


export { Generate_ERD_File, MermaidUtils, MermaidSchema, getHtmlContent, getERDContent };

//export const Generate_ERD_File = Generate_ERD_File;