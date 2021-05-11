import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderFilterPlaceComponent } from './order-filter-place.component';

describe('OrderFilterPlaceComponent', () => {
  let component: OrderFilterPlaceComponent;
  let fixture: ComponentFixture<OrderFilterPlaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderFilterPlaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFilterPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
