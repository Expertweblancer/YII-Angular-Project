/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ViewFleetComponent } from './view-fleet.component';

describe('ViewFleetComponent', () => {
  let component: ViewFleetComponent;
  let fixture: ComponentFixture<ViewFleetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFleetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFleetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
