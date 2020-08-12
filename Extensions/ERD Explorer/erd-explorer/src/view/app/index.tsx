import './index.scss';
import * as $ from 'jquery';
import 'popper.js';
import mermaid from "mermaid";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import { MermaidModel } from "db-utils/out/erd/mermaid-utils";
import { ErdModel } from "db-utils/out/structure/utils";
import { log } from './messaging';

declare global {
  interface Window {
      acquireVsCodeApi(): any;
  }
}

let model: ErdModel = undefined;

$(document).ready(function () {
  mermaid.contentLoaded();
  vscode.postMessage({
    command: 'getERD'
  })
});

mermaid.initialize({
  startOnLoad: false
});



/*
var flip = function(str) {
  let out = "";
  let strArr = str.split("").reverse();
  strArr.forEach(element => {
    if (element == "{") {
      out += "}";
    } else if (element == "}") {
      out += "{";
    } else {
      out += element;
    }
  });
  return out;
}

var parse = function(str) {
  str = str.substr(str.indexOf("\n")+1);
  var erd = {

  }
  $('ol').append("<li id='full'>Full Diagram</li>");
  str.split("\n").forEach((e) => {
    var f = e.trim();
    var elems = f.split(" ");
    if (elems.length == 5) {
      if (erd[elems[0]]) {
        erd[elems[0]].push({
          name: elems[2],
          relationship: elems[1]
        });
      } else {
        $('ol').append("<li id='" + elems[0] + "'>" + elems[0] + "</li>");
        erd[elems[0]] = [{
          name: elems[2],
          relationship: elems[1]
        }];
      }

      if (erd[elems[2]]) {
        erd[elems[2]].push({
          name: elems[0],
          relationship: flip(elems[1])
        });
      } else {
        $('ol').append("<li id='" + elems[2] + "'>" + elems[2] + "</li>");
        erd[elems[2]] = [{
          name: elems[0],
          relationship: flip(elems[1])
        }];
      }
    }
  });

  for (var key in erd) {
    erd[key].expanded = false;
  }

  $('li').click(clicked);

  return erd;
}

let erd = parse("");
var erdRaw = "";

var currentERD = "";
var getMermaid = function(id) {
  if (id == "full") {
    return erdRaw;
  }
  var out = "erDiagram\n";
  erd[id].forEach((e) => {
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
    expand(e.currentTarget.id);
    reload(currentERD);
  });
}

function clicked(element) {
  let id = element.target.id;
  reload(getMermaid(id));
}
*/