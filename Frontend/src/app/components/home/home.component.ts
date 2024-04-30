import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  advertisements: any = [];
  users: any = [];
  programmingLanguages: any = [];
  favoriteLists: any = [];
  showModal: boolean = false;
  newFavoriteListName: string = ''; // Variable para almacenar el nombre de la nueva lista de favoritos
  selectedFavoriteList: any = '';
  currentUserID: number | null = null;

  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentUserID = parseInt(localStorage.getItem('user_id') ?? '', 10);
    this.getAdvertisements();
    this.getUsers();
    this.getProgrammingLanguages();
    this.getFavoriteLists();
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

  getFavoriteLists() {
    // Método para obtener listas de favoritos
    this.apiService.getFavouriteLists().subscribe((favoriteLists: any) => {
      this.favoriteLists = favoriteLists;
      console.log('Favorite Lists:', favoriteLists);
    });
  }

  createCookie(advertisementId: string): void {
    localStorage.setItem('advertisement_id', advertisementId);
  }

  openForm(advertisementId: string): void {
    this.createCookie(advertisementId);
    this.showModal = true;
  }
  
  closeForm(): void {
    this.showModal = false;
  }
  
  createFavoriteList(): void {
    // Verifica si se seleccionó una lista existente
    if (this.selectedFavoriteList) {
      const userId = localStorage.getItem('user_id'); // Obtener user_id del almacenamiento local
      const advertisementId = localStorage.getItem('advertisement_id');
      
      if (userId && advertisementId) {
        const newFavoriteList1 = {
          advertisement_id: advertisementId,
          favouriteList_id: this.selectedFavoriteList // Usar el ID de la lista seleccionada
        };
  
        // Llama al método del servicio para vincular el anuncio a la lista de favoritos
        this.apiService.crearAnuncioListaFavoritos(newFavoriteList1).subscribe((response: any) => {
          console.log('Anuncio vinculado a lista de favoritos:', response);
          // Aquí puedes agregar lógica adicional si es necesario
          this.router.navigate(['/lista-favoritos', userId]);
        }, error => {
          console.error('Error al vincular el anuncio a la lista de favoritos:', error);
          // Aquí puedes manejar errores de manera apropiada
        });
      } else {
        console.error('No se encontró user_id o advertisement_id en el almacenamiento local');
        // Manejar el caso donde no se encuentra user_id o advertisement_id en el almacenamiento local
      }
    } else {
      // Si no se selecciona una lista existente, procede a crear una nueva lista
      if (this.newFavoriteListName.trim() !== '') {
        const userId = localStorage.getItem('user_id'); // Obtener user_id del almacenamiento local
        const advertisementId = localStorage.getItem('advertisement_id');
        
        if (userId && advertisementId) {
          const newFavoriteList = {
            name: this.newFavoriteListName,
            user_id: userId // Agregar user_id al objeto de la lista de favoritos
          };
  
          // Llama al método del servicio para crear la lista de favoritos
          this.apiService.crearListaFavoritos(newFavoriteList).subscribe((response: any) => {
            console.log('Nueva lista de favoritos creada:', response);
            
            const newFavoriteList1 = {
              advertisement_id: advertisementId,
              favouriteList_id: response.data.id // Usar el ID de la nueva lista de favoritos creada
            };
  
            // Llama al método del servicio para vincular el anuncio a la lista de favoritos
            this.apiService.crearAnuncioListaFavoritos(newFavoriteList1).subscribe((response: any) => {
              console.log('Anuncio vinculado a lista de favoritos:', response);
              // Aquí puedes agregar lógica adicional si es necesario
              this.router.navigate(['/lista-favoritos', userId]);
            }, error => {
              console.error('Error al vincular el anuncio a la lista de favoritos:', error);
              // Aquí puedes manejar errores de manera apropiada
            });
          }, error => {
            console.error('Error al crear la lista de favoritos:', error);
            // Aquí puedes manejar errores de manera apropiada
          });
        } else {
          console.error('No se encontró user_id o advertisement_id en el almacenamiento local');
          // Manejar el caso donde no se encuentra user_id o advertisement_id en el almacenamiento local
        }
      } else {
        console.error('El nombre de la lista de favoritos no puede estar vacío');
        // Puedes mostrar un mensaje al usuario o realizar otra acción apropiada
      }
    }
  }
  
  

}

