'use strict';
import * as keytarType from 'keytar';
import * as vscode from 'vscode';

export class Global {
  public static keytar: typeof keytarType = getCoreNodeModule('keytar');
  public static context: vscode.ExtensionContext;

  public static get Configuration(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration("tarkalabs-postgresql");
  }
}

function getCoreNodeModule(moduleName: string) {
  try {
    return require(`${vscode.env.appRoot}/node_modules.asar/${moduleName}`);
  } catch(err) { }

  try {
    return require(`${vscode.env.appRoot}/node_modules/${moduleName}`);
  } catch(err) { }

  return null;
}