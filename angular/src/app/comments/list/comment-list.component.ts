import { Component, OnInit, Input } from '@angular/core';
import { MessagesService } from '../../messages/messages.service';
import { CommentsService } from '../comments.service';
import { CommentModel } from '../comment.model';

@Component({
  selector: 'comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {

  @Input() company_id:number;
  commentsModel:CommentModel[];
  constructor(private messagesService:MessagesService, private commentsService:CommentsService) { }
  messages:Messages;
  working=false;

  ngOnInit() {
    this.working = true;
    this.messagesService.translate(new Messages()).subscribe(data=>this.messages = data);
    this.commentsService.getListByCompanyId(this.company_id).subscribe(data=>{
      this.commentsModel = data;
      this.working = false;
      console.log('comment list');
      
      console.log(this.commentsModel);
    });
  }
}

class Messages{
  comments = "Comments";
  date = "Date";
  order="Order";
  general_rating = "General Rating";
  you_have_no_comments = "No any comments.";  
}