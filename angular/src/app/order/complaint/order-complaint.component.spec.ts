import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderComplaintComponent } from './order-complaint.component';

describe('OrderComplaintComponent', () => {
  let component: OrderComplaintComponent;
  let fixture: ComponentFixture<OrderComplaintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderComplaintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
