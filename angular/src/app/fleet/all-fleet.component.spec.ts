/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AllFleetComponent } from './all-fleet.component';

describe('AllFleetComponent', () => {
  let component: AllFleetComponent;
  let fixture: ComponentFixture<AllFleetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllFleetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllFleetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
