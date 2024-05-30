import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRegistroComponent } from './payment-registro.component';

describe('PaymentRegistroComponent', () => {
  let component: PaymentRegistroComponent;
  let fixture: ComponentFixture<PaymentRegistroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentRegistroComponent]
    });
    fixture = TestBed.createComponent(PaymentRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
