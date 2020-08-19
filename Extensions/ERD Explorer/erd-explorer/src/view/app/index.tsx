import './index.scss';
import * as $ from 'jquery';
import 'popper.js';
import mermaid from "mermaid";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import { ErdModel } from "db-utils/out/structure/utils";
import { MermaidModel } from "db-utils/out/erd/mermaid-utils";

declare global {
  interface Window {
    acquireVsCodeApi(): any;
  }
}
const vscode = window.acquireVsCodeApi();

let model: ErdModel;
let erd: string = "";
let options: { [name: string]: string[] };
let fullDiagramRelationships = undefined;
let expandedRelationships: { [relationshipId: string]: any }
let expandedTables = {};
let visibleTables = {};
let tableList = {};

$(document).ready(function () {
  mermaid.contentLoaded();
  vscode.postMessage({
    command: 'getERD'
  })
});

mermaid.initialize({
  startOnLoad: false
});

function updateModel(new_model: ErdModel, target: string) {
  model = new_model;

  parseModel();

  load(target);

  refresh();
}

function parseModel() {
  options = {};
  fullDiagramRelationships = {};
  for (let key in model.dbStructure.relationships.items) {
    let relationship = model.dbStructure.relationships.items[key];

    if (!relationship.endTable.id) {
      relationship.endTable.id = relationship.startTable.id;
    }

    let startNodeName = getNodeName(relationship.startTable.id);
    let endNodeName = getNodeName(relationship.endTable.id);
    
    if (!options[startNodeName]) {
      options[startNodeName] = [];
    }
    if (!options[endNodeName]) {
      options[endNodeName] = [];
    }
    options[startNodeName].push(relationship.id);
    options[endNodeName].push(relationship.id);
    log("parseModel: " + startNodeName + " " + endNodeName);
    fullDiagramRelationships[key] = key;
  }

  $('ol').append("<li id='full'>Full Diagram</li>");
  for (let key in model.dbStructure.tables.items) {
    let nodeName = getNodeName(key)
    $('ol').append("<li id='" + nodeName + "'>" + nodeName + "</li>");
    tableList[nodeName] = nodeName;
  }
  $('li').click(click);
}

function load(target: string) {
  erd = "";
  expandedRelationships = {};
  expandedTables = {};
  visibleTables = {};
  if (target == "full") {
    Object.assign(expandedRelationships, fullDiagramRelationships);
    Object.assign(expandedTables, tableList);
    Object.assign(visibleTables, tableList);

    erd = MermaidModel.getERD(model);
  } else {
    log("load: " + target);
    visibleTables[target] = target;
    options[target].forEach(relationshipId => {
      if (!expandedRelationships[relationshipId]) {
        expandedRelationships[relationshipId] = relationshipId;
        let relationship = model.dbStructure.relationships.items[relationshipId];
        if (!relationship.endTable.id) {
          relationship.endTable.id = relationship.startTable.id;
        }
        visibleTables[getNodeName(relationship.startTable.id)] = getNodeName(relationship.startTable.id);
        visibleTables[getNodeName(relationship.endTable.id)] = getNodeName(relationship.endTable.id);
        erd += "\t" + getNodeName(relationship.startTable.id) + " " + relationship.relationshipType + " " + getNodeName(relationship.endTable.id) + " : \"\"\n";
      }
    });
    erd = "erDiagram" + erd.split('\n').sort().join('\n');
  }
}

var refresh = function () {
  $('.mermaid').html(erd).removeAttr('data-processed');
  mermaid.init(undefined, $(".mermaid"));
  $("g").click(function (e) {
    expand(e.currentTarget.id);
    log("refresh: " + e.currentTarget.id)
  });
  
  log(Object.keys(expandedTables).length + " " + Object.keys(tableList).length );
  for (let tableId in tableList) {
    if (!expandedTables[tableId]) {
      let elementSelector = "g#" + tableId;
      $(elementSelector).children(":first-child").addClass('not-expanded');
    }
  }
}

function click(element) {
  let id = element.target.id;
  if (id) {
    load(id);
    refresh();
  }
}

function expand(id) {
  if (id) {
    if (!expandedTables[id]) {
      expandedTables[id] = id;
      log("expand: " + id);
      options[id].forEach((relationshipId) => {
        if (!expandedRelationships[relationshipId]) {
          let relationship = model.dbStructure.relationships.items[relationshipId];
          visibleTables[getNodeName(relationship.startTable.id)] = getNodeName(relationship.startTable.id);
          visibleTables[getNodeName(relationship.endTable.id)] = getNodeName(relationship.endTable.id);
          erd += getNodeName(relationship.startTable.id) + " " + relationship.relationshipType + " " + getNodeName(relationship.endTable.id) + " : \"\"\n";
        }
      });
    } else {
      collapse(id);
    }
    refresh();
  }
}

function collapse(id) {
  delete expandedTables[id];
  options[id].forEach((relationshipId) => {
    let relationship = model.dbStructure.relationships.items[relationshipId];
    let occurrences = [0, 0];
    erd.substring(erd.indexOf("\n")+1).split("\n").map(line => {
      if (line.split(" ")[0] == getNodeName(relationship.startTable.id) || line.split(" ")[2] == getNodeName(relationship.startTable.id)) {
        occurrences[0]++;
      }
      if (line.split(" ")[0] == getNodeName(relationship.endTable.id) || line.split(" ")[2] == getNodeName(relationship.endTable.id)) {
        occurrences[1]++;
      }
    });

    let deleteRelationship = false;
    if (id == getNodeName(relationship.startTable.id)) {
      if (occurrences[1] == 1) {
        deleteRelationship = true;
      }
    } else {
      if (occurrences[0] == 1) {
        deleteRelationship = true;
      }
    }
    if (deleteRelationship) {
      erd = erd.replace(getNodeName(relationship.startTable.id) + " " + relationship.relationshipType + " " + getNodeName(relationship.endTable.id) + " : \"\"\n", "");
    }
  });
}

function getNodeName(tableId) {
  let table = model.dbStructure.tables.items[tableId];
  let schema = model.dbStructure.schemas.items[table.schema];
  return (schema.name + "-" + table.name).replace("_", "");
}

// Handle the message inside the webview
window.addEventListener('message', event => {
  const message = event.data; // The JSON data our extension sent

  switch (message.command) {
    case 'loadERD':
      updateModel(message.model, message.target);
      break;
  }
});

window.onerror = function (message, source, lineno, colno, error) {
  vscode.postMessage({
    command: 'error',
    error: {
      message,
      source,
      lineno,
      colno,
      error
    }
  });
}

export function log(message) {
  vscode.postMessage({
    command: 'log',
    message: message
  })
}