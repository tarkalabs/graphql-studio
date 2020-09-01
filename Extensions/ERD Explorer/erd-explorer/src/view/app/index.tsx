import './index.scss';
import * as $ from 'jquery';
import 'popper.js';
import mermaid from "mermaid";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import { ErdModel, MermaidModel } from "@tarkalabs/pg-db-utils";

declare global {
  interface Window {
    acquireVsCodeApi(): any;
  }
}
const vscode = window.acquireVsCodeApi();

let model: ErdModel;
let erd: string = "";
//let options: { [name: string]: string[] };
//let fullDiagramRelationships = undefined;
//let expandedRelationships: { [relationshipId: string]: any }
//let expandedTables = {};
//let visibleTables = {};
let tableList = {};

let relationships: Set<string> = new Set();
let activeRelationships: Set<string> = new Set();
let tables: Set<string> = new Set();
let activeTables: { [tableName: string]: boolean } = {}; // true = expanded, false = not expanded
let tableRelationships: { [tableName: string]: string[] } = {};
let rootTable = "";

$(document).ready(function () {
  mermaid.contentLoaded();
  vscode.postMessage({
    command: 'getERD'
  })
});

let theme = "default";
if (!$('body').hasClass("vscode-light")) {
  theme = "dark"
}

mermaid.initialize({
  startOnLoad: false,
  theme: theme
});

function updateModel(new_model: ErdModel, target: string) {
  model = new_model;

  parseModel();

  load(target);

  refresh();
}

function parseModel() {
  for (let key in model.dbStructure.relationships.items) {
    let relationship = model.dbStructure.relationships.items[key];

    if (!relationship.endTable.id) {
      relationship.endTable.id = relationship.startTable.id;
    }

    let startNodeName = getNodeName(relationship.startTable.id);
    let endNodeName = getNodeName(relationship.endTable.id);
    
    tables.add(startNodeName);
    tables.add(endNodeName);

    let relationshipString = startNodeName + " " + relationship.relationshipType + " " + endNodeName + " : \"\"";

    relationships.add(relationshipString);

    if (!tableRelationships[startNodeName]) {
      tableRelationships[startNodeName] = [];
    }
    if (!tableRelationships[endNodeName]) {
      tableRelationships[endNodeName] = [];
    }
    tableRelationships[startNodeName].push(relationshipString);
    tableRelationships[endNodeName].push(relationshipString);
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
  if (target == "full") {
    erd = MermaidModel.getERD(model);

    activeRelationships = new Set(relationships.keys());
    tables.forEach(table => {
      activeTables[table] = true;
    })
    rootTable = "";
  } else {
    activeTables = {};
    activeRelationships = new Set();

    rootTable = target;
    activeTables[rootTable] = false;
    expand(rootTable);
    /*
    activeTables[target] = true;
    tableRelationships[target].forEach(relationship => {
      let rSplit = relationship.split(" ");
      let t1 = rSplit[0];
      let t2 = rSplit[2];
      if (activeTables[t1] == undefined) {
        activeTables[t1] = false;
      }
      if (activeTables[t2] == undefined) {
        activeTables[t2] = false;
      }
      activeRelationships.add(relationship);
    });*/
  }
}

var refresh = function () {
  if (rootTable != "") {
    erd = "erDiagram"
    activeRelationships.forEach(relationship => {
      erd += "\n\t" + relationship;
    });
  }
  $('.mermaid').html(erd.replace(/\./g, "-")).removeAttr('data-processed');
  mermaid.init(undefined, $(".mermaid"));
  $("g").click(function (e) {
    expand(e.currentTarget.id);
  });
  
  tables.forEach(table => {
    if (table == rootTable || rootTable == "") {
      let elementSelector = "g#" + table;
      $(elementSelector).children(":first-child").addClass('root-table');
    } else if (!activeTables[table]) {
      let elementSelector = "g#" + table;
      $(elementSelector).children(":first-child").addClass('not-expanded');
    } else {
      let elementSelector = "g#" + table;
      $(elementSelector).children(":first-child").addClass('expanded');
    }
  });
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
    if (activeTables[id] == false) {
      activeTables[id] = true;

      let checkRelationships = new Set<string>();
      tableRelationships[id].forEach(relationship => {
        let rSplit = relationship.split(" ");
        let t1 = rSplit[0];
        let t2 = rSplit[2];
        if (activeTables[t1] == undefined) {
          activeTables[t1] = false;
          checkRelationships.add(t1);
        }
        if (activeTables[t2] == undefined) {
          activeTables[t2] = false;
          checkRelationships.add(t2);
        }
        activeRelationships.add(relationship);
      });
      tables.forEach(table => {
        if (activeTables[table] != undefined) {
          let isExpanded = true;
          tableRelationships[table].forEach(relationship => {
            let rSplit = relationship.split(" ");
            let t1 = rSplit[0];
            let t2 = rSplit[2];
            if (activeTables[t1] != undefined && activeTables[t2] != undefined) {
              activeRelationships.add(relationship);
            } else {
              isExpanded = false;
            }
          });
          if (isExpanded) {
            activeTables[table] = true;
          }
        }
      });
    } else {
      collapse(id);
    }
    refresh();
  }
}

function collapse(id) {
  if (id && (id == rootTable || rootTable == "")) {
    log("Cannot Collapse Root Node");
    return;
  }

  activeTables[id] = false;
  let checkRelationships = new Set<string>();
  tableRelationships[id].forEach(relationship => {
    let rSplit = relationship.split(" ");
    let t1 = rSplit[0];
    let t2 = rSplit[2];
    let other = (id == t1)? t2: t1;

    if (activeTables[other] == false) {
      checkRelationships.add(other);
    }
  });
  tables.forEach(table => {
    if (activeTables[table] == false) {
      let orphanTable = true;
      tableRelationships[table].forEach(relationship => {
        let rSplit = relationship.split(" ");
        let t1 = rSplit[0];
        let t2 = rSplit[2];
        let other = (table == t1)? t2: t1;

        log(table + " " + other + ":" + activeTables[other]);

        if (activeTables[other] == true) {
          orphanTable = false;
        }
      });
      if (orphanTable) {
        delete activeTables[table];
        tableRelationships[table].forEach(relationship => {
          activeRelationships.delete(relationship);
        });
      }
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