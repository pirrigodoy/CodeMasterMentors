import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProgramingLanguageComponent } from './add-programing-language.component';

describe('AddProgramingLanguageComponent', () => {
  let component: AddProgramingLanguageComponent;
  let fixture: ComponentFixture<AddProgramingLanguageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddProgramingLanguageComponent]
    });
    fixture = TestBed.createComponent(AddProgramingLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
