import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import * as EmailJS from 'emailjs-com';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-mis-anuncios',
  templateUrl: './mis-anuncios.component.html',
  styleUrls: ['./mis-anuncios.component.css']
})
export class MisAnunciosComponent implements OnInit {
  advertisements: any = [];
  users: any = [];
  programmingLanguages: any = [];
  advertisementData: any = {};

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {


    this.getAdvertisements();
    this.getUsers();
    this.getProgrammingLanguages();
    const EMAILJS_USER_ID = 'RFJu4BW0oAhWI-OvO';
    EmailJS.init(EMAILJS_USER_ID);
  }

  /**
  * Fetches advertisements data from the ApiService's getAdvertisements method.
  * Filters advertisements based on the user_id retrieved from localStorage.
  * Assigns filtered advertisements to the 'advertisements' property.
  * Handles cases when response.data is not an array or an error occurs during the request.
  */
  getAdvertisements() {
    this.apiService.getAdvertisements().subscribe(
      (response: any) => {
        // Ensure response.data is an array before assigning
        if (Array.isArray(response.data)) {
          const userId = localStorage.getItem('user_id');
          if (userId) {
            this.advertisements = [];
            for (const ad of response.data) {
              if (ad.user_id == userId) {
                this.advertisements.push(ad);
              }
            }
          } else {
            this.advertisements = [];
          }
        } else {
          // Handle the case when response.data is not an array
          this.advertisements = [];
        }
      },
      (error) => {
        // Handle error as per your requirement
        this.advertisements = [];
      }
    );
  }


  /**
  * Fetches users data from the ApiService's getUsers method.
  * Assigns fetched users data to the 'users' property.
  */
  getUsers() {
    this.apiService.getUsers().subscribe((users: any) => {
      this.users = users;
    });
  }

  /**
 * Fetches programming languages data from the ApiService's getProgrammingLanguages method.
 * Assigns fetched programming languages data to the 'programmingLanguages' property.
 */
  getProgrammingLanguages() {
    this.apiService.getProgrammingLanguages().subscribe((programmingLanguages: any) => {
      this.programmingLanguages = programmingLanguages;
    });
  }

  /**
  * Modifies an advertisement by setting the advertisement_id in localStorage and navigating to the 'modificar-anuncio' route with the specified advertisementId.
  * @param {string} advertisementId - The ID of the advertisement to be modified
  */
  modificarAnuncio(advertisementId: string): void {
    localStorage.setItem('advertisement_id', advertisementId);
    this.router.navigate(['/modificar-anuncio', advertisementId]);
  }


  borrarAnuncio(advertisementId: string): void {
    // Utiliza SweetAlert para mostrar un mensaje de confirmación en lugar de la función confirm nativa
    Swal.fire({
      title: '¿Estás seguro de que quieres eliminar este anuncio?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma la eliminación, procede con el resto del código
        this.apiService.getAdvertisementData(advertisementId).subscribe(
          (advertisementData: any) => {
            const programmingLanguageId = advertisementData.data.programmingLanguage_id;
            const userId = localStorage.getItem('user_id');
            if (userId) {
              this.apiService.getUserData(userId).subscribe(
                (userData: any) => {
                  const userEmail = userData.data.email;
                  const userName = userData.data.name;

                  // Obtener el nombre del lenguaje de programación
                  this.apiService.getLanguageprogrammingData(programmingLanguageId).subscribe(
                    (languageData: any) => {
                      const programmingLanguage = languageData.data.languageName;

                      const templateParams = {
                        email: userEmail,
                        subject: 'Confirmación de eliminación de anuncio',
                        user_name: userName,
                        programming_language: programmingLanguage
                      };

                      // Enviar el correo electrónico utilizando EmailJS
                      EmailJS.send('service_9zm8nuc', 'template_s2efope', templateParams)
                        .then((response: any) => {
                          console.log('Correo electrónico enviado con éxito:', response);
                        })
                        .catch((error: any) => {
                          console.error('Error al enviar el correo electrónico:', error);
                        });
                    },
                    (error) => {
                      console.error('Error al obtener datos del lenguaje de programación:', error);
                    }
                  );
                },
                (error) => {
                  console.error('Error al obtener datos del usuario:', error);
                }
              );
            } else {
              console.error('No se encontró el user_id en el localStorage');
            }

            // Eliminar el anuncio después de obtener los datos necesarios
            this.apiService.deleteAdvertisement(advertisementId).subscribe(
              () => {
                // Eliminación exitosa, muestra un mensaje de confirmación utilizando SweetAlert
                Swal.fire(
                  '¡Eliminado!',
                  'El anuncio ha sido eliminado correctamente.',
                  'success'
                );
                // Actualiza la lista de anuncios
                this.getAdvertisements();
              },
              (error) => {
                console.error('Error al eliminar el anuncio:', error);
                // Maneja el error según tus requisitos, por ejemplo, mostrando un mensaje al usuario.
              }
            );
          },
          (error) => {
            console.error('Error al obtener datos del anuncio:', error);
          }
        );
      }
    });
  }

}
