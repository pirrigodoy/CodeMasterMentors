import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;
  advertisementPrice: number | null = null;
  paymentSuccess: boolean = false;
  messageToProgrammer: string = '';
  senderId: number = parseInt(localStorage.getItem('user_id') || '0', 10);
  recipientId: number = 11;

  constructor(private apiService: ApiService, private router: Router) { }

  async ngOnInit() {
    this.loadRecipientId();
    const stripePromise = loadStripe('pk_live_51PBvY4Rq5tXwNMj9gK7A3gAnVqucWSpwh3LWut9PKZSQm0VQIZlQbrqSBkUvjHxoM0sD0tHdDXEGiHQnd8JnhzBo00BOgKK6XA');
    this.stripe = await stripePromise;

    if (this.stripe) {
      this.elements = this.stripe.elements();

      const style = {
        base: {
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      };

      this.cardElement = this.elements.create('card', { style });
      this.cardElement.mount('#card-element');
    } else {
      console.error('Stripe is not initialized');
    }

    const advertisementId = localStorage.getItem('advertisement_id');
    if (advertisementId) {
      this.apiService.getAdvertisementData(advertisementId).subscribe(
        (response) => {
          if (!response.error) {
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
      const amount = this.advertisementPrice;

      this.apiService.processPayment(paymentMethod.id, amount)
        .subscribe(
          (response: any) => {
            console.log('Pago procesado correctamente:', response);
            this.paymentSuccess = true;
          },
          (error: any) => {
            console.error('Error al procesar el pago:', error);
            alert('Error al procesar el pago. Por favor, inténtalo de nuevo.');
          }
        );
    }
  }

  sendMessageToProgrammer() {
    if (!this.messageToProgrammer.trim()) {
      console.error('El contenido del mensaje es requerido.');
      return;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', { timeZone: 'UTC', hour12: false });

    const newMessage = {
      remitente: this.senderId,
      destinatario: this.recipientId,
      content: this.messageToProgrammer,
      date: formattedDate,
      estado: 1
    };

    this.apiService.sendMessage(newMessage).subscribe(
      (response: any) => {
        console.log('Mensaje enviado al programador:', response);
        this.router.navigate(['/messages']);
        this.messageToProgrammer = '';
        this.paymentSuccess = false;
      },
      (error: any) => {
        console.error('Error al enviar el mensaje al programador:', error);
      }
    );
  }

  loadRecipientId(): void {
    const advertisementId = localStorage.getItem('advertisement_id');

    if (advertisementId === null) {
      console.error('El ID del anuncio no está disponible en el localStorage.');
      return;
    }

    const parsedAdvertisementId = parseInt(advertisementId, 10);
    if (isNaN(parsedAdvertisementId)) {
      console.error('El ID del anuncio no es un número válido.');
      return;
    }

    this.apiService.getUserIdByAdvertisementId(parsedAdvertisementId.toString()).subscribe(
      (userId: number | undefined) => {
        console.log('ID del usuario obtenido:', userId);
        if (userId === undefined || userId === null) {
          console.error('El ID del usuario obtenido es inválido.');
          return;
        }
        this.recipientId = userId;
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
    this.paymentSuccess = false;
    this.router.navigate(['/messages']);
  }
}
