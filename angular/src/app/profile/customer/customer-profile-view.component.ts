import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Helpers } from '../../tools/helpers';
import { MessagesService } from '../../messages/messages.service';
import { CustomerProfileService } from './customer-profile.service';
import { CountryService } from '../country/country.service';
import { CustomerProfileModel } from './customer-profile.model';
import { CountryModel } from '../country/country.model';
import { AddressModel } from '../address/address.model';
import { AddressService } from '../address/address.service';

@Component({
  selector: 'app-customer-profile-view',
  templateUrl: './customer-profile-view.component.html'
})
export class CustomerProfileViewComponent implements OnInit {



  constructor(private messagesService:MessagesService, 
              private route: ActivatedRoute, 
              private addressService:AddressService,
              private customerProfileService:CustomerProfileService, 
              private countryService:CountryService) { }
  
  profile:CustomerProfileModel;
  address:AddressModel;
  messages:Messages;
  working=false;
  countryModel:CountryModel;
  
  getPhoto(f):string{
    return Helpers.getImageLink(f);
  }

  isMyProfile(){
    if (Helpers.isIdUserId(this.profile.user_id))
      return true;
  }

  ngOnInit() {
    this.working=true;
    this.messagesService.translate(new Messages()).subscribe(data=>this.messages=data);
    this.route.params.subscribe(params=>{
      let id = +params['id'];
      if (!id) 
        id = 0;
      this.customerProfileService.get(id).subscribe(data =>{
        console.log('customer profile downloaded');
        
        console.log(data);
        
        this.profile = data;
        if (this.profile.id_address) {
          this.addressService.get(this.profile.id_address).subscribe(data=>{
            this.address = data;
            if (this.address.id_country)
              this.countryService.getCountry(this.address.id_country).subscribe(data=>{
              this.countryModel = data;
              this.working = false;
            });
            else
              this.working = false;
          });
        } else
        this.working = false;
    });
      }, err=>this.working=false);
  }
}
class Messages{
  country="Country";
  general_rating = "General Rating";
  message = "Message";
  add_new_order = "Assign Order";
  name_and_surname = "Name and Surname";
  edit = "Edit";
}