import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../messages/messages.service';

@Component({
  templateUrl: './page-not-found.component.html',
  styleUrls: ['../security/security.css']
})
export class PageNotFoundComponent implements OnInit {
  messages:Messages;
  constructor(private msgSrv: MessagesService) { }

  ngOnInit() {
    this.msgSrv.translate(new Messages()).subscribe(data=>{
      this.messages = data;
    })
  }
}

class Messages{
  not_found= "Page Not Found";
}