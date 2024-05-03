import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;
  advertisementPrice: number | null = null;
  paymentSuccess: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  async ngOnInit() {
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

    // Obtener advertisement_id del localStorage
    const advertisementId = localStorage.getItem('advertisement_id');
    if (advertisementId) {
      // Obtener datos del anuncio del backend
      this.apiService.getAdvertisementData(advertisementId).subscribe(
        (response) => {
          if (!response.error) {
            // Convertir el precio de euros a centavos
            this.advertisementPrice = response.data.price_hour * 100;
          } else {
            console.error('Error al obtener los datos del anuncio:', response.message);
          }
        },
        (error) => {
          console.error('Error al obtener los datos del anuncio:', error);
        }
      );
    } else {
      console.error('advertisement_id no encontrado en el localStorage');
    }
  }

  async submitPayment() {
    if (!this.stripe || !this.cardElement || this.advertisementPrice === null) {
      console.error('Stripe is not initialized, card element is missing, or advertisement price is not available');
      return;
    }

    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.cardElement,
    });

    if (error) {
      console.error(error);
      alert('Error al procesar el pago. Por favor, inténtalo de nuevo.');
    } else {
      console.log(paymentMethod);

      // Utilizar el precio del anuncio como el monto del pago
      const amount = this.advertisementPrice;

      // Envía el token de pago y el monto al backend para procesar el pago
      this.apiService.processPayment(paymentMethod.id, amount)
        .subscribe(
          (response: any) => {
            console.log('Pago procesado correctamente:', response);
            // Redirigir a otra vista y enviar un mensaje al profesor
            this.paymentSuccess = true;
            setTimeout(() => {
              this.router.navigate(['/messages']);
            }, 3000); // Redirigir después de 3 segundos
          },
          (error: any) => {
            console.error('Error al procesar el pago:', error);
            // Mostrar un alerta con el mensaje de error
            alert('Error al procesar el pago. Por favor, inténtalo de nuevo.');
            // Redirigir a otra vista de error
          }
        );
    }
  }
}
