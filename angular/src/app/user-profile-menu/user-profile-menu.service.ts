import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserProfileService {

  isUserProfileMenuVisible = false;
  userProfileMenuChange: Subject<boolean> = new Subject<boolean>();

  showUserProfileMenu() {
    this.isUserProfileMenuVisible = true;
    this.userProfileMenuChange.next(true);
  }

}