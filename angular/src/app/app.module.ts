import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './security/login.component';
import { SecurityService } from './security/security.service';
import { AppRoutingModule } from './app-routing.module';
import { OrderService } from './order/order.service';
import { FormOrderComponent } from './order/form-order.component';
import { CategoryService } from './category/category.service';
import { OrderComponent } from './order/order.component';
import { GoogleMapsComponent } from './google-maps/google-maps.component';
import { ErrandComponent } from './errand/errand.component';
import { SearchComponent } from './errand/search.component';
import { ListComponent } from './errand/list.component';
import { MessagesService } from './messages/messages.service';
import { SearchOrderComponent } from './search-order/search-order.component';
import { AutocompleteComponent } from './google-maps/autocomplete.component';
import { SearchOrderService } from './search-order/search-order.service';
import { LoaderComponent } from './top/loader/loader.component';
import { RegisterComponent } from './security/register.component';
import { SearchDetailsComponent } from './search-order/search-details.component';
import { CheckNameDirective } from './directives/check-name.directive';
import { P24Component } from './p24/p24.component';
import { P24Service } from './p24/p24.service';
import { ConfirmationComponent } from './security/confirmation.component';
import { ResendComponent } from './security/resend.component';
import { ResetPasswordFormComponent } from './security/reset-password-form.component';
import { ResultsComponent } from './search-order/results.component';
import { FleetComponent } from './fleet/fleet.component';
import { AllFleetComponent } from './fleet/all-fleet.component';
import { AddNewFleetComponent } from './fleet/add-new-fleet.component';
import { FleetService } from './fleet/fleet.service';
import { FleetTypeService } from './fleet/fleet-type.service';
import { ResetPasswordRequestComponent } from './security/reset-password-request.component';
import { AppChangeService } from './app-change.service';
import { FleetSingleComponent } from './fleet/fleet-single/fleet-single.component';
import { FleetSingleEditableComponent } from './fleet/fleet-single/fleet-single-editable.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { RegisterFromInvitationComponent } from './security/register-from-invitation.component';
import { CustomerTopComponent } from './customer-top/customer-top.component';
import { CompanyTopComponent } from './company-top/company-top.component';
import { OrderListComponent } from './company-top/order-list/order-list.component';
import { MenuGetProfileComponent } from './top/menu-get-profile/menu-get-profile.component';
import { TrusteeTopComponent } from './trustee-top/trustee-top.component';
import { AdminTopComponent } from './admin-top/admin-top.component';
import { AdminAuthManager } from './admin-auth-manager.service';
import { AdminService } from './admin-top/admin.service';
import { AdminUserService } from './admin-top/user/admin-user.service';
import { AdminUserComponent } from './admin-top/user/user.component';
import { TranslationComponent } from './admin-top/translation/translation.component';
import { TranslationService } from './admin-top/translation/translation.service';
import { PaymentTypesService } from './common/payment-types.service';
import { CurrencyService } from './common/currency.service';
import { CurrencyComponent } from './admin-top/currency/currency.component';
import { FileUploadService } from './common/file-upload.service';
import { FileUploadComponent } from './common/file-upload.component';
import { OrderAttachmentsService } from './order/other/order-attachments.service';
import { OrderTimeService } from './order/other/order-time.service';
import { ViewOrderComponent } from './order/view/view-order.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ParcelService } from './order/parcel/parcel.service';
import { TrusteeAuthManager } from './trustee-auth-manager.service';
import { InLoaderComponent } from './top/loader/in-loader.component';
import { DashboardCustomerComponent } from './customer-top/dashboard-customer/dashboard-customer.component';
import { DashboardCompanyComponent } from './company-top/dashboard/dashboard-company.component';
import { DashboardAdminComponent } from './admin-top/dashboard-admin/dashboard-admin.component';
import { DashboardTrusteeSearchService } from './trustee-top/dashboard/dashboard-search.service';
import { DashboardTrusteeSearchResultComponent } from './trustee-top/dashboard/search-result/search-result.component';
import { DashboardTrusteeComponent } from './trustee-top/dashboard/dashboard.component';
import { CommentsService } from './comments/comments.service';
import { CompanyListOrderComponent } from './order/company-list-order/company-list-order.component';
import { OrderOfferService } from './order/offer/order-offer.service';
import { OrderOfferElementComponent } from './order/offer/element/order-offer-element.component';
import { ChooseOfferBoxComponent } from './order/offer/choose/choose-offer-box.component';
import { ChangeLogComponent } from './change-log/change-log.component';
import { ChangeLogService } from './change-log/change-log.service';
import { UserMessageService } from './top/user-messages/user-message.service';
import { UserMessagesMenuComponent } from './top/user-messages/menu/user-messages-menu.component';
import { UserMessagesListComponent } from './top/user-messages/list/user-messages-list.component';
import { UserMessagesViewComponent } from './top/user-messages/view/user-messages-view.component';
import { AgoDateFormatComponent } from './ago-date-format/ago-date-format.component';
import { EmployeesListComponent } from './employees/list/employees-list.component';
import { EmployeesFormComponent } from './employees/form/employees-form.component';
import { EmployeesService } from './employees/employees.service';
import { InviteService } from './employees/invite.service';
import { CompanyManualInvoicesComponent } from './company-top/invoices/company-manual-invoices.component';
import { MenuNotificationsComponent } from './top/notifications/menu/menu-notifications.component';
import { ListNotificationsComponent } from './top/notifications/list/list-notifications.component';
import { NotificationPromptComponent } from './top/notifications/prompt/notification-prompt.component';
import { ManualInvoiceService } from './company-top/invoices/manual-invoice.service';
import { CustomerAuthManager } from './customer-auth-manager.service';
import { CompanyAuthManager } from './company-auth-manager.service';
import { SelectModule } from 'ng2-select-compat';
import { FleetOrderCategoryService } from './fleet/fleet-order-category.service';
import { CountryService } from './profile/country/country.service';
import { ProfileViewComponent } from './profile/company/profile-view.component';
import { ProfileFormComponent } from './profile/company/profile-form.component';
import { ProfileService } from './profile/company/profile.service';
import { AddressService } from './profile/address/address.service';
import { ProfileUserComponent } from './profile/user/profile-user.component';
import { ProfileAddressComponent } from './profile/address/profile-address.component';
import { CustomerProfileViewComponent } from './profile/customer/customer-profile-view.component';
import { CustomerProfileFormComponent } from './profile/customer/customer-profile-form.component';
import { CustomerProfileService } from './profile/customer/customer-profile.service';
import { TrusteeCreateCompanyFormComponent } from './profile/company/trustee-create-company-form.component';
import { TrusteeCreateCustomerFormComponent } from './profile/customer/trustee-create-customer-form.component';
import { TrusteeListCompanyComponent } from './profile/list/trustee-list-company.component';
import { TrusteeListCompanyFilterService } from './profile/list/trustee-list-company-filter.service';
import { TrusteeListCustomerComponent } from './profile/list/trustee-list-customer.component';
import { TrusteeListCustomerFilterService } from './profile/list/trustee-list-customer-filter.service';
import { TopUniversalComponent } from './top-universal/top-universal.component';
import { SetupProfileComponent } from './top/setup-profile/setup-profile.component';
import { NoProfileAuthManager } from './no-profile-auth-manager.service';
import { SetupCustomerProfileComponent } from './top/setup-profile/setup-customer-profile.component';
import { SetupCompanyProfileComponent } from './top/setup-profile/setup-company-profile.component';
import { ImageUploadComponent } from './common/image-upload/image-upload.component';
import { NotificationsService } from './top/notifications/notifications.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OrderOfferFormComponent } from './order/offer/form/order-offer-form.component';
import { TermsComponent } from './pages/terms/terms.component';
import { OrderFilterCountryComponent } from './order/company-list-order/filter-country/order-filter-country.component';
import { SpinIconComponent } from './common/spin-icon/spin-icon.component';
import { CommentsFormComponent } from './comments/form/comments-form.component';
import { CommentElementComponent } from './comments/element/comment-element.component';
import { CommentListComponent } from './comments/list/comment-list.component';
import { CommentElementAltComponent } from './comments/element/comment-element-alt.component';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { RatingModule } from "ngx-rating";
import { TruncatePipe } from './shared/truncate.pipe';
import { OrderFilterRouteComponent } from './order/company-list-order/filter-route/order-filter-route.component';
import { MiscService } from './top/misc.service';
import { OrderComplaintComponent } from './order/complaint/order-complaint.component';
import { OrderComplaintService } from './order/complaint/order-complaint.service';
import { FilterCategoriesComponent } from './order/company-list-order/filter-categories/filter-categories.component';
import { SinglePaymentComponent } from './single-payment/single-payment.component';
import { SinglePaymentService } from './single-payment/single-payment.service';
import { PaymentResultComponent } from './single-payment/result/payment-result.component';
import { EmployeesViewComponent } from './employees/view/employees-view.component';
import { OrderFilterPlaceComponent } from './order/company-list-order/filter-place/order-filter-place.component';
import { BreadcrumbsComponent } from './top/breadcrumbs/breadcrumbs.component';
import { GoogleMapsService } from './google-maps/google-maps.service';
import { CustomerListOrderComponent } from './order/customer-list-order/customer-list-order.component';
import { ListOrderComponent} from './order/list/list-order.component'
import { ExtendedFooterComponent } from './footer/extended-footer.component';
import { ScrollToBottomDirective } from './directives/scroll-to-bottom.directive';
import { RegistrationPlateComponent } from './fleet/registration-plate/registration-plate.component';
import { LandingOrderCreateComponent } from './landing-order-create/landing-order-create.component';
import { Step1Component } from './landing-order-create/step-1/step-1.component';
import { Step2Component } from './landing-order-create/step-2/step-2.component';
import { Step3Component } from './landing-order-create/step-3/step-3.component';
import { Step4Component } from './landing-order-create/step-4/step-4.component';
import { SummaryComponent } from './landing-order-create/summary/summary.component';
import { SavingComponent } from './landing-order-create/saving/saving.component';
import { NgbAlertComponent } from './common/ngb-alert/ngb-alert.component';
import { RoundPipe } from './shared/round.pipe';
import { jqxDateTimeInputComponent } from '../../node_modules/jqwidgets-framework/jqwidgets-ts/angular_jqxdatetimeinput';
import { UserProfileComponent } from './user-profile-menu/user-profile-menu.component';
import { UserProfileService } from './user-profile-menu/user-profile-menu.service';

//AIzaSyDfH47xr23B21N7jH6c_ZpfazkjWd7GVPE
@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent,
    LoginComponent,
    CustomerListOrderComponent,
    FormOrderComponent,
    OrderComponent,
    GoogleMapsComponent,
    ErrandComponent,
    SearchComponent,
    SearchComponent,
    ListComponent,
    ViewOrderComponent,
    SinglePaymentComponent,
    SearchOrderComponent,
    AutocompleteComponent,
    LoaderComponent,
    RegisterComponent,
    SearchDetailsComponent,
    CheckNameDirective,
    P24Component,
    ConfirmationComponent,
    ProfileViewComponent,
    ProfileFormComponent,
    ResendComponent,
    ResetPasswordFormComponent,
    ResultsComponent,
    FleetComponent,
    AllFleetComponent,
    AddNewFleetComponent,
    ResetPasswordRequestComponent,
    FleetSingleComponent,
    FleetSingleEditableComponent,
    ConfirmDialogComponent,
    NotificationPromptComponent,
    RegisterFromInvitationComponent,
    CustomerTopComponent,
    DashboardCustomerComponent,
    DashboardCompanyComponent,
    CompanyTopComponent,
    MenuGetProfileComponent,
    TrusteeTopComponent,
    AdminTopComponent,
    AdminUserComponent,
    DashboardAdminComponent,
    TranslationComponent,
    CurrencyComponent,
    FileUploadComponent,
    PageNotFoundComponent,
    TrusteeTopComponent,
    DashboardTrusteeComponent,
    DashboardTrusteeSearchResultComponent,
    InLoaderComponent,
    CompanyListOrderComponent,
    OrderOfferFormComponent,
    OrderOfferElementComponent,
    ChooseOfferBoxComponent,
    OrderListComponent,
    ChangeLogComponent,
    UserMessagesMenuComponent,
    UserMessagesListComponent,
    UserMessagesViewComponent,
    AgoDateFormatComponent,
    EmployeesListComponent,
    EmployeesFormComponent,
    CompanyManualInvoicesComponent,
    MenuNotificationsComponent,
    ListNotificationsComponent,
    ProfileUserComponent,
    ProfileAddressComponent,
    CustomerProfileViewComponent,
    CustomerProfileFormComponent,
    TrusteeCreateCompanyFormComponent,
    TrusteeCreateCustomerFormComponent,
    TrusteeListCompanyComponent,
    TrusteeListCustomerComponent,
    TopUniversalComponent,
    SetupProfileComponent,
    SetupCustomerProfileComponent,
    SetupCompanyProfileComponent,
    ImageUploadComponent,
    TermsComponent,
    OrderFilterCountryComponent,
    SpinIconComponent,
    CommentsFormComponent,
    CommentElementComponent,
    CommentListComponent,
    CommentElementAltComponent,
    TruncatePipe,
    OrderFilterRouteComponent,
    OrderComplaintComponent,
    FilterCategoriesComponent,
    PaymentResultComponent,
    EmployeesViewComponent,
    OrderFilterPlaceComponent,
    BreadcrumbsComponent,
    ListOrderComponent,
    ExtendedFooterComponent,
    ScrollToBottomDirective,
    RegistrationPlateComponent,
    LandingOrderCreateComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    SummaryComponent,
    SavingComponent,
    NgbAlertComponent,
    RoundPipe,
    jqxDateTimeInputComponent,
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    SelectModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    RatingModule,
    FormsModule, 
    MyDateRangePickerModule,
    ReactiveFormsModule,
  ],
  providers: [SecurityService, CustomerAuthManager, CompanyAuthManager, AdminAuthManager, 
    TrusteeAuthManager, ParcelService, UserProfileService,
     OrderService, CategoryService, MessagesService, SearchOrderService, P24Service, AddressService,
     ProfileService, CountryService, InviteService, FleetService, FleetTypeService,
     AppChangeService, AdminService, AdminUserService, TranslationService, MiscService,
     PaymentTypesService, CurrencyService, CommentsService, FileUploadService,
     OrderAttachmentsService, OrderTimeService, CustomerProfileService,
     DashboardTrusteeSearchService, OrderOfferService, NotificationsService,
     ChangeLogService, UserMessageService, FleetOrderCategoryService, GoogleMapsService,
     TrusteeListCompanyFilterService, TrusteeListCustomerFilterService, SinglePaymentService,
     EmployeesService, ManualInvoiceService, NoProfileAuthManager, OrderComplaintService],
  bootstrap: [AppComponent]
})
export class AppModule { }
