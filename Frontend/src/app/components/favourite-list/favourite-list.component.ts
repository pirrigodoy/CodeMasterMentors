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

  constructor(private apiService: ApiService) { }

  ngOnInit() {
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
  
}
