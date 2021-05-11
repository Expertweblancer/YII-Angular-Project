import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentElementAltComponent } from './comment-element-alt.component';

describe('CommentElementAltComponent', () => {
  let component: CommentElementAltComponent;
  let fixture: ComponentFixture<CommentElementAltComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentElementAltComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentElementAltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
