import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // URL de tu API en Laravel
  private apiUrl = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) { }

  // Método para realizar una solicitud GET
  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'endpoint');
  }

  //----------------------------------------------------------------------

  getAdvertisements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}advertisements`);
  }

  //----------------------------------------------------------------------


  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}users`);
  }

  //----------------------------------------------------------------------

  getProgrammingLanguages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}programminglanguages`);
  }

  //----------------------------------------------------------------------

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}roles`);
  }

  //----------------------------------------------------------------------
  // Método para realizar una solicitud POST
  postData(data: any): Observable<any> {
    // Especifica el encabezado para enviar datos JSON
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    // Realiza la solicitud POST con los datos y las opciones de encabezado
    return this.http.post<any>(this.apiUrl + 'endpoint', data, httpOptions);
  }

  //----------------------------------------------------------------------

  login(credentials: { email: string, password: string }) {
    return this.http.post<any>(`${this.apiUrl}login`, credentials)
      .pipe(
        tap(response => {
          // Almacena el token de acceso en el almacenamiento local
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('user_id', response.user.id);
        })
      );
  }

  //----------------------------------------------------------------------
  // Método para cerrar sesión
  logout() {
    // Elimina el token de acceso del almacenamiento local
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');

    // Realiza una solicitud de cierre de sesión al backend (si es necesario)
    return this.http.post<any>(`${this.apiUrl}logout`, {});
  }

  //----------------------------------------------------------------------
  // Método para obtener los datos del usuario por su ID
  getUserData(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}users/${userId}`);
  }

  getAdvertisementData(advertisementId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}advertisements/${advertisementId}`);
  }
  //----------------------------------------------------------------------
  // Método para actualizar los datos del usuario
  updateUserData(userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}users/${userData.id}`, userData);
  }

  //----------------------------------------------------------------------


  // Método para registrar un nuevo usuario
  register(credentials: {
    username: string,
    password: string,
    role_id: string,
    name: string,
    email: string,
    born_date: string,
    area: string,
    img: string
  }) {
    return this.http.post<any>(`${this.apiUrl}register`, credentials);
  }

  crearAnuncio(nuevoAnuncio: any): Observable<any> {
    // Especifica el encabezado para enviar datos JSON
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    // Realiza la solicitud POST con los datos del nuevo anuncio y las opciones de encabezado
    return this.http.post<any>(`${this.apiUrl}advertisements`, nuevoAnuncio, httpOptions);
  }


  getAdvertisementById(advertisementId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}advertisements/${advertisementId}`);
  }
  

  updateAdvertisement(advertisement: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<any>(`${this.apiUrl}advertisements/${advertisement.id}`, advertisement, httpOptions);
  }

  deleteAdvertisement(advertisementId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}advertisements/${advertisementId}`);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}users/${userId}`);
  }
  
}
