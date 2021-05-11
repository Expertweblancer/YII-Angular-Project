import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../messages/messages.service';
import { EmployeesModel } from '../employees.model';
import { ProfileService } from '../../profile/company/profile.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent implements OnInit {
  messages:Messages;
  working = false;
  model:EmployeesModel[];
  constructor(
      private messagesService:MessagesService,
      private profileService:ProfileService,
      private router:Router,
      private route:ActivatedRoute,
  ) { }
  profileClick(id:number){
    this.router.navigate(['../',id], {relativeTo:this.route})
  }
  ngOnInit() {
    this.working = true;
    this.messagesService.translate(new Messages()).subscribe(data=>{
      this.messages = data;
      this.profileService.employeesList().subscribe(data=>{
        this.working = false;
        this.model = data;
        console.log(data);
      }
    )});
  }
}
class Messages{
  add_new         = "Add New";
  no_result_found = "You have not any result";
  username        = "Username";
  email           = "Email";
}