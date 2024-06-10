import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-payment-registro',
  templateUrl: './payment-registro.component.html',
  styleUrls: ['./payment-registro.component.css']
})
export class PaymentRegistroComponent {
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;
  advertisementPrice: number | null = null;
  paymentSuccess: boolean = false;
  messageToProgrammer: string = '';
  senderId: number = parseInt(localStorage.getItem('user_id') || '0', 10);
  recipientId: number = 11;
  cardholderName: string = '';
  showRoleMessage: boolean = false;

  constructor(private apiService: ApiService, private router: Router) { }

  async ngOnInit() {
    // Verificar el role en localStorage y mostrar el mensaje si es 2
    this.checkRoleInLocalStorage();

    this.advertisementPrice = 1000;

    const stripePromise = loadStripe('pk_live_51PBvY4Rq5tXwNMj9gK7A3gAnVqucWSpwh3LWut9PKZSQm0VQIZlQbrqSBkUvjHxoM0sD0tHdDXEGiHQnd8JnhzBo00BOgKK6XA');
    this.stripe = await stripePromise;

    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.cardElement = this.elements.create('card');
      this.cardElement.mount('#card-element');
    } else {
      console.error('Stripe is not initialized');
    }
  }

  async submitPayment(paymentForm: NgForm) {
    if (!this.stripe || !this.cardElement || this.advertisementPrice === null || paymentForm.invalid) {
      console.error('Stripe is not initialized, card element is missing, advertisement price is not available, or form is invalid');

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });

      return;
    }

    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.cardElement,
      billing_details: {
        name: this.cardholderName
      }
    });

    if (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al procesar el pago. Por favor, inténtalo de nuevo.",
      });
    } else {
      console.log(paymentMethod);
      const amount = this.advertisementPrice;

      this.apiService.processPayment(paymentMethod.id, amount)
        .subscribe(
          (response: any) => {
            console.log('Pago procesado correctamente:', response);

            // Borrar la entrada de 'role' en localStorage
            localStorage.removeItem('role');

           // localStorage.setItem('paymentRegister', 'false');
            this.router.navigate(['/login']);
            Swal.fire({
              icon: "success",
              title: "Payment Successful",
              text: "Your payment has been processed successfully.",
            });
          },
          (error: any) => {
            console.error('Error al procesar el pago:', error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Error al procesar el pago. Por favor, inténtalo de nuevo.",
            });
          }
        );
    }
  }

  openModal() {
    this.paymentSuccess = true;
  }

  closeModalAndRedirect() {
    this.paymentSuccess = false;
    this.router.navigate(['/login']);
  }

  checkRoleInLocalStorage() {
    const role = localStorage.getItem('role');
    this.showRoleMessage = role === '2';
  }
}
