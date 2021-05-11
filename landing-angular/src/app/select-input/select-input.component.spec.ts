import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectInput } from './select-input.component';

describe('SelectInput', () => {
  let component: SelectInput;
  let fixture: ComponentFixture<SelectInput>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectInput ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
