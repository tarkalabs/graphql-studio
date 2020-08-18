import { ErdModel } from "../structure/utils";
import { RelationshipType } from "../structure/interfaces";

const enum leftSideRelationships {
    ZeroN = "}o",
    ZeroOne = "|o",
    OneOnly = "||",
    OneN = "}|"
}
const enum rightSideRelationships {
    ZeroN = "o{",
    ZeroOne = "o|",
    OneOnly = "||",
    OneN = "|{"
}

export class MermaidModel {
    static getERD(model: ErdModel) {
        console.log(model);
        let out = "";
        if (model.dbStructure.relationships) {
            for (let key in model.dbStructure.relationships.items) {
                let relationship = model.dbStructure.relationships.items[key];
                let startTable = model.dbStructure.tables.items[relationship.startTable.id];
                let endTable = model.dbStructure.tables.items[relationship.endTable.id];
                if (startTable && endTable) {
                    out += "\n";
                    let startSchema = model.dbStructure.schemas.items[startTable.schema];
                    let endSchema = model.dbStructure.schemas.items[endTable.schema];
                    switch (relationship.relationshipType) {
                        case RelationshipType.N:
                        case RelationshipType.ZeroN:
                            out += "\t" + startSchema.name.replace("_", "") + "-" + startTable.name.replace("_", "") + " " + leftSideRelationships.OneOnly + ".." + rightSideRelationships.ZeroN + " " + endSchema.name.replace("_", "") + "-" + endTable.name.replace("_", "") + " : \"\"";
                            break;
                        case RelationshipType.ZeroOne:
                        case RelationshipType.One:
                            out += "\t" + startSchema.name.replace("_", "") + "-" + startTable.name.replace("_", "") + " " + leftSideRelationships.OneOnly + ".." + rightSideRelationships.ZeroOne + " " + endSchema.name.replace("_", "") + "-" + endTable.name.replace("_", "") + " : \"\"";
                            break;
                        case RelationshipType.OneOnly:
                            out += "\t" + startSchema.name.replace("_", "") + "-" + startTable.name.replace("_", "") + " " + leftSideRelationships.OneOnly + ".." + rightSideRelationships.ZeroOne + " " + endSchema.name.replace("_", "") + "-" + endTable.name.replace("_", "") + " : \"\"";
                            break;
                        case RelationshipType.ZeroOneN:
                        case RelationshipType.OneN:
                            out += "\t" + startSchema.name.replace("_", "") + "-" + startTable.name.replace("_", "") + " " + leftSideRelationships.OneOnly + ".." + rightSideRelationships.OneN + " " + endSchema.name.replace("_", "") + "-" + endTable.name.replace("_", "") + " : \"\"";
                            break;
                    }
                }
            }
        }

        out = "erDiagram\n" + out.split('\n').sort().join('\n');

        return out;
    }
}