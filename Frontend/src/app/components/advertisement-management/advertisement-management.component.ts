import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgModule } from '@angular/core';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-advertisement-management',
  templateUrl: './advertisement-management.component.html',
  styleUrls: ['./advertisement-management.component.css']
})
export class AdvertisementManagementComponent implements OnInit {
  advertisements: any = [];
  router: any;
  users: any = [] = [];
  programmingLanguages: any = [] = [];


  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadComments();
    this.getUsers();
    this.getProgrammingLanguages();
  }

  loadComments() {
    this.apiService.getAdvertisements().subscribe((advertisements: any[]) => {
      this.advertisements = advertisements;
    });
  }

  getUsers() {
    return new Promise<void>((resolve, reject) => {
      this.apiService.getUsers().subscribe((response: any) => {
        console.log('API response:', response);
        if (Array.isArray(response.data)) {
          this.users = response.data;
          console.log('Users:', this.users);
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

  getProgrammingLanguages() {
    return new Promise<void>((resolve, reject) => {
      this.apiService.getProgrammingLanguages().subscribe((response: any) => {
        console.log('API response:', response);
        if (Array.isArray(response.data)) {
          this.programmingLanguages = response.data;
          console.log('Users:', this.programmingLanguages);
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

  getUserName(userId: number): string {
    const user = this.users.find((user: any) => user.id === userId);
    return user ? user.name : 'Usuario desconocido';
  }

  getProgrammingName(programmingLanguageId: number): string {
    const programmingLanguage = this.programmingLanguages.find((programmingLanguage: any) => programmingLanguage.id === programmingLanguageId);
    return programmingLanguage ? programmingLanguage.languageName : 'Usuario desconocido';
  }

  eliminarAnuncio(advertisementId: string) {
    Swal.fire({
      title: 'Are you sure you want to delete this advertisement?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteAdvertisement(advertisementId).subscribe(
          response => {
            console.log('Advertisement deleted successfully:', response);
            // Realizar cualquier acción adicional después de eliminar el anuncio
            Swal.fire('Advertisement deleted!', '', 'success').then(() => {
              // Refrescar la página después de eliminar el anuncio
              window.location.reload();
            });
          },
          error => {
            console.error('Error deleting advertisement:', error);
            // Manejar el error en caso de que ocurra
            Swal.fire('Error', 'Failed to delete advertisement', 'error');
          }
        );
      }
    });
  }





}
