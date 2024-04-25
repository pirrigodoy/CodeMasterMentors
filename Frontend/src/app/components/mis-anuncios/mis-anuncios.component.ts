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
    this.apiService.getAdvertisements().subscribe((advertisements: any) => {
      this.advertisements = advertisements;
       console.log('Advertisements:', advertisements);

    });
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
