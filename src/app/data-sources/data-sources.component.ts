import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as SQL from 'sql.js/js/sql.js';

@Component({
  selector: 'app-data-sources',
  templateUrl: './data-sources.component.html',
  styleUrls: ['./data-sources.component.css']
})
export class DataSourcesComponent implements OnInit {

  objectKeys = Object.keys;

  db:any;

  sqlText:string = `select SUM(STEPS) as weeksteps, date(ROUND(AVG(timestamp)), 'unixepoch') as datum, timestamp
  from MI_BAND_ACTIVITY_SAMPLE
  where (timestamp between strftime('%s','now','-80 days') and strftime('%s','now','-1 days'))
  group by timestamp/(3600*24*7);`;

  sqlResult = [];

  @Output() resultUpdate:EventEmitter = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.testSQL();
  }

  emitData(){
    this.resultUpdate.emit(this.sqlResult);
  }

  testSQL(){

    this.db = new SQL.Database();
    console.log('baaaaaaaaaaa')
    //this.db = SQL.sql.Database();

    console.log('baabbbbbbbbb')



    let sqlstr = "CREATE TABLE hello (a int, b char);";
    sqlstr += "INSERT INTO hello VALUES (0, 'hello');"
    sqlstr += "INSERT INTO hello VALUES (1, 'world');"
    this.db.run(sqlstr); // Run the query without returning anything

    let res = this.db.exec("SELECT * FROM hello");
    console.log(res);
    /*
    [
      {columns:['a','b'], values:[[0,'hello'],[1,'world']]}
    ]
    */

    // Prepare an sql statement
    let stmt = this.db.prepare("SELECT * FROM hello WHERE a=:aval AND b=:bval");

    // Bind values to the parameters and fetch the results of the query
    let result = stmt.getAsObject({':aval' : 1, ':bval' : 'world'});
    console.log(result); // Will print {a:1, b:'world'}
  }


  loadDB(ev:any ){
    console.log('load db...');
    console.log('load db...', ev);
    var f = ev.target.files[0];

    console.log(f);
    let r = new FileReader();
    r.onload = ()=> {
      console.log(r.result);
      let Uints = new Uint8Array(r.result);
      this.db = new SQL.Database(Uints);
    };
    r.readAsArrayBuffer(f);
  }

  executeSQLfromTextarea(){
    let stmt = this.db.prepare(this.sqlText);
    let result = [];
    while(stmt.step()) { //
      let row = stmt.getAsObject();
      result.push(row);
    }
    this.sqlResult = result;
  }

  testBridgeDB(){

    let sqlText = `select SUM(STEPS) as weeksteps, date(ROUND(AVG(timestamp)), 'unixepoch') as datum, timestamp
from MI_BAND_ACTIVITY_SAMPLE
where (timestamp between strftime('%s','now','-80 days') and strftime('%s','now','-1 days'))
group by timestamp/(3600*24*7);`

    //var stmt = this.db.prepare("SELECT * FROM hello WHERE a=:aval AND b=:bval");
    let stmt = this.db.prepare(sqlText);

    let result = [];

    while(stmt.step()) { //
      let row = stmt.getAsObject();
      result.push(row);
      // [...] do something with the row of result
    }
    console.log('result from testBridgeDB: ', result, this.objectKeys(result));
    this.sqlResult = result;
  }
}
