/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TopUniversalComponent } from './top-universal.component';

describe('TopUniversalComponent', () => {
  let component: TopUniversalComponent;
  let fixture: ComponentFixture<TopUniversalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopUniversalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopUniversalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
