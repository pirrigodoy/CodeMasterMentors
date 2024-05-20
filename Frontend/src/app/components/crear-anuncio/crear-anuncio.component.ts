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
  crearAnuncio(): void {

    // Aquí puedes enviar el formulario al servidor si todos los campos son válidos
    if (this.validateForm()) {
      // Convertir el precio por hora a número antes de enviarlo al servidor
      this.nuevoAnuncio.price_hour = parseFloat(this.nuevoAnuncio.price_hour); // Convertir a número
      this.apiService.crearAnuncio(this.nuevoAnuncio).subscribe((response: any) => {
        console.log('Anuncio creado:', response);

        const userId = response.data.user_id;
        const programmingLanguageId = response.data.programmingLanguage_id;

        this.apiService.getUserData(userId).subscribe((userData: any) => {
          const userEmail = userData.data.email;
          const userName = userData.data.name;

          // Obtener los datos del lenguaje de programación
          this.apiService.getLanguageprogrammingData(programmingLanguageId).subscribe((languageData: any) => {
            const languageName = languageData.data.languageName;

            const templateParams = {
              your_email: userEmail,
              subject: 'Confirmación de creación de anuncio',
              message: `Has creado un anuncio de ${languageName}`,
              to_name: userName,
              language_programming: languageName
            };

            // Envía el correo electrónico utilizando EmailJS
            EmailJS.send('service_32gackn', 'template_7amm96p', templateParams)
              .then((response: any) => {
                console.log('Correo electrónico enviado con éxito:', response);
              })
              .catch((error: any) => {
                console.error('Error al enviar el correo electrónico:', error);
              });

            const advertisementId = localStorage.getItem('advertisement_id');
            this.router.navigate(['/mis-anuncios', advertisementId]);
          });
        });
      });
    } else {
      console.log('Formulario inválido');
    }



  }



  getProgrammingLanguages() {
    this.apiService.getProgrammingLanguages().subscribe((response: any) => {
      this.programmingLanguages = response.data;
      console.log('ProgrammingLanguages:', this.programmingLanguages);
    });
  }


  validateForm(): boolean {
    // Validar cada campo del formulario
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
    // Puedes agregar más validaciones para otros campos aquí
    return true;
  }
}
