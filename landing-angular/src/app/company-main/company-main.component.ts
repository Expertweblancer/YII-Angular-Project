import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-main',
  templateUrl: './company-main.component.html',
  styleUrls: ['./company-main.component.scss']
})
export class CompanyMainComponent implements OnInit {

  pictograms = [
    {
      src: '/assets/icons/truck.svg',
      desc: `Minimalizacja pustych
przebiegów floty`
    },
    {
      src: '/assets/icons/monitor.svg',
      desc: `Jedno narzędzie
do obsługi całej firmy`
    },
    {
      src: '/assets/icons/tag.svg',
      desc: `Dostęp do bogatej
bazy ogłoszeń`
    },
    {
      src: '/assets/icons/id-card.svg',
      desc: `Wsparcie
dyspozytorów`
    }
  ]

  constructor() { }

  ngOnInit() {
  }

}
