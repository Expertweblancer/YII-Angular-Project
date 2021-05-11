import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinIconComponent } from './spin-icon.component';

describe('SpinIconComponent', () => {
  let component: SpinIconComponent;
  let fixture: ComponentFixture<SpinIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
