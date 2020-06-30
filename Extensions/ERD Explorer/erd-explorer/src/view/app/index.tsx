import * as React from "react";
import * as ReactDOM from "react-dom";

import ERD from "./erd";

declare global {
  interface Window {
    acquireVsCodeApi(): any;
  }
}

const vscode = window.acquireVsCodeApi();

ReactDOM.render(
  <ERD vscode={vscode} />,
  document.getElementById("root")
);