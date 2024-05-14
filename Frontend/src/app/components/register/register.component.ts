import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // Variables para almacenar los datos del formulario y mensajes de éxito/error
  isValidAge: boolean = true;
  username: string = '';
  password: string = '';
  role_id: string = '';
  name: string = '';
  email: string = '';
  born_date: string = '';
  city_id: string = '';
  cities: any = [];
  img: string = '';
  registerSuccess: string = '';
  errorMessage: string = '';
  emailPattern: any;
  roles: any = [];
  userData: any = {};


  @Output() hideFooter: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(private apiService: ApiService, private router: Router) {
    this.hideFooter.emit(true); // Emitir el evento para ocultar el footer en el AppComponent
  }

  ngOnInit(): void {
    this.getRoles();
    this.getCities();
  }

  validateAge() {
    const today = new Date();
    const birthDate = new Date(this.born_date);
    let ageDiff = today.getFullYear() - birthDate.getFullYear(); // Cambiar de const a let
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      ageDiff--;
    }
    this.isValidAge = ageDiff >= 14;
  }


  onSubmit() {
    // Validar si todos los campos están llenos
    if (!this.username || !this.password || !this.role_id || !this.name || !this.email || !this.born_date || !this.city_id || !this.img) {
      this.errorMessage = 'Por favor, complete todos los campos.';
      return; // Detener la ejecución si algún campo está vacío
    }

    // Validar si city_id tiene un valor seleccionado
    if (!this.city_id) {
      this.errorMessage = 'Por favor, selecciona una ciudad.';
      return; // Detener la ejecución si city_id está vacío
    }

    // Validar formato de correo electrónico utilizando una expresión regular
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Por favor, introduce un correo electrónico válido.';
      return; // Detener la ejecución si el formato del correo electrónico es incorrecto
    }

    // Validar longitud y contenido de la contraseña
    if (this.password.length < 8 || !(/[a-zA-Z]/.test(this.password) && /[0-9]/.test(this.password))) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres y contener letras y números.';
      return; // Detener la ejecución si la contraseña no cumple con los requisitos
    }

    // Enviar la solicitud de registro al servicio API
    this.apiService.register({
      username: this.username,
      role_id: this.role_id,
      name: this.name,
      email: this.email,
      password: this.password,
      born_date: this.born_date,
      city_id: this.city_id,
      img: this.img
    }).subscribe({
      next: (response) => {
        // Manejar la respuesta de éxito
        console.log('Registro exitoso:', response);
        // Mostrar mensaje de éxito y redirigir al componente de inicio de sesión
        this.registerSuccess = 'Registro exitoso. Ahora puedes iniciar sesión.';
        this.router.navigate(['/login']);
      },
      error: (error) => {
        // Manejar errores de la solicitud de registro
        this.errorMessage = 'Error en el registro. Por favor, inténtalo de nuevo.';
        console.error('Error en el registro:', error);
      }
    });
  }


  getRoles() {
    this.apiService.getRoles().subscribe((roles: any) => {
      this.roles = roles;
      console.log('roles:', roles);
      console.log('eeeeeeeee')

    });
  }

  getCities() {
    this.apiService.getCities().subscribe((cities: any) => {
      this.cities = cities;
      console.log('cities:', cities);
      console.log('eeeeeeeee')

    });
  }


  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    // Subir la imagen al servidor
    this.apiService.uploadImage(file).subscribe(
      (response: any) => {
        if (response.url) { // Verifica si la URL de la imagen está presente en la respuesta
          // Guarda la ruta de la imagen en this.img
          this.img = response.url;
        } else {
          console.error('Error al subir la imagen:', response.message);
        }
      },
      (error: any) => {
        console.error('Error al subir la imagen:', error);
      }
    );
  }






}
