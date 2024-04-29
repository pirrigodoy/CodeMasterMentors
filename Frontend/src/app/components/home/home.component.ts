import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  advertisements: any = [];
  users: any = [];
  programmingLanguages: any = [];

  constructor(private apiService: ApiService) { }

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

  createCookie(advertisementId: string): void {
    localStorage.setItem('advertisement_id', advertisementId);
  }

  openModal(advertisementId: string): void {
    // Obtener el modal
    const modal = document.getElementById('myModal');
  
    // Verificar si el modal existe antes de intentar acceder a él
    if (modal) {
      // Mostrar el modal
      modal.style.display = 'block';
    } else {
      console.error('Modal element not found');
    }
  }
  
  closeModal(): void {
    // Obtener el modal
    const modal = document.getElementById('myModal');
  
    // Verificar si el modal existe antes de intentar acceder a él
    if (modal) {
      // Ocultar el modal
      modal.style.display = 'none';
    } else {
      console.error('Modal element not found');
    }
  }


}

