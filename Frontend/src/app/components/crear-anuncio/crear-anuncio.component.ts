// mis-anuncios.component.ts

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, ActivatedRoute, Route } from '@angular/router'; // Importa Route junto con Router y ActivatedRoute
import Swal from 'sweetalert2'; // Importa SweetAlert

@Component({
  selector: 'app-mis-anuncios',
  templateUrl: './crear-anuncio.component.html',
  styleUrls: ['./crear-anuncio.component.css']
})
export class CrearAnuncioComponent implements OnInit{
  nuevoAnuncio: any = {
    user_id: localStorage.getItem('user_id') // Obtener user_id del local_storage
  };  // Objeto para almacenar los datos del nuevo anuncio
  programmingLanguages: any = [];
  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
   
    this.getProgrammingLanguages();
  }

   confirmarCreacion(): void {
    Swal.fire({
      title: '¿Estás seguro de crear este anuncio?',
      text: 'Una vez creado, el anuncio no se podrá modificar.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, crear anuncio',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.crearAnuncio();
      }
    });
  }
  crearAnuncio(): void {
    this.apiService.crearAnuncio(this.nuevoAnuncio).subscribe((response: any) => {
      // Muestra una alerta de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Anuncio creado!',
        text: 'El anuncio se ha creado correctamente.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok'
      }).then((result) => {
        // Redirige a la ruta mis-anuncios con el ID de usuario después de crear el anuncio
        this.router.navigate(['/mis-anuncios', this.nuevoAnuncio.user_id]);
      });
    }, (error: any) => {
      // Muestra una alerta de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al crear el anuncio.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ok'
      });
      console.error('Error creating advertisement:', error);
    });
  }
  getProgrammingLanguages() {
    this.apiService.getProgrammingLanguages().subscribe((response: any) => {
        this.programmingLanguages = response.data;
        console.log('ProgrammingLanguages:', this.programmingLanguages);
    });
}

}
