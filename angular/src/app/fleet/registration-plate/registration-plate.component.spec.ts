import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationPlateComponent } from './registration-plate.component';

describe('RegistrationPlateComponent', () => {
  let component: RegistrationPlateComponent;
  let fixture: ComponentFixture<RegistrationPlateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationPlateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationPlateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
