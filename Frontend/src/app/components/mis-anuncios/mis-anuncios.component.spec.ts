import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisAnunciosComponent } from './mis-anuncios.component';

describe('MisAnunciosComponent', () => {
  let component: MisAnunciosComponent;
  let fixture: ComponentFixture<MisAnunciosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MisAnunciosComponent]
    });
    fixture = TestBed.createComponent(MisAnunciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
