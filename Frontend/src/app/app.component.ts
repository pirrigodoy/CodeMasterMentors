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
  users: any = [];
  userId: string | null = null;
  showFooter: boolean = true;

  constructor(private authService: AuthService, private apiService: ApiService) {}

  ngOnInit() {
    this.getUsers();
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.userId = localStorage.getItem('user_id');
      } else {
        this.userId = null;
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  getUsers() {
    return this.apiService.getUsers().subscribe((users: {}) => {
      this.users = users;
    });
  }

  onHideFooter(hide: boolean) {
    this.showFooter = hide;
  }
}
