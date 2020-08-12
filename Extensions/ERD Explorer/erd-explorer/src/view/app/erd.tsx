import { ErdModel } from "db-utils/out/structure/utils";

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
        options.push();
    }
}

function load(id: string) {
    erd = getMermaid(id);
}

export function click() {

}

function expand() {

}

function collapse() {

}

function getMermaid(id: string): string {

}

const relationships = {
    "||--|{": "}|--||",
    "||--||": "||--||",
    "}|--|{": "}|--|{",
    "}|--||": "||--|{",
    "|o--|{": "}|--o|",
    "|o--||": "||--o|",
    "}o--|{": "}|--o{",
    "}o--||": "||--o{",
    "||--o{": "}o--||",
    "||--o|": "|o--||",
    "}|--o{": "}o--|{",
    "}|--o|": "|o--|{",
}