import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service'; // Importa el servicio de autenticación

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as EmailJS from 'emailjs-com';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: string = '';
  userData: any = {};
  isEditing: boolean = false;
  selectedFile: File | null = null;
  deleteCheckbox: boolean = false; // Agregar esta línea para definir la variable deleteCheckbox
  deleteButtonClass: string = 'bg-red-700'; // Variable para controlar la clase CSS del botón "Eliminar"
  deleteButtonColor: string = 'bg-gray-500'; // Inicialmente gris

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {

    const userIdParam = this.route.snapshot.paramMap.get('userId');
    if (userIdParam) {
      this.userId = userIdParam;
    } else {
      console.error("No se proporcionó un ID de usuario en la URL");
    }

    this.apiService.getUserData(this.userId).subscribe(
      (response) => {
        if (response.error) {
          console.error('Error al obtener los datos del usuario:', response.message);
        } else {
          this.userData = response.data;
          console.log(this.userData);
        }
      },
      (error) => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    );
    const EMAILJS_USER_ID = 'a68ncIwtUgoSeP9S6';
    EmailJS.init(EMAILJS_USER_ID);
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  updateDeleteButtonClass() {
    if (this.deleteCheckbox) {
      this.deleteButtonColor = 'bg-red-700'; // Cambia a rojo si el checkbox está marcado
    } else {
      this.deleteButtonColor = 'bg-gray-500'; // Vuelve a gris si el checkbox está desmarcado
    }
  }

  saveChanges() {
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.apiService.updateUserData(this.userData).subscribe(
          (data) => {
            console.log('Cambios guardados exitosamente:', data);
            this.isEditing = false;
            Swal.fire('Saved!', '', 'success').then(() => {
              window.location.reload();
            });
          },
          (error) => {
            console.error('Error al guardar los cambios:', error);
          }
        );
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
        this.isEditing = false;
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    // Subir la imagen al servidor
    this.apiService.uploadImage(file).subscribe(
      (response: any) => {
        if (response.url) { // Verifica si la URL de la imagen está presente en la respuesta
          // Guarda la ruta de la imagen en userData
          this.userData.img = response.url;
        } else {
          console.error('Error al subir la imagen:', response.message);
        }
      },
      (error: any) => {
        console.error('Error al subir la imagen:', error);
      }
    );
  }



  deleteUser() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará permanentemente tu perfil.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteUser(this.userId).subscribe(
          (response: any) => {
            console.log('pppppp', response)
            if (response) {


              const templateParams = {
                to_email: this.userData.email, // Suponiendo que la dirección de correo electrónico del usuario está almacenada en userData.email
                subject: 'Confirmación de eliminación de cuenta',
                message: 'Tu cuenta ha sido eliminada con éxito.',
                user_name: this.userData.name
              };

              EmailJS.send('service_b0ebhe5', 'template_5bn545g', templateParams)
                .then((response: any) => {
                  console.log('Correo electrónico enviado con éxito:', response);
                })
                .catch((error: any) => {
                  console.error('Error al enviar el correo electrónico:', error);
                });
              // Usuario eliminado con éxito
              Swal.fire(
                '¡Eliminado!',
                'Tu perfil ha sido eliminado.',
                'success'
              ).then(() => {
                // Redirige a la página de inicio o a otro lugar apropiado después de eliminar el usuario
                this.authService.logout();
                this.router.navigate(['/']);
              });
            }
          },
          (error: any) => {
            // Si hay un error en la solicitud HTTP
            console.error('Error al eliminar el usuario:', error);
            Swal.fire(
              'Error',
              'Hubo un problema al intentar eliminar tu perfil. Por favor, inténtalo de nuevo más tarde.',
              'error'
            );
          }
        );

      }
    });
  }
}
