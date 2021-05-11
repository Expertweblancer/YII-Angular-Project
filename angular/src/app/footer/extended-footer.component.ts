import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'extended-footer',
  templateUrl: '../../../../landing-angular/src/app/footer/footer.component.html',
})
export class ExtendedFooterComponent implements OnInit {

  constructor() { }
  
  link = "https://snarto.com/customer-how-it-works"

  ngOnInit() {

  }

}
