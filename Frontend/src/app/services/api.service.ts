import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // URL de tu API en Laravel
  // private apiUrl = 'http://localhost:8000/api/';
  private apiUrl = 'https://www.slimedungeon.es/api/';

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

  getCities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}cities`);
  }
  //----------------------------------------------------------------------

  getComments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}comments`);
  }

  //----------------------------------------------------------------------

  getApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}applications`);
  }

  //----------------------------------------------------------------------
  getReceipts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}receipts`);
  }

  //----------------------------------------------------------------------
  getStates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}states`);
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
          localStorage.setItem('role_id', response.user.role_id);
          localStorage.setItem('user_id', response.user.id);
          localStorage.setItem('user_email', response.user.email);
          localStorage.setItem('user_name', response.user.name);

        })
      );
  }

  //----------------------------------------------------------------------
  // Método para cerrar sesión
  logout() {
    // Elimina el token de acceso del almacenamiento local
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('role_id');
    localStorage.removeItem('receiver');
    localStorage.removeItem('advertisement_id');
    localStorage.removeItem('paymentProcessed');



    // Realiza una solicitud de cierre de sesión al backend (si es necesario)
    return this.http.post<any>(`${this.apiUrl}logout`, {});
  }

  //----------------------------------------------------------------------
  // Método para obtener los datos del usuario por su ID
  getUserData(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}users/${userId}`);
  }

  //----------------------------------------------------------------------

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
    city_id: string,
    img: string
  }) {
    return this.http.post<any>(`${this.apiUrl}register`, credentials);
  }
  // ------------------------------------------------------------------------------------------------

  createAdvertisement(nuevoAnuncio: any): Observable<any> {
    // Especifica el encabezado para enviar datos JSON
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    // Realiza la solicitud POST con los datos del nuevo anuncio y las opciones de encabezado
    return this.http.post<any>(`${this.apiUrl}advertisements`, nuevoAnuncio, httpOptions);
  }
  // ------------------------------------------------------------------------------------------------

  guardarRatingYComentario(advertisementId: number, rating: number, comment: string, fecha: string, receiver: number, transmitter: number): Observable<any> {
    const formData = {
      transmitter: transmitter,
      advertisement_id: advertisementId,
      receiver: receiver,
      rating: rating,
      comment: comment,
      fecha: fecha,
    };

    return this.http.post<any>(`${this.apiUrl}comments`, formData);
  }


  // ------------------------------------------------------------------------------------------------

  addPrograma(nuevoPrograma: any): Observable<any> {
    // Especifica el encabezado para enviar datos JSON
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    // Realiza la solicitud POST con los datos del nuevo anuncio y las opciones de encabezado
    return this.http.post<any>(`${this.apiUrl}programminglanguages`, nuevoPrograma, httpOptions);
  }

  // ------------------------------------------------------------------------------------------------

  getAdvertisementById(advertisementId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}advertisements/${advertisementId}`);
  }
  // ------------------------------------------------------------------------------------------------


  updateAdvertisement(advertisement: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<any>(`${this.apiUrl}advertisements/${advertisement.id}`, advertisement, httpOptions);
  }

  // ------------------------------------------------------------------------------------------------

  updateProgrammingLaunguage(programminglanguage: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<any>(`${this.apiUrl}programminglanguages/${programminglanguage.id}`, programminglanguage, httpOptions);
  }

  // ------------------------------------------------------------------------------------------------

  deleteAdvertisement(advertisementId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}advertisements/${advertisementId}`);
  }
  // ------------------------------------------------------------------------------------------------

  deleteProgrammingLanguage(programmingLanguageId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}programminglanguages/${programmingLanguageId}`);
  }
  // ------------------------------------------------------------------------------------------------

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}users/${userId}`);
  }
  // ------------------------------------------------------------------------------------------------

  uploadImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);

    // Realiza la solicitud POST al servidor para subir la imagen
    return this.http.post<any>(`${this.apiUrl}uploadimage`, formData);
  }
  // ------------------------------------------------------------------------------------------------

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
  // ------------------------------------------------------------------------------------------------


  crearListaFavoritos(nuevaLista: any): Observable<any> {
    // Especifica el encabezado para enviar datos JSON
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    // Realiza la solicitud POST con los datos del nuevo anuncio y las opciones de encabezado
    return this.http.post<any>(`${this.apiUrl}favourite_lists`, nuevaLista, httpOptions);
  }
  // ------------------------------------------------------------------------------------------------

  createAdvertisementListaFavoritos(nuevaAnuncioLista: any): Observable<any> {
    // Especifica el encabezado para enviar datos JSON
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    // Realiza la solicitud POST con los datos del nuevo anuncio y las opciones de encabezado
    return this.http.post<any>(`${this.apiUrl}advertisement_favourite_lists`, nuevaAnuncioLista, httpOptions);
  }
  // ------------------------------------------------------------------------------------------------

  getFavouriteLists(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}favourite_lists`);
  }
  // ------------------------------------------------------------------------------------------------

  getAdvertisementFavouriteLists(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}advertisement_favourite_lists`);
  }
  // ------------------------------------------------------------------------------------------------
  updateFavouriteList(favourite_list: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<any>(`${this.apiUrl}favourite_lists/${favourite_list.id}`, favourite_list, httpOptions);
  }
  // ------------------------------------------------------------------------------------------------



  deleteFavourite_list(favouriteList_id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}favourite_lists/${favouriteList_id}`);
  }
  // ------------------------------------------------------------------------------------------------

  deleteAdvertisementFavourite_list(advertisementFavouriteListsId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}advertisement_favourite_lists/${advertisementFavouriteListsId}`);
  }
  // ------------------------------------------------------------------------------------------------

  processPayment(paymentMethodId: string, amount: number): Observable<any> {
    // Especifica el encabezado para enviar datos JSON
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    // Crea un objeto con el ID del método de pago y el monto del pago
    const paymentData = { paymentMethodId, amount };

    // Realiza la solicitud POST con los datos del método de pago y las opciones de encabezado
    return this.http.post<any>(`${this.apiUrl}process-payment`, paymentData, httpOptions);
  }
  // ------------------------------------------------------------------------------------------------

  getReceipt(receiptId: string): Observable<any> {
    if (!receiptId) {
      throw new Error('El ID del recibo es nulo o no válido');
    }
    const url = `${this.apiUrl}receipts/${receiptId}`;
    return this.http.get<any>(url);
  }

  // ------------------------------------------------------------------------------------------------

  deleteApplication(applicationId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}applications/${applicationId}`);
  }

  sendMessage(message: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(`${this.apiUrl}messages/send`, message, httpOptions);
  }
  // ------------------------------------------------------------------------------------------------


  // Método para obtener los mensajes entre dos usuarios
  getMessages(senderId: number, recipientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}messages/${senderId}/${recipientId}`);
  }
  // ------------------------------------------------------------------------------------------------

  getUserIdByAdvertisementId(advertisementId: string): Observable<number | undefined> {
    return this.http.get<any>(`${this.apiUrl}advertisements/${advertisementId}`).pipe(
      tap(advertisement => console.log('Valor de advertisement.user_id:', advertisement.data.user_id)),
      tap(advertisement => console.log('Valor de advertisement.user_id:', advertisement)),

      map(advertisement => advertisement.data.user_id));
  }
  // ------------------------------------------------------------------------------------------------

  getUniqueRecipients(senderId: number): Observable<any[]> {
    const url = `${this.apiUrl}messages/recipients/${senderId}`;
    console.log('URL de la solicitud:', url); // Agregar este console.log para verificar la URL de la solicitud
    return this.http.get<any[]>(url);
  }
  // ------------------------------------------------------------------------------------------------

  getUniqueSenders(senderId: number): Observable<any[]> {
    const url = `${this.apiUrl}messages/senders/${senderId}`;
    console.log('URL de la solicitud:', url); // Para verificar la URL de la solicitud, puedes eliminar este console.log una vez confirmado que la URL es correcta
    return this.http.get<any[]>(url);
  }

  getLanguageprogrammingData(programmingLanguageId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}programminglanguages/${programmingLanguageId}`);
  }

  getCityData(cityId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}cities/${cityId}`);
  }




  deleteComment(commentId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}comments/${commentId}`);
  }




  // Método para obtener los datos del usuario autenticado
  getAuthenticatedUser(): Observable<any> {
    const roleId: string | null = localStorage.getItem('role_id');

    if (roleId !== null) {
      // Si tenemos el role_id en el localStorage, podemos devolverlo directamente
      return of({ role_id: roleId });
    } else {
      // Manejar el caso cuando roleId es null
      // Puedes lanzar un error, devolver un observable vacío, etc.
      return throwError('Role ID is null');
    }
  }

  // Método para obtener el rol del usuario autenticado
  getUserRole(): Observable<string> {
    return this.getAuthenticatedUser().pipe(
      map(user => user.role_id) // Suponiendo que role_id es el identificador del rol en tu aplicación
    );
  }
}
