import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesViewComponent } from './employees-view.component';

describe('EmployeesViewComponent', () => {
  let component: EmployeesViewComponent;
  let fixture: ComponentFixture<EmployeesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
