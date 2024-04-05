import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

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
    return this.http.post<any>(`${this.apiUrl}login`, credentials);
  }
  // Otros métodos para PUT, DELETE, etc.
}
