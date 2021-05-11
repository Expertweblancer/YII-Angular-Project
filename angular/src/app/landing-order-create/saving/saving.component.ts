import { Component, OnInit, Input } from '@angular/core';
import { LandingMessages } from '../landing-messages';

@Component({
  selector: 'saving',
  templateUrl: './saving.component.html',
  styleUrls: ['./saving.component.css'],
})
export class SavingComponent implements OnInit {
  @Input() messages:LandingMessages;
  constructor() { }

  ngOnInit() {
  }

}
