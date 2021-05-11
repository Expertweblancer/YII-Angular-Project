/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { P24Component } from './p24.component';

describe('P24Component', () => {
  let component: P24Component;
  let fixture: ComponentFixture<P24Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ P24Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(P24Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
