import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
// import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CustomerMainComponent } from './customer-main/customer-main.component';
import { AppRoutingModule } from './app-routing.module';
import { CompanyMainComponent } from './company-main/company-main.component';
import { CustomerHowItWorksComponent } from './customer-how-it-works/customer-how-it-works.component';
import { RegisterComponent } from './register/register.component';
import { DropdownDirective } from './directives/dropdown.directive';
import { CompanyRequirementsComponent } from './company-requirements/company-requirements.component';
import { CompanySafetyComponent } from './company-safety/company-safety.component';
import { CustomerSafetyComponent } from './customer-safety/customer-safety.component';
import { BottomElementComponent } from './bottom-element/bottom-element.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { StartNowComponent } from './start-now/start-now.component';
import { PictogramsComponent } from './pictograms/pictograms.component';
import { SelectInputComponent } from './select-input/select-input.component';
import { IllPattContentComponent } from './ill-patt-content/ill-patt-content.component';
import { SafetyIntroComponent } from './safety-intro/safety-intro.component';
import { FaqComponent } from './faq/faq.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { InputComponent } from './input/input.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { LoginModalService } from './login-modal/login-modal.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginModalComponent,
    InputComponent,
    RegisterComponent,
    CheckboxComponent,
    FaqComponent,
    // PageNotFoundComponent,
    SelectInputComponent,
    SafetyIntroComponent,
    IllPattContentComponent,
    CustomerMainComponent,
    PictogramsComponent,
    CompanyMainComponent,
    CustomerHowItWorksComponent,
    DropdownDirective,
    CompanyRequirementsComponent,
    StartNowComponent,
    CompanySafetyComponent,
    CustomerSafetyComponent,
    BottomElementComponent,
    FooterComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpModule
  ],
  providers: [
    LoginModalService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
