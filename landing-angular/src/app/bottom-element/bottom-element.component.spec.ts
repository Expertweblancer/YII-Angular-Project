import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomElementComponent } from './bottom-element.component';

describe('BottomElementComponent', () => {
  let component: BottomElementComponent;
  let fixture: ComponentFixture<BottomElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
