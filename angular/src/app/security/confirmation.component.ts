import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SecurityService } from './security.service';
import { MessagesService } from '../messages/messages.service';

@Component({
  templateUrl: './confirmation.component.html',
  styleUrls: ['./security.css'],
})
export class ConfirmationComponent implements OnInit {
  key:string;
  messages:Messages;
  constructor(private router:Router, private messagesService: MessagesService, private securityService:SecurityService, private activatedRoute:ActivatedRoute) {
     this.key = this.activatedRoute.snapshot.params['key']; 
  }
  ngOnInit() {
    this.messagesService.translate(new Messages()).subscribe(data=>this.messages = data);
    this.securityService.confirmEmail(this.key).subscribe(data=>this.confirmSuccess(data), err=>this.confirmErr(err))
    console.log(this.key);
  }
  confirmErr(err){
    console.log(err);
  }

  confirmSuccess(data)
  {
    if (data.status===true) {
       this.router.navigate(['/login', {emcom:1}]);
    }
    console.log(data);
  }
}
class Messages{
  thank_you = 'Email confirmed';
}