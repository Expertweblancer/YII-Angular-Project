import { NgModule }                               from '@angular/core';
import { RouterModule, Routes, CanActivate }      from '@angular/router';
import { LoginComponent }                         from './security/login.component';
import { FormOrderComponent }                     from './order/form-order.component';
import { OrderComponent }                         from './order/order.component';
import { SearchOrderComponent }                   from './search-order/search-order.component';
import { RegisterComponent }                      from './security/register.component';
import { ConfirmationComponent }                  from './security/confirmation.component';
import { ResendComponent }                        from './security/resend.component';
import { AllFleetComponent }                      from './fleet/all-fleet.component';
import { FleetComponent }                         from './fleet/fleet.component';
import { ResetPasswordRequestComponent }          from './security/reset-password-request.component';
import { ResetPasswordFormComponent }             from './security/reset-password-form.component';
import { AddNewFleetComponent }                   from './fleet/add-new-fleet.component';
import { RegisterFromInvitationComponent }        from './security/register-from-invitation.component';
import { CustomerTopComponent }                   from './customer-top/customer-top.component';
import { CompanyTopComponent }                    from './company-top/company-top.component';
import { AdminAuthManager }                       from './admin-auth-manager.service';
import { AdminTopComponent }                      from './admin-top/admin-top.component';
import { AdminUserComponent }                     from './admin-top/user/user.component';
import { TranslationComponent }                   from './admin-top/translation/translation.component';
import { CurrencyComponent }                      from './admin-top/currency/currency.component';
import { ViewOrderComponent }                     from './order/view/view-order.component';
import { PageNotFoundComponent }                  from './page-not-found/page-not-found.component';
import { DashboardCustomerComponent }             from './customer-top/dashboard-customer/dashboard-customer.component';
import { DashboardCompanyComponent }              from './company-top/dashboard/dashboard-company.component';
import { DashboardAdminComponent }                from './admin-top/dashboard-admin/dashboard-admin.component';
import { TrusteeAuthManager }                     from './trustee-auth-manager.service';
import { TrusteeTopComponent }                    from './trustee-top/trustee-top.component';
import { DashboardTrusteeComponent }              from './trustee-top/dashboard/dashboard.component';
import { CompanyListOrderComponent }              from './order/company-list-order/company-list-order.component';
import { ChangeLogComponent }                     from './change-log/change-log.component';
import { UserMessagesListComponent }              from './top/user-messages/list/user-messages-list.component';
import { UserMessagesViewComponent }              from './top/user-messages/view/user-messages-view.component';
import { EmployeesListComponent }                 from './employees/list/employees-list.component';
import { EmployeesFormComponent }                 from './employees/form/employees-form.component';
import { CompanyManualInvoicesComponent }         from './company-top/invoices/company-manual-invoices.component';
import { CompanyAuthManager }                     from './company-auth-manager.service';
import { CustomerAuthManager }                    from './customer-auth-manager.service';
import { ListNotificationsComponent }             from './top/notifications/list/list-notifications.component';
import { LoggedInAuthManager }                    from './logged-in-auth-manager.service';
import { ProfileViewComponent }                   from './profile/company/profile-view.component';
import { ProfileFormComponent }                   from './profile/company/profile-form.component';
import { CustomerProfileViewComponent }           from './profile/customer/customer-profile-view.component';
import { CustomerProfileFormComponent }           from './profile/customer/customer-profile-form.component';
import { TrusteeCreateCompanyFormComponent }      from './profile/company/trustee-create-company-form.component';
import { TrusteeCreateCustomerFormComponent }     from './profile/customer/trustee-create-customer-form.component';
import { TrusteeListCompanyComponent }            from './profile/list/trustee-list-company.component';
import { TrusteeListCustomerComponent }           from './profile/list/trustee-list-customer.component';
import { TopUniversalComponent }                  from './top-universal/top-universal.component';
import { SetupProfileComponent }                  from './top/setup-profile/setup-profile.component';
import { NoProfileAuthManager }                   from './no-profile-auth-manager.service';
import { TermsComponent }                         from './pages/terms/terms.component';
import { SinglePaymentComponent }                 from './single-payment/single-payment.component';
import { PaymentResultComponent }                 from './single-payment/result/payment-result.component';
import { EmployeesViewComponent } from './employees/view/employees-view.component';
import { CustomerListOrderComponent } from './order/customer-list-order/customer-list-order.component';
import { LandingOrderCreateComponent } from './landing-order-create/landing-order-create.component';

const routes: Routes = [
    /** Admin Menu */
{ path: '', redirectTo: 'admin', pathMatch: 'full' },
{ path: 'profile',                      component: SetupProfileComponent,  canActivate: [NoProfileAuthManager]},
{ path: 'login',                        component: LoginComponent },
{ path: 'create-order',                 component: LandingOrderCreateComponent },
{ path: 'terms',                        component: TermsComponent },
{ path: 'change-log',                   component: ChangeLogComponent },
{ path: 'register',                     component: RegisterComponent},
{ path: 'register-complete',            component: RegisterFromInvitationComponent },
{ path: 'reset-password-request',       component: ResetPasswordRequestComponent },
{ path: 'reset-password-form',          component: ResetPasswordFormComponent },
{ path: 'register',                     component: RegisterComponent },
{ path: 'resend',                       component: ResendComponent },
{ path: 'confirmation',                 component: ConfirmationComponent },
  {
    path: 'admin',                component: AdminTopComponent,             canActivate: [AdminAuthManager],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'messages/:id',     component: UserMessagesViewComponent,     canActivate: [AdminAuthManager] },
      { path: 'dashboard',        component: DashboardAdminComponent,       canActivate: [AdminAuthManager] },
      { path: 'user-list',        component: AdminUserComponent,            canActivate: [AdminAuthManager] },
      { path: 'translations',     component: TranslationComponent,          canActivate: [AdminAuthManager] },
      { path: 'currencies',       component: CurrencyComponent,             canActivate: [AdminAuthManager] },
    ]},

    /**company menu */
  {
    path: 'company', component: CompanyTopComponent,           canActivate: [CompanyAuthManager],data: {breadcrumb: "dashboard"},
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'payments',              component: SinglePaymentComponent,              canActivate: [CompanyAuthManager] },      
      { path: 'profile',               component: TopUniversalComponent,      canActivate: [CompanyAuthManager],
        children:[
          { path: '', redirectTo: 'view', pathMatch: 'full' },
          { path: 'edit',            component: ProfileFormComponent,      canActivate: [CompanyAuthManager] },
          { path: 'view',            component: ProfileViewComponent,      canActivate: [CompanyAuthManager] },
        ]
      },
      { path: 'employees',                     component: TopUniversalComponent,     canActivate: [CompanyAuthManager],
        children:[
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list',         component: EmployeesListComponent,     canActivate: [CompanyAuthManager] },
          { path: 'new',          component: EmployeesFormComponent,     canActivate: [CompanyAuthManager] },
          { path: 'edit/:id',     component: EmployeesFormComponent,     canActivate: [CompanyAuthManager] },
          { path: ':id',     component: EmployeesViewComponent,     canActivate: [CompanyAuthManager] },          
        ]
      },  
      { path: 'dashboard',                     component: DashboardCompanyComponent, canActivate: [CompanyAuthManager] },
      { path: 'invoices',                      component: CompanyManualInvoicesComponent, canActivate: [CompanyAuthManager], data: {breadcrumb: "invoices"} },
      { path: 'notifications',                 component: ListNotificationsComponent, canActivate: [CompanyAuthManager], data: {breadcrumb: "notifications"}},
      { path: 'messages',                      component: TopUniversalComponent,  canActivate: [CompanyAuthManager],data: {breadcrumb: "messages"}, 
        children:[
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list',                 component: UserMessagesListComponent,      canActivate: [CompanyAuthManager], data: {breadcrumb: "list" }},
          { path: 'view',                 component: UserMessagesViewComponent,      canActivate: [CompanyAuthManager], data: {breadcrumb: "view" }},
        ]
      },      
      { path:'fleet', component: TopUniversalComponent, canActivate:[CompanyAuthManager],data: {breadcrumb: "fleet"},
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full'},
          { path: 'new',                component: AddNewFleetComponent,           canActivate: [CompanyAuthManager], data: {breadcrumb: "new_element"}},
          { path: 'edit/:id',           component: AddNewFleetComponent,           canActivate: [CompanyAuthManager], data: {breadcrumb: "edit"} },
          { path: 'list',               component: AllFleetComponent,              canActivate: [CompanyAuthManager], data: {breadcrumb: "list"} },
          { path: ':id',                component: FleetComponent,                 canActivate: [CompanyAuthManager], data: {breadcrumb: "view"} },
        ]
      },
      { path: 'order',                    component: TopUniversalComponent,                canActivate: [CompanyAuthManager], data: {breadcrumb: "orders"},
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list',                 component: CompanyListOrderComponent,        canActivate: [CompanyAuthManager],  data: {breadcrumb: "order_list"} },
          { path: 'search',               component: CompanyListOrderComponent,        canActivate: [CompanyAuthManager],  data: {breadcrumb: "search"} },        
          { path: 'new',                  component: OrderComponent,                   canActivate: [CompanyAuthManager],  data: {breadcrumb: "new_element"} },  
          { path: ':id',                  component: ViewOrderComponent,               canActivate: [CompanyAuthManager],  data: {breadcrumb: "view"} },  
        ]
      }]
  },
  
  /**customer menu */
  {
    path: 'customer',                  component: CustomerTopComponent,             canActivate: [CustomerAuthManager],data: {breadcrumb: "dashboard"},
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'payment-result',        component: PaymentResultComponent },      
      { path: 'add-company-profile',   component: ProfileFormComponent,           canActivate: [CustomerAuthManager] },
      { path: 'dashboard',             component: DashboardCustomerComponent,     canActivate: [CustomerAuthManager], },
      { path: 'notifications',         component: ListNotificationsComponent,     canActivate: [CustomerAuthManager], data: {breadcrumb: "notifications"}, },
      { path: 'payments',              component: SinglePaymentComponent,         canActivate: [CustomerAuthManager], data: {breadcrumb: "payments"}, },
      { path: 'profile',               component: TopUniversalComponent,          canActivate: [CustomerAuthManager], data: {breadcrumb: "profile"},
        children:[
          { path: '', redirectTo: 'view', pathMatch: 'full' },
          { path: 'edit',              component: CustomerProfileFormComponent,      canActivate: [CustomerAuthManager], data: {breadcrumb: "edit"},},
          { path: 'view',              component: CustomerProfileViewComponent,      canActivate: [CustomerAuthManager], data: {breadcrumb: "view"}, },

        ]
      },
      { path: 'messages',              component: TopUniversalComponent,       canActivate: [CustomerAuthManager], data: {breadcrumb: "messages"},
        children:[
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list',              component: UserMessagesListComponent,      canActivate: [CustomerAuthManager],  data: {breadcrumb: "list"},},
          { path: 'view',              component: UserMessagesViewComponent,      canActivate: [CustomerAuthManager] , data: {breadcrumb: "view"},},
        ]
      },
      { path: 'invoices',              component: CompanyManualInvoicesComponent, canActivate: [CustomerAuthManager], data: {breadcrumb: "invoices"}, },
      { path: 'order',                 component: TopUniversalComponent,              canActivate: [CustomerAuthManager], data: {breadcrumb: "order"},
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list',              component: CustomerListOrderComponent,               canActivate: [CustomerAuthManager], data: {breadcrumb: "order_list"}, },
          { path: 'edit/new',          component: OrderComponent,                   canActivate: [CustomerAuthManager], data: {breadcrumb: "new_element"}, },  
          { path: 'edit/:id',          component: OrderComponent,                   canActivate: [CustomerAuthManager], data: {breadcrumb: "edit"}, },  
          { path: ':id',               component: ViewOrderComponent,               canActivate: [CustomerAuthManager], data: {breadcrumb: "view"}, },  
        ]}
    ]},
  
  /**trustee menu */
  {
    path: 'trustee',                       component: TrusteeTopComponent,         canActivate: [TrusteeAuthManager],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',                 component: DashboardTrusteeComponent,     canActivate: [TrusteeAuthManager], },
      { path: 'messages',                  component: UserMessagesListComponent,     canActivate: [TrusteeAuthManager] },
      { path: 'profile',                   component: TopUniversalComponent,           canActivate: [TrusteeAuthManager],
        children:[
          { path: '', redirectTo: 'view', pathMatch: 'full' },
          { path: 'edit',                  component: CustomerProfileFormComponent,      canActivate: [TrusteeAuthManager] },
          { path: 'view',                  component: CustomerProfileViewComponent,      canActivate: [TrusteeAuthManager] },
        ]
      },

      { path: 'messages/:id',              component: UserMessagesViewComponent,          canActivate: [TrusteeAuthManager] },
      { path: 'company',                   component: TopUniversalComponent,              canActivate: [TrusteeAuthManager],
        children:[
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'new' ,                  component: TrusteeCreateCompanyFormComponent,  canActivate: [TrusteeAuthManager]},
          { path: 'list',                  component: TrusteeListCompanyComponent,   canActivate: [TrusteeAuthManager]},
          { path: ':id',                   component: ProfileViewComponent,               canActivate: [TrusteeAuthManager],},
        ]
      },   
      { path: 'customer',                   component: TopUniversalComponent,              canActivate: [TrusteeAuthManager],
        children:[
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list',                  component: TrusteeListCustomerComponent,       canActivate: [TrusteeAuthManager]},
          { path: 'new',                   component: TrusteeCreateCustomerFormComponent, canActivate: [TrusteeAuthManager]},
          { path: ':id',                   component: CustomerProfileViewComponent,       canActivate: [TrusteeAuthManager],},
        ]},
      { path: 'order',                     component: TopUniversalComponent,                  canActivate: [TrusteeAuthManager],
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path:'list',              component: CustomerListOrderComponent,               canActivate: [TrusteeAuthManager] },
          { path: 'edit/new',         component: FormOrderComponent,                   canActivate: [TrusteeAuthManager] },  
          { path: 'edit/:id',         component: FormOrderComponent,                   canActivate: [TrusteeAuthManager] },  
          { path: ':id',              component: ViewOrderComponent,               canActivate: [TrusteeAuthManager] },  
      ]
  }]},
  { path: '**',                      component: PageNotFoundComponent },
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
