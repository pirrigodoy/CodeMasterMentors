import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service'; // Asegúrate de importar el servicio AuthService

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false; // Inicializa isLoggedIn como falso por defecto
  showDropdown: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    // Suscribe a isLoggedIn$ para actualizar isLoggedIn cuando cambie el estado de autenticación
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  // Método para cerrar sesión
  logout() {
    this.authService.logout(); // Llama al método de cierre de sesión en el servicio de autenticación
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
}

