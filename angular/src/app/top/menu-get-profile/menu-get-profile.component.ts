import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SecurityService } from '../../security/security.service';
import { AppChangeService } from '../../app-change.service';
import { UserInfoModel } from '../../security/user-info.model';
import { Helpers } from '../../tools/helpers';
import { SystemMode } from '../system-mode';
import { MessagesService } from '../../messages/messages.service';
import { UserProfileService } from '../../user-profile-menu/user-profile-menu.service';

@Component({
  selector: 'menu-get-profile',
  templateUrl: './menu-get-profile.component.html',
  styleUrls: ['./menu-get-profile.component.scss'],
})
export class MenuGetProfileComponent implements OnInit, OnDestroy {

  constructor(private securityService:SecurityService, private acs:AppChangeService, private messagesService:MessagesService, public userProfileMenuService: UserProfileService) { }
  
  userInfo:UserInfoModel;
  working = false;
  subscr:any;
  foto:string;
  messages:Messages;
  
  mode = new SystemMode();
  
  loadProfile(){
    console.log("getting profile");
    this.working = true;
    this.securityService.getUserInfo().subscribe(data=>{
      if (!data.username){
        /*no profile - logout*/
        this.acs.emitChange('logout');
        return;
      };

      //console.log(data);
      
      this.working = false;
      this.userInfo = data;
      if (this.mode.is_company)
        this.foto=this.userInfo.company_logo;
      else
        this.foto = this.userInfo.foto;
    }, err=>{
      this.acs.emitChange(this.acs.events.srv_error);
    }, ()=>{
    })
  }
  ngOnDestroy(){
    if (this.subscr)
      this.subscr.unsubscribe();
  }
  ngOnInit() {
    this.messagesService.translate(new Messages).subscribe(data=>{
      this.messages = data;
    })
    this.subscr = this.acs.changeEmitted$.subscribe(text => {
      console.log('got event!');
      switch (text){
          case this.acs.events.reload_profile: this.loadProfile();break;
          }
      });
      this.loadProfile();
  }
  getPhoto(f):string{
    return Helpers.getImageLink(f);
   }
  userProfileMenuClick = () => {
    if (!this.userProfileMenuService.isUserProfileMenuVisible) {
      this.userProfileMenuService.showUserProfileMenu();
    }
  }
}
class Messages{
  your_account = "TWOJE KONTO";
}