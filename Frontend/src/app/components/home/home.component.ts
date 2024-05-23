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
  comments: any = [];
  showZoneModal: boolean = false;
  selectedCity: number | null = null;
  selectedLanguageId: string | null = null;
  averageRatings: { [key: number]: number } = {};


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

  /**
  * Fetches cities data from the ApiService's getCities method.
  * Assigns fetched cities data to the 'cities' property.
  * Logs fetched cities to the console.
  */
  getCities() {
    this.apiService.getCities().subscribe((cities: any) => {
      this.cities = cities;
      console.log('cities:', cities);
    });
  }


  /**
 * Fetches comments data from the ApiService's getComments method.
 * Assigns fetched comments data to the 'comments' property.
 * Calculates average ratings based on the fetched comments.
 * Assigns calculated average ratings to the 'averageRatings' property.
 * Logs fetched comments and calculated average ratings to the console.
 */
  getComments() {
    this.apiService.getComments().subscribe((comments: any) => {
      this.comments = comments;
      console.log('comments:', comments);
      this.averageRatings = this.calculateAverageRatings();
      console.log('averageRatings:', this.averageRatings);
    });
  }


  /**
 * Fetches advertisements data from the ApiService's getAdvertisements method.
 * Assigns fetched advertisements data to the 'advertisements' property.
 * Logs fetched advertisements to the console.
 * Initializes the 'filteredAdvertisements' property with the fetched advertisements data.
 */
  getAdvertisements() {
    this.apiService.getAdvertisements().subscribe((advertisements: any) => {
      this.advertisements = advertisements;
      console.log('Fetched advertisements:', advertisements);
      this.filteredAdvertisements = advertisements.data;
    });
  }


  /**
 * Fetches users data from the ApiService's getUsers method.
 * Assigns fetched users data to the 'users' property.
 */
  getUsers() {
    this.apiService.getUsers().subscribe((users: any) => {
      this.users = users;
    });
  }


  /**
  * Fetches programming languages data from the ApiService's getProgrammingLanguages method.
  * Assigns fetched programming languages data to the 'programmingLanguages' property.
  */
  getProgrammingLanguages() {
    this.apiService.getProgrammingLanguages().subscribe((programmingLanguages: any) => {
      this.programmingLanguages = programmingLanguages;
    });
  }


  /**
 * Creates a cookie with the advertisement ID and sets the receiver ID in localStorage.
 * @param {string} advertisementId - The ID of the advertisement
 */
  createCookie(advertisementId: string): void {
    localStorage.setItem('advertisement_id', advertisementId);

    const advertisement = this.advertisements.data.find((advertisement: any) => advertisement.id === advertisementId);
    if (advertisement) {
      const userId = advertisement.user_id;
      localStorage.setItem('receiver', userId);
    }
  }


  /**
 * Filters advertisements based on selected filters such as programming language, price range, and city.
 * Updates the 'filteredAdvertisements' property with the filtered advertisements.
 */
  filterAdvertisements() {
    this.filteredAdvertisements = this.advertisements.data.filter((advertisement: any) => {
      const matchesLanguage = this.selectedLanguageId ? advertisement.programmingLanguage_id === this.selectedLanguageId : true;
      const matchesPrice = advertisement.price_hour >= this.minPrice && advertisement.price_hour <= this.maxPrice;
      const user = this.users.data.find((user: any) => user.id === advertisement.user_id);
      const matchesCity = this.selectedCity ? user && user.city_id === this.selectedCity : true;
      return matchesLanguage && matchesPrice && matchesCity;
    });
  }


  /**
 * Sets the selected language ID and filters advertisements accordingly.
 * @param {string | null} languageId - The ID of the selected language, or null if no language is selected
 */
  filterByLanguage(languageId: string | null) {
    this.selectedLanguageId = languageId;
    this.filterAdvertisements();
  }


  /**
  * Fetches favorite lists data from the ApiService's getFavouriteLists method.
  * Assigns fetched favorite lists data to the 'favoriteLists' property.
  */
  getFavoriteLists() {
    this.apiService.getFavouriteLists().subscribe((favoriteLists: any) => {
      this.favoriteLists = favoriteLists;
    });
  }


  /**
 * Creates a new favorite list or adds the advertisement to an existing favorite list.
 * Redirects to the favorite lists page after creating or updating the favorite list.
 */
  createFavoriteList(): void {
    // Check if the user is authenticated
    if (!localStorage.getItem('user_id')) {
      this.router.navigate(['/login']); // Redirect to the login page
      return;
    }

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

  /**
  * Calculates the average ratings for each advertisement based on the comments data.
  * Returns an object containing the average ratings for each advertisement.
  * @returns {Object} - An object containing the average ratings for each advertisement
  */
  calculateAverageRatings() {
    const ratingsSum: { [key: number]: { sum: number, count: number } } = {};

    // Check if comments data exists and is an array
    if (this.comments.data && Array.isArray(this.comments.data)) {
      console.log('Complete comments data:', JSON.stringify(this.comments.data, null, 2));

      this.comments.data.forEach((comment: { advertisement_id: number; rating: number }) => {
        console.log('Processing comment:', comment);
        const advertisementId = comment.advertisement_id;
        const rating = comment.rating;
        console.log('Advertisement ID:', advertisementId);
        console.log('Rating:', rating);

        if (advertisementId !== undefined && rating !== undefined) {
          if (ratingsSum[advertisementId]) {
            ratingsSum[advertisementId].sum += rating;
            ratingsSum[advertisementId].count += 1;
          } else {
            ratingsSum[advertisementId] = { sum: rating, count: 1 };
          }
        } else {
          console.error('advertisement_id or rating is undefined:', { advertisementId, rating });
        }
      });
    } else {
      console.error('comments.data is not a valid array:', this.comments);
    }

    const averageRatings: { [key: number]: number } = {};

    for (const advertisementId in ratingsSum) {
      if (ratingsSum.hasOwnProperty(advertisementId)) {
        const { sum, count } = ratingsSum[advertisementId];
        if (count !== 0) {
          averageRatings[advertisementId] = sum / count;
        } else {
          averageRatings[advertisementId] = 0;
        }
      }
    }

    console.log('Average Ratings:', averageRatings);
    return averageRatings;
  }


  round(value: number): number {
    return Math.round(value);
  }

  /**
 * Retrieves the role ID of the user with the specified user ID.
 * If the user ID is null or undefined, returns 0 or any other default value according to your logic.
 * @param {number | null} userId - The ID of the user
 * @returns {number} - The role ID of the user, or 0 if the user is not found or the user ID is null/undefined
 */
  getUserRole(userId: number | null): number {
    if (!userId) return 0; // If userId is null or undefined, returns 0 or any other default value according to your logic

    const user = this.users.data.find((user: any) => user.id === userId);
    if (user) {
      return user.role_id; // Assuming role_id is an attribute of your user object
    } else {
      return 0; // If user is not found, returns 0 or any other default value according to your logic
    }
  }


}
