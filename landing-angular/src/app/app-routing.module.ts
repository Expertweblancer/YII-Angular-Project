import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
// import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CustomerMainComponent } from './customer-main/customer-main.component';
import { CompanyMainComponent } from './company-main/company-main.component';
import { CustomerHowItWorksComponent } from './customer-how-it-works/customer-how-it-works.component';
import { CustomerSafetyComponent } from './customer-safety/customer-safety.component';
import { CompanyRequirementsComponent } from './company-requirements/company-requirements.component';
import { CompanySafetyComponent } from './company-safety/company-safety.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
    /** Admin Menu */
{ path: '',                        redirectTo: 'customer', pathMatch: 'full' },
{ path: 'customer',                component: CustomerMainComponent},
{ path: 'customer-how-it-works',   component: CustomerHowItWorksComponent},
{ path: 'customer-safety',         component: CustomerSafetyComponent},
{ path: 'register', component: RegisterComponent },


{ path: 'company',                 component: CompanyMainComponent},
{ path: 'company-requirements',    component: CompanyRequirementsComponent},
{ path: 'company-safety',          component: CompanySafetyComponent},
// { path: '**',                      component: PageNotFoundComponent },
{ path: '**',                      redirectTo: 'customer', pathMatch: 'full' },
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
