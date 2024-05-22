import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.css']
})
export class AdvertisementComponent implements OnInit {
  advertisementId: string = '';
  advertisementData: any = {};
  programmingLanguages: any = [];
  users: any = [] = [];
  comments: any[] = []; // Asegúrate de que esto es un array
  filteredComments: any[] = []; // Asegúrate de que esto es un array
  currentUserRoleId: number | undefined;


  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    // Obtener advertisementId del local storage
    const advertisementIdFromStorage = localStorage.getItem('advertisement_id');
    if (advertisementIdFromStorage) {
      this.advertisementId = advertisementIdFromStorage;
    } else {
      console.error("No se encontró advertisement_id en el local storage");
      return;
    }

    this.apiService.getAdvertisementData(this.advertisementId).subscribe(
      (response) => {
        if (response.error) {
          console.error('Error al obtener los datos del anuncio:', response.message);
        } else {
          this.advertisementData = response.data;
          console.log(this.advertisementData);
        }
      },
      (error) => {
        console.error('Error al obtener los datos del anuncio:', error);
      }
    );

    this.getProgrammingLanguages();
    this.getUsers();
    this.getComments(); // Obtener los comentarios al inicializar el componente
  }

  getProgrammingLanguages() {
    this.apiService.getProgrammingLanguages().subscribe((programmingLanguages: any) => {
      this.programmingLanguages = programmingLanguages;
      console.log('ProgrammingLanguages:', programmingLanguages);
    });
  }

  getUsers() {
    return new Promise<void>((resolve, reject) => {
      this.apiService.getUsers().subscribe((response: any) => {
        console.log('API response:', response);
        if (Array.isArray(response.data)) {
          this.users = response.data;
          console.log('Users:', this.users);
          // Obtener el role_id del usuario actual
          const userIdFromStorage = localStorage.getItem('user_id');
          if (userIdFromStorage) {
            const currentUser = this.users.find((user: any) => user.id === parseInt(userIdFromStorage, 10));
            if (currentUser) {
              this.currentUserRoleId = currentUser.role_id;
            }
          }
          console.log('Current User Role ID:', this.currentUserRoleId);
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


  getComments() {
    this.apiService.getComments().subscribe((response: any) => {
      if (Array.isArray(response.data)) {
        this.comments = response.data;
        console.log('Comments:', this.comments);
        this.comments.forEach(comment => {
          console.log('Comment advertisement_id:', comment.advertisement_id);
        });
        this.filterComments();
      } else {
        console.error('Error: los comentarios no son un array:', response.data);
      }
    });
  }

  filterComments() {
    console.log('Filtering comments for advertisementId:', this.advertisementId);
    const advertisementId = parseInt(this.advertisementId, 10);
    this.filteredComments = this.comments.filter((comment: any) => {
      if (comment.advertisement_id) {
        return comment.advertisement_id === advertisementId;
      } else {
        console.warn('Comment without advertisement_id:', comment);
        return false;
      }
    });
    console.log('Filtered Comments:', this.filteredComments);
  }

  getUserName(userId: number): string {
    const user = this.users.find((user: any) => user.id === userId);
    return user ? user.name : 'Usuario desconocido';
  }

  getUserImageUrl(userId: number): string | undefined {
    const user = this.users.find((user: any) => user.id === userId);
    return user ? user.img : undefined;
  }


}
