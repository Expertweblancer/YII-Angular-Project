import { Component, OnInit } from '@angular/core';
import { SinglePaymentService } from '../single-payment.service';
import { ActivatedRoute } from '@angular/router';
import { SinglePaymentModel } from '../single-payment.model';
import { MessagesService } from '../../messages/messages.service';
import { P24Service } from '../../p24/p24.service';
import { AppDefinitions } from '../../definitions';
import { Helpers } from '../../tools/helpers';
import { AppChangeService } from '../../app-change.service';

@Component({
  selector: 'app-payment-result',
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.css']
})
export class PaymentResultComponent implements OnInit {
  messages : Messages;
  success = false;
  working = false;

  constructor(private messagesService:MessagesService, 
              private p24Service:P24Service,  
              private route:ActivatedRoute, 
              private singlePaymentService:SinglePaymentService, 
              private acs:AppChangeService) { }

  model:SinglePaymentModel;

  ngOnInit() {
    this.working=true;
    this.messagesService.translate(new Messages()).subscribe(data=>{
      this.messages = data;
      this.route.queryParams.subscribe(params=>{
        let sid:string = params['sid'];
        
        if (sid)
          this.singlePaymentService.get(sid).subscribe(data=>{
            console.log(data);
            this.model = data;
            if (this.model.amount!=this.model.paid_amount){
              this.success=false;
              this.working = false;              
            }
            else
              {
                let currency = "PLN";
                let sign = Helpers.md5(this.model.session_id+'|'+AppDefinitions.p24_pos_id+'|'+(this.model.amount*100)+'|'+currency+'|'+AppDefinitions.p24_crc)
                this.p24Service.verify(AppDefinitions.p24_pos_id, AppDefinitions.p24_pos_id, this.model.session_id, this.model.amount.toString(), 'PLN', this.model.p24_oid, sign).subscribe(data=>{
                  console.log(data);
                  
                }, err=>{
                  console.log(err);
                  
                })
              }
          }); 
          else
            this.working = false; 
      })
    });
  }

}
class Messages{
  thank_you = "Thank you for your payment";
  payment_error = "There was error in your payment";
}