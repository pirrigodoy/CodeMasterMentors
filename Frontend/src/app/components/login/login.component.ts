import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private apiService: ApiService) { }

  onSubmit() {
    this.apiService.login({ email: this.email, password: this.password })
      .subscribe(
        response => {
          // Manejar la respuesta de éxito, por ejemplo, redirigir al usuario a otra página
          console.log('Login exitoso:', response);
        },
        error => {
          // Manejar errores, por ejemplo, mostrar un mensaje de error al usuario
          this.errorMessage = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
          console.error('Error en el login:', error);
        }
      );
  }
}
