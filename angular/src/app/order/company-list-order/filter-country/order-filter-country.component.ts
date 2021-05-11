import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MessagesService } from '../../../messages/messages.service';
import { CountryModel } from '../../../profile/country/country.model';
import { OrderListFilterModel } from '../../order-list-filter.model';
import { Helpers } from '../../../tools/helpers';
import { CategoryModel } from '../../../category/category.model';

@Component({
  selector: 'order-filter-country',
  templateUrl: './order-filter-country.component.html',
  styleUrls: ['./order-filter-country.component.css']
})
export class OrderFilterCountryComponent implements OnInit {
  @Input() countries:CountryModel[];
  @Input() searching:boolean;
  @Input() categories:CategoryModel[];
  @Output() onFilterChange = new EventEmitter<OrderListFilterModel>();

  today:string = Helpers.formatDate();

  filterObjModel = new OrderListFilterModel();
  messages:Messages;
  working=false;

  constructor(private messagesService:MessagesService) { 
    this.filterObjModel.status='open';
  }

  dateExecutionChange(val){
    console.log(val);
    this.filterObjModel.date_execution=Helpers.formatDate(val.args.newValue);
    this.onFilterChange.emit(this.filterObjModel);
  }
  
  countryFromChange(id){
    this.filterObjModel.from_country_id = id;
    console.log(this.filterObjModel);
    
    this.onFilterChange.emit(this.filterObjModel);
  }

  countryToChange(id){
    this.filterObjModel.to_country_id = id;
    console.log(this.filterObjModel);
    
    this.onFilterChange.emit(this.filterObjModel);
  }

  ngOnInit() {
    console.log(this.categories);
    
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
  country_from          = "From Country";
  country_to            = "To Country"
  filters               = "Filters";
  category              = "Category";
  route                 = "Route";
  date_order_execution  = "Order Execution Date";
  all_countries         = "-- All Countries --"
  date_execution        = "Execution Date";
  mark_all              = "Mark All";
  search = "Search"
}