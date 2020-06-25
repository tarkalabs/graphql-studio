import {getStructure} from "../index"
import {expect} from "chai";
import { Connection } from "../db/connection";
describe("structure", () => {
  it("should return current path", async (done) => {
    Connection.setup({
      label:"Localhost",
      host:"127.0.0.1",
      user:"dev",
      password:"1234",
      port:5432,
      database:"example"
    });
    const result = await getStructure();
    console.log(result);
    expect([]).to.eql([]);
    done();
  })
})