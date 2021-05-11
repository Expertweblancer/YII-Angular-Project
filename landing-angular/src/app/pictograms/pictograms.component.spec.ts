import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictogramsComponent } from './pictograms.component';

describe('PictogramsComponent', () => {
  let component: PictogramsComponent;
  let fixture: ComponentFixture<PictogramsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictogramsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictogramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
