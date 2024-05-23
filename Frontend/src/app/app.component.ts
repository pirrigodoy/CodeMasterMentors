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

  /**
   * Initializes the component and checks the user's authentication status.
   * Subscribes to changes in the authentication state and updates the component's
   * properties accordingly. If the user is authenticated, retrieves user data
   * using the user ID stored in localStorage.
   */
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

  /**
    * Logs out the current user by calling the logout method from the authentication service.
    * This will typically clear the user's session and redirect them to a login or home page.
 */
  logout() {
    this.authService.logout();
  }

  /**
 * Toggles the visibility of the dropdown menu.
 * This method changes the `showDropdown` property to its opposite value.
 */
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  /**
 * Fetches user data from the API based on the provided user ID.
 * If the response is successful and contains no error, updates the `user` property with the fetched data.
 * Logs an error message to the console if the request fails.
 *
 * @param {string} userId - The ID of the user whose data is to be fetched.
 */
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

/**
 * Toggles the visibility of the footer based on the provided boolean value.
 *
 * @param {boolean} hide - A boolean value indicating whether to hide or show the footer.
 */
  onHideFooter(hide: boolean) {
    this.showFooter = hide;
  }

  /**
 * Toggles the state of the navbar between collapsed and expanded.
 */
  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
