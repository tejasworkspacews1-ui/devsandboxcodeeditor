declare module 'sql.js' {
  export interface Database {
    run(sql: string, params?: any[]): void;
    exec(sql: string): void;
    prepare(sql: string): Statement;
    export(): Uint8Array;
  }
  
  export interface Statement {
    run(params?: any[]): { changes: number };
    get(params?: any[]): any;
    all(params?: any[]): any[];
    bind(params?: any[]): void;
    free(): void;
  }
  
  export interface SqlJsStatic {
    Database: new (data?: ArrayLike<number>) => Database;
  }
  
  export default function initSqlJs(config?: any): Promise<SqlJsStatic>;
}
