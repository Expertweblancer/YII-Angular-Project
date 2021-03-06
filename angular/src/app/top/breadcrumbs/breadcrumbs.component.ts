import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from "@angular/router";
import "rxjs/add/operator/filter";
import { MessagesService } from '../../messages/messages.service';

interface IBreadcrumb {
  label: string;
  params: Params;
  url: string;
}

@Component({
  selector: 'breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit {

  public breadcrumbs: IBreadcrumb[];
  messages:Messages;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messagesService:MessagesService
  ) {
    this.breadcrumbs = [];
  }


  ngOnInit() {
    const ROUTE_DATA_BREADCRUMB: string = "breadcrumb";
    this.messagesService.translate(new Messages).subscribe(data=>{
      this.messages=data;
    });

    this.breadcrumbs = this.getBreadcrumbs(this.activatedRoute.root);
    //subscribe to the NavigationEnd event
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      let root: ActivatedRoute = this.activatedRoute.root;
      this.breadcrumbs = this.getBreadcrumbs(root);
    });
  }

  getLabel(str){
    return this.messages[str];
  }

  private getBreadcrumbs(route: ActivatedRoute, url: string="", breadcrumbs: IBreadcrumb[]=[]): IBreadcrumb[] {
    const ROUTE_DATA_BREADCRUMB: string = "breadcrumb";

    //get the child routes
    let children: ActivatedRoute[] = route.children;
    
    //return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;
    }
    
    //iterate over each children
    for (let child of children) {
      //verify primary route
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }

      //verify the custom data property "breadcrumb" is specified on the route
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      //get the route's URL segment
      let routeURL: string = child.snapshot.url.map(segment => segment.path).join("/");

      //append route URL to URL
      url += `/${routeURL}`;

      //add breadcrumb
      let breadcrumb: IBreadcrumb = {
        label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        params: child.snapshot.params,
        url: url
      };
      
      breadcrumbs.push(breadcrumb);

      //recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }
  }

}

class Messages{
  sign_in = "Sign In";
  order = "Order";
  fleet="Fleet";
  new_element = "New";
  home="Home";
  invoices="Invoices";
  edit="Edit";
  view= "View";
  orders = "Orders";
  list = "List";
  search = "Search";
  dashboard = "Dashboard";
  notifications = "Notifications";
  payments = "Payments";
  profile ="Profile";
  messages = "Messages";
  order_list = "List of orders"
}