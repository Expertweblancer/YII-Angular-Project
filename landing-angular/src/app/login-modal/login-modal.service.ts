import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LoginModalService {

  isLoginModalVisible = false;
  loginModalVisibilityChange: Subject<boolean> = new Subject<boolean>();

  setLoginModalVisibility(isVisible: boolean) {
    this.isLoginModalVisible = isVisible;
    this.loginModalVisibilityChange.next(isVisible);
  }

}