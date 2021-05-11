import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSafetyComponent } from './customer-safety.component';

describe('CustomerSafetyComponent', () => {
  let component: CustomerSafetyComponent;
  let fixture: ComponentFixture<CustomerSafetyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSafetyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSafetyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
