import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MessagesService } from '../messages/messages.service';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  messages: Messages;
  @Input() message:string;
  @Output() onAction= new EventEmitter<boolean>();
  
  constructor(private messagesService:MessagesService) { }

  ngOnInit() {
    this.messagesService.translate(new Messages).subscribe(data=>{
      this.messages = data;
      if (!this.message)
        this.message = this.messages.are_you_sure_you_want_to_delete;
    });
  }
  actionClick(action:boolean){
    this.onAction.emit(action);
  }
}

class Messages{
  are_you_sure_you_want_to_delete = "Are you sure you want to delete that element?";
  ok="OK";
  cancel="Cancel";
}