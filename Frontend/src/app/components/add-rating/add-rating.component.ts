import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-add-rating',
  templateUrl: './add-rating.component.html',
  styleUrls: ['./add-rating.component.css']
})
export class AddRatingComponent implements OnInit {
  comment: string = '';
  rating: number = 1;
  fecha: string = new Date().toISOString().slice(0, 10);
  advertisementId: string | null = null;
  nombreReceptor: string = '';
  nombreUsuario: string = '';

  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    const paramAdvertisementId = this.route.snapshot.paramMap.get('advertisementId');
    if (paramAdvertisementId) {
      this.advertisementId = paramAdvertisementId;
    }
  }

  ngOnInit(): void {
    if (this.advertisementId) {
      this.apiService.getAdvertisementData(this.advertisementId).subscribe(
        (advertisementData: any) => {
          this.nombreReceptor = advertisementData.receiverName;
          const userId = advertisementData.user_id;
          if (userId) {
            this.apiService.getUserData(userId).subscribe(
              (userData: any) => {
                this.nombreUsuario = userData.name;
              },
              (error: any) => {
                console.error('Error al obtener los datos del usuario:', error);
              }
            );
          } else {
            console.error('El ID del usuario en el anuncio es nulo');
          }
        },
        (error: any) => {
          console.error('Error al obtener los datos del anuncio:', error);
        }
      );
    }
  }

  crearComentario(): void {
    if (!this.advertisementId) {
      console.error('Advertisement ID es null');
      return;
    }

    // Verificar que el usuario haya ingresado un comentario
    if (!this.comment) {
      console.error('Debe ingresar un comentario');
      return;
    }

    // Crear el objeto de comentario
    const nuevoComentario = {
      advertisement_id: this.advertisementId,
      transmitter: localStorage.getItem('user_id'), // Suponiendo que el transmisor es el usuario actual
      receiver: this.nombreReceptor,
      comment: this.comment,
      rating: this.rating,
      fecha: this.fecha
    };

    // Llamar al método en el servicio API para crear el comentario
    this.apiService.crearComentario(nuevoComentario).subscribe(
      (response: any) => {
        console.log('Comentario creado:', response);
        // Aquí puedes realizar acciones adicionales después de crear el comentario, como mostrar un mensaje de éxito o actualizar la lista de comentarios
      },
      (error: any) => {
        console.error('Error al crear el comentario:', error);
      }
    );
  }
}
