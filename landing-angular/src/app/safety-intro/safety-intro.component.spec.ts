import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyIntroComponent } from './safety-intro.component';

describe('SafetyIntroComponent', () => {
  let component: SafetyIntroComponent;
  let fixture: ComponentFixture<SafetyIntroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafetyIntroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
