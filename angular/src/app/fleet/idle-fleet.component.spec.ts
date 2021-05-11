/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IdleFleetComponent } from './idle-fleet.component';

describe('IdleFleetComponent', () => {
  let component: IdleFleetComponent;
  let fixture: ComponentFixture<IdleFleetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdleFleetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdleFleetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
