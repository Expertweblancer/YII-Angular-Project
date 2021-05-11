import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySafetyComponent } from './company-safety.component';

describe('CompanySafetyComponent', () => {
  let component: CompanySafetyComponent;
  let fixture: ComponentFixture<CompanySafetyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanySafetyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySafetyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
