import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-rating',
  templateUrl: './add-rating.component.html',
  styleUrls: ['./add-rating.component.css']
})
export class AddRatingComponent {
  comment: string = '';
  rating: number = 1; // Valor predeterminado para el rating
  fecha: string = new Date().toISOString().slice(0, 10); // Obtener fecha actual en formato YYYY-MM-DD

  constructor(private apiService: ApiService) { }

  crearComentario(): void {
    const nuevoComentario = {
      comment: this.comment,
      rating: this.rating,
      fecha: this.fecha
    };

    this.apiService.crearComentario(nuevoComentario).subscribe((response: any) => {
      console.log('Comentario creado:', response);
      // Aquí podrías realizar alguna acción adicional, como mostrar un mensaje de éxito o actualizar la lista de comentarios
    });
  }
}



