import { Component, OnInit } from '@angular/core';


import vegaEmbed, { vega } from 'vega-embed';
import * as vegaLito from 'vega-lite';


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
    console.log("updateVegaText:",event);
    this.vegaText=event;
  }

  updateData(event){
    this.data = event;
  }

  drawChart(){
    console.log('this.vegaText',this.vegaText);
    console.log('data to string: ', this.data.toString(), JSON.stringify(this.data));
    console.log('data:', this.data);
    let spec = "https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json";
    spec = this.vegaText.replace('_data_',JSON.stringify(this.data));

    /*
    spec = `{
      "data": {"values":  [{"weeksteps":8333,"datum":"2018-02-21","TIMESTAMP":1519257583},{"weeksteps":89736,"datum":"2018-02-24","TIMESTAMP":1519647643}] },
      "mark": "bar",
      "encoding": {
        "x": {"field": "datum", "type": "ordinal"},
        "y": {"field": "weeksteps", "type": "quantitative"}
      }
  }`;*/

    let vegaspec = vegaLito.compile(JSON.parse(spec)).spec;

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

}
