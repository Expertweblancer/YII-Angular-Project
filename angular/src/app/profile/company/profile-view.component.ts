import { Component, OnInit, Input, NgZone } from '@angular/core';
import { ProfileService } from './profile.service';
import { CompanyProfileModel } from './company-profile.model';
import { MessagesModel } from './profile-messages.model';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/switchMap';
import { CountryModel } from '../country/country.model';
import { CountryService } from '../country/country.service';
import { MessagesService } from '../../messages/messages.service';
import { AppDefinitions } from '../../definitions';
import { AddressModel } from '../address/address.model';
import { AddressService } from '../address/address.service';
import { Helpers } from '../../tools/helpers';
import { CommentsService } from '../../comments/comments.service';

@Component({
  selector: 'profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  working:boolean;
  imageLink:string;
  rating:number;
  messages = new MessagesModel();
  addressModel = new AddressModel();
  model:CompanyProfileModel;
  countryModel:CountryModel;
  constructor( private route          : ActivatedRoute, 
               private addressService : AddressService,
               private profileService : ProfileService,
               private commentService : CommentsService, 
               private zone           : NgZone,
               private countryService : CountryService,
               private ms             : MessagesService) { }

  getPhoto(){
    return Helpers.getBackendUrl()+'upload/'+this.model.foto;
  }

  isMyProfile(){
    if (Helpers.isIdProfileId(this.model.id))
      return true;
  }

  ngOnInit() {
    this.working = true;
    this.rating = 0;
    this.route.params.subscribe(params=>{
      let pid = params['id']?params['id']:0;
      this.profileService.get(pid).subscribe(data =>{
        this.model = data;
        this.commentService.getAverageRating(pid).subscribe(data=>{
          this.rating = +data.avg;
        });
        this.ms.translate(this.messages).subscribe(data=>{
          this.messages = data;
          if (this.model.id_address)
            this.addressService.get(this.model.id_address).subscribe(data=>{
              console.log(data);
              
              this.addressModel = data;
              this.countryService.getCountry(this.addressModel.id_country).subscribe(data => {
                this.countryModel = data;
                this.working = false
              })
            });
          });
      });
    });
  }
}
