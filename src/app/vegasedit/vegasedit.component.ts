import { Component, OnInit, event } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';

@Component({
  selector: 'app-vegasedit',
  templateUrl: './vegasedit.component.html',
  styleUrls: ['./vegasedit.component.css']
})
export class VegaseditComponent implements OnInit {

  vegaText =`{
    "data": {"values":  _data_ },
    "mark": "bar",
    "encoding": {
      "x": {"field": "datum", "type": "ordinal"},
      "y": {"field": "weeksteps", "type": "quantitative"}
    }
  };`

  @Output() vegaTextUpdate:EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  updateChart(){
    this.vegaTextUpdate.emit(this.vegaText);
  }

}
