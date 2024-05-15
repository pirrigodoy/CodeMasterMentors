import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment-crear-anuncio',
  templateUrl: './payment-crear-anuncio.component.html',
  styleUrls: ['./payment-crear-anuncio.component.css']
})
export class PaymentCrearAnuncioComponent {
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;
  advertisementPrice: number | null = null;
  paymentSuccess: boolean = false;
  messageToProgrammer: string = '';
  senderId: number = parseInt(localStorage.getItem('user_id') || '0', 10);; // Inicializa senderId
  recipientId: number = 11;

  constructor(private apiService: ApiService, private router: Router) { }

  async ngOnInit() {
    this.loadRecipientId();
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
            // setTimeout(() => {
            //   this.router.navigate(['/messages']);
            // }, 3000); // Redirigir después de 3 segundos
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

  loadRecipientId(): void {
    const advertisementId = localStorage.getItem('advertisement_id');
    console.log('hey', advertisementId);

    if (advertisementId === null) {
      console.error('El ID del anuncio no está disponible en el localStorage.');
      return;
    }

    // Intenta parsear el ID del anuncio a un número
    const parsedAdvertisementId = parseInt(advertisementId, 10);
    if (isNaN(parsedAdvertisementId)) {
      console.error('El ID del anuncio no es un número válido.');
      return;
    }

    // console.log('ID del anuncio parseado:', parsedAdvertisementId);

    // Si el parseo fue exitoso, asigna el valor a recipientId
    this.apiService.getUserIdByAdvertisementId(parsedAdvertisementId.toString()).subscribe(
      (userId: number | undefined) => { // <- Cambio aquí
        console.log('ID del usuario obtenido:', userId);
        if (userId === undefined || userId === null) {
          console.error('El ID del usuario obtenido es inválido.');
          return;
        }
        this.recipientId = userId;
        console.log('hola', this.recipientId);
        //this.loadMessages();
      },
      (error: any) => {
        console.error('Error al obtener el user_id:', error);
      }
    );

  }

  openModal() {
    this.paymentSuccess = true;
  }

  closeModalAndRedirect() {
    // Cierra el modal y redirige a la página de mensajes
    this.paymentSuccess = false;
    this.router.navigate(['/crear-anuncio']);
  }
}
