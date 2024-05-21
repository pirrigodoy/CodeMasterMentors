import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router'; // Importa Router
import * as EmailJS from 'emailjs-com';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any = [];
  roles: any = [] = [];

  constructor(private apiService: ApiService, private router: Router) { } // Inyecta Router en el constructor

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
    this.getRoles();
    const EMAILJS_USER_ID = 'ZZGv2rSlsn03aidsX';
    EmailJS.init(EMAILJS_USER_ID);
  }

  loadUsers() {
    this.apiService.getUsers().subscribe((users: any[]) => {
      this.users = users;
    });
  }

  loadRoles() {
    this.apiService.getRoles().subscribe((roles: any[]) => {
      this.roles = roles;
    });
  }

  getRoles() {
    return new Promise<void>((resolve, reject) => {
      this.apiService.getRoles().subscribe((response: any) => {
        console.log('API response:', response);
        if (Array.isArray(response.data)) {
          this.roles = response.data;
          console.log('Users:', this.roles);
          resolve();
        } else {
          console.error('Error: los usuarios no son un array:', response.data);
          reject('Error: los usuarios no son un array');
        }
      }, error => {
        console.error('Error al obtener los usuarios:', error);
        reject(error);
      });
    });
  }

  getRoleName(roleId: string): string {
    const role = this.roles.find((role: any) => role.id === roleId);
    return role ? role.name : 'Unknown Role';
  }


  eliminarUsuario(userId: string) {
    Swal.fire({
      title: 'Are you sure you want to delete this user?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.getUserData(userId).subscribe(
          userData => {
            const userEmail = userData.data.email;
            if (!userEmail) {
              console.error('El correo electrónico del usuario está vacío.');
              return;
            } // Accede al correo electrónico del usuario
            const userName = userData.data.name;
            console.log(userName);
            console.log(userEmail);

            // Continuar con la lógica de eliminación del usuario
            this.apiService.deleteUser(userId).subscribe(
              response => {
                console.log('User deleted successfully:', response);
                // Envía un correo electrónico al usuario eliminado
                const templateParams = {
                  your_email: userEmail,
                  subject: 'Confirmación de eliminación de cuenta',
                  message: 'Tu cuenta ha sido eliminada con éxito.',
                  to_name: userName
                };

                EmailJS.send('service_32gackn', 'template_g8ykurf', templateParams)
                  .then((response: any) => {
                    console.log('Correo electrónico enviado con éxito:', response);
                  })
                  .catch((error: any) => {
                    console.error('Error al enviar el correo electrónico:', error);
                  });

                Swal.fire('User deleted!', '', 'success');
                this.router.navigate(['/userManagement']);
              },
              error => {
                console.error('Error deleting user:', error);
                Swal.fire('Error', 'Failed to delete user', 'error');
              }
            );
          },
          error => {
            console.error('Error getting user data:', error);
            Swal.fire('Error', 'Failed to get user data', 'error');
          }
        );
      }
    });
  }



}
