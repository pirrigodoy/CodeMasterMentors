import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-advertisement',
  templateUrl: './edit-advertisement.component.html',
  styleUrls: ['./edit-advertisement.component.css']
})
export class EditAdvertisementComponent {
  advertisement: any = {};
  programmingLanguages: any = {};
  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    // Obtenemos el advertisementId del localStorage
    const advertisementId = localStorage.getItem('advertisement_id');

    // Verificamos si advertisementId no es null
    if (advertisementId !== null) {
      // Llamamos al método getAdvertisementById del ApiService para obtener los datos del anuncio
      this.apiService.getAdvertisementById(advertisementId).subscribe((advertisement: any) => {
        this.advertisement = advertisement.data;
        console.log('Advertisement:', advertisement);
      });

      this.apiService.getProgrammingLanguages().subscribe((programmingLanguages: any[]) => {
        this.programmingLanguages = programmingLanguages;
        console.log('Programming Languages:', programmingLanguages);
      });
    } else {
      console.error('No se encontró advertisement_id en el localStorage.');
      // Puedes manejar este caso de acuerdo a tus necesidades, por ejemplo, redirigiendo a otra página.
    }


  }
  confirmarActualizacion(): void {
    Swal.fire({
      title: '¿Estás seguro de guardar los cambios?',
      text: 'Una vez guardados, los cambios no se podrán deshacer.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar cambios',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateAdvertisement();
      }
    });
  }
  updateAdvertisement(): void {
    this.apiService.updateAdvertisement(this.advertisement).subscribe((response: any) => {
      // Muestra una alerta de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Anuncio actualizado!',
        text: 'El anuncio se ha actualizado correctamente.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok'
      }).then((result) => {
        // Redirige a la ruta mis-anuncios con el ID de usuario después de actualizar el anuncio
        this.router.navigate(['/adManagement']);
      });
    }, (error: any) => {
      // Muestra una alerta de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al actualizar el anuncio.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ok'
      });
      console.error('Error updating advertisement:', error);
    });
  }
}
