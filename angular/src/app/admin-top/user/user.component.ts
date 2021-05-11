import { Component, OnInit } from '@angular/core';
import { UserModel } from './user.model';
import { AdminUserService } from './admin-user.service';
import { Helpers } from '../../tools/helpers';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class AdminUserComponent implements OnInit {
  userProfiles:UserModel[];
  working = false;
  constructor(private userService:AdminUserService) { }
  formatTimestamp(timestamp:number){
    return Helpers.timestampToStrDate(timestamp);
  }
  ngOnInit() {
    this.working = true;
    this.userService.getUserList().subscribe(
      data => {
        this.working = false;
        this.userProfiles = data;
      },
      err => this.working = false
    );
  }
}
