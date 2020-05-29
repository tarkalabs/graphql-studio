'use strict';

export class Constants {
  public static ExtensionId = 'vscode-postgres';
  public static GlobalStateKey = 'postgresql.connections';
}

/*
  @author Caleb Reath 
  Constants used by the ERDGenerator Command
*/
export class ErdConstants {
  public static columnCount = 5;
  public static rowCount = 5;
  public static width = 2000;
  public static height = 2000;
  public static columnWidth = ErdConstants.width/ErdConstants.columnCount;
  public static rowHeight = ErdConstants.height/ErdConstants.rowCount;
}