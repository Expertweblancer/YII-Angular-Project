import { Component, OnInit, OnDestroy } from '@angular/core';
import { FleetModel } from './fleet.model';
import { FleetService } from './fleet.service';
import { FleetTypeService } from './fleet-type.service';
import { FleetTypeModel } from './fleet-type.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { MessagesService } from '../messages/messages.service';
import { FleetOrderHistory } from './fleet-order-history.model';
import { FleetOrderCategoryService } from './fleet-order-category.service';
import { FleetOrderCategoryModel } from './fleet-order-category.model';
import { CategoryModel } from '../category/category.model';
import { Subscription } from 'rxjs/Rx';
import { FleetMessages } from './fleet.messages';
import { Helpers } from '../tools/helpers';

@Component({
  selector: 'fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.css']
})
export class FleetComponent implements OnInit, OnDestroy {
  fleetType:string = "";
  fleetModel:FleetModel;
  messages:FleetMessages;
  fleetOrderCategories:CategoryModel[];
  history:FleetOrderHistory[] = [];
  fleetNotFound = false;
  working=false;
  paramsSubscr:Subscription;

  constructor(private route:ActivatedRoute, 
              private router:Router, 
              private fleetService:FleetService, 
              private fleetOrderCategoryService:FleetOrderCategoryService,
              private fleetTypeService:FleetTypeService, 
              private messagesService:MessagesService) { }
ngOnDestroy(){
  if (this.paramsSubscr)
    this.paramsSubscr.unsubscribe();
}

getOrderCategoryIcon(id:number){
  return Helpers.getCategoryIcon(id);
}

ngOnInit() {
    this.working=true;
    this.messagesService.translate(new FleetMessages()).subscribe(data=>{
      this.messages = data;
      this.paramsSubscr = this.route.params.subscribe(params=>{
        this.fleetService.get(+params['id']).subscribe(data => {
         this.fleetModel = data; 
         this.fleetOrderCategoryService.getCategories(this.fleetModel.id).subscribe(data=>{
           this.fleetOrderCategories = data;
           this.fleetService.getHistory(this.fleetModel.id).subscribe(data=>{
             this.history = data;
             this.working = false;          
           });
         });
         this.fleetTypeService.getFleetType(this.fleetModel.id_type).subscribe(
           data=>this.fleetType=data.name, 
           err=>this.router.navigate['/fleet-all']);
         }, err=>{
           this.router.navigate(['../list;all'], {relativeTo:this.route});
         });
     });    
    });

  }
  formatDistance(d:number){
    return Math.round(d/1000);
  }
}