import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OrderModel } from '../order.model';
import { CategoryModel } from '../../category/category.model';
import { OrderListFilterModel } from '../order-list-filter.model';
import { MessagesService } from '../../messages/messages.service';
import { OrderService } from '../order.service';
import { CategoryService } from '../../category/category.service';
import { AddressModel } from '../../google-maps/address.model';
import { MessageDefinitions } from '../../messages/message-definitions';
import { CountryModel } from '../../profile/country/country.model';
import { CountryService } from '../../profile/country/country.service';
import { Subscription } from 'rxjs/Rx';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { AgoDateFormatMessagesModel } from '../../ago-date-format/ago-date-format-messages.model';
import { FleetModel } from '../../fleet/fleet.model';
import { FleetService } from '../../fleet/fleet.service';
import 'rxjs/add/operator/switchMap';
import { ListOrderMessages } from '../list/list-order.messages';

@Component({
  selector: '../order.css',
  templateUrl: './company-list-order.component.html',
  styleUrls: ['./company-list-order.component.css']
})
export class CompanyListOrderComponent implements OnInit, OnDestroy {
  messages: Messages;
  listOrderMessages: ListOrderMessages;

  orders: OrderModel[] = [];
  loadOrderModel: OrderModel[] = [];

  selectedOrder: OrderModel = new OrderModel();
  numOrginalElements: number;
  categoryModel: CategoryModel[];
  filterMode: string = 'country';
  searching = false;
  showView = false;
  filterObjModel = new OrderListFilterModel();
  filterObjectModelFromFilterComponent = new OrderListFilterModel();
  agoComponentMessages: AgoDateFormatMessagesModel;

  filterCategories: string[];
  fleetFilterActiveIndex = -1;
  showLoading = 1;
  countries: CountryModel[];
  working = false;
  init = true;
  action: string;
  showFilterPanel = false;

  // subscription helpers
  fun;

  timerSubscr: Subscription;
  routeSubscr: Subscription;

  constructor(private router: Router,
    private zone: NgZone,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private messagesService: MessagesService,
    private categoryService: CategoryService,
    private countryService: CountryService,
    private fleetService: FleetService) { }

  setFilterCategories(data) {
    this.filterCategories = data;
    this.filterObjModel.categories = this.filterCategories;
    this.filterOrders();
  }

  toggleFilterFleet(index) {
    this.filterObjModel.categories = this.filterCategories;
    this.fleetFilterActiveIndex = index;
    this.filterOrders();
  }
  removeFleet(index) { }

  setFilterObject(obj) {
    this.filterObjectModelFromFilterComponent = obj;
    this.filterObjModel.date_execution = this.filterObjectModelFromFilterComponent.date_execution;
    this.filterObjModel.from_country_id = this.filterObjectModelFromFilterComponent.from_country_id;
    this.filterObjModel.to_country_id = this.filterObjectModelFromFilterComponent.to_country_id;
    this.filterObjModel.start_lat = this.filterObjectModelFromFilterComponent.start_lat;
    this.filterObjModel.start_lng = this.filterObjectModelFromFilterComponent.start_lng;
    this.filterObjModel.end_lat = this.filterObjectModelFromFilterComponent.end_lat;
    this.filterObjModel.end_lng = this.filterObjectModelFromFilterComponent.end_lng;
    this.filterObjModel.categories = this.filterCategories;
    this.filterObjModel.radius = this.filterObjectModelFromFilterComponent.radius;
    this.filterObjModel.range_date = this.filterObjectModelFromFilterComponent.range_date;
    this.filterObjModel.distance = this.filterObjectModelFromFilterComponent.distance;
    this.filterOrders();
  }
  ngOnDestroy() {
    if (this.timerSubscr)
      this.timerSubscr.unsubscribe();
    if (this.routeSubscr)
      this.routeSubscr.unsubscribe();
  }
  
  setFilterMode(type:string){
    if (type === this.filterMode)
      return
    this.filterMode = type;
    this.filterObjModel = new OrderListFilterModel();
    this.filterOrders();
  }

  ngOnInit(): void {
    this.working = true;
    this.routeSubscr = this.route.queryParams.subscribe(params => {
      if (params['action']) {
        this.filterObjModel.status = params['action'];
      } else
        this.filterObjModel.status = 'open';

      //get fleet if not yet in fleet filter array
      // in the futur there will be more fleets in that  array
      if (params['fid']) {
        let found = false;
      }

      if (this.filterObjModel.status == 'open') {
        this.showFilterPanel = true;
        //we can check list freequently
        this.working = true;
        // init false, byTimer true
        this.timerSubscr = TimerObservable.create(30000,30000).subscribe(() => this.filterOrders(false, true));
      }
      this.filterOrders(true);
    });

    this.countryService.getCountries().subscribe(data => {
      this.countries = data;
      this.messagesService.translate(new AgoDateFormatMessagesModel).subscribe(data => this.agoComponentMessages = data);
      this.messagesService.translate(new ListOrderMessages).subscribe(data => this.listOrderMessages = data);
      this.messagesService.translate(new Messages).subscribe(data => {
        this.messages = data;
        this.categoryService.getCategories().subscribe(data => {
          this.categoryModel = data;
          this.working = false;
        });
      },
        error => console.log('getting translation error:' + error)
      );
    });
  }

  filterOrders(init = false, byTimer = false) {
    if (byTimer == false)
      this.searching = true;
    if (this.fun) {
      this.fun.unsubscribe();
    }
    this.fun = this.orderService.filterOrder(this.filterObjModel, true).subscribe(data => {
      this.orders = data;
      console.log(data);
      if (init && this.orders.length == 0)
        this.showFilterPanel = false;
      this.searching = false;
    }, err => {
      this.searching = false;
      console.log(err);
    }, () => this.searching = false);
  }

  onListOrderClick(id: number) {
    this.router.navigate(['../', id], { relativeTo: this.route });
  }
}

class Messages {
  no_orders_info = MessageDefinitions.no_orders_info
  add_new_order = 'Add New Order';
  order = MessageDefinitions.order;
  country_from = "From Country";
  country_to = "To Country"
  filters = "Filters";
  category = "Category";
  route = "Route";
  date_order_execution = "Order Execution Date";
  dimensions_loading = "Dim. of the loading area";
  required_capacity = "Requared Capacity";
  date_execution = "Date Execution";
  no_result = "No orders found";
  place = "Place";
  country = "Country";
  list_of_orders = "List Of Orders";
  search = "Search";
  parameters = "Parameters";
  choose = "Choose";
  general_filter = "General Filter"
}

