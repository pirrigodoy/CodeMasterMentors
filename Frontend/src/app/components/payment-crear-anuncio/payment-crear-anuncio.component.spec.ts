import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentcreateAdvertisementComponent } from './payment-crear-anuncio.component';

describe('PaymentcreateAdvertisementComponent', () => {
  let component: PaymentcreateAdvertisementComponent;
  let fixture: ComponentFixture<PaymentcreateAdvertisementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentcreateAdvertisementComponent]
    });
    fixture = TestBed.createComponent(PaymentcreateAdvertisementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
