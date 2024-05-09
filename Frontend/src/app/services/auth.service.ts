import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://www.slimedungeon.es/api/';
  // private apiUrl = 'http://localhost:8000/api/';


  private isLoggedInSubject: BehaviorSubject<boolean>; // BehaviorSubject para almacenar el estado actual
  isLoggedIn$: Observable<boolean>; // Observable público para que otros componentes se suscriban

  constructor(private http: HttpClient) {
    // Inicializa isLoggedInSubject con el valor de localStorage o falso si no está definido
    this.isLoggedInSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
    // Convierte el BehaviorSubject en un Observable público
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
  }

  // Método para realizar el inicio de sesión
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}login`, credentials)
      .pipe(
        tap(response => {
          console.log('Login response:', response); // Agregar esta línea para depurar
          // Almacena el token de acceso en el almacenamiento local
          localStorage.setItem('access_token', response.access_token);
          // Si la respuesta contiene el ID del usuario, almacénalo en el almacenamiento local también
          if (response.user && response.user.id) {
            localStorage.setItem('user_id', response.user.id);
          }
          // Emite un nuevo valor de true para indicar que el usuario está autenticado
          this.isLoggedInSubject.next(true);
        })
      );
  }


  // Método para cerrar sesión
  logout() {
    // Elimina el token de acceso del almacenamiento local
    localStorage.removeItem('access_token');
    // Realiza una solicitud de cierre de sesión al backend (si es necesario)
    // Puedes agregar lógica adicional aquí si necesitas más acciones de cierre de sesión
    // Emite un nuevo valor de false para indicar que el usuario ya no está autenticado
    this.isLoggedInSubject.next(false);
  }

  // Método para verificar si el usuario está autenticado
  private isAuthenticated(): boolean {
    // Devuelve true si existe un token de acceso en el almacenamiento local, de lo contrario, false
    return !!localStorage.getItem('access_token');
  }





}



