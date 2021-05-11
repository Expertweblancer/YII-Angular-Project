import { Component, OnInit, NgZone, animate, state, trigger, transition, style, keyframes } from '@angular/core';
import { AddressModel } from '../google-maps/address.model';
import { GoogleMapsComponent } from '../google-maps/google-maps.component';
import { SearchOrderService } from './search-order.service';
import { SearchOrderModel } from './search-order.model';
import { MapTools } from '../google-maps/map-tools';
import { Marker } from '../google-maps/marker.model';
import { OrderModel } from '../order/order.model';

@Component({
  selector: 'search-order',
  templateUrl: './search-order.component.html',
  styleUrls: ['./search-order.component.css'],

  animations:[
    trigger('focusPanel', [
      state('inactive', style({
        transform:'scale(1.0)'
      })),
      state('active', style({
        transform:'scale(1.1)'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out')),
    ]),
    trigger('popInAnimation', [
      transition('void => *', [
        animate(200, keyframes([
          style({opacity:.5, transform: 'scale(0)', offset:0}),
          style({opacity:1, transform: 'scale(1.1)', offset:0.8}),
          style({opacity:1, transform: 'scale(1.0)', offset:1}),
        ]))
      ])
    ]),
    trigger('enterRight', [
      transition('void => *', [
        animate(200),
        style({transform: 'translateX(-100%)'}),
      ])
    ])
  ]

})
export class SearchOrderComponent implements OnInit {
  fromAddress = new  AddressModel;
  toAddress   = new  AddressModel;
  distance : number;
  
  state='inactive';

  radius:number;
  searchResults:OrderModel[];
  constructor(private searchOrderService:SearchOrderService, private zone:NgZone) { }
  ngOnInit() {}

  private getResults(data:any){
    console.log(data);
    this.zone.run(()=>{
      if (data.status){
        this.searchResults=data.orders;
      }
    });
  }

  private onSearchSubmit(total_km:number){
    this.searchOrderService.getOrderAround(total_km, this.distance, this.fromAddress.lat, this.fromAddress.lng, 
            this.toAddress.lat, this.toAddress.lng, this.fromAddress.address, this.toAddress.address)
        .subscribe(data=>this.getResults(data), error=>console.log(error), ()=>console.log('search-finish'));
  }
  toggleState(){
    this.state=(this.state==='inactive'?'active':'inactive');
  }
  onDirectionSet(distance:number){
    this.zone.run(()=>{
        this.distance = Math.ceil(distance/1000);
    });
  }

  onFromPlacesChanged(a:AddressModel){
    this.zone.run(()=>{
      this.fromAddress = a;
    });
  }
  
  resultOrderClick(order:OrderModel) {
    console.log(order)
  }

  onToPlacesChanged(a:AddressModel){
    this.zone.run(()=>{
      this.toAddress = a;
    });
  }
}
