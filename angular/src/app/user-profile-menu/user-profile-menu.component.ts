import { Component, OnInit } from '@angular/core';
import { UserProfileService } from './user-profile-menu.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { AppChangeService } from '../app-change.service';

interface Position {
    x: number;
    y: number;
}

@Component({
  selector: 'user-profile-menu',
  templateUrl: './user-profile-menu.component.html',
  styleUrls: ['./user-profile-menu.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ transform: 'translateY(-10%)', opacity: 0 }),
          animate('120ms', style({ transform: 'translateY(0)', opacity: 1 }))
        ]),
        transition(':leave', [
          style({ transform: 'translateY(0)', opacity: 1 }),
          animate('120ms', style({ transform: 'translateY(-10%)', opacity: 0 }))
        ])
      ]
    )
  ]
})
export class UserProfileComponent implements OnInit {

    activePosition?: Position;

    constructor(public userPorfileMenuService: UserProfileService, public acs: AppChangeService) {
        userPorfileMenuService.userProfileMenuChange.subscribe(isVisible => {
            if (isVisible) {
                this.showMenu();
            }
        });
    }

    ngOnInit() {

    }

    showMenu() {
        const releaser = document.getElementById('user-menu-releaser');
        if (releaser) {
            const rect = releaser.getBoundingClientRect();
            this.activePosition = { x: rect.left - 13, y: rect.top + 34 }
            const handler = () => {
                this.activePosition = undefined;
                this.userPorfileMenuService.isUserProfileMenuVisible = false;
                document.removeEventListener('click', handler);
            }
            setTimeout(() => document.addEventListener('click', handler));
        }
    }

    logout() {
      this.acs.emitChange(this.acs.events.logout);
    }

}
