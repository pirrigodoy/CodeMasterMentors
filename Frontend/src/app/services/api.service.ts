import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // URL de tu API en Laravel
  // private apiUrl = 'http://localhost:8000/api/';
  private apiUrl = 'https://www.slimedungeon.es/api/';

  constructor(private http: HttpClient) { }

  /**
   * Performs a GET request to retrieve data from a specified endpoint.
   * @return {Observable<any>}
   */
  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'endpoint');
  }

  //----------------------------------------------------------------------
  /**
    * Retrieves advertisement data using a GET request.
    * @return {Observable<any[]>}
    */
  getAdvertisements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}advertisements`);
  }

  //----------------------------------------------------------------------

  /**
     * Retrieves user data using a GET request.
     * @return {Observable<any[]>}
     */
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}users`);
  }

  //----------------------------------------------------------------------
  /**
     * Retrieves programming languages data using a GET request.
     * @return {Observable<any[]>}
     */
  getProgrammingLanguages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}programminglanguages`);
  }

  //----------------------------------------------------------------------
  /**
     * Retrieves roles data using a GET request.
     * @return {Observable<any[]>}
     */
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}roles`);
  }
  //----------------------------------------------------------------------
  /**
     * Retrieves cities data using a GET request.
     * @return {Observable<any[]>}
     */
  getCities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}cities`);
  }
  //----------------------------------------------------------------------
  /**
     * Retrieves cities data using a GET request.
     * @return {Observable<any[]>}
     */
  getComments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}comments`);
  }

  //----------------------------------------------------------------------
  /**
   * Retrieves cities data using a GET request.
   * @return {Observable<any[]>}
   */
  getStates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}states`);
  }

  //----------------------------------------------------------------------
  /**
   * Performs a POST request to a specified endpoint with JSON data.
   * @param data - The data to be sent in the request body.
   * @return {Observable<any>} - An observable of the HTTP response.
   */
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
  /**
   * Logs in the user by sending credentials and stores the access token in local storage.
   * @param credentials - Object containing user email and password.
   * @return {Observable<any>}
   */
  login(credentials: { email: string, password: string }) {
    return this.http.post<any>(`${this.apiUrl}login`, credentials)
      .pipe(
        tap(response => {
          // Almacena el token de acceso en el almacenamiento local
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('user_id', response.user.id);
          localStorage.setItem('user_email', response.user.email);
          localStorage.setItem('user_name', response.user.name);

        })
      );
  }

  //----------------------------------------------------------------------
  /**
   * Logs the user out by removing the access token and user information from local storage.
   * Sends a logout request to the backend (if necessary).
   * @return {Observable<any>} - An observable of the HTTP response.
   */
  logout() {
    // Elimina el token de acceso del almacenamiento local
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');

    // Realiza una solicitud de cierre de sesión al backend (si es necesario)
    return this.http.post<any>(`${this.apiUrl}logout`, {});
  }

  //----------------------------------------------------------------------
  /**
   * Retrieves user data by user ID.
   * @param {string} userId - The ID of the user to retrieve data for.
   * @return {Observable<any>} - An observable of the HTTP response containing user data.
   */
  getUserData(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}users/${userId}`);
  }

  //----------------------------------------------------------------------
  /**
 * Retrieves advertisement data by advertisement ID.
 * @param {string} advertisementId - The ID of the advertisement to retrieve data for.
 * @return {Observable<any>} - An observable of the HTTP response containing advertisement data.
 */
  getAdvertisementData(advertisementId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}advertisements/${advertisementId}`);
  }

  //----------------------------------------------------------------------
  /**
   * Updates user data.
   * @param {any} userData - The data of the user to be updated.
   * @return {Observable<any>} - An observable of the HTTP response containing the updated user data.
   */
  updateUserData(userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}users/${userData.id}`, userData);
  }

  //----------------------------------------------------------------------

  /**
 * Registers a new user.
 * @param {Object} credentials - The credentials of the new user.
 * @param {string} credentials.username - The username of the new user.
 * @param {string} credentials.password - The password of the new user.
 * @param {string} credentials.role_id - The role ID of the new user.
 * @param {string} credentials.name - The name of the new user.
 * @param {string} credentials.email - The email of the new user.
 * @param {string} credentials.born_date - The birth date of the new user.
 * @param {string} credentials.city_id - The city ID of the new user.
 * @param {string} credentials.img - The image of the new user.
 * @return {Observable<any>} - An observable of the HTTP response containing the registration status.
 */
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
  /**
   * Creates a new advertisement.
   * @param {Object} nuevoAnuncio - The data of the new advertisement.
   * @return {Observable<any>} - An observable of the HTTP response containing the status of the advertisement creation.
   */
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
  /**
 * Saves rating and comment for an advertisement.
 * @param {number} advertisementId - The ID of the advertisement.
 * @param {number} rating - The rating value.
 * @param {string} comment - The comment text.
 * @param {string} fecha - The date of the rating and comment.
 * @param {number} receiver - The ID of the receiver.
 * @param {number} transmitter - The ID of the transmitter.
 * @return {Observable<any>} - An observable of the HTTP response containing the status of the operation.
 */
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
  /**
 * Adds a new programming language.
 * @param {any} nuevoPrograma - The new programming language data.
 * @return {Observable<any>} - An observable of the HTTP response containing the status of the operation.
 */
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
  /**
  * Retrieves advertisement data by its ID.
  * @param {string} advertisementId - The ID of the advertisement.
  * @return {Observable<any>} - An observable of the HTTP response containing the advertisement data.
  */
  getAdvertisementById(advertisementId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}advertisements/${advertisementId}`);
  }
  // ------------------------------------------------------------------------------------------------

  /**
   * Updates advertisement data.
   * @param {any} advertisement - The advertisement object to be updated.
   * @return {Observable<any>} - An observable of the HTTP response after updating the advertisement.
   */
  updateAdvertisement(advertisement: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<any>(`${this.apiUrl}advertisements/${advertisement.id}`, advertisement, httpOptions);
  }

  // ------------------------------------------------------------------------------------------------
  /**
  * Updates programming language data.
  * @param {any} programminglanguage - The programming language object to be updated.
  * @return {Observable<any>} - An observable of the HTTP response after updating the programming language.
  */
  updateProgrammingLaunguage(programminglanguage: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<any>(`${this.apiUrl}programminglanguages/${programminglanguage.id}`, programminglanguage, httpOptions);
  }

  // ------------------------------------------------------------------------------------------------
  /**
   * Deletes an advertisement by ID.
   * @param {string} advertisementId - The ID of the advertisement to be deleted.
   * @return {Observable<any>} - An observable of the HTTP response after deleting the advertisement.
   */
  deleteAdvertisement(advertisementId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}advertisements/${advertisementId}`);
  }
  // ------------------------------------------------------------------------------------------------
  /**
  * Deletes a programming language by ID.
  * @param {string} programmingLanguageId - The ID of the programming language to be deleted.
  * @return {Observable<any>} - An observable of the HTTP response after deleting the programming language.
  */
  deleteProgrammingLanguage(programmingLanguageId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}programminglanguages/${programmingLanguageId}`);
  }
  // ------------------------------------------------------------------------------------------------
  /**
   * Deletes a user by ID.
   * @param {string} userId - The ID of the user to be deleted.
   * @return {Observable<any>} - An observable of the HTTP response after deleting the user.
   */
  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}users/${userId}`);
  }
  // ------------------------------------------------------------------------------------------------
  /**
  * Uploads an image file to the server.
  * @param {File} image - The image file to be uploaded.
  * @return {Observable<any>} - An observable of the HTTP response after uploading the image.
  */
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

  /**
   * Creates a new advertisement.
   * @param {any} nuevoAnuncio - The data for the new advertisement.
   * @return {Observable<any>} - An observable of the HTTP response after creating the advertisement.
   */
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
  /**
   * Creates a new advertisement in a favorite list.
   * @param {any} nuevaAnuncioLista - The data for the new advertisement in the favorite list.
   * @return {Observable<any>} - An observable of the HTTP response after creating the advertisement in the favorite list.
   */
  getFavouriteLists(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}favourite_lists`);
  }
  // ------------------------------------------------------------------------------------------------
  /**
   * Retrieves the favorite lists of advertisements.
   * @return {Observable<any[]>} - An observable of the HTTP response containing the favorite lists of advertisements.
   */
  getAdvertisementFavouriteLists(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}advertisement_favourite_lists`);
  }
  // ------------------------------------------------------------------------------------------------
  /**
 * Updates a favorite list.
 * @param {any} favourite_list - The favorite list to be updated.
 * @return {Observable<any>} - An observable of the HTTP response containing the updated favorite list.
 */
  updateFavouriteList(favourite_list: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<any>(`${this.apiUrl}favourite_lists/${favourite_list.id}`, favourite_list, httpOptions);
  }
  // ------------------------------------------------------------------------------------------------

  /**
   * Deletes a favorite list by ID.
   * @param {string} favouriteList_id - The ID of the favorite list to be deleted.
   * @return {Observable<any>} - An observable of the HTTP response.
   */
  deleteFavourite_list(favouriteList_id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}favourite_lists/${favouriteList_id}`);
  }
  // ------------------------------------------------------------------------------------------------
  /**
   * Deletes an advertisement from a favorite list by ID.
   * @param {string} advertisementFavouriteListsId - The ID of the advertisement in the favorite list to be deleted.
   * @return {Observable<any>} - An observable of the HTTP response.
   */
  deleteAdvertisementFavourite_list(advertisementFavouriteListsId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}advertisement_favourite_lists/${advertisementFavouriteListsId}`);
  }
  // ------------------------------------------------------------------------------------------------
  /**
   * Processes a payment using the specified payment method and amount.
   * @param {string} paymentMethodId - The ID of the payment method.
   * @param {number} amount - The amount to be paid.
   * @return {Observable<any>} - An observable of the HTTP response.
   */
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
  /**
  * Retrieves the receipt data by its ID.
  * @param {string} receiptId - The ID of the receipt to retrieve.
  * @return {Observable<any>} - An observable of the HTTP response containing the receipt data.
  * @throws {Error} - If the receipt ID is null or invalid.
  */
  getReceipt(receiptId: string): Observable<any> {
    if (!receiptId) {
      throw new Error('El ID del recibo es nulo o no válido');
    }
    const url = `${this.apiUrl}receipts/${receiptId}`;
    return this.http.get<any>(url);
  }

  // ------------------------------------------------------------------------------------------------
  /**
   * Deletes an application by its ID.
   * @param {string} applicationId - The ID of the application to delete.
   * @return {Observable<any>} - An observable of the HTTP response.
   */
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

  /**
   * Retrieves messages between two users.
   * @param {number} senderId - The ID of the sender user.
   * @param {number} recipientId - The ID of the recipient user.
   * @return {Observable<any[]>} - An observable of the array of messages.
   */
  getMessages(senderId: number, recipientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}messages/${senderId}/${recipientId}`);
  }
  // ------------------------------------------------------------------------------------------------
  /**
   * Retrieves the user ID associated with a given advertisement ID.
   * @param {string} advertisementId - The ID of the advertisement.
   * @return {Observable<number | undefined>} - An observable of the user ID.
   */
  getUserIdByAdvertisementId(advertisementId: string): Observable<number | undefined> {
    return this.http.get<any>(`${this.apiUrl}advertisements/${advertisementId}`).pipe(
      tap(advertisement => console.log('Valor de advertisement.user_id:', advertisement.data.user_id)),
      tap(advertisement => console.log('Valor de advertisement.user_id:', advertisement)),

      map(advertisement => advertisement.data.user_id));
  }
  // ------------------------------------------------------------------------------------------------
  /**
   * Retrieves unique recipients for messages sent by a specified sender.
   * @param {number} senderId - The ID of the sender.
   * @return {Observable<any[]>} - An observable of unique recipients.
   */
  getUniqueRecipients(senderId: number): Observable<any[]> {
    const url = `${this.apiUrl}messages/recipients/${senderId}`;
    console.log('URL de la solicitud:', url); // Agregar este console.log para verificar la URL de la solicitud
    return this.http.get<any[]>(url);
  }
  // ------------------------------------------------------------------------------------------------
  /**
   * Retrieves unique senders for messages received by a specified recipient.
   * @param {number} senderId - The ID of the recipient.
   * @return {Observable<any[]>} - An observable of unique senders.
   */
  getUniqueSenders(senderId: number): Observable<any[]> {
    const url = `${this.apiUrl}messages/senders/${senderId}`;
    console.log('URL de la solicitud:', url); // Para verificar la URL de la solicitud, puedes eliminar este console.log una vez confirmado que la URL es correcta
    return this.http.get<any[]>(url);
  }

  // ------------------------------------------------------------------------------------------------
  /**
   * Retrieves data for a specific programming language by its ID.
   * @param {string} programmingLanguageId - The ID of the programming language.
   * @return {Observable<any>} - An observable of the programming language data.
   */
  getLanguageprogrammingData(programmingLanguageId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}programminglanguages/${programmingLanguageId}`);
  }

  // ------------------------------------------------------------------------------------------------
  /**
   * Retrieves data for a specific city by its ID.
   * @param {string} cityId - The ID of the city.
   * @return {Observable<any>} - An observable of the city data.
   */
  getCityData(cityId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}cities/${cityId}`);
  }
}


