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
  showModal: boolean = false;

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

  openForm(advertisementId: string): void {
    this.showModal = true;
  }
  
  closeForm(): void {
    this.showModal = false;
  }
  


}

