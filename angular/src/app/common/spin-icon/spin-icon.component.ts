import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'spin-icon',
  templateUrl: './spin-icon.component.html',
  styleUrls: ['./spin-icon.component.css']
})
export class SpinIconComponent implements OnInit {
  @Input() working:boolean;
  constructor() { }

  ngOnInit() {
  }

}
