import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Router, Route } from '@angular/router'; // Importa Route junto con Router y ActivatedRoute
import Swal from 'sweetalert2'; // Importa SweetAlert

@Component({
  selector: 'app-modificar-anuncio',
  templateUrl: './modificar-anuncio.component.html',
  styleUrls: ['./modificar-anuncio.component.css']
})
export class ModificarAnuncioComponent implements OnInit {
  advertisement: any = {};
  programmingLanguages: any = {};
  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) { }

  /**
 * Initializes component properties by fetching advertisement data and programming languages.
 * Retrieves advertisement data from localStorage using advertisement_id, then calls ApiService methods to fetch advertisement and programming languages data.
 * Logs retrieved data to console.
 * If advertisement_id is not found in localStorage, logs an error message and handles the case according to requirements.
 */
  ngOnInit(): void {
    // Retrieve advertisementId from localStorage
    const advertisementId = localStorage.getItem('advertisement_id');

    // Check if advertisementId is not null
    if (advertisementId !== null) {
      // Call ApiService's getAdvertisementById method to fetch advertisement data
      this.apiService.getAdvertisementById(advertisementId).subscribe((advertisement: any) => {
        this.advertisement = advertisement.data;
        console.log('Advertisement:', advertisement);
      });

      // Call ApiService's getProgrammingLanguages method to fetch programming languages data
      this.apiService.getProgrammingLanguages().subscribe((programmingLanguages: any[]) => {
        this.programmingLanguages = programmingLanguages;
        console.log('Programming Languages:', programmingLanguages);
      });
    } else {
      // Log error message if advertisement_id is not found in localStorage
      console.error('No se encontró advertisement_id en el localStorage.');
      // You can handle this case according to your requirements, for example, redirecting to another page.
    }
  }

  /**
 * Displays a confirmation dialog to confirm saving changes.
 * If user confirms, calls updateAdvertisement method.
 */
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


  /**
 * Updates the advertisement data by calling the ApiService's updateAdvertisement method.
 * Displays success or error alert messages based on the response.
 * If update is successful, redirects to the 'mis-anuncios' route with the user ID after updating the advertisement.
 */
  updateAdvertisement(): void {
    this.apiService.updateAdvertisement(this.advertisement).subscribe((response: any) => {
      // Display success alert
      Swal.fire({
        icon: 'success',
        title: '¡Anuncio actualizado!',
        text: 'El anuncio se ha actualizado correctamente.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok'
      }).then((result) => {
        // Redirect to 'mis-anuncios' route with the user ID after updating the advertisement
        this.router.navigate(['/mis-anuncios', this.advertisement.user_id]);
      });
    }, (error: any) => {
      // Display error alert
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
