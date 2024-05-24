import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import * as EmailJS from 'emailjs-com';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;
  advertisementPrice: number = 0;
  paymentSuccess: boolean = false;
  messageToProgrammer: string = '';
  senderId: number = parseInt(localStorage.getItem('user_id') || '0', 10); // Inicializa senderId
  recipientId: number = 11;
  cardholderName: string = '';

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
    const EMAILJS_USER_ID = 'RFJu4BW0oAhWI-OvO';
    EmailJS.init(EMAILJS_USER_ID);
  }

  async submitPayment(paymentForm: NgForm) {
    if (!this.stripe || !this.cardElement || this.advertisementPrice === null) {
      console.error('Stripe is not initialized, card element is missing, or advertisement price is not available');

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });

      return;
    }

    if (paymentForm.invalid) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill out all required fields correctly.",
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
            this.sendPaymentConfirmationEmail();

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

  sendMessageToProgrammer() {
    // Verifica si el nuevo mensaje tiene contenido antes de enviarlo
    if (!this.messageToProgrammer.trim()) {
      console.error('El contenido del mensaje es requerido.');
      return;
    }

    // Obtiene la fecha actual
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', { timeZone: 'UTC', hour12: false });

    const newMessage = {
      remitente: this.senderId,
      destinatario: this.recipientId, // Aquí debes definir el ID del programador contratado
      content: this.messageToProgrammer,
      date: formattedDate,
      estado: 1
    };

    this.apiService.sendMessage(newMessage).subscribe(
      (response: any) => {
        console.log('Mensaje enviado al programador:', response);
        this.router.navigate(['/messages']);
        // Limpia el campo de texto del nuevo mensaje
        this.messageToProgrammer = '';
        // Cierra el modal
        this.paymentSuccess = false;
      },
      (error: any) => {
        console.error('Error al enviar el mensaje al programador:', error);
        // Puedes manejar el error de acuerdo a tus necesidades
      }
    );
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
    this.router.navigate(['/messages']);
  }

  sendPaymentConfirmationEmail() {
    const user_name = localStorage.getItem('user_name'); // Reemplaza con el nombre del usuario
    const user_email = localStorage.getItem('user_email'); // Reemplaza con el correo electrónico del usuario
    const price = this.advertisementPrice / 100;
    // Define los parámetros de tu plantilla de correo electrónico
    const templateParams = {
      user_name: user_name,
      user_email: user_email,
      price: price
    };

    // Enviar el correo electrónico utilizando EmailJS
    EmailJS.send('service_9zm8nuc', 'template_sqxu2a7', templateParams)
      .then((response: any) => {
        console.log('Correo electrónico enviado con éxito:', response);
        // Puedes agregar lógica adicional si lo necesitas
      })
      .catch((error: any) => {
        console.error('Error al enviar el correo electrónico:', error);
        // Puedes manejar el error de acuerdo a tus necesidades
      });
  }
}
