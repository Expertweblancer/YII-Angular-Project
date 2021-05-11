import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MessagesService } from '../../../messages/messages.service';
import { AddressModel } from '../../../google-maps/address.model';
import { OrderListFilterModel } from '../../order-list-filter.model';
import { GoogleMapsService } from '../../../google-maps/google-maps.service';


@Component({
  selector: 'order-filter-route',
  templateUrl: './order-filter-route.component.html',
  styleUrls: ['./order-filter-route.component.css']
})
export class OrderFilterRouteComponent implements OnInit {
  messages:Messages;
  fromAddress:AddressModel = new AddressModel();
  toAddress:AddressModel = new AddressModel();
  constructor(private mapsService:GoogleMapsService, private messagesService:MessagesService) { }  
  filterObjModel           = new OrderListFilterModel();
  @Output() onFilterChange = new EventEmitter<OrderListFilterModel>();
  

  onDintanceSet(data:number){
    console.log('got distance! '+data);
    
    this.filterObjModel.distance = data;
    this.onFilterChange.emit(this.filterObjModel);       
  }
  
  onFromPlaceChanged(addr:AddressModel){
    this.toAddress = addr;
    this.filterObjModel.start_lat = addr.lat;
    this.filterObjModel.start_lng = addr.lng;
  }

  onToPlaceChanged(addr:AddressModel){ 
    this.fromAddress = addr;
    this.filterObjModel.end_lat = addr.lat;    
    this.filterObjModel.end_lng = addr.lng; 
  }
  onDateChange(date){
    this.filterObjModel.date_execution = date;
    this.onFilterChange.emit(this.filterObjModel);
  }   
  
  ngOnInit() {
    this.messagesService.translate(new Messages()).subscribe(data=>this.messages = data);
  }
}
class Messages{
  from                  = "From";
  to                    = "To"
  date_delivery         = "Delivery Date";
  start_date            = "Start Date";
  beginning             = "Start Point";
  end                   = "Finish Point";
}