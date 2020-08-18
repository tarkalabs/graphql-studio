/*import { ErdModel } from "db-utils/out/structure/utils";
import { MermaidModel } from "db-utils/out/erd/mermaid-utils";

let model: ErdModel;
export let erd: string = "";
export let options: { [name:string]: string[] };

export function updateModel(new_model: ErdModel, target_id: string) {
    model = new_model;

    parseModel();

    load(target_id);
}

function parseModel() {
    for (let key in model.dbStructure.relationships.items) {
        let relationship = model.dbStructure.relationships.items[key];
        options[model.getItemById(model.dbStructure.tables, relationship.startTable.id).name].push(relationship.id);
        options[model.getItemById(model.dbStructure.tables, relationship.endTable.id).name].push(relationship.id);
    }
}

function load(name: string) {
    let out = "erDiagram\n";
    if (name == "full") {
        return MermaidModel.getERD(model);
    } else {
        options[name].forEach(relationshipId => {
            let relationship = model.dbStructure.relationships.items[relationshipId];
            out += model.getItemById(model.dbStructure.tables, relationship.startTable.id).name + " " + relationships[relationship.relationshipType] + " " + model.getItemById(model.dbStructure.tables, relationship.endTable.id).name + " : \"\"";
        });
    }
    return out;
}

export function click(element) {
    let id = element.target.id;
    console.log(id);
    load(id);
}

function expand() {

}

function collapse() {

}

const relationships = {
    "ZeroOneN": "||--o|{",
    "ZeroOne": "||--o|",
    "ZeroN": "||--o{",
    "OneOnly": "||--||",
    "OneN": "||--|{",
    "One": "||--|",
    "N": "}--{"
}*/