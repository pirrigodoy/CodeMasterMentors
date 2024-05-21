import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  showDropdown: boolean = false;
  user: any = null;
  userId: string | null = null;
  showFooter: boolean = true;
  isNavbarCollapsed: boolean = true; // Nuevo

  constructor(private authService: AuthService, private apiService: ApiService) {
    // Inicializamos showDropdown como false
    this.showDropdown = false;
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.userId = localStorage.getItem('user_id');
        if (this.userId) {
          this.getUserData(this.userId);
        } else {
          console.error('User ID is null');
        }
      } else {
        this.userId = null;
        this.user = null;
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  getUserData(userId: string) {
    this.apiService.getUserData(userId).subscribe(
      (response) => {
        if (!response.error) {
          this.user = response.data;
        }
      },
      (error) => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    );
  }

  onHideFooter(hide: boolean) {
    this.showFooter = hide;
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
