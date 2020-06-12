import {Client} from "pg";
import {readFileSync} from "fs";

export const getDBConnection = async (connectionString?: string) => {
  let _connStr = connectionString || process.env.DATABASE_URL
  const client = new Client({
    connectionString: _connStr
  });
  await client.connect()
  return client;
}

export const getStructure = async (client: Client) => {
  const queryText = readFileSync(__dirname + "/../sql/erd-fields.sql").toString();
  return client.query(queryText);
}
