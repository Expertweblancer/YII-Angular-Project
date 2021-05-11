import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { LoginModalService } from '../login-modal/login-modal.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
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
export class NavbarComponent implements OnInit {
  
  activeMenuType: string|undefined;
  hideMenuTimeout: number;

  constructor(public loginModalService: LoginModalService, private router: Router) {}

  ngOnInit() { }

  goTo(where: string){
    this.router.navigate([where]);
  }

  showMenu = (menuType?: string) => {
    if (menuType) {
      this.activeMenuType = menuType;
    }
    clearTimeout(this.hideMenuTimeout);
  }

  hideMenu = (timeout: number = 400) => {
    clearTimeout(this.hideMenuTimeout);
    this.hideMenuTimeout = window.setTimeout(() => {
      this.activeMenuType = undefined;
    }, timeout);
  }

  hideMenuForce = () => {
    // this.isMenuVisible = false;
    this.activeMenuType = undefined;
    clearTimeout(this.hideMenuTimeout);
  }

  showLoginModal = () => {
    this.loginModalService.setLoginModalVisibility(true);
  }

}
