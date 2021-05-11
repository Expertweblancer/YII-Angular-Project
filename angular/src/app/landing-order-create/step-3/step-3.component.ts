import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LandingMessages } from '../landing-messages';
import { ParcelModel } from '../../order/parcel/parcel.model';

@Component({
  selector: 'step-3',
  templateUrl: './step-3.component.html',
  styleUrls: ['./step-3.component.css'],
})
export class Step3Component implements OnInit {
  canNext = false;
  @Input() parcels: ParcelModel[];

  @Input()  messages:LandingMessages;
  @Output() onGoNext = new EventEmitter<ParcelModel[]>();
  @Output() onGoBack = new EventEmitter<boolean>();
  
  constructor() { }

  addParcel(){
    this.parcels.push(new ParcelModel());
  }

  removeParcel(id:number){
    this.parcels.splice(id, 1);
  }

  onSubmit(){
    let err = false;

    this.parcels.forEach(el=>{
      if (!el.depth || !el.width || !el.height || !el.weight)
        err = true;
    })

    if (!err)
    this.onGoNext.emit(this.parcels);
  }

  ngOnInit() {
    if (this.parcels.length == 0)
     this.parcels.push(new ParcelModel);
  }

  prev(){
    this.onGoBack.emit(true);
  }
}
