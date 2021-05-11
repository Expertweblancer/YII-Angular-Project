import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ngb-alert',
  templateUrl: './ngb-alert.component.html',
  styleUrls: ['./ngb-alert.component.css'],
})
export class NgbAlertComponent implements OnInit {
  @Input() dismissible = false;
  @Input() type = 'info';

  constructor() { }

  ngOnInit() {
  }

}
