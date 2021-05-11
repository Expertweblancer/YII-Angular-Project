import { Component, OnInit, TemplateRef } from '@angular/core';
import { InfoBoxModel } from '../../top/info-box.model';
import { MiscService } from '../../top/misc.service';
import { OrderService } from '../../order/order.service';
import { OrderListFilterModel } from '../../order/order-list-filter.model';
import { OrderModel } from '../../order/order.model';
import { AgoDateFormatMessagesModel } from '../../ago-date-format/ago-date-format-messages.model';
import { MessagesService } from '../../messages/messages.service';
import { ListOrderMessages } from '../../order/list/list-order.messages';
import { CategoryService } from '../../category/category.service';
import { CategoryModel } from '../../category/category.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './dashboard-customer.component.html',
  styleUrls: ['./dashboard-customer.component.scss']
})
export class DashboardCustomerComponent implements OnInit {
  infoBoxData:InfoBoxModel;
  working = false;
  messages = new Messages();
  orders:OrderModel[] = [];
  categories : CategoryModel[];
  listOrderMessages:ListOrderMessages;
  loadingOrders = true;
  areOrdersVisible = true;

  agoDateFormatMessages: AgoDateFormatMessagesModel;
  constructor( private router          : Router, 
               private route           : ActivatedRoute,
               private miscService     : MiscService, 
               private categoryService : CategoryService, 
               private messagesService : MessagesService, 
               private orderService    : OrderService) {
    
  }
  
  onListOrderClick(id:number){
    this.router.navigate(['../order', id], {relativeTo:this.route});
  }

  ngOnInit() {
    this.working = true;
    this.messagesService.translate(new Messages()).subscribe(data=>this.messages=data);
    this.loadingOrders = true;
    //getting order list data
    this.orderService.filterOrder(new OrderListFilterModel()).subscribe(data=>{
      this.messagesService.translate(new AgoDateFormatMessagesModel()).subscribe(data=>{
        this.agoDateFormatMessages = data;
        this.messagesService.translate(new ListOrderMessages()).subscribe(data=>{
          this.listOrderMessages = data;
          this.categoryService.getCategories().subscribe(data=>{
            this.categories = data;
            this.loadingOrders = false;
          })
        });
      });
      this.orders = data;
      this
    })
    
    this.miscService.getCustomerInfoBox().subscribe(data=>{
      this.infoBoxData = data;
      console.log(data);
      this.working = false;
    }),
    (err)=>{
      this.working = false;
    }
  }
}

class Messages{
  orders = "Orders";
  auctions = "Auctions";
  unpaid = "Unpaid";
  rating = "Rating";
  realized = "Realized"
  congratulations="Congratulations";
  open = "Open";
  realizing_orders="Realizing Orders";
  orders_realizing = "Currently Processed Orders"
  orders_not_found = "Orders Not Found";
}