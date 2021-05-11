import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bottom-element',
  templateUrl: './bottom-element.component.html',
  styleUrls: ['./bottom-element.component.scss']
})
export class BottomElementComponent implements OnInit {
  @Input() isForCustomer: boolean;

  constructor() { }

  ngOnInit() { }

}
