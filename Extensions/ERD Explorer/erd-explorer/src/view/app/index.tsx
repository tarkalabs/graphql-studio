import * as $ from 'jquery';
import 'popper.js';

import mermaid from "mermaid";
import 'bootstrap';
import './index.scss';

declare global {
  interface Window {
    acquireVsCodeApi(): any;
  }
}

const vscode = window.acquireVsCodeApi();

$(document).ready(function () {
  clicked("full");
  mermaid.contentLoaded();
  vscode.postMessage({
    command: 'getERD'
  })
});

mermaid.initialize({
  startOnLoad: false
});

var flip = {
  "||..|{": "}|..||",
  "}|..||": "||..|{",
  "||..||": "||..||"
}

var parse = function(str) {
  var erd = {

  }
  str.split("\n").forEach((e) => {
    var f = e.trim();
    var elems = f.split(" ");
    if (erd[elems[0]]) {
      erd[elems[0]].push({
        name: elems[2],
        relationship: elems[1]
      });
    } else {
      $('ol').append("<li onclick=\"clicked('" + elems[0] + "')\">" + elems[0] + "</li>");
      erd[elems[0]] = [{
        name: elems[2],
        relationship: elems[1]
      }];
    }

    if (erd[elems[2]]) {
      erd[elems[2]].push({
        name: elems[0],
        relationship: flip[elems[1]]
      });
    } else {
      $('ol').append("<li onclick=\"clicked('" + elems[2] + "')\">" + elems[2] + "</li>");
      erd[elems[2]] = [{
        name: elems[0],
        relationship: flip[elems[1]]
      }];
    }
  });

  for (var key in erd) {
    erd[key].expanded = false;
  }

  return erd;
}

let erd = parse("");
var erdRaw = "";

var currentERD = "";
var getMermaid = function(name) {
  var out = "erDiagram\n";
  erd[name].forEach((e) => {
    out += name + " " + e.relationship + " " + e.name + " : \"\"\n";
  });
  currentERD = out;
  return out;
}

var expand = function(id) {
  if (!erd[id].expanded) {
    erd[id].expanded = true;
    erd[id].forEach((e) => {
      var str = id + " " + e.relationship + " " + e.name + " : \"\"\n";
      var str2 = e.name + " " + flip[e.relationship] + " " + id + " : \"\"\n";
      if (currentERD.indexOf(str) == -1 && currentERD.indexOf(str2) == -1) {
        currentERD += str;
      }
    });
  }
}

var reload = function(content) {
  $('.mermaid').html(content).removeAttr('data-processed');
  mermaid.init(undefined, $(".mermaid"));
  $("g").click(function(e) {
    console.log(e.currentTarget.id);
    expand(e.currentTarget.id);
    reload(currentERD);
  });
}

const clicked = function(id) {
  if (id == "full") {
    currentERD = "erDiagram " + erdRaw;
    reload(currentERD);
  } else {
    reload(getMermaid(id));
  }
}

// Handle the message inside the webview
window.addEventListener('message', event => {

  const message = event.data; // The JSON data our extension sent

  switch (message.command) {
      case 'loadERD':
        parse(message.text);
        reload(message.text);
        break;
  }
});