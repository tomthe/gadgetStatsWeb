import { Component, OnInit } from '@angular/core';

import vegaEmbed, { vega } from 'vega-embed';
import * as vegaLito from 'vega-lite';
import * as localforage from 'localforage';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  configName = 'new';
  data = [];
  vegaText = '';
  sqlText = `select SUM(STEPS) as weeksteps, date(ROUND(AVG(timestamp)), 'unixepoch') as datum, timestamp
  from MI_BAND_ACTIVITY_SAMPLE
  where (timestamp between strftime('%s','now','-44 days') and strftime('%s','now','-38 days'))
  group by timestamp/(3600*24*7);`;
  presetChartConfigs = [{
    'name':'Steps per minute',
    'sqlText':`select SUM(STEPS) as weeksteps, date(ROUND(AVG(timestamp)), 'unixepoch') as datum, timestamp
    from MI_BAND_ACTIVITY_SAMPLE
    where (timestamp between strftime('%s','now','-44 days') and strftime('%s','now','-38 days'))
    group by timestamp/(3600*24*7);`,
    'vegaText':`{
      "data": {"values":  _data_ },
      "mark": "bar",
      "width": 820,
      "height": 620,
      "encoding": {
        "x": {"field": "datum", "type": "ordinal"},
        "y": {"field": "weeksteps", "type": "quantitative"}
      }
    }`},{
      'name':'StepsPerHour-Logarithmic',
      'sqlText':`select SUM(STEPS)+1 as weeksteps, date(ROUND(AVG(timestamp)), 'unixepoch') as datum, timestamp
      from MI_BAND_ACTIVITY_SAMPLE
      where (timestamp between strftime('%s','now','-65 days') and strftime('%s','now','-0 days'))
      group by timestamp/(3600);`,
      'vegaText':`{
        "data": {"values":  _data_ },
        "mark": "circle",
        "width": 1120,
        "height": 920,
        "encoding": {
          "x": {"field": "datum", "type": "ordinal"},
          "y": {"field": "weeksteps", "type": "quantitative",
          "scale": {"type": "log"}}
        }
      }`},

  ]
  savedChartConfigs = [];

  vegaError = '';

  constructor() { }

  ngOnInit() {
    this.loadChartConfigsFromLocalStorage();
  }

  updateVegaText(event){
    console.log("updateVegaText:",event);
    this.vegaText=event;
  }

  updateData(event){
    this.data = event;
  }

  updateSqlText(event) {
    this.sqlText = event;
  }

  loadPreset(preset){
    this.sqlText = preset.sqlText;
    this.vegaText = preset.vegaText;
  }

  drawChart(){
    //console.log('this.vegaText',this.vegaText);
    //console.log('data to string: ', this.data.toString(), JSON.stringify(this.data));
    //console.log('data:', this.data);
    let spec:any;
    let vegaspec:any;
    try {
      spec = this.vegaText.replace('_data_',JSON.stringify(this.data));
      vegaspec = vegaLito.compile(JSON.parse(spec)).spec;
    } catch (error) {
      console.log(error);
      this.vegaError = error.toString();
    }
    console.log(spec);
    console.log('vegaspec: ', vegaspec);
    let vegaOb = vega.parse(vegaspec, (error, chart) => {
      console.log("vega got parsed!")
      if (error) {
        console.error(error);
      }
      const view = chart({renderer: 'svg'});
      const svg = view.update().svg();
      console.log("svg:", svg);
      //response.type('svg').send(svg);
      view.destroy();
    });
    console.log('vegaOb: ', vegaOb);
    console.log();
    console.log(JSON.stringify(vegaspec));

    let view = new vega.View(vegaOb)
      .renderer('canvas')  // set renderer (canvas or svg)
      .initialize('#view') // initialize view within parent DOM container
      .hover()             // enable hover encode set processing
      .run();


    /*
    let opt = {
      "mode": 'vega-lite'
    };

    vegaEmbed('#vis', spec, opt).then(function(result) {
      // access view as result.view
      console.log("embedded", result);
    }).catch(console.error);
*/

  }

  saveNewUserConfig(){
    let newConfig = {'name':this.configName,
      'sqlText':this.sqlText,
      'vegaText':this.vegaText}
    this.savedChartConfigs.push(newConfig);
    localforage.setItem('savedChartConfigs', this.savedChartConfigs)
  }

  loadChartConfigsFromLocalStorage() {
    localforage.getItem('savedChartConfigs').then( (res) => {
      console.log ("userconfigs:", res);
      if (res){
        let arr = [];
        arr.concat(res);
        /*for (let index = 0; index < res.length; index++) {
          const element = array[index];

        }*/

        this.savedChartConfigs = [].concat(res);

        console.log("arr", arr);
        console.log("saved", this.savedChartConfigs);
      }
    });
  }

}
