import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../messages/messages.service';
import { TrusteeListCompanyFilterModel } from './trustee-list-company-filter.model';
import { TrusteeListCompanyFilterService } from './trustee-list-company-filter.service';
import { CompanyProfileModel } from '../company/company-profile.model';
import { Router } from '@angular/router';

@Component({
  templateUrl: './trustee-list-company.component.html',
  styleUrls: ['./trustee-list-company.component.css']
})
export class TrusteeListCompanyComponent implements OnInit {
  companies:CompanyProfileModel[];
  messages:Messages;
  working=false;
  searching = false;
  filterObjModel = new TrusteeListCompanyFilterModel();
  
  fun:any;
  
  constructor(
    private msgSrv:MessagesService,
    private filterService:TrusteeListCompanyFilterService,
    private router: Router,
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
  
  profileClick(id:number){
   this.router.navigate(['/trustee/company', id]);
  }
  
  filter(){
    this.searching = true;
    if (this.fun)
      this.fun.unsubscribe();
    this.fun = this.filterService.filter(this.filterObjModel).subscribe(data=>{
      this.companies = data;
      console.log(data);
      this.searching = false;     
    });
  }
}
class Messages{
  filters = "Filters";
  company_name = "Company Name";
  telephone =  "Phone Number";
  contact_person = "Contact Person";
  vat_no = "Vat Number";
  no_result = "No result found";
  view_profile = "View Profile";
  general_rating = "General Rating";
  not_set = "Not Set";
  add_new = "Add New";
}
