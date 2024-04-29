import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';


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
    }
  }

}
