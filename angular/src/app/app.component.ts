import { Component, OnInit, OnDestroy, trigger, animate, style, transition, state } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cookie } from './tools/cookie';
import { AppDefinitions } from './definitions';
import { SecurityService } from './security/security.service';
import { MessageDefinitions } from './messages/message-definitions';
import { MessagesService } from './messages/messages.service';
import { Helpers } from './tools/helpers';
import { AppChangeService } from './app-change.service';
import { UserInfoModel } from './security/user-info.model';
import { Security } from './tools/security';
import { log } from 'util';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    animations: [
        trigger('animateDown', [
            transition('void => *', [
                style({ transform: 'translateY(-100%)' }),
                animate(500)
            ])
        ])
    ]
})

export class AppComponent implements OnInit, OnDestroy {
    working = false;
    isLoggedIn: boolean = false;
    showServerError = false;
    error_text: any;
    constructor(private router: Router, private route: ActivatedRoute,
        private securityService: SecurityService, private messagesService: MessagesService, private appChangeService: AppChangeService) {
        if (Cookie.getCookie(AppDefinitions.authKeyCookieName)
            && Cookie.getCookie(AppDefinitions.authKeyCookieName) !== '') {
            this.securityService.getUserInfo().subscribe(data => {
                if (!data.status) {
                    console.log('initialization but getprofile - no profile' + data.status)
                    this.logout();
                    return;
                }
                Security.setUserInfoCookies(data);
            }, err => {
                this.logout();
            }, )
        }

        appChangeService.changeEmitted$.subscribe(text => {
            console.log('callback err' + text);

            switch (text) {
                case this.appChangeService.events.logout: this.logout(); break;


                default:
                    if (text.indexOf(this.appChangeService.events.srv_error) != -1)
                        this.reportServerError(text.substring(this.appChangeService.events.srv_error.length));
            }
        });
    }

    reportServerError(err: string) {
        if (this.showServerError)
            return;
        console.log(err);
        this.error_text = err;
        this.working = false;

        // this.showServerError = true;
        this.logout(true)
    }

    ngOnInit() {
        this.router.events.subscribe(event => {
            this.isLoggedIn = Cookie.getCookie(AppDefinitions.authKeyCookieName) ? true : false;
        });
        // get url of backend        
    }

    ngOnDestroy() { }

    logout(emergency = false) {
        log('*logout!*')
        this.showServerError = false;
        this.working = true;
        this.isLoggedIn = true;
        if (emergency)
            Cookie.setAsName(AppDefinitions.emergencyLogout);
        if (Cookie.getCookie(AppDefinitions.authKeyCookieName))
            this.securityService.logout().subscribe(data => {
                Cookie.clearAllCookies()
                this.working = false;
                this.router.navigate(['/login']);
            }, err => {
                this.working = false;
                Cookie.clearAllCookies();
                if (err.status != 401) {
                    this.router.navigate(['/login']);
                }
            });
    }
}
class Messages {
    search_order = MessageDefinitions.search_order;
    new_order = "New Order";
    add_order = "Add Order";
    order_list = "Order List";
    panel = MessageDefinitions.panel;
    search = MessageDefinitions.search;
    logout = "Logout";
    profile = "Profile";
    see_all_notifications = "See all notifications";
    registration_succesfull = "Registration Successfull"
}