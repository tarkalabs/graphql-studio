import { ErdModel, GenerateERD } from "./structure/utils";
import { PgTree } from "./structure/interfaces";


export const getStructure = async () => {
  let model = new GenerateERD().getSchema();

  return model;
}