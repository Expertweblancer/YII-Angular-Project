import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  constructor() { }
  
  text1:string;
  text2:string;
  opt:number;
  ngOnInit() {
  }
  onSubmit(){
    console.log(this.text1 + this.opt);
    
  }
}
