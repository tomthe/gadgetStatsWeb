import { Component, OnInit } from '@angular/core';

/*
import * as vega3 from 'vega';
import * as vegaLite from 'vega-lite';
import * as vegaEmbed from 'vega-embed';
*/

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  data = [];
  vegaText = '';


  constructor() { }

  ngOnInit() {
  }

  updateVegaText(event){
    console.log(event);
    this.vegaText=event;
  }

  updateData(event){
    this.data = event;
  }

  drawChart(){
    let spec = "https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json";
    spec = this.vegaText.replace('_data_',this.data.toString());

/*

    vegaEmbed('#vis', spec).then(function(result) {
      // access view as result.view
    }).catch(console.error);
*/

  }

}
