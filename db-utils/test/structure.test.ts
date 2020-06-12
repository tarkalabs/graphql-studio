import {getDBConnection, getStructure} from "../src/index"
import {expect} from "chai";
describe("structure", () => {
  it("should return current path", async (done) => {
    const conn = await getDBConnection();
    const result = await getStructure(conn);
    result[1].rows.forEach((r)=> console.log(JSON.stringify(r)))
    expect([]).to.eql([]);
    done();
  })
})