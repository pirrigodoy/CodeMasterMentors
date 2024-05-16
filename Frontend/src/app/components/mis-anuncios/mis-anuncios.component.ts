import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import * as EmailJS from 'emailjs-com';


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

  getUsers() {
    this.apiService.getUsers().subscribe((users: any) => {
      this.users = users;

    });
  }

  getProgrammingLanguages() {
    this.apiService.getProgrammingLanguages().subscribe((programmingLanguages: any) => {
      this.programmingLanguages = programmingLanguages;
    });
  }

  modificarAnuncio(advertisementId: string): void {
    localStorage.setItem('advertisement_id', advertisementId);
    this.router.navigate(['/modificar-anuncio', advertisementId]);
  }

  borrarAnuncio(advertisementId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
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

                    // Envía el correo electrónico utilizando EmailJS
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
              // Eliminación exitosa, actualiza la lista de anuncios
              this.getAdvertisements();
            },
            (error) => {
              console.error('Error al eliminar el anuncio:', error);
              // Puedes manejar el error de acuerdo a tus necesidades, por ejemplo, mostrar un mensaje al usuario.
            }
          );
        },
        (error) => {
          console.error('Error al obtener datos del anuncio:', error);
        }
      );
    }
  }


}
