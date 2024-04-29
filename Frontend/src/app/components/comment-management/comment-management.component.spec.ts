import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentManagementComponent } from './comment-management.component';

describe('CommentManagementComponent', () => {
  let component: CommentManagementComponent;
  let fixture: ComponentFixture<CommentManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommentManagementComponent]
    });
    fixture = TestBed.createComponent(CommentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
