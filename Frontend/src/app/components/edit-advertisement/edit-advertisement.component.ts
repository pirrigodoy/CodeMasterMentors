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

  /**
 * Initializes the component.
 * Retrieves the advertisement ID from the localStorage.
 * If the advertisement ID is not null, retrieves advertisement data and programming languages data.
 * Otherwise, logs an error indicating that the advertisement ID was not found in the localStorage.
 */
  ngOnInit(): void {
    // Retrieve the advertisementId from localStorage
    const advertisementId = localStorage.getItem('advertisement_id');

    // Check if advertisementId is not null
    if (advertisementId !== null) {
      // Call the getAdvertisementById method of ApiService to retrieve advertisement data
      this.apiService.getAdvertisementById(advertisementId).subscribe((advertisement: any) => {
        this.advertisement = advertisement.data;
        console.log('Advertisement:', advertisement);
      });

      // Retrieve programming languages data
      this.apiService.getProgrammingLanguages().subscribe((programmingLanguages: any[]) => {
        this.programmingLanguages = programmingLanguages;
        console.log('Programming Languages:', programmingLanguages);
      });
    } else {
      console.error('No se encontró advertisement_id en el localStorage.');
      // You can handle this case according to your requirements, for example, redirecting to another page.
    }
  }

  /**
  * Displays a confirmation dialog to confirm whether the user wants to save changes.
  * If confirmed, calls the updateAdvertisement method.
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
  * Updates the advertisement using the ApiService's updateAdvertisement method.
  * Displays a success message if the update is successful.
  * Redirects to the 'adManagement' route after updating the advertisement.
  * Displays an error message if there is an error updating the advertisement.
  */
  updateAdvertisement(): void {
    this.apiService.updateAdvertisement(this.advertisement).subscribe((response: any) => {
      // Display a success alert
      Swal.fire({
        icon: 'success',
        title: '¡Anuncio actualizado!',
        text: 'El anuncio se ha actualizado correctamente.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok'
      }).then((result) => {
        // Redirect to the 'adManagement' route with the user ID after updating the advertisement
        this.router.navigate(['/adManagement']);
      });
    }, (error: any) => {
      // Display an error alert
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
