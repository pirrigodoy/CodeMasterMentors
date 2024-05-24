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

  /**
 * Initializes component properties and loads recipient ID asynchronously.
 */
  async ngOnInit() {
    // Load recipient ID
    this.loadRecipientId();

    // Asynchronously load the Stripe library
    const stripePromise = loadStripe('pk_live_51PBvY4Rq5tXwNMj9gK7A3gAnVqucWSpwh3LWut9PKZSQm0VQIZlQbrqSBkUvjHxoM0sD0tHdDXEGiHQnd8JnhzBo00BOgKK6XA');
    this.stripe = await stripePromise;

    if (this.stripe) {
      // Initialize Stripe elements
      this.elements = this.stripe.elements();

      // Create and mount card element
      this.cardElement = this.elements.create('card');
      this.cardElement.mount('#card-element');
    } else {
      console.error('Stripe is not initialized');
    }

    // Retrieve advertisement_id from localStorage
    const advertisementId = localStorage.getItem('advertisement_id');
    if (advertisementId) {
      // Fetch advertisement data from the backend
      this.apiService.getAdvertisementData(advertisementId).subscribe(
        (response) => {
          if (!response.error) {
            // Convert price from euros to cents
            this.advertisementPrice = response.data.price_hour * 100;
          } else {
            console.error('Error fetching advertisement data:', response.message);
          }
        },
        (error) => {
          console.error('Error fetching advertisement data:', error);
        }
      );
    } else {
      console.error('advertisement_id not found in localStorage');
    }

    // Initialize EmailJS with user ID
    const EMAILJS_USER_ID = 'RFJu4BW0oAhWI-OvO';
    EmailJS.init(EMAILJS_USER_ID);
  }


  /**
 * Submits the payment form for processing.
 * @param {NgForm} paymentForm - The payment form to be submitted.
 */
  async submitPayment(paymentForm: NgForm) {
    // Check if Stripe, card element, or advertisement price is not available
    if (!this.stripe || !this.cardElement || this.advertisementPrice === null) {
      console.error('Stripe is not initialized, card element is missing, or advertisement price is not available');

      // Display an error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });

      return;
    }

    // Check if the payment form is invalid
    if (paymentForm.invalid) {
      // Display an error message for invalid form
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill out all required fields correctly.",
      });
      return;
    }

    // Create payment method using Stripe
    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.cardElement,
      billing_details: {
        name: this.cardholderName
      }
    });

    if (error) {
      console.error(error);
      alert('Error processing payment. Please try again.');
    } else {
      console.log(paymentMethod);

      // Use advertisement price as the payment amount
      const amount = this.advertisementPrice;

      // Send payment token and amount to backend for processing
      this.apiService.processPayment(paymentMethod.id, amount)
        .subscribe(
          (response: any) => {
            console.log('Payment processed successfully:', response);
            this.sendPaymentConfirmationEmail();

            // Show success message and redirect to another view
            this.paymentSuccess = true;
          },
          (error: any) => {
            console.error('Error processing payment:', error);
            // Show an alert with the error message
            alert('Error processing payment. Please try again.');
            // Redirect to an error view
          }
        );
    }
  }


  /**
 Sends a message to the programmer with the specified content
 */
  sendMessageToProgrammer() {
    if (!this.messageToProgrammer.trim()) {
      console.error('Message content is required.');
      return;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();

    const newMessage = {
      sender: this.senderId,
      recipient: this.recipientId,
      content: this.messageToProgrammer,
      date: formattedDate,
      status: 1
    };

    this.apiService.sendMessage(newMessage).subscribe(
      (response: any) => {
        console.log('Message sent to the programmer:', response);
        Swal.fire({
          icon: 'success',
          title: 'Message sent',
          text: 'Your message has been sent successfully!'
        }).then(() => {
          this.router.navigate(['/messages']);
          this.messageToProgrammer = '';
          this.paymentSuccess = false;
        });
      },
      (error: any) => {
        console.error('Error sending message to the programmer:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error sending your message. Please try again later.'
        });
      }
    );
  }
  /**
Loads the recipient ID from the localStorage and assigns it to the recipientId property
*/
  loadRecipientId(): void {
    const advertisementId = localStorage.getItem('advertisement_id');
    if (!advertisementId) {
      console.error('The advertisement ID is not available in the localStorage.');
      return;
    }

    const parsedAdvertisementId = parseInt(advertisementId, 10);
    if (isNaN(parsedAdvertisementId)) {
      console.error('The advertisement ID is not a valid number.');
      return;
    }

    this.apiService.getUserIdByAdvertisementId(parsedAdvertisementId.toString()).subscribe(
      (userId: number | undefined) => {
        if (!userId) {
          console.error('The obtained user ID is invalid.');
          return;
        }
        this.recipientId = userId;
      },
      (error: any) => {
        console.error('Error getting the user_id:', error);
      }
    );
  }

  /**
Opens the modal for displaying payment success message
*/
  openModal() {
    this.paymentSuccess = true;
  }

  /**
Closes the modal and redirects to the messages page
*/
  closeModalAndRedirect() {
    // Closes the modal and redirects to the messages page
    this.paymentSuccess = false;
    this.router.navigate(['/messages']);
  }

  /**
Sends a payment confirmation email to the user
*/
  sendPaymentConfirmationEmail() {
    const user_name = localStorage.getItem('user_name'); // Replace with the user's name
    const user_email = localStorage.getItem('user_email'); // Replace with the user's email
    const price = this.advertisementPrice / 100;
    // Define the parameters for your email template
    const templateParams = {
      user_name: user_name,
      user_email: user_email,
      price: price
    };
    // Send the email using EmailJS

    EmailJS.send('service_9zm8nuc', 'template_sqxu2a7', templateParams)
      .then((response: any) => {
        console.log('Email sent successfully:', response);
        // You can add additional logic if needed
      })
      .catch((error: any) => {
        console.error('Error sending email:', error);
        // You can handle the error as needed
      });

  }
}
