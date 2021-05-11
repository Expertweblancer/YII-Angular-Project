import { Component, OnInit } from '@angular/core';
import { CustomerProfileModel } from '../customer/customer-profile.model';
import { MessagesService } from '../../messages/messages.service';
import { TrusteeListCustomerFilterModel } from './trustee-list-customer-filter.model';
import { TrusteeListCustomerFilterService } from './trustee-list-customer-filter.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './trustee-list-customer.component.html',
  styleUrls: ['./trustee-list-customer.component.css']
})
export class TrusteeListCustomerComponent implements OnInit {

  customers:CustomerProfileModel[];
  messages:Messages;
  working=false;
  searching = false;
  filterObjModel = new TrusteeListCustomerFilterModel();
  
  fun:any;
  
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private msgSrv:MessagesService,
    private filterService:TrusteeListCustomerFilterService
  ) { }

  ngOnInit() {
    this.working = true;
    this.msgSrv.translate(new Messages()).subscribe(data=>{
        this.messages = data;
        this.working = false;
        this.filter();
    });
  }

  formChange(){
    this.filter();
  }
  
  profileClick(profile:CustomerProfileModel){
    console.log(profile);
    
    if (profile.id)
      this.router.navigate(['../', profile.id], {relativeTo: this.route});
  }

  filter(){
    this.searching = true;
    if (this.fun)
      this.fun.unsubscribe();

    console.log(JSON.stringify(this.filterObjModel));
    
    this.fun = this.filterService.filter(this.filterObjModel).subscribe(data=>{
      this.customers = data;
      console.log(data);
      this.searching = false;     
    });
  }
}


class Messages{
  filters = "Filters";
  name = "Name";
  email = "Email";
  surname = "Surname";
  telephone =  "Phone Number";
  no_result = "No result found";
  view_profile = "View Profile";
  name_surname = "Name and Surname"
  general_rating = 'General Rating';
  not_set = "Not Set";
  add_new = "Add New";
}
