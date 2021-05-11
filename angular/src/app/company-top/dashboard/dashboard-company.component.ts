import { Component, OnInit, transition } from '@angular/core';
import { InfoBoxModel } from '../../top/info-box.model';
import { MessagesService } from '../../messages/messages.service';
import { MiscService } from '../../top/misc.service';
import { OrderModel } from '../../order/order.model';
import { OrderService } from '../../order/order.service';
import { OrderListFilterModel } from '../../order/order-list-filter.model';
import { AgoDateFormatComponent } from '../../ago-date-format/ago-date-format.component';
import { AgoDateFormatMessagesModel } from '../../ago-date-format/ago-date-format-messages.model';
import { ListOrderMessages } from '../../order/list/list-order.messages';
import { CategoryModel } from '../../category/category.model';
import { CategoryService } from '../../category/category.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard-company',
  templateUrl: './dashboard-company.component.html',
  styleUrls: ['./dashboard-company.component.scss']
})
export class DashboardCompanyComponent implements OnInit {
  infoBox:InfoBoxModel;
  constructor(private messagesService:MessagesService,
              private route: ActivatedRoute, 
              private router:Router, 
              private categoryService:CategoryService, 
              private orderService:OrderService, 
              private miscSerrvice:MiscService) { }
  messages:Messages;
  working = false;
  categories:CategoryModel[];
  agoDateFormatMessages: AgoDateFormatComponent;
  listOrderMessages:ListOrderMessages
  awaitingOrders:OrderModel[]=[];
  
  offeringOrders:OrderModel[]=[];
  loadingOffering = true;
  loadingAwaiting = true;

  onListOrderClick(id:number){
    
    this.router.navigate(['../order', id], {relativeTo: this.route});
  }

  ngOnInit() {
    this.working = true;
    this.categoryService.getCategories().subscribe(data=>this.categories = data);
    this.messagesService.translate(new AgoDateFormatMessagesModel()).subscribe(data=>this.agoDateFormatMessages = data);
    this.messagesService.translate(new ListOrderMessages()).subscribe(data=>this.listOrderMessages = data);
    
    this.orderService.filterOrder(new OrderListFilterModel('awaiting'), true).subscribe(data=>{this.loadingAwaiting=false; this.awaitingOrders = data; console.log(this.awaitingOrders)});
    this.orderService.filterOrder(new OrderListFilterModel('offering'), true).subscribe(data=>{this.loadingOffering=false; this.offeringOrders = data; console.log(this.offeringOrders);});
    this.messagesService.translate(new Messages()).subscribe(data=>{
      this.messages = data;
      this.miscSerrvice.getCompanyInfoBox().subscribe(data=>{
        this.infoBox = data;
        console.log('Info BOX');
        
        console.log(data);
        this.working = false;
      })
    })
  }
}
class Messages{
  dashboard = "Dashboard";
  working_fleet = "Working Fleet";
  your_rating = "Your Rating"
  income = "Income";
  orders = "Orders";
  cars = "cars";
  lat_three_months = "last month"
  compleated = "compleated";
  congratulations = "congratulations!"
  rating = "Rating";
  awaiting = "To Execute";
  offered = "Offered";
  orders_not_found = "Orders Not Found";
  offering = "Offering";
}