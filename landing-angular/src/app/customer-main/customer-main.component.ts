import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-main',
  templateUrl: './customer-main.component.html',
  styleUrls: ['./customer-main.component.scss']
})
export class CustomerMainComponent implements OnInit {

  pictograms = [
    {
      src: '/assets/icons/truck.svg',
      desc: `Darmowy dostęp do ofert
 wielu przewoźników`
    },
    {
      src: '/assets/icons/to-do-list.svg',
      desc: `Szybki wybór 
najkorzystniejszej oferty`
    },
    {
      src: '/assets/icons/no-phone.svg',
      desc: `Koniec z dzwonieniem
 do spedytorów`
    },
    {
      src: '/assets/icons/checked-in-o.svg',
      desc: `Pełna kontrola
 nad zamówieniem`
    }
  ]

  isSwitchCompanySelect = false;
  
  navCustomer = true;
 
  constructor() { }

  ngOnInit() {
    // @ts-ignore
    window.scroll(0, 0);
  }

}
