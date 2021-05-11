import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRequirementsComponent } from './company-requirements.component';

describe('CompanyRequirementsComponent', () => {
  let component: CompanyRequirementsComponent;
  let fixture: ComponentFixture<CompanyRequirementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyRequirementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
