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

  logout() {
    this.apiService.logout().subscribe(
      response => {
        // Eliminar cualquier dato de usuario almacenado en la aplicación (si es necesario)
        // Redirigir a la página de inicio de sesión u otra página de destino
        this.router.navigate(['/login']); // Redirige a la página de inicio de sesión después del logout
      },
      error => {
        // Manejar errores si es necesario
        console.error(error);
        // Redirigir a la página de inicio de sesión u otra página de destino
        this.router.navigate(['/login']); // Redirige a la página de inicio de sesión en caso de error
      }
    );
  }
}
