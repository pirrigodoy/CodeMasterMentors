import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service'; // Asegúrate de importar el servicio AuthService
import { ApiService } from './services/api.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false; // Inicializa isLoggedIn como falso por defecto
  showDropdown: boolean = false;
  users: any = [];
  userId: string | null = null;
  constructor(private authService: AuthService, private apiService:ApiService
  ) { }

  ngOnInit() {
    this.getUsers();
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        // Cuando el usuario está autenticado, recuperamos su ID del almacenamiento local
        this.userId = localStorage.getItem('user_id');
      } else {
        this.userId = null;
      }
    });
  }

  // Método para cerrar sesión
  logout() {
    this.authService.logout(); // Llama al método de cierre de sesión en el servicio de autenticación
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  getUsers() {
    return this.apiService.getUsers().subscribe((users: {}) => {
      this.users = users;
      console.log('Users:', users);
    })
  }
}

