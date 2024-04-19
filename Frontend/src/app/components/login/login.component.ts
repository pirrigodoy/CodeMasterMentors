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

  constructor(private apiService: ApiService,  private router: Router) {
    this.hideFooter.emit(true); // Emitir el evento para ocultar el footer en el AppComponent

   }

   onSubmit() {
    this.apiService.login({ email: this.email, password: this.password })
      .subscribe(
        response => {
          // Manejar la respuesta de éxito, por ejemplo, redirigir al usuario a otra página
          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
        },
        error => {
          // Manejar errores, por ejemplo, mostrar un mensaje de error al usuario
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
