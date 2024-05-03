import { Component, AfterViewInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements AfterViewInit {
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;

  constructor(private apiService: ApiService) { }

  async ngAfterViewInit() {
    // Cargar la biblioteca de Stripe de forma asíncrona
    const stripePromise = loadStripe('pk_live_51PBvY4Rq5tXwNMj9gK7A3gAnVqucWSpwh3LWut9PKZSQm0VQIZlQbrqSBkUvjHxoM0sD0tHdDXEGiHQnd8JnhzBo00BOgKK6XA');
    this.stripe = await stripePromise;

    if (this.stripe) {
      this.elements = this.stripe.elements();

      // Crear y montar el elemento de tarjeta
      this.cardElement = this.elements.create('card');
      this.cardElement.mount('#card-element');
    } else {
      console.error('Stripe is not initialized');
    }
  }

  async submitPayment() {
    if (!this.stripe || !this.cardElement) {
      console.error('Stripe is not initialized or card element is missing');
      return;
    }

    // Obtener el token de la tarjeta
    const { token, error } = await this.stripe.createToken(this.cardElement);

    if (error) {
      console.error(error);
    } else {
      console.log(token);

      // Obtener el monto del pago (por ejemplo, desde un formulario)
      const amount = 1000; // Supongamos que el monto es de 1000 (en centavos)

      // Envía el token de pago y el monto al backend para procesar el pago
      this.apiService.processPayment(token.id, amount)
        .subscribe(
          (response: any) => {
            console.log('Pago procesado correctamente:', response);
            // Mostrar mensaje de éxito al usuario
          },
          (error: any) => {
            console.error('Error al procesar el pago:', error);
            // Mostrar mensaje de error al usuario
          }
        );
    }
  }
}
