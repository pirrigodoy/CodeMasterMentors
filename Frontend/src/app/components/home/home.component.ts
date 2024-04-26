import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { map } from 'rxjs/operators';

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


  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getAdvertisements();
    this.getUsers();
    this.getProgrammingLanguages();
  }

  getAdvertisements() {
    this.apiService.getAdvertisements().subscribe((advertisements: any) => {
      this.advertisements = advertisements;
      // Inicialmente, mostrar todos los anuncios
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
      // Filtrar por lenguaje si se selecciona uno
      this.filteredAdvertisements = this.advertisements.data.filter((advertisement: any) => advertisement.programmingLanguage_id === languageId);
    } else {
      // Mostrar todos los anuncios si no se selecciona ningún lenguaje
      this.filteredAdvertisements = this.advertisements.data;
    }
  }

}
