import { Component, OnInit, trigger, state, keyframes, transition, style, animate } from '@angular/core';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.css'],
  animations: [
   trigger('flyAnimation', [
    state('in', style({transform: 'translateX(0)'})),
    transition('void => *', [
      style({transform: 'translateX(-100%)'}),
      animate(100)
    ]),
    transition('* => void', [
      animate(100, style({transform: 'translateX(100%)'}))
    ])
  ])
],
})
export class OrderComponent implements OnInit {
  showNewFormView = true;
  showNewParcelView = false;
  insertedOrderID:number;
  
  state="inactive";

  constructor() {}
  ngOnInit() {}

  onAdded(added_id:number):void {
    this.showNewFormView = false;
    this.showNewParcelView = true;
    this.insertedOrderID = added_id;
  }
  onAddedParcel(added_id:number):void {
    this.showNewParcelView = false;
  }
  toggleState(){
    
  }
}
