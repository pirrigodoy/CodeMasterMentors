import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.logout();
  }

  /**
 * Logs out the user by calling the ApiService's logout method.
 * Clears any user data stored in the application if necessary.
 * Redirects to the login page or another destination page after logout.
 */
  logout() {
    this.apiService.logout().subscribe(
      response => {
        // Clear any user data stored in the application (if necessary)
        // Redirect to the login page or another destination page
        this.router.navigate(['/login']); // Redirect to the login page after logout
      },
      error => {
        // Handle errors if necessary
        console.error(error);
        // Redirect to the login page or another destination page
        this.router.navigate(['/login']); // Redirect to the login page in case of error
      }
    );
  }

}
