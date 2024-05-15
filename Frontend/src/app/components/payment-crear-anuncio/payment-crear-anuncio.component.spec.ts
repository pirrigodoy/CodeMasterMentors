import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCrearAnuncioComponent } from './payment-crear-anuncio.component';

describe('PaymentCrearAnuncioComponent', () => {
  let component: PaymentCrearAnuncioComponent;
  let fixture: ComponentFixture<PaymentCrearAnuncioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentCrearAnuncioComponent]
    });
    fixture = TestBed.createComponent(PaymentCrearAnuncioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
