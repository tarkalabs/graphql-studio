export interface IForeignKey {
    constraint: string,
    catalog: string,
    schema: string,
    table: string,
    column: string
  }
  
  export interface IColumn {
    columnName: string;
    data_type: string;
    pk: boolean;
    fk?: IForeignKey;
  }