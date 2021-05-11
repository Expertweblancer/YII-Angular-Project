import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/switchMap';
import { OrderModel } from '../order.model';
import { CategoryModel } from '../../category/category.model';
import { OrderListFilterModel } from '../order-list-filter.model';
import { MessagesService } from '../../messages/messages.service';
import { OrderService } from '../order.service';
import { CategoryService } from '../../category/category.service';
import { AddressModel } from '../../google-maps/address.model';
import { MessageDefinitions } from '../../messages/message-definitions';
import { SystemMode } from '../../top/system-mode';
import { CountryModel } from '../../profile/country/country.model';
import { AgoDateFormatMessagesModel } from '../../ago-date-format/ago-date-format-messages.model';
import { ListOrderMessages } from '../list/list-order.messages';


@Component({
  templateUrl: './customer-list-order.component.html',
  styleUrls: ['../order.css']
})
export class CustomerListOrderComponent implements OnInit {
  messages            : Messages;
  orders              : OrderModel[] = [];
  categoryModel       : CategoryModel[] = [];
  numOrginalElements  : number;
  systemMode          = new SystemMode();
  filterObjModel      = new OrderListFilterModel();
  searching           = false;
  working             = false;
  countries           : CountryModel[];
  dispOrderState      : string;
  fun;
  agoComponentMessages:AgoDateFormatMessagesModel;
  listOrderMessages:ListOrderMessages;

  constructor ( private router: Router, 
                private zone:NgZone, 
                private route:ActivatedRoute, 
                private orderService:OrderService, 
                private messagesService:MessagesService,
                private categoryService:CategoryService) {}

  ngOnInit(): void {
    this.working = true;
    this.messagesService.translate(new AgoDateFormatMessagesModel()).subscribe(data => this.agoComponentMessages = data);
    this.messagesService.translate(new ListOrderMessages()).subscribe(data => this.listOrderMessages = data);
    this.categoryService.getCategories().subscribe(data=>{
      this.categoryModel = data;
       this.orderService.getNumOfOrders().subscribe(data=>{
         this.numOrginalElements = data.num;
         console.log(data);
         this.working = false;        
         this.route.queryParams.subscribe(params => {
           this.filterObjModel.status = params['action'];
           this.dispOrderState
           this.filterOrders();    
        });
     });
   });
    this.messagesService.translate(new Messages).subscribe(data  =>{
       this.messages = data;

    });
  }
  
  onListOrderClick(id:number){
    this.router.navigate(['../',id], { relativeTo: this.route });
  }

  formChange(event){
    this.filterOrders();
  }

  onFromPlacesChanged(event:AddressModel){
    this.filterObjModel.filterFromAddressModel =event;
    this.filterOrders();
  }

  onToPlacesChanged(event){
    this.filterObjModel.filterToAddressModel = event;
    this.filterOrders();
  }
  
  filterOrders(){
    this.searching = true;
    if (this.fun){
      this.fun.unsubscribe();
    }
    console.log(JSON.stringify(this.filterObjModel));
    this.fun = this.orderService.filterOrder(this.filterObjModel).subscribe(data=>{
      console.log(data);
      
      this.zone.run(()=>{
        this.orders = data;
        this.searching = false;
      })
    });
  }
}

class Messages{
  no_orders_info = MessageDefinitions.no_orders_info
  add_new_order  = 'Add New Order';
  delivery_from  = MessageDefinitions.delivery_from;
  delivery_to    = MessageDefinitions.delivery_to;
  date_added     = MessageDefinitions.date_added;
  save                  = MessageDefinitions.save;
  action                = MessageDefinitions.action;
  order                 = MessageDefinitions.order;
  new_order             = MessageDefinitions.new_order;
  name                  = "Name"
  filters               = "Filters";
  category              = "Category";
  starting_point        = "Starting Point";
  finishing_point       = "Finishing Point"
  route                 = "Route";
  date_order_execution  = "Order Execution Date";
  dimensions_loading    = "Dim. of the loading area";
  required_capacity     = "Requared Capacity";
  no_offer              = "-- no offers --";
  no_result             = "No orders found";
  orders                = "Orders";
}