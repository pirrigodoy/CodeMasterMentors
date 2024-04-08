import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Variables para almacenar los datos del formulario y mensajes de éxito/error
  username: string = '';
  password: string = '';
  role_id: string = '';
  name: string = '';
  email: string = '';
  born_date: string = '';
  area: string = '';
  registerSuccess: string = '';
  errorMessage: string = '';
  emailPattern: any;

  constructor(private apiService: ApiService, private router: Router) { }

  onSubmit() {
    // Validar si todos los campos están llenos
    if (!this.username || !this.password || !this.role_id || !this.name || !this.email || !this.born_date || !this.area ) {
      this.errorMessage = 'Por favor, complete todos los campos.';
      return; // Detener la ejecución si algún campo está vacío
    }

    // Validar formato de correo electrónico utilizando una expresión regular
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Por favor, introduce un correo electrónico válido.';
      return; // Detener la ejecución si el formato del correo electrónico es incorrecto
    }

    // Convertir la fecha al formato inglés (YYYY-MM-DD)
    const formattedDate = new Date(this.born_date).toLocaleDateString('en-GB');

    // Enviar la solicitud de registro al servicio API
    this.apiService.register({
      username: this.username,
      role_id: this.role_id,
      name: this.name,
      email: this.email,
      password: this.password,
      born_date: formattedDate, // Usar la fecha formateada
      area: this.area,
    }).subscribe(
      response => {
        // Manejar la respuesta de éxito
        console.log('Registro exitoso:', response);
        // Mostrar mensaje de éxito y redirigir al componente de inicio de sesión
        this.registerSuccess = 'Registro exitoso. Ahora puedes iniciar sesión.';
        this.router.navigate(['/login']);
      },
      error => {
        // Manejar errores de la solicitud de registro
        this.errorMessage = 'Error en el registro. Por favor, inténtalo de nuevo.';
        console.error('Error en el registro:', error);
      }
    );
  }
}
