import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { MessagesService } from '../../../messages/messages.service';
import { OrderListFilterModel } from '../../order-list-filter.model';
import { CategoryModel } from '../../../category/category.model';
import { Helpers } from '../../../tools/helpers';
import { AddressModel } from '../../../profile/address/address.model';

@Component({
  selector: 'order-filter-place',
  templateUrl: './order-filter-place.component.html',
  styleUrls: ['./order-filter-place.component.css']
})
export class OrderFilterPlaceComponent implements OnInit {

  @Input() searching:boolean;
  @Input() categories:CategoryModel[];
  @Output() onFilterChange = new EventEmitter<OrderListFilterModel>();
  today:string = Helpers.formatDate();
  


  filterObjModel = new OrderListFilterModel();
  messages:Messages;
  working=false;
  angle:number;
  originDest = "from";



  onAngleChanged(radius){
    this.filterObjModel.radius = radius;
    if (this.filterObjModel.start_lat || this.filterObjModel.end_lat)
      this.onFilterChange.emit(this.filterObjModel)
  }

  onDateRangeChanged(val:any) {
    let dateFrom = Helpers.formatDate(val.args.newValue.from);
    let dateTo = Helpers.formatDate(val.args.newValue.to);
    
    console.log(val.args.newValue);

    this.filterObjModel.range_date = `${dateFrom} - ${dateTo}`;
    if (this.filterObjModel.start_lat || this.filterObjModel.end_lat)
      this.onFilterChange.emit(this.filterObjModel)
  }

  private rangeModel: Object = {};

  constructor(private messagesService:MessagesService) { 
    this.filterObjModel.status='open';
  }
  
  onPlaceChanged(address){
    this.filterObjModel.start_lat = this.filterObjModel.start_lng = this.filterObjModel.end_lat = this.filterObjModel.end_lng = null;
    if (this.originDest=='from'){
      this.filterObjModel.start_lat = address.lat;
      this.filterObjModel.start_lng = address.lng;
    } else {
      this.filterObjModel.end_lat = address.lat;
      this.filterObjModel.end_lng = address.lng;
    }
    this.onFilterChange.emit(this.filterObjModel);
  }

  origDestChange(od){
    this.originDest = od;
    if (od=='to'){
      this.filterObjModel.end_lat = this.filterObjModel.start_lat;
      this.filterObjModel.end_lng = this.filterObjModel.start_lng;
      this.filterObjModel.start_lat = this.filterObjModel.start_lng = null;
    } else {
      this.filterObjModel.start_lat = this.filterObjModel.end_lat;
      this.filterObjModel.start_lng = this.filterObjModel.end_lng;
      this.filterObjModel.end_lat = this.filterObjModel.end_lng = null;
    }
    if (this.filterObjModel.start_lat || this.filterObjModel.end_lat)
      this.onFilterChange.emit(this.filterObjModel);  
  }
  ngOnInit() {
    this.working=true;
    this.messagesService.translate(new Messages).subscribe(data  => { 
        this.messages = data;
      }, 
      error => console.log('getting translation error: '+error,
      () => console.log('FINISH WORKING!')
    ));
  }

}
class Messages{
  from = "From";
  to = "To";
  within = "Search Within [km]"
  city = "City"
  search_within = "Search within";
  address = "Address";
  date="Date";
}