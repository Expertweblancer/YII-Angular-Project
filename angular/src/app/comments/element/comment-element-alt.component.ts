import { Component, OnInit, Input } from '@angular/core';
import { CommentModel } from '../comment.model';
import { MessagesService } from '../../messages/messages.service';
import { CommentMessages } from './comment.messages';


@Component({
  selector: 'comment-element-alt',
  templateUrl: './comment-element-alt.component.html',
  styleUrls: ['./comment-element-alt.component.css']
})
export class CommentElementAltComponent implements OnInit {
  @Input() messages:CommentMessages;
  @Input() comment: CommentModel;
  working = false;

  constructor(private messagesService:MessagesService) { }

  ngOnInit() {
    if (!this.messages)
    this.messagesService.translate(new CommentMessages).subscribe(data=>this.messages = data)
  }
}
