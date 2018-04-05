import { Component, OnInit, event } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';

@Component({
  selector: 'app-vegasedit',
  templateUrl: './vegasedit.component.html',
  styleUrls: ['./vegasedit.component.css']
})
export class VegaseditComponent implements OnInit {

  vegaText ='';

  @Output() vegaTextUpdate:EventEmitter = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  updateChart(){
    this.vegaTextUpdate.emit(this.vegaText);
  }

}
