import { Component, OnInit } from '@angular/core';

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

  }

}
