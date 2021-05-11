import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-requirements',
  templateUrl: './company-requirements.component.html',
  styleUrls: ['./company-requirements.component.scss']
})
export class CompanyRequirementsComponent implements OnInit {

  pictograms = [
    {
      src: '/assets/icons/truck.svg',
      desc: `Wymaganie numer1
lorem ipsum`
    },
    {
      src: '/assets/icons/to-do-list.svg',
      desc: `Dolor sit amet
 ipsum dolor sit`
    },
    {
      src: '/assets/icons/no-phone.svg',
      desc: `When an unknown 
printer took`
    },
    {
      src: '/assets/icons/checked-in-o.svg',
      desc: `It is a long established
fact that`
    },
  ]

  constructor() { }

  ngOnInit() {
  }

}
