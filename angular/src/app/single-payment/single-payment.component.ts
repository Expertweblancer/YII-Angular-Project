import { Component, OnInit } from '@angular/core';
import { AppDefinitions } from '../definitions';
import { Cookie } from '../tools/cookie';
import { P24Service } from '../p24/p24.service';
import { Helpers } from '../tools/helpers';
import { SinglePaymentService } from './single-payment.service';
import { SinglePaymentModel } from './single-payment.model';
import { OrderModel } from '../order/order.model';
import { CustomerProfileService } from '../profile/customer/customer-profile.service';
import { CustomerProfileModel } from '../profile/customer/customer-profile.model';
import { CountryModel } from '../profile/country/country.model';
import { CountryService } from '../profile/country/country.service';
import { AddressService } from '../profile/address/address.service';
import { AddressModel } from '../profile/address/address.model';
import { P24Model } from '../p24/p24.model';


@Component({
  selector: 'single-payment',
  templateUrl: './single-payment.component.html',
  styleUrls: ['./single-payment.component.css']
})
export class SinglePaymentComponent implements OnInit{
  amount = 2*100;
  currency = 'PLN';
  model = new SinglePaymentModel();
  profile:CustomerProfileModel;
  working=false;
  country:CountryModel;
  address:AddressModel;
  lang = 'pl';
  
  p24Model = new P24Model();

  constructor(private singlePaymentService:SinglePaymentService, 
              private addressService:AddressService, 
              private countryService:CountryService, 
              private p24Service:P24Service,
              private customerProfileService:CustomerProfileService) {
  }

  ngOnInit(){    
    this.working = true;
    this.model.order_id = 1;
    this.model.amount = this.amount;
    this.model.order_id = 1;
    
    this.singlePaymentService.start(this.model).subscribe(data=>{
      this.model=data;
      console.log(data);
      
      this.customerProfileService.get().subscribe(data=>{
        this.profile = data;
        console.log(this.profile);
        
        this.addressService.get(this.profile.id_address).subscribe(data=>{
          this.address = data;
          this.countryService.getCountry(this.address.id_country).subscribe(data=>{
            this.country = data;
            this.p24Model.p24_pos_id = AppDefinitions.p24_pos_id;
            this.p24Model.p24_merchant_id = this.p24Model.p24_pos_id;

            this.p24Model.p24_client = this.profile.name + ' ' + this.profile.surname;
            this.p24Model.p24_address = this.address.address1;
            this.p24Model.p24_zip = this.address.postal;
            this.p24Model.p24_city = this.address.city;
            this.p24Model.p24_country = this.country.code;
            this.p24Model.p24_email = this.profile.email;

            this.p24Model.p24_description = "Shipme";
            this.p24Model.p24_url_return = Helpers.getBaseUrl()+'customer/payment-result';
            this.p24Model.p24_url_status = Helpers.getBackendUrl()+"payment-result/result";
            this.p24Model.p24_amount = this.amount.toString();
            this.p24Model.p24_currency = this.currency;
            this.p24Model.p24_session_id = this.model.session_id;
            this.p24Model.p24_sign = Helpers.md5(this.model.session_id+'|'+this.p24Model.p24_merchant_id+'|'+(this.amount)+'|'+this.currency+'|'+AppDefinitions.p24_crc); ;

            this.p24Service.init(this.p24Model).subscribe(data=>{
              console.log(data);
              
            }, err=>{
              console.log('error');
              console.log(err);
              
              
            });

            this.working= false;            
          })
        })
      })
    });   
  }
}
