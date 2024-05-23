// mis-anuncios.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import * as EmailJS from 'emailjs-com';


@Component({
  selector: 'app-mis-anuncios',
  templateUrl: './crear-anuncio.component.html',
  styleUrls: ['./crear-anuncio.component.css']
})
export class CrearAnuncioComponent implements OnInit {
  nuevoAnuncio: any = {
    user_id: localStorage.getItem('user_id') // Obtener user_id del local_storage
  };  // Objeto para almacenar los datos del nuevo anuncio
  programmingLanguages: any = [];
  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {

    this.getProgrammingLanguages();
    const EMAILJS_USER_ID = 'ZZGv2rSlsn03aidsX';
    EmailJS.init(EMAILJS_USER_ID);
  }
  /**
 * Creates an advertisement by sending the form data to the server if all fields are valid.
 * Converts the price per hour to a number before sending it to the server.
 * Displays a success message after creating the advertisement and sends an email confirmation.
 * Redirects to the 'mis-anuncios' route after creating the advertisement.
 * Displays a message if the form is invalid.
 */
  crearAnuncio(): void {
    // Send the form to the server if all fields are valid
    if (this.validateForm()) {
      // Convert the price per hour to a number before sending it to the server
      this.nuevoAnuncio.price_hour = parseFloat(this.nuevoAnuncio.price_hour);

      // Call the API service to create the advertisement
      this.apiService.crearAnuncio(this.nuevoAnuncio).subscribe((response: any) => {
        console.log('Anuncio creado:', response);

        const userId = response.data.user_id;
        const programmingLanguageId = response.data.programmingLanguage_id;

        // Get user data to send an email confirmation
        this.apiService.getUserData(userId).subscribe((userData: any) => {
          const userEmail = userData.data.email;
          const userName = userData.data.name;

          // Get the programming language data
          this.apiService.getLanguageprogrammingData(programmingLanguageId).subscribe((languageData: any) => {
            const languageName = languageData.data.languageName;

            const templateParams = {
              your_email: userEmail,
              subject: 'Confirmación de creación de anuncio',
              message: `Has creado un anuncio de ${languageName}`,
              to_name: userName,
              language_programming: languageName
            };

            // Send the email using EmailJS
            EmailJS.send('service_32gackn', 'template_7amm96p', templateParams)
              .then((response: any) => {
                console.log('Correo electrónico enviado con éxito:', response);
              })
              .catch((error: any) => {
                console.error('Error al enviar el correo electrónico:', error);
              });

            // Redirect to 'mis-anuncios' route
            const advertisementId = localStorage.getItem('advertisement_id');
            this.router.navigate(['/mis-anuncios', advertisementId]);
          });
        });
      });
    } else {
      console.log('Formulario inválido');
    }
  }




  /**
 * Retrieves programming languages from the API service and assigns them to the component property.
 * Logs the retrieved programming languages to the console.
 */
  getProgrammingLanguages() {
    this.apiService.getProgrammingLanguages().subscribe((response: any) => {
      this.programmingLanguages = response.data;
      console.log('ProgrammingLanguages:', this.programmingLanguages);
    });
  }



  /**
 * Validates the form fields for creating a new advertisement.
 * Returns true if all fields are valid; otherwise, returns false.
 */
  validateForm(): boolean {
    // Validate each field of the form
    if (!this.nuevoAnuncio.title || this.nuevoAnuncio.title.length < 6) {
      return false;
    }
    if (!this.nuevoAnuncio.class) {
      return false;
    }
    if (!this.nuevoAnuncio.about_me) {
      return false;
    }
    if (!this.nuevoAnuncio.description) {
      return false;
    }
    if (!this.nuevoAnuncio.price_hour) {
      return false;
    }
    if (!this.nuevoAnuncio.disponibility) {
      return false;
    }
    if (!this.nuevoAnuncio.experience) {
      return false;
    }
    if (!this.nuevoAnuncio.programmingLanguage_id) {
      return false;
    }
    // You can add more validations for other fields here
    return true;
  }

}
