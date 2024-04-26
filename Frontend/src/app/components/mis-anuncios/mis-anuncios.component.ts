import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router'; 


@Component({
  selector: 'app-mis-anuncios',
  templateUrl: './mis-anuncios.component.html',
  styleUrls: ['./mis-anuncios.component.css']
})
export class MisAnunciosComponent implements OnInit{
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
        console.log('Response:', response); // Log the response
        // Ensure response.data is an array before assigning
        if (Array.isArray(response.data)) {
          const userId = localStorage.getItem('user_id');
          console.log('User ID from localStorage:', userId);
          if (userId) {
            this.advertisements = [];
            console.log('Before filtering, User ID:', userId);
            for (const ad of response.data) {
              console.log('Advertisement user_id:', ad.user_id);
              if (ad.user_id == userId) {
                this.advertisements.push(ad);
                console.log('Match found:', ad);
              }
            }
            console.log('After filtering, Advertisements:', this.advertisements);
          } else {
            this.advertisements = [];
          }
        } else {
          // Handle the case when response.data is not an array
          console.error('Error: Response data is not an array');
          this.advertisements = [];
        }
      },
      (error) => {
        console.error('Error fetching advertisements:', error);
        // Handle error as per your requirement
        this.advertisements = [];
      }
    );
  }
  
  
  
  
  
  

  getUsers() {
    this.apiService.getUsers().subscribe((users: any) => {
      this.users = users;
       console.log('Users:', users);

    });
  }

  getProgrammingLanguages() {
    this.apiService.getProgrammingLanguages().subscribe((programmingLanguages: any) => {
      this.programmingLanguages = programmingLanguages;
       console.log('ProgrammingLanguages:', programmingLanguages);
    });
  }

  modificarAnuncio(advertisementId: string): void {
    localStorage.setItem('advertisement_id', advertisementId);
    this.router.navigate(['/modificar-anuncio',advertisementId ]);
  }

  borrarAnuncio(advertisementId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
      this.apiService.deleteAdvertisement(advertisementId).subscribe(
        () => {
          // Eliminación exitosa, actualiza la lista de anuncios
          this.getAdvertisements();
          console.log('Anuncio eliminado correctamente.');
        },
        (error) => {
          console.error('Error al eliminar el anuncio:', error);
          // Puedes manejar el error de acuerdo a tus necesidades, por ejemplo, mostrar un mensaje al usuario.
        }
      );
    }
  }
  


  
}
