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

let model: ErdModel; // ErdModel received from pg-db-utils
let erd: string = ""; // Current rendered erd

let relationships: Set<string> = new Set(); // Set of all relationships
let activeRelationships: Set<string> = new Set(); // Set of rendered relationships
let tables: Set<string> = new Set(); // Set of all tables
let activeTables: { [tableName: string]: boolean } = {}; // Dictionary of rendered tables, true = expanded, false = not expanded
let tableRelationships: { [tableName: string]: string[] } = {}; // Map for each table identifying their relationships
let rootTable = ""; // Root table is defined when selecting an expansion root. It prevents collapsing root nodes

$(document).ready(function () {
  mermaid.contentLoaded();
  vscode.postMessage({
    command: 'getERD'
  })
});

// Set colour theme because paths css is not responding reliably
let theme = "default";
if (!$('body').hasClass("vscode-light")) {
  theme = "dark"
}

mermaid.initialize({
  startOnLoad: false,
  theme: theme
});

// Get an updated version of the model
function updateModel(new_model: ErdModel, target: string) {
  model = new_model;

  parseModel();

  load(target);

  refresh();
}

// Parse ErdModel to populate maps and sets correctly
// Also populate ol element for root selection
function parseModel() {
  relationships = new Set();
  activeRelationships = new Set(); 
  tables = new Set(); 
  activeTables = {}; 
  tableRelationships = {}; 
  rootTable = ""; 
  $('ol').html("");

  // Record every table and relationship
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

  // Populate roots list
  $('ol').append("<li class=\"erd-dropdown\" id='full'>Full Diagram</li>");
  let list: string[] = [];
  for (let key in model.dbStructure.tables.items) {
    let nodeName = getNodeName(key)
    list.push("<li class=\"erd-dropdown\" id='" + nodeName + "'>" + nodeName + "</li>");
  }

  list = list.sort();

  let currentSchema = "";
  list.forEach(item => {
    if (currentSchema == "" || item.split(" ")[2].indexOf(currentSchema + "-") == -1) {
      currentSchema = item.split(" ")[2].substring(4, item.split(" ")[2].indexOf("-"));
      log(currentSchema)
      $('ol').append("<hr>");
    }
    $('ol').append(item);
  });

  // Add click listeners to root list
  $('li').click(click);
}

// Load erd from a specific root, 'full' = full diagram
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
    // Reset active table/relationship list
    activeTables = {};
    activeRelationships = new Set();

    rootTable = target;
    activeTables[rootTable] = false;
    expand(rootTable); //Expand root node
  }
}

// Refresh Erd by re initializing mermaid
// If root table is not set then expand all nodes
var refresh = function () {
  if (rootTable != "") {
    erd = "erDiagram"
    activeRelationships.forEach(relationship => {
      erd += "\n\t" + relationship;
    });
  }
  $('.mermaid').html(erd.replace(/\./g, "-")).removeAttr('data-processed');
  mermaid.init(undefined, $(".mermaid"));

  // Add click listeners to table elements
  $("g").click(function (e) {
    tableClick(e);
  });
  
  // Add css classes to table nodes based on their level of expansion
  // If rootTable is not set then every table is a root table
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

// Click event fired from root list to load a new root
function click(element) {
  let id = element.target.id;
  if (id) {
    load(id);
    refresh();
  }
}

// Click event fired from a table element to either expand/collapse or explore the table occurrences
function tableClick(e) {
  // If ctl+click or cmd+click explore sql for table references
  if (e.ctrlKey || e.metaKey) {
    vscode.postMessage({
      command: 'explore',
      tableName: e.currentTarget.id
    });
  } else { // expand/collapse clicked table
    let id = e.currentTarget.id;
    if (id) {
      // If table is active and not expanded then expand, otherwise collapse
      if (activeTables[id] == false) {
        expand(id);
      } else {
        collapse(id);
      }
      refresh();
    }
  }
}

// Expands a table and adds all relationships and adjacent tables to the active sets
function expand(id) {
  activeTables[id] = true;

  // Add each relationship to the active set
  tableRelationships[id].forEach(relationship => {
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
  });

  // check every table for adjacency
  // If a table is adjacent then ensure it is in the active set
  // If the table has no other relationships then set the node as expanded
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
}

// Collapses a table element if it not a rootTable
function collapse(id) {
  if (id == rootTable || rootTable == "") {
    log("Cannot Collapse A Root Node");
    return;
  }

  // Collapse table
  // Check every table to ensure they are not orphaned
  // A table is orphaned when itself and every adjacent table to it is not expanded
  // Orphaned tables must be removed from the erd
  // If config erd-retain-orphan-tables is true then orphans should remain but appear gray TODO: Add this config option
  activeTables[id] = false;
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

// Helper function to ensure all table names are standard
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

// Output errors to the ViewLoader for easy handling
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

// Log messages to ViewLoader for easy handling
export function log(message) {
  vscode.postMessage({
    command: 'log',
    message: message
  })
}