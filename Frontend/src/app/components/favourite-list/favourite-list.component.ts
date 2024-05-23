import { Component, OnInit } from '@angular/core';
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
  users: any = [];
  currentUserID: number | null = null;
  editedListName: string = '';
  showModal: boolean = false;
  selectedFavouriteList: any = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.currentUserID = parseInt(localStorage.getItem('user_id') ?? '', 10);
    this.getAdvertisements();
    this.getUsers();
    this.getFavouriteLists();
    this.getAdvertisementFavouriteLists();
  }

  /**
 * Fetches advertisements data from the ApiService's getAdvertisements method.
 * Assigns fetched advertisements data to the 'advertisements' property.
 * Logs fetched advertisements to the console.
 */
  getAdvertisements() {
    this.apiService.getAdvertisements().subscribe((advertisements: any) => {
      this.advertisements = advertisements;
      console.log('Advertisements:', advertisements);
    });
  }


  /**
 * Fetches users data from the ApiService's getUsers method.
 * Assigns fetched users data to the 'users' property.
 * Logs fetched users to the console.
 */
  getUsers() {
    this.apiService.getUsers().subscribe((users: any) => {
      this.users = users;
      console.log('Users:', users);
    });
  }


  /**
 * Fetches favorite lists data from the ApiService's getFavouriteLists method.
 * Assigns fetched favorite lists data to the 'favouriteLists' property.
 * Logs fetched favorite lists to the console.
 */
  getFavouriteLists() {
    this.apiService.getFavouriteLists().subscribe((favouriteLists: any) => {
      this.favouriteLists = favouriteLists;
      console.log('Favourite lists:', favouriteLists);
    });
  }

  /**
 * Fetches advertisement favourite lists data from the ApiService's getAdvertisementFavouriteLists method.
 * Assigns fetched advertisement favourite lists data to the 'advertisementFavouriteLists' property.
 * Logs fetched advertisement favourite lists to the console.
 * Modifies each advertisement favourite list item to include the user's image URL.
 */
  getAdvertisementFavouriteLists() {
    this.apiService.getAdvertisementFavouriteLists().subscribe((advertisementFavouriteLists: any) => {
      this.advertisementFavouriteLists = advertisementFavouriteLists;
      console.log('Advertisement favourite lists:', advertisementFavouriteLists);

      this.advertisementFavouriteLists.data.forEach((adList: any) => {
        const advertisement = this.advertisements.data.find((ad: any) => ad.id === adList.advertisement_id);
        if (advertisement) {
          const user = this.users.data.find((user: any) => user.id === advertisement.user_id);
          if (user) {
            adList.userImgUrl = user.img; // Adjust according to the image field in the 'users' table
          }
        }
      });
    });
  }


  /**
  * Retrieves the title of the advertisement with the specified advertisement ID.
  * If the advertisement is found, returns its title; otherwise, returns a default message.
  * @param {number} advertisementId - The ID of the advertisement
  * @returns {string} - The title of the advertisement, or a default message if the advertisement is not found
  */
  getAdvertisementTitle(advertisementId: number): string {
    const advertisement = this.advertisements.data.find((ad: any) => ad.id === advertisementId);
    return advertisement ? advertisement.title : 'Anuncio no encontrado';
  }


  /**
  * Deletes the specified favorite list.
  * @param {any} favouriteList - The favorite list object to be deleted
  */
  deleteList(favouriteList: any) {
    const favouriteListId = favouriteList.id;
    this.apiService.deleteFavourite_list(favouriteListId)
      .subscribe(
        response => {
          console.log('La lista de favoritos ha sido eliminada exitosamente.');
          window.location.reload();
        },
        error => {
          console.error('Ocurrió un error al eliminar la lista de favoritos:', error);
        }
      );
  }


  /**
 * Deletes the specified advertisement from the favorite lists.
 * @param {any} advertisementFavouriteLists - The advertisement favourite lists object to be deleted
 */
  deleteAdvertisementFavourite(advertisementFavouriteLists: any) {
    const advertisementFavouriteListsId = advertisementFavouriteLists.id;

    this.apiService.deleteAdvertisementFavourite_list(advertisementFavouriteListsId)
      .subscribe(
        response => {
          console.log('El anuncio ha sido eliminado de la lista de favoritos exitosamente.');
          window.location.reload();
        },
        error => {
          console.error('Ocurrió un error al eliminar el anuncio de la lista de favoritos:', error);
        }
      );
  }


  openEditModal(favouriteList: any) {
    this.selectedFavouriteList = favouriteList;
    this.editedListName = favouriteList.name;
    this.showModal = true;
  }

  closeEditModal() {
    this.showModal = false;
  }

  /**
 * Saves the edited favorite list.
 * If the edited list name is not empty, updates the favorite list with the edited name.
 * @returns {void}
 */
  saveEditedList() {
    if (this.editedListName.trim() !== '') {
      const editedFavouriteList = {
        id: this.selectedFavouriteList.id,
        name: this.editedListName,
        user_id: this.selectedFavouriteList.user_id
      };

      this.apiService.updateFavouriteList(editedFavouriteList).subscribe(
        (response: any) => {
          console.log('Lista de favoritos actualizada exitosamente:', response);
          this.selectedFavouriteList.name = this.editedListName;
          this.closeEditModal();
        },
        (error: any) => {
          console.error('Error al actualizar la lista de favoritos:', error);
        }
      );
    } else {
      console.error('El nombre de la lista de favoritos no puede estar vacío');
    }
  }

}
