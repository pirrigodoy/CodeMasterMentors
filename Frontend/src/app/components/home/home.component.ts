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
  searchQuery: string = '';
  filteredAdvertisements: any = [];
  favoriteLists: any = [];
  showModal: boolean = false;
  newFavoriteListName: string = '';
  selectedFavoriteList: any = '';
  currentUserID: number | null = null;
  minPrice: number = 0;
  maxPrice: number = 0;
  priceFilter: number = 0;
  showPriceModal: boolean = false;
  currentPriceFilter: number = 0;
  showDropdown: boolean = false;


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
      this.filteredAdvertisements = advertisements.data;
    });
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

  createCookie(advertisementId: string): void {
    localStorage.setItem('advertisement_id', advertisementId);
  }

  filterByLanguage(languageId: string | null) {
    if (languageId) {
      this.filteredAdvertisements = this.advertisements.data.filter((advertisement: any) => advertisement.programmingLanguage_id === languageId);
    } else {
      this.filteredAdvertisements = this.advertisements.data;
    }
  }

  getFavoriteLists() {
    this.apiService.getFavouriteLists().subscribe((favoriteLists: any) => {
      this.favoriteLists = favoriteLists;
    });
  }

  createFavoriteList(): void {
    if (this.selectedFavoriteList) {
      const userId = localStorage.getItem('user_id');
      const advertisementId = localStorage.getItem('advertisement_id');

      if (userId && advertisementId) {
        const newFavoriteList1 = {
          advertisement_id: advertisementId,
          favouriteList_id: this.selectedFavoriteList
        };

        this.apiService.crearAnuncioListaFavoritos(newFavoriteList1).subscribe((response: any) => {
          this.router.navigate(['/lista-favoritos', userId]);
        }, error => {
          console.error('Error al vincular el anuncio a la lista de favoritos:', error);
        });
      } else {
        console.error('No se encontró user_id o advertisement_id en el almacenamiento local');
      }
    } else {
      if (this.newFavoriteListName.trim() !== '') {
        const userId = localStorage.getItem('user_id');
        const advertisementId = localStorage.getItem('advertisement_id');

        if (userId && advertisementId) {
          const newFavoriteList = {
            name: this.newFavoriteListName,
            user_id: userId
          };

          this.apiService.crearListaFavoritos(newFavoriteList).subscribe((response: any) => {
            const newFavoriteList1 = {
              advertisement_id: advertisementId,
              favouriteList_id: response.data.id
            };

            this.apiService.crearAnuncioListaFavoritos(newFavoriteList1).subscribe((response: any) => {
              this.router.navigate(['/lista-favoritos', userId]);
            }, error => {
              console.error('Error al vincular el anuncio a la lista de favoritos:', error);
            });
          }, error => {
            console.error('Error al crear la lista de favoritos:', error);
          });
        } else {
          console.error('No se encontró user_id o advertisement_id en el almacenamiento local');
        }
      } else {
        console.error('El nombre de la lista de favoritos no puede estar vacío');
      }
    }
  }

  openForm(advertisementId: string): void {
    this.createCookie(advertisementId);
    this.showModal = true;
  }

  closeForm(): void {
    this.showModal = false;
  }

  openPriceModal() {
    this.showPriceModal = true;
  }

  closePriceModal() {
    this.showPriceModal = false;
  }

  applyPriceFilter() {
    this.searchByPrice();
    this.closePriceModal();
  }

  searchByPrice() {
    if (Array.isArray(this.advertisements.data)) {
      this.filteredAdvertisements = this.advertisements.data.filter((advertisement: any) => {
        const price = advertisement.price_hour;
        return price >= this.minPrice && price <= this.maxPrice;
      });
    } else {
      console.error('this.advertisements.data no es un array.');
    }
  }

  onPriceFilterChange() {
    this.currentPriceFilter = this.priceFilter;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
}
