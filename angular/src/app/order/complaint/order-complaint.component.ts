import { Component, OnInit,  Input, Output, EventEmitter } from '@angular/core';
import { OrderModel } from '../order.model';
import { OrderComplaintModel } from './order-complaint.model';
import { OrderComplaintService } from './order-complaint.service';

@Component({
  selector: 'order-complaint',
  templateUrl: './order-complaint.component.html',
  styleUrls: ['./order-complaint.component.css']
})
export class OrderComplaintComponent implements OnInit {
  messages = new Messages();
  cansend=false;
  working = false;
  @Input() order:OrderModel;
  @Output() onAction = new EventEmitter<boolean>();

  complaint = new OrderComplaintModel;

  constructor(private orderComplaintService:OrderComplaintService) { }
  
  ngOnInit() {
    this.working=true;
    this.complaint.order_id = this.order.id;
    this.complaint.isNewModel=true;
    this.orderComplaintService.get(this.order.id).subscribe(data=>{
      if (data.order_id){
        this.complaint = data;
        this.complaint.isNewModel = false;
      }  
      this.working=false;    
    }, ()=>{
    });
  }

  onFileUpload(data:any){
    this.complaint.filename = data[0];
  }
  
  onMessageChange(str:string){
    this.cansend=str.length>0;
  }

  cancel(){
    this.onAction.emit(null);
  }  
  
  ok(){
    if (!this.cansend)
      return;
    this.cansend = false;
    this.orderComplaintService.post(this.complaint).subscribe(data=>{
      this.cansend = true;      
      this.onAction.emit(true);
    });
  }
}
class Messages{
  report_complaint = "Report Complaint";
  mark_as_not_realized = "Order was not realized";
  send = "Send";
  cancel = "Cancel";
}