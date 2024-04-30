import { Component, OnInit} from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-favourite-list',
  templateUrl: './favourite-list.component.html',
  styleUrls: ['./favourite-list.component.css']
})
export class FavouriteListComponent implements OnInit {
  advertisements: any = [];
  favouriteLists: any = [];
  advertisementFavouriteLists: any = [];
  currentUserID: number | null = null;
  editedListName: string = '';
  showModal: boolean = false;
  selectedFavouriteList: any = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.currentUserID = parseInt(localStorage.getItem('user_id') ?? '', 10);
    this.getAdvertisements();
    this.getFavouriteLists();
    this.getAdvertisementFavouriteLists();
  }

  getAdvertisements() {
    this.apiService.getAdvertisements().subscribe((advertisements: any) => {
      this.advertisements = advertisements;
      console.log('Advertisements:', advertisements);
    });
  }

  getFavouriteLists() {
    this.apiService.getFavouriteLists().subscribe((favouriteLists: any) => {
      this.favouriteLists = favouriteLists;
      console.log('favourite_list:', favouriteLists);
    });
  }

  getAdvertisementFavouriteLists() {
    this.apiService.getAdvertisementFavouriteLists().subscribe((advertisementFavouriteLists: any) => {
      this.advertisementFavouriteLists = advertisementFavouriteLists;
      console.log('AdvertisementsFavorite_list:', advertisementFavouriteLists);
    });
  }

  getAdvertisementTitle(advertisementId: number): string {
    const advertisement = this.advertisements.data.find((ad: any) => ad.id === advertisementId);
    return advertisement ? advertisement.title : 'Anuncio no encontrado';
  }

  
  deleteList(favouriteList: any) {
    const favouriteListId = favouriteList.id;
    this.apiService.deleteFavourite_list(favouriteListId)
      .subscribe(
        response => {
          console.log('La lista de favoritos ha sido eliminada exitosamente.');
          window.location.reload();
          // Aquí puedes actualizar cualquier otra lógica de tu componente después de eliminar la lista
        },
        error => {
          console.error('Ocurrió un error al eliminar la lista de favoritos:', error);
          // Manejo de errores, si es necesario
        }
      );
  }

 openEditModal(favouriteList: any) {
  this.selectedFavouriteList = favouriteList;
    this.editedListName = favouriteList.name;
    this.showModal = true; // Mostrar el modal al hacer clic en el botón "Editar"
  }
  
  closeEditModal() {
    this.showModal = false; // Ocultar el modal al hacer clic en el botón "Cerrar"
  }

  enableSaveButton() {
    // Habilita el botón de guardar si el nombre de la lista editado es diferente al nombre original
    return this.editedListName.trim() !== '' && this.editedListName !== this.getFavouriteLists.name;
  }

  saveEditedList() {
    // Verificar si el nombre editado es diferente al original
    if (this.editedListName.trim() !== '') {
      // Crear un objeto con los datos actualizados de la lista de favoritos
      const editedFavouriteList = {
        id: this.selectedFavouriteList.id,
        name: this.editedListName,
        user_id: this.selectedFavouriteList.user_id // Agregar el user_id
      };
  
      // Llamar al método del servicio para actualizar la lista de favoritos
      this.apiService.updateFavouriteList(editedFavouriteList).subscribe(
        (response: any) => {
          console.log('Lista de favoritos actualizada exitosamente:', response);
          // Actualizar el nombre de la lista en la lista local
          this.selectedFavouriteList.name = this.editedListName;
          // Cerrar el modal después de la actualización
          this.closeEditModal();
        },
        (error: any) => {
          console.error('Error al actualizar la lista de favoritos:', error);
          // Manejar errores, si es necesario
        }
      );
    } else {
      console.error('El nombre de la lista de favoritos no puede estar vacío');
      // Puedes mostrar un mensaje al usuario o realizar otra acción apropiada
    }
  }

  deleteAdvertisementFavourite_list(advertisementListId: string){
    this.apiService.deleteAdvertisementFavourite_list(advertisementListId)
      .subscribe(
        response => {
          console.log('El anuncio ha sido eliminado de la lista de favoritos exitosamente.');
          // Eliminar el anuncio de la lista local advertisementFavouriteLists
          this.advertisementFavouriteLists.data = this.advertisementFavouriteLists.data.filter((item: any) => item.id !== advertisementListId);
        },
        error => {
          console.error('Ocurrió un error al eliminar el anuncio de la lista de favoritos:', error);
          // Manejo de errores, si es necesario
        }
      );
  }
  
  
}
