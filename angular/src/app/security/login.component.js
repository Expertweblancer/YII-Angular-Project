"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var login_service_1 = require('./login.service');
var user_1 = require('./user');
var cookie_1 = require('../api/cookie');
var definitions_1 = require('../definitions');
var router_1 = require('@angular/router');
var LoginComponent = (function () {
    function LoginComponent(loginService, router) {
        this.loginService = loginService;
        this.router = router;
        if (this.loginService.isLoggedIn())
            this.router.navigate(['/']);
        console.log(cookie_1.Cookie.getCookie(definitions_1.AppDefinitions.authKeyCookieName));
        console.log(cookie_1.Cookie.getCookie(definitions_1.AppDefinitions.authUserIdCookieName));
    }
    LoginComponent.prototype.loginSuccess = function (data) {
        console.log(JSON.stringify(data));
        console.log(data.auth_key);
        if (data.status === true) {
            console.log('login!!!');
            cookie_1.Cookie.setCookie(definitions_1.AppDefinitions.authKeyCookieName, data.auth_key.toString(), definitions_1.AppDefinitions.authCookieDaysExpire);
            cookie_1.Cookie.setCookie(definitions_1.AppDefinitions.authUserIdCookieName, data.uid.toString(), definitions_1.AppDefinitions.authCookieDaysExpire);
            location.reload();
        }
    };
    LoginComponent.prototype.loginCallError = function (error) {
    };
    LoginComponent.prototype.login = function (username, password) {
        var _this = this;
        this.loginService.login(username, password).subscribe(function (data) { return _this.loginSuccess(data); }, function (error) { return _this.loginCallError(error); }, function () { return console.log('login finished'); });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', user_1.User)
    ], LoginComponent.prototype, "user", void 0);
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'login-form',
            template: " \n    <div class=\"row\">\n    <p *ngIf=\"creditionals !== undefined\">{{creditionals.auth_key}}</p>\n        <div class=\"col-xs-4\">\n        <div class=\"form-group\">\n            <input class=\"form-control\" #username placeholder=\"username\">\n        </div>\n        <div class=\"form-group\">\n            <input type=\"password\" class=\"form-control\" #password ngControl='password' placeholder=\"password\">\n        </div>\n        <button (click)=\"login(username.value, password.value)\" class=\"btn btn-primary\">Login</button>\n    </div>\n    </div>\n    ",
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, router_1.Router])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map