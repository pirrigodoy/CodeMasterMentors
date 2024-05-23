import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginSuccess: string = '';
  errorMessage: string = '';

  @Output() hideFooter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private apiService: ApiService, private router: Router) {
    this.hideFooter.emit(true); // Emitir el evento para ocultar el footer en el AppComponent
    // this.hideFooter.emit(true); // Emitir el evento para ocultar el footer en el AppComponent

  }

  /**
* Submits the login form by calling the ApiService's login method with the provided email and password.
* Handles success response by redirecting the user to another page.
* Handles errors by displaying error messages to the user.
*/
  onSubmit() {
    this.apiService.login({ email: this.email, password: this.password })
      .subscribe(
        response => {
          // Handle success response, e.g., redirect user to another page
          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
        },
        error => {
          // Handle errors, e.g., display error message to user
          if (error.status === 401) {
            this.errorMessage = 'Usuario o contraseña incorrectos.';
          } else {
            this.errorMessage = 'Se produjo un error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.';
          }
          console.error('Error en el login:', error);
        }
      );
  }

}
