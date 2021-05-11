import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'safety-intro',
  templateUrl: './safety-intro.component.html',
  styleUrls: ['./safety-intro.component.scss']
})
export class SafetyIntroComponent implements OnInit {
  @Input() startsFromRight;

  constructor() {}

  ngOnInit() {}

}
