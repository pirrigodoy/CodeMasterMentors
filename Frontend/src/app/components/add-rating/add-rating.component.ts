import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-rating',
  templateUrl: './add-rating.component.html',
  styleUrls: ['./add-rating.component.css']
})
export class AddRatingComponent implements OnInit {
  advertisementId: string = '';
  rating: number = 0;
  comment: string = '';
  receiver: string = ''; // Nombre del receptor
  receiver_id: number = 0;
  users: any = [];
  currentDate: string = ''; // Fecha actual
  remitente: number = parseInt(localStorage.getItem('user_id') || '0', 10);

  constructor(private router: Router, private apiService: ApiService) { }

  /**
 * Initializes the component.
 * Retrieves the advertisement ID and receiver name from localStorage.
 * Retrieves the current date and formats it.
 * Calls the API service to get the user data for the receiver.
 * Logs any errors that occur during the data retrieval process.
 */
ngOnInit(): void {
  // Retrieve advertisement ID from localStorage
  const advertisementIdString = localStorage.getItem('advertisement_id');
  if (advertisementIdString) {
    this.advertisementId = advertisementIdString;
  } else {
    console.error('advertisement_id no está presente en localStorage');
    return;
  }

  // Retrieve receiver name from localStorage
  const receiver = localStorage.getItem('receiver');
  if (receiver) {
    this.receiver = receiver;
  } else {
    console.error('receiver no está presente en localStorage');
    return;
  }

  // Get current date and format it
  const currentDate = new Date();
  this.currentDate = currentDate.toISOString().split('T')[0];

  // Call API service to get user data for the receiver
  this.apiService.getUserData(this.receiver).subscribe(
    (response) => {
      if (response.error) {
        console.error('Error al obtener los datos del anuncio:', response.message);
      } else {
        // Assign receiver name and ID from the response
        this.receiver = response.data.username;
        this.receiver_id = response.data.id;
        console.log(this.receiver);
      }
    },
    (error) => {
      console.error('Error al obtener los datos del anuncio:', error);
    }
  );
}



  /**
 * Handles the submission of the rating and comment form.
 * Logs the rating, comment, receiver, and sender information to the console.
 * Validates the required fields and logs an error if any field is missing.
 * Calls the API service to save the rating and comment data.
 * Redirects to the advertisement details page after successfully saving the data.
 */
onSubmit() {
  console.log('Rating:', this.rating);
  console.log('Comentario:', this.comment);
  console.log('Receptor:', this.receiver);
  console.log('Remitente:', this.remitente);

  // Validate required fields
  if (!this.rating || !this.comment || !this.receiver || !this.remitente) {
    console.error('Por favor, complete el rating, el comentario y asegúrate de tener un destinatario y remitente');
    return;
  }

  // Parse advertisement ID to integer
  const ad_id = parseInt(this.advertisementId, 10);

  // Call API service to save rating and comment data
  this.apiService.guardarRatingYComentario(ad_id, this.rating, this.comment, this.currentDate, this.receiver_id, this.remitente).subscribe(
    response => {
      console.log('Mensaje enviado exitosamente', response);
      // Redirect to the advertisement details page after successful submission
      this.router.navigate(['/advertisement', this.advertisementId]);
    },
    error => {
      console.error('Error al enviar el mensaje', error);
      // Handle the error as needed
    }
  );
}


  /**
 * Retrieves a list of users by calling the API service's getUsers method.
 * Stores the retrieved user data and logs it to the console.
 */
  getUsers() {
    this.apiService.getUsers().subscribe((users: any) => {
      this.users = users;
      console.log('Users:', users);
    });
  }

}
