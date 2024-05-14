import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramingLanguageManagementComponent } from './programing-language-management.component';

describe('ProgramingLanguageManagementComponent', () => {
  let component: ProgramingLanguageManagementComponent;
  let fixture: ComponentFixture<ProgramingLanguageManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgramingLanguageManagementComponent]
    });
    fixture = TestBed.createComponent(ProgramingLanguageManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
