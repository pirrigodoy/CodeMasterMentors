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

  ngOnInit(): void {
    const advertisementIdString = localStorage.getItem('advertisement_id');
    if (advertisementIdString) {
      this.advertisementId = advertisementIdString;
    } else {
      console.error('advertisement_id no está presente en localStorage');
      return;
    }

    // Obtener el nombre del receptor desde el localStorage
    const receiver = localStorage.getItem('receiver');
    if (receiver) {
      this.receiver = receiver;
    } else {
      console.error('receiver no está presente en localStorage');
      return;
    }

    // Obtener la fecha actual
    const currentDate = new Date();
    this.currentDate = currentDate.toISOString().split('T')[0];

    this.apiService.getUserData(this.receiver).subscribe(
      (response) => {
        if (response.error) {
          console.error('Error al obtener los datos del anuncio:', response.message);
        } else {
          this.receiver = response.data.username; // Asignar el nombre del receptor
          this.receiver_id = response.data.id; // Asignar el ID del receptor
          console.log(this.receiver);
        }
      },
      (error) => {
        console.error('Error al obtener los datos del anuncio:', error);
      }
    );
  }


    onSubmit() {
      console.log('Rating:', this.rating);
      console.log('Comentario:', this.comment);
      console.log('Receptor:', this.receiver);
      console.log('Remitente:', this.remitente);

      if (!this.rating || !this.comment || !this.receiver || !this.remitente) {
          console.error('Por favor, complete el rating, el comentario y asegúrate de tener un destinatario y remitente');
          return;
      }
      const ad_id = parseInt(this.advertisementId, 10);

      this.apiService.guardarRatingYComentario(ad_id, this.rating, this.comment, this.currentDate, this.receiver_id, this.remitente).subscribe(
          response => {
              console.log('Mensaje enviado exitosamente', response);
              this.router.navigate(['/advertisement', this.advertisementId]);
          },
          error => {
              console.error('Error al enviar el mensaje', error);
              // Aquí puedes manejar el error de acuerdo a tus necesidades
          }
      );
  }

  getUsers() {
    this.apiService.getUsers().subscribe((users: any) => {
      this.users = users;
      console.log('Users:', users);
    });
  }
}
