import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Data } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  checkUserExists(username: string, email: string) {
    throw new Error('Method not implemented.');
  }

  // URL de tu API en Laravel
  private apiUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) { }

  // Método para realizar una solicitud GET
  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'endpoint');
  }

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

  login(credentials: { email: string, password: string }) {
    return this.http.post<any>(`${this.apiUrl}login`, credentials)
      .pipe(
        tap(response => {
          // Almacena el token de acceso en el almacenamiento local
          localStorage.setItem('access_token', response.access_token);
        })
      );
  }
  // Otros métodos para PUT, DELETE, etc.

register(credentials: {username: string, password: string, role_id: string, name: string, email:string, born_date: string, area: string}){
  return this.http.post<any>(`${this.apiUrl}register`, credentials);
}
}


