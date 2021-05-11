import { Component, OnInit, Input } from '@angular/core';
import { LandingMessages } from '../landing-messages';

@Component({
  selector: 'summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
  @Input() messages: LandingMessages;
  constructor() { }

  ngOnInit() {
  }

}
