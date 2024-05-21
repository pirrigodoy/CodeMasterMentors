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
  maxPrice: number = 100;
  priceFilter: number = 0;
  showPriceModal: boolean = false;
  currentPriceFilter: number = 0;
  showDropdown: boolean = false;
  cities: any = [];
  comments: any[] = [];
  showZoneModal: boolean = false;
  selectedCity: number | null = null;
  selectedLanguageId: string | null = null;

  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentUserID = parseInt(localStorage.getItem('user_id') ?? '', 10);

    this.getAdvertisements();
    this.getUsers();
    this.getCities();
    this.getProgrammingLanguages();
    this.getFavoriteLists();
    this.getComments();
  }

  getCities() {
    this.apiService.getCities().subscribe((cities: any) => {
      this.cities = cities;
      console.log('cities:', cities);
    });
  }

  getComments() {
    this.apiService.getComments().subscribe(
      (comments: any) => {
        if (Array.isArray(comments)) {
          this.comments = comments;
          console.log('Fetched comments:', this.comments);
        } else {
          console.log('Comments data is not an array:', comments);
          this.comments = [];
        }
      },
      error => {
        console.error('Error fetching comments:', error);
      }
    );
  }




  getAdvertisements() {
    this.apiService.getAdvertisements().subscribe((advertisements: any) => {
      this.advertisements = advertisements;
      console.log('Fetched advertisements:', advertisements);
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

    const advertisement = this.advertisements.data.find((advertisement: any) => advertisement.id === advertisementId);
    if (advertisement) {
      const userId = advertisement.user_id;
      localStorage.setItem('receiver', userId);
    }
  }

  filterAdvertisements() {
    this.filteredAdvertisements = this.advertisements.data.filter((advertisement: any) => {
      const matchesLanguage = this.selectedLanguageId ? advertisement.programmingLanguage_id === this.selectedLanguageId : true;
      const matchesPrice = advertisement.price_hour >= this.minPrice && advertisement.price_hour <= this.maxPrice;
      const user = this.users.data.find((user: any) => user.id === advertisement.user_id);
      const matchesCity = this.selectedCity ? user && user.city_id === this.selectedCity : true;
      return matchesLanguage && matchesPrice && matchesCity;
    });
  }

  filterByLanguage(languageId: string | null) {
    this.selectedLanguageId = languageId;
    this.filterAdvertisements();
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

        this.apiService.createAdvertisementListaFavoritos(newFavoriteList1).subscribe((response: any) => {
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

            this.apiService.createAdvertisementListaFavoritos(newFavoriteList1).subscribe((response: any) => {
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
    this.filterAdvertisements();
    this.closePriceModal();
  }

  onPriceFilterChange() {
    this.currentPriceFilter = this.priceFilter;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  openZoneModal() {
    this.showZoneModal = true;
  }

  closeZoneModal() {
    this.showZoneModal = false;
  }

  applyZoneFilter() {
    this.filterAdvertisements();
    this.closeZoneModal();
  }


  calculateAverageRating(advertisementId: number): number {
    const advertisementComments = this.comments.filter((comment: any) => comment.advertisement_id === advertisementId);
    if (advertisementComments.length === 0) {
      return 0; // If there are no comments, return 0 stars.
    }

    const totalRating = advertisementComments.reduce((sum: number, comment: any) => sum + comment.rating, 0);
    return totalRating / advertisementComments.length;
  }


  round(value: number): number {
    return Math.round(value);
  }



}
