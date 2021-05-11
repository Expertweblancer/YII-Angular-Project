import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IllPattContentComponent } from './ill-patt-content.component';

describe('IllPattContentComponent', () => {
  let component: IllPattContentComponent;
  let fixture: ComponentFixture<IllPattContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IllPattContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IllPattContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
