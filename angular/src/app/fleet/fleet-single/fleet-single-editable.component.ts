import { Component, OnInit, Input } from '@angular/core';
import { FleetModel } from '../fleet.model';
import { FleetMessages } from '../fleet.messages';
import { Router, ActivatedRoute } from '@angular/router';
import { Helpers } from '../../tools/helpers';
import { FleetService } from '../fleet.service';
import { Location } from '@angular/common';
import { CategoryModel } from '../../category/category.model';

@Component({
  selector: 'fleet-single-editable',
  templateUrl: './fleet-single-editable.component.html',
  styleUrls: ['./fleet-single.component.css']
})
export class FleetSingleEditableComponent implements OnInit {
  @Input() editable:false;
  @Input() fleetType:string;
  @Input() fleet:FleetModel;
  @Input() categories:CategoryModel[];
  @Input() messages: FleetMessages;
  

  deleting = false;
  confirmDelete = false;
  categoryString:string = "";

  constructor(private router:Router,private location:Location, private route:ActivatedRoute, private fleetService:FleetService) { }
  
  getFoto(foto:string){
    return Helpers.getImageLink(foto);
  }

  deleteFleet(){
    this.confirmDelete = true;
  }

  confirmAction(data){
    this.confirmDelete = false;
    if (data){
      this.deleting = true;
      this.fleetService.delete(this.fleet.id).subscribe(data=>{
        console.log(data);
        this.deleting = false;
        this.router.navigate(['../list'], {relativeTo:this.route});
      });
    }
  }

  editFleet(){
    this.router.navigate(['../edit', this.fleet.id], { relativeTo: this.route });
  }

  ngOnInit() {
    console.log('categories');
    console.log(this.categories);  
    if (this.categories)
      for (let i=0;i<this.categories.length;i++){
        this.categoryString += this.categories[i].text;
        if (this.categories.length-1!=i)
          this.categoryString+=", ";             
      }
    console.log(this.categoryString);
    
  }
}
