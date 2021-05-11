import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderFilterCountryComponent } from './order-filter-country.component';

describe('OrderFilterCountryComponent', () => {
  let component: OrderFilterCountryComponent;
  let fixture: ComponentFixture<OrderFilterCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderFilterCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFilterCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
