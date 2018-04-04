import { Component, OnInit } from '@angular/core';
import * as SQL from 'sql.js/js/sql.js';

@Component({
  selector: 'app-data-sources',
  templateUrl: './data-sources.component.html',
  styleUrls: ['./data-sources.component.css']
})
export class DataSourcesComponent implements OnInit {

  db:any;

  constructor() { }

  ngOnInit() {
    this.testSQL();
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

    var res = this.db.exec("SELECT * FROM hello");
    console.log(res);
    /*
    [
      {columns:['a','b'], values:[[0,'hello'],[1,'world']]}
    ]
    */

    // Prepare an sql statement
    var stmt = this.db.prepare("SELECT * FROM hello WHERE a=:aval AND b=:bval");

    // Bind values to the parameters and fetch the results of the query
    var result = stmt.getAsObject({':aval' : 1, ':bval' : 'world'});
    console.log(result); // Will print {a:1, b:'world'}
  }


  loadDB(ev:any ){
    console.log('load db...');
    console.log('load db...', ev);
    var f = ev.target.files[0];

    console.log(f);
    var r = new FileReader();
    r.onload = ()=> {
      console.log(r.result);
      var Uints = new Uint8Array(r.result);
      this.db = new SQL.Database(Uints);
    };
    r.readAsArrayBuffer(f);
  }
}
