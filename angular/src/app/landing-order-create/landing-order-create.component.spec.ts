import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingOrderCreateComponent } from './landing-order-create.component';

describe('LandingOrderCreateComponent', () => {
  let component: LandingOrderCreateComponent;
  let fixture: ComponentFixture<LandingOrderCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingOrderCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingOrderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
