import { Component, OnInit, Input } from '@angular/core';
import { CommentModel } from '../comment.model';
import { CommentMessages } from './comment.messages';
import { MessagesService } from '../../messages/messages.service';

@Component({
  selector: 'comment-element',
  templateUrl: './comment-element.component.html',
  styleUrls: ['./comment-element.component.css']
})
export class CommentElementComponent implements OnInit {
  @Input() messages:CommentMessages;
  @Input() comment: CommentModel;
  working = false;

  constructor(private messagesService:MessagesService) { }

  ngOnInit() {
    if (!this.messages)
      this.messagesService.translate(new CommentMessages).subscribe(data=>this.messages = data)
  }
  
}
