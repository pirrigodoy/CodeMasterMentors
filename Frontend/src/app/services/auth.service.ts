import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://www.slimedungeon.es/api/';
  // private apiUrl = 'http://localhost:8000/api/';


  private isLoggedInSubject: BehaviorSubject<boolean>; // BehaviorSubject para almacenar el estado actual
  isLoggedIn$: Observable<boolean>; // Observable público para que otros componentes se suscriban

  constructor(private http: HttpClient) {
    // Inicializa isLoggedInSubject con el valor de localStorage o falso si no está definido
    this.isLoggedInSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
    // Convierte el BehaviorSubject en un Observable público
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
  }

  /**
   * Logs in a user with the provided credentials.
   * @param {Object} credentials - The user's login credentials containing email and password.
   * @param {string} credentials.email - The user's email.
   * @param {string} credentials.password - The user's password.
   * @return {Observable<any>} - An observable of the login response.
   */
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


  /**
 * Logs out the currently authenticated user.
 */
  logout() {
    // Remove the access token from local storage
    localStorage.removeItem('access_token');

    // You can add additional logout logic here if you need more logout actions

    // Emit a new value of false to indicate that the user is no longer authenticated
    this.isLoggedInSubject.next(false);
  }

  /**
   * Checks if the user is authenticated.
   * @returns {boolean} - True if the user is authenticated, otherwise false.
   * @private
   */
  private isAuthenticated(): boolean {
    // Returns true if there is an access token in local storage, otherwise false
    return !!localStorage.getItem('access_token');
  }





}



