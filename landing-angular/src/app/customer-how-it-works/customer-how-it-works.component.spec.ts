import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerHowItWorksComponent } from './customer-how-it-works.component';

describe('CustomerHowItWorksComponent', () => {
  let component: CustomerHowItWorksComponent;
  let fixture: ComponentFixture<CustomerHowItWorksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerHowItWorksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerHowItWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
