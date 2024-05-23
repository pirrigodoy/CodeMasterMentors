import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment-crear-anuncio',
  templateUrl: './payment-crear-anuncio.component.html',
  styleUrls: ['./payment-crear-anuncio.component.css']
})
export class PaymentcreateAdvertisementComponent {
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;
  advertisementPrice: number | null = null;
  paymentSuccess: boolean = false;
  messageToProgrammer: string = '';
  senderId: number = parseInt(localStorage.getItem('user_id') || '0', 10); // Inicializa senderId
  recipientId: number = 11;
  cardholderName: string = '';

  constructor(private apiService: ApiService, private router: Router) { }

  /**
  * Initializes component properties and performs asynchronous operations when the component is initialized.
  */
  async ngOnInit() {
    // Load recipient ID
    this.loadRecipientId();

    // Set the advertisement price to 10€ (1000 cents)
    this.advertisementPrice = 1000;

    // Asynchronously load the Stripe library
    const stripePromise = loadStripe('pk_live_51PBvY4Rq5tXwNMj9gK7A3gAnVqucWSpwh3LWut9PKZSQm0VQIZlQbrqSBkUvjHxoM0sD0tHdDXEGiHQnd8JnhzBo00BOgKK6XA');
    this.stripe = await stripePromise;

    if (this.stripe) {
      // Initialize Stripe elements
      this.elements = this.stripe.elements();

      // Create and mount the card element
      this.cardElement = this.elements.create('card');
      this.cardElement.mount('#card-element');
    } else {
      console.error('Stripe is not initialized');
    }
  }


  /**
 * Submits the payment form asynchronously.
 * @param {NgForm} paymentForm - The payment form to submit.
 */
  async submitPayment(paymentForm: NgForm) {
    // Check if Stripe, card element, advertisement price, or form is invalid
    if (!this.stripe || !this.cardElement || this.advertisementPrice === null || paymentForm.invalid) {
      console.error('Stripe is not initialized, card element is missing, advertisement price is not available, or form is invalid');

      // Display error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });

      return;
    }

    // Create payment method with Stripe
    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.cardElement,
      billing_details: {
        name: this.cardholderName
      }
    });

    if (error) {
      // If there's an error in creating payment method
      console.error(error);
      // Display error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al procesar el pago. Por favor, inténtalo de nuevo.",
      });
    } else {
      // Payment method created successfully
      console.log(paymentMethod);

      // Use advertisement price as payment amount
      const amount = this.advertisementPrice;

      // Send payment token and amount to backend for processing
      this.apiService.processPayment(paymentMethod.id, amount)
        .subscribe(
          (response: any) => {
            console.log('Pago procesado correctamente:', response);
            // Redirect to another view and notify the user about successful payment
            this.paymentSuccess = true;
          },
          (error: any) => {
            console.error('Error al procesar el pago:', error);
            // Display error message
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Error al procesar el pago. Por favor, inténtalo de nuevo.",
            });
          }
        );
    }
  }


  /**
 * Loads the recipient ID from local storage.
 */
  loadRecipientId(): void {
    // Retrieve advertisement ID from local storage
    const advertisementId = localStorage.getItem('advertisement_id');
    console.log('hey', advertisementId);

    if (advertisementId === null) {
      // If advertisement ID is not available in local storage
      console.error('El ID del anuncio no está disponible en el localStorage.');
      return;
    }

    // Attempt to parse the advertisement ID to a number
    const parsedAdvertisementId = parseInt(advertisementId, 10);
    if (isNaN(parsedAdvertisementId)) {
      // If advertisement ID is not a valid number
      console.error('El ID del anuncio no es un número válido.');
      return;
    }

    // If parsing was successful, assign the value to recipientId
    this.apiService.getUserIdByAdvertisementId(parsedAdvertisementId.toString()).subscribe(
      (userId: number | undefined) => {
        console.log('ID del usuario obtenido:', userId);
        if (userId === undefined || userId === null) {
          // If the obtained user ID is invalid
          console.error('El ID del usuario obtenido es inválido.');
          return;
        }
        // Assign the obtained user ID to recipientId
        this.recipientId = userId;
        console.log('hola', this.recipientId);
      },
      (error: any) => {
        // If there's an error in retrieving the user ID
        console.error('Error al obtener el user_id:', error);
      }
    );
  }


  /**
 * Opens the payment success modal.
 */
  openModal() {
    // Set paymentSuccess flag to true to open the modal
    this.paymentSuccess = true;
  }


  /**
 * Closes the payment success modal and redirects to the message page.
 */
  closeModalAndRedirect() {
    // Set paymentSuccess flag to false to close the modal
    this.paymentSuccess = false;
    // Redirect to the create advertisement page
    this.router.navigate(['/crear-anuncio']);
  }

}
