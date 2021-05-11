import { Component, OnInit, Input } from '@angular/core';
import { Helpers } from '../../tools/helpers';
import { FleetModel } from '../fleet.model';
import { FleetMessages } from '../fleet.messages';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'fleet-single',
  templateUrl: './fleet-single.component.html',
  styleUrls: ['./fleet-single.component.css']  
})
export class FleetSingleComponent implements OnInit {
  @Input() editable:false;
  @Input() fleetType:string;
  @Input() fleet:FleetModel;
  @Input() messages: FleetMessages;

  constructor(private router:Router, private route: ActivatedRoute) { }
  
  fleetClick(id:number){
    console.log('click');
    
    this.router.navigate(['..',id], { relativeTo: this.route });
  }

  ngOnInit() {
  }
}
