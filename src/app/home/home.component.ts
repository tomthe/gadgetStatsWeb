import { Component, OnInit, ViewChild } from '@angular/core';

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
  sqlText = ``;
  presetChartConfigs = [
    
    {
      'name':'Intensity and Steps per Minute',
      'sqlText':`select raw_intensity as intensity, STEPS as steps, datetime(timestamp, 'unixepoch') as datum, timestamp
      from MI_BAND_ACTIVITY_SAMPLE
      where (timestamp between strftime('%s','now','-1 days') and strftime('%s','now','-0 days'));`,
      'vegaText':`{
        "data": {"values":  _data_ },
        "width": 820,
        "height": 620,
  "resolve":{"scale":{"y":"independent"}},
  "layer":[{
          "mark": "bar",
          "encoding": {
            "x": {"field": "datum", "type": "temporal"},
            "y": {"field": "steps", "type": "quantitative",
            "scale": {"type": "linear"}},
   "color": {"value": "#0099cc"}
          }},
          {
          "mark": "line",
          "encoding": {
            "x": {"field": "datum", "type": "temporal"},
            "y": {"field": "intensity", "type": "quantitative",
               "scale": {"type": "linear"}
             },
           "color":{"value":"#ccaa00"}
            }
          }
  ]
      }`},
    
    
    
    {
      'name':'Steps, Heart-Rate and Intensity per Minute',
      'sqlText':`select HEART_RATE as hr, raw_intensity as intensity, STEPS as steps, datetime(timestamp, 'unixepoch') as datum, timestamp
      from MI_BAND_ACTIVITY_SAMPLE
      where (timestamp between strftime('%s','now','-2 days') and strftime('%s','now','-0 days'));`,
      'vegaText':`{
        "data": {"values":  _data_ },
        "width": 820,
        "height": 620,
  "resolve":{"scale":{"y":"independent"}},
  "layer":[{
          "mark": "bar",
          "encoding": {
            "x": {"field": "datum", "type": "temporal"},
            "y": {"field": "steps", "type": "quantitative",
            "scale": {"type": "linear"}},
   "color": {"value": "#0099cc"}
          }},
          {
          "mark": "line",
          "encoding": {
            "x": {"field": "datum", "type": "temporal"},
            "y": {"field": "intensity", "type": "quantitative",
               "scale": {"type": "linear"}
             },
           "color":{"value":"#ccaa00"}
            }
          },
          {
          "mark": "circle",
          "encoding": {
            "x": {"field": "datum", "type": "temporal"},
            "y": {"field": "hr", "type": "quantitative",
               "scale": {"type": "linear"}
             },
           "color":{"value":"#FF33DD"}
            }
          }
  ]
      }`},
      {
      'name':'10 Minute Average',
      'sqlText':`select avg(HEART_RATE) as hr, avg(raw_intensity) as intensity, avg(STEPS) as steps, datetime(avg(timestamp), 'unixepoch') as datum, timestamp
      from MI_BAND_ACTIVITY_SAMPLE
      where (timestamp between strftime('%s','now','-3 days') and strftime('%s','now','-0 days'))
group by timestamp/600;`,
      'vegaText':`{
        "data": {"values":  _data_ },
        "width": 820,
        "height": 620,
  "resolve":{"scale":{"y":"independent"}},
  "layer":[{
          "mark": "bar",
          "encoding": {
            "x": {"field": "datum", "type": "temporal"},
            "y": {"field": "steps", "type": "quantitative",
            "scale": {"type": "linear"}},
   "color": {"value": "#0099cc"}
          }},
          {
          "mark": "line",
          "encoding": {
            "x": {"field": "datum", "type": "temporal"},
            "y": {"field": "intensity", "type": "quantitative",
               "scale": {"type": "linear"}
             },
           "color":{"value":"#ccaa00"}
            }
          },
          {
          "mark": "circle",
          "encoding": {
            "x": {"field": "datum", "type": "temporal"},
            "y": {"field": "hr", "type": "quantitative",
               "scale": {"type": "linear"}
             },
           "color":{"value":"#FF33DD"}
            }
          }
  ]
      }`},
      {
      'name':'Steps and Intensity per Day',
      'sqlText':`select avg(raw_intensity) as intensity, sum(STEPS) as steps, datetime(avg(timestamp), 'unixepoch') as datum, timestamp
      from MI_BAND_ACTIVITY_SAMPLE
      where (timestamp between strftime('%s','now','-30 days') and strftime('%s','now','-0 days'))
group by timestamp/(3600*24);`,
      'vegaText':`{
        "data": {"values":  _data_ },
        "width": 820,
        "height": 620,
  "resolve":{"scale":{"y":"independent"}},
  "layer":[{
          "mark": "bar",
          "encoding": {
            "x": {"field": "datum", "type": "temporal"},
            "y": {"field": "steps", "type": "quantitative",
            "scale": {"type": "linear"}},
   "color": {"value": "#0099cc"}
          }},
          {
          "mark": "line",
          "encoding": {
            "x": {"field": "datum", "type": "temporal"},
            "y": {"field": "intensity", "type": "quantitative",
               "scale": {"type": "linear"}
             },
           "color":{"value":"#ccaa00"}
            }
          }
  ]
      }`},
      {
      'name':'everything and Kind per Minute',
      'sqlText':`select RAW_KIND as kind, HEART_RATE as hr, raw_intensity as intensity, STEPS as steps, datetime(timestamp, 'unixepoch') as datum, timestamp
      from MI_BAND_ACTIVITY_SAMPLE
      where (timestamp between strftime('%s','now','-.3 days') and strftime('%s','now','-0 days'));`,
      'vegaText':`{
        "data": {"values":  _data_ },
        "width": 820,
        "height": 620,
  "resolve":{"scale":{"y":"independent"}},
  "layer":[{
          "mark": "bar",
          "encoding": {
            "x": {"field": "datum", "type": "temporal"},
            "y": {"field": "steps", "type": "quantitative",
            "scale": {"type": "linear"}},
   "color": {"value": "#0099cc"}
          }},
          {
          "mark": "line",
          "encoding": {
            "x": {"field": "datum", "type": "temporal"},
            "y": {"field": "intensity", "type": "quantitative",
               "scale": {"type": "linear"}
             },
           "color":{"value":"#ccaa00"}
            }
          },
          {
          "mark": "circle",
          "encoding": {
            "x": {"field": "datum", "type": "temporal"},
            "y": {"field": "hr", "type": "quantitative",
               "scale": {"type": "linear"}
             },
           "color":{"value":"#FF33DD"}
            }
          },
          {
          "mark": "circle",
          "encoding": {
            "x": {"field": "datum", "type": "temporal"},
            "y": {"field": "kind", "type": "quantitative",
               "scale": {"type": "linear"}
             },
           "color":{"value":"#00FFDD"}
            }
          }
  ]
      }`},
      {
      'name':'Hours of Sleep last Month',
      'sqlText':`select count(RAW_KIND)/60.0 as hoursleep,  datetime(timestamp, 'unixepoch') as datum, timestamp
      from MI_BAND_ACTIVITY_SAMPLE
      where (RAW_KIND = 112) and (timestamp between strftime('%s','now','-30 days') and strftime('%s','now','-0 days'))
group by timestamp/(3600*24);`,
      'vegaText':`{
        "data": {"values":  _data_ },
        "width": 820,
        "height": 620,
  "resolve":{"scale":{"y":"independent"}},
  "layer":[{
          "mark": "bar",
          "encoding": {
            "x": {"field": "datum", "type": "temporal"},
            "y": {"field": "hoursleep", "type": "quantitative",
            "scale": {"type": "linear"}},
   "color": {"value": "#0099cc"}
          }}
  ]
      }`},

      {
        'name':'Hours of Sleep and minimal Heart Rate',
        'sqlText':`select min(HEART_RATE) as minhr, count(RAW_KIND)/60.0 as hoursleep,  datetime(timestamp, 'unixepoch') as datum, timestamp
        from MI_BAND_ACTIVITY_SAMPLE
        where (RAW_KIND = 112 or RAW_KIND = 122) and (timestamp between strftime('%s','now','-30 days') and strftime('%s','now','-0 days'))
  group by timestamp/(3600*24);`,
        'vegaText':`{
          "data": {"values":  _data_ },
          "width": 820,
          "height": 620,
    "resolve":{"scale":{"y":"independent"}},
    "layer":[{
            "mark": "bar",
            "encoding": {
              "x": {"field": "datum", "type": "temporal"},
              "y": {"field": "hoursleep", "type": "quantitative",
              "scale": {"type": "linear"}},
     "color": {"value": "#0099cc"}
            }},
  {
            "mark": "circle",
            "encoding": {
              "x": {"field": "datum", "type": "temporal"},
              "y": {"field": "minhr", "type": "quantitative",
              "scale": {"type": "linear"}},
     "color": {"value": "#FF3344"}
            }}
    ]
        }`},
        {
        'name':'Intensity Histogramm',
        'sqlText':`select raw_intensity as intensity, count(*) as c1,  datetime(timestamp, 'unixepoch') as datum, timestamp
        from MI_BAND_ACTIVITY_SAMPLE
        where (RAW_KIND = 112 or RAW_KIND = 122) and (timestamp between strftime('%s','now','-5 days') and strftime('%s','now','-0 days'))
  group by raw_intensity;`,
        'vegaText':`{
          "data": {"values":  _data_ },
          "width": 820,
          "height": 620,
    "resolve":{"scale":{"y":"independent"}},
    "layer":[{
            "mark": "bar",
            "encoding": {
              "x": {"field": "intensity", "type": "quantitative"},
              "y": {"field": "c1", "type": "quantitative",
              "scale": {"type": "log"}},
     "color": {"value": "#0099cc"}
            }}
    ]
        }`},
        {
        'name':'Steps Histogram',
        'sqlText':`select steps as steps, count(*) +1 as c1,  datetime(timestamp, 'unixepoch') as datum, timestamp
        from MI_BAND_ACTIVITY_SAMPLE
        where (timestamp between strftime('%s','now','-5 days') and strftime('%s','now','-0 days'))
  group by steps;`,
        'vegaText':`{
          "data": {"values":  _data_ },
          "width": 820,
          "height": 620,
    "resolve":{"scale":{"y":"independent"}},
    "layer":[{
            "mark": "bar",
            "encoding": {
              "x": {"field": "steps", "type": "quantitative"},
              "y": {"field": "c1", "type": "quantitative",
              "scale": {"type": "log"}},
     "color": {"value": "#0099cc"}
            }}
    ]
        }`},
        {
        'name':'Resting Heart Rate',
        'sqlText':`select min(hr) as mhr,datetime(avg(timestamp), 'unixepoch') as datum, timestamp from
        (select avg(HEART_RATE) as hr, datetime(avg(timestamp), 'unixepoch') as datum, timestamp from MI_BAND_ACTIVITY_SAMPLE
        where (timestamp between strftime('%s','now','-30 days') and strftime('%s','now','-0 days'))
        group by timestamp/600)
        group by timestamp/(3600*24);`,
        'vegaText':`{
          "data": {"values":  _data_ },
          "width": 820,
          "height": 620,
    "resolve":{"scale":{"y":"independent"}},
    "layer":[{
            "mark": "bar",
            "encoding": {
              "x": {"field": "datum", "type": "temporal"},
              "y": {"field": "mhr", "type": "quantitative",
              "scale": {"type": "linear"}},
     "color": {"value": "#0099cc"}
            }}
    ]
        }`},

      {
      'name':'Steps per minute',
      'sqlText':`select SUM(STEPS) as weeksteps, date(ROUND(AVG(timestamp)), 'unixepoch') as datum, timestamp
      from MI_BAND_ACTIVITY_SAMPLE
      where (timestamp between strftime('%s','now','-5 days') and strftime('%s','now','-0 days'))
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
      }`},
      {
      'name':'StepsPerHour-Logarithmic',
      'sqlText':`select SUM(STEPS)+1 as weeksteps, date(ROUND(AVG(timestamp)), 'unixepoch') as datum, timestamp
      from MI_BAND_ACTIVITY_SAMPLE
      where (timestamp between strftime('%s','now','-50 days') and strftime('%s','now','-0 days'))
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
      }`},{
      'name':'Miband - Steps and Heart Rate for 4 days in one chart',
      'sqlText':`select STEPS, timestamp, strftime('%Y-%m-%d %H:%M',timestamp, 'unixepoch')  as d2, HEART_RATE
      from MI_BAND_ACTIVITY_SAMPLE
      where (timestamp between strftime('%s','now','-5 days') and strftime('%s','now','-0 days'));`,
      'vegaText':`{
        "data": {"values":  _data_ ,
    "format": {
      "parse": {"d2": "utc:'%Y-%m-%d %H:%M'"}
    }},
        "width": 820,
        "height": 920,
"resolve":{"scale":{"y":"independent"}},
"layer":[{
        "mark": "bar",
        "encoding": {
          "x": {"field": "d2", "type": "temporal"},
          "y": {"field": "STEPS", "type": "quantitative",
          "scale": {"type": "linear"}},
 "color": {"value": "#0099cc"}
        }},
        {
        "mark": "circle",
        "encoding": {
          "x": {"field": "d2", "type": "temporal"},
          "y": {"field": "HEART_RATE", "type": "quantitative",
             "scale": {"type": "linear"}
           },
         "color":{"value":"#ccaa00"}
          }
        }
]
      }`},

  ]
  savedChartConfigs = [];

  vegaError = '';
  showSave:boolean=false;
  
  
  @ViewChild('dataSource') dataSource;

  constructor() { }

  ngOnInit() {
    this.loadChartConfigsFromLocalStorage();
    this.loadPreset(this.presetChartConfigs[0],false);
  }

  updateVegaText(event){
    console.log("updateVegaText:",event);
    this.vegaText=event;
  }

  updateData(event){
    this.data = event;
    this.drawChart(event);
  }

  updateSqlText(event) {
    this.sqlText = event;
  }

  loadPreset(preset, createChart=true){
    this.sqlText = preset.sqlText;
    this.vegaText = preset.vegaText;
    if (createChart){
      this.dataSource.executeSQLfromTextarea();
    }
  }

  drawChart(sdata=this.data){
    //console.log('this.vegaText',this.vegaText);
    //console.log('data to string: ', this.data.toString(), JSON.stringify(this.data));
    //console.log('data:', this.data);
    let spec:any;
    let vegaspec:any;
    this.vegaError = "";
    try {
      spec = this.vegaText.replace('_data_',JSON.stringify(sdata));
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
