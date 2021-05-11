import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderFilterRouteComponent } from './order-filter-route.component';

describe('OrderFilterRouteComponent', () => {
  let component: OrderFilterRouteComponent;
  let fixture: ComponentFixture<OrderFilterRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderFilterRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFilterRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
