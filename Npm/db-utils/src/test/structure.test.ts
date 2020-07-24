import {getStructure, MermaidUtils, MermaidSchema, getTreeSchema} from "../index"
import {expect} from "chai";
import { Connection } from "../db/connection";
import { getERDContent } from "../erd/erd-core-utils";
describe("structure", () => {
  it("should return current path", async (done) => {
    Connection.setup({
      label:"Localhost",
      host:"127.0.0.1",
      user:"dev",
      password:"1234",
      port:5432,
      database:"StackExchange"
    });
    const result = await getTreeSchema();
    console.log(result.tree.schemas[0].tables);
    //console.log(await getERDContent(new MermaidSchema(), new MermaidUtils(),result));
    expect([]).to.eql([]);
    done();
  })
})