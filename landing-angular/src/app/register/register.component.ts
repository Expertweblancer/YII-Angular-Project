import { Component, OnInit } from '@angular/core';
import { LoginModalService } from '../login-modal/login-modal.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isReqChecked = false;
  isCompany = true;

  constructor(public loginModalService: LoginModalService) {}

  ngOnInit() {
  }

  onReqChange(isChecked: boolean) {
    this.isReqChecked = isChecked;
  }

  showLoginModal() {
    this.loginModalService.setLoginModalVisibility(true);
  }

}
