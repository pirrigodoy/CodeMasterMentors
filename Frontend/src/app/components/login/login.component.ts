import { Component } from '@angular/core';
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

  constructor(private apiService: ApiService,  private router: Router) { }

  onSubmit() {
    this.apiService.login({ email: this.email, password: this.password })
      .subscribe(
        response => {
          // Manejar la respuesta de éxito, por ejemplo, redirigir al usuario a otra página
          console.log('Login exitoso:', response);
          loginSuccess: "Login Exitoso";
          this.router.navigate(['/home']); // Redirige al componente Home después del inicio de sesión exitoso
        },
        error => {
          // Manejar errores, por ejemplo, mostrar un mensaje de error al usuario
          this.errorMessage = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
          console.error('Error en el login:', error);
        }
      );
  }
}
