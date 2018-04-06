import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as SQL from 'sql.js/js/sql.js';

@Component({
  selector: 'app-data-sources',
  templateUrl: './data-sources.component.html',
  styleUrls: ['./data-sources.component.css']
})
export class DataSourcesComponent implements OnInit {

  objectKeys = Object.keys;

  boolSaveDatabaseInLocalStorage:boolean = true;

  db:any;

  sqlText:string = `select SUM(STEPS) as weeksteps, date(ROUND(AVG(timestamp)), 'unixepoch') as datum, timestamp
  from MI_BAND_ACTIVITY_SAMPLE
  where (timestamp between strftime('%s','now','-44 days') and strftime('%s','now','-38 days'))
  group by timestamp/(3600*24*7);`;

  sqlResult = [];

  @Output() resultUpdate:EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    if (this.boolSaveDatabaseInLocalStorage){
        this.loadDbFromLocalStorage();
    }
  }

  saveDbToLocalStorage(){
    // from https://github.com/kripken/sql.js/wiki/Persisting-a-Modified-Database
    function toBinString (arr) {
      var uarr = new Uint8Array(arr);
      var strings = [], chunksize = 0xffff;
      // There is a maximum stack size. We cannot call String.fromCharCode with as many arguments as we want
      for (var i=0; i*chunksize < uarr.length; i++){
        strings.push(String.fromCharCode.apply(null, uarr.subarray(i*chunksize, (i+1)*chunksize)));
      }
      return strings.join('');
    }
    //try {
      window.localStorage.setItem("db", toBinString(this.db.export()));
    //} catch (error) {
      console.log("tried to save to local-storage...failed! :(  ... your database is probably too big")
    //}
  }

  loadDbFromLocalStorage(){
    // from: https://github.com/kripken/sql.js/wiki/Persisting-a-Modified-Database
    function toBinArray (str) {
      var l = str.length,
          arr = new Uint8Array(l);
      for (var i=0; i<l; i++) arr[i] = str.charCodeAt(i);
      return arr;
    }
    try {
      this.db = new SQL.Database(toBinArray(localStorage.getItem("db")));
    } catch (error) {
      console.log("tried to load from local-storage...failed! :(")
    }
  }


  emitData(){
    this.resultUpdate.emit(this.sqlResult);
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
      this.saveDbToLocalStorage();
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
    this.emitData();
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
    this.emitData();
  }
}
