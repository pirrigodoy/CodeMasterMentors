import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.css']
})
export class AdvertisementComponent implements OnInit {
  advertisementId: string = '';
  advertisementData: any = {};
  programmingLanguages: any = [];
  users: any = [] = [];
  comments: any[] = []; // Asegúrate de que esto es un array
  filteredComments: any[] = []; // Asegúrate de que esto es un array
  currentUserRoleId: number | undefined;


  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  /**
  * Initializes the component.
  * Retrieves the advertisement ID from localStorage.
  * Calls the API service to get advertisement data using the retrieved ID.
  * Logs any errors that occur during the data retrieval process.
  * Calls methods to retrieve programming languages, users, and comments.
  */
  ngOnInit(): void {
    // Retrieve advertisement ID from localStorage
    const advertisementIdFromStorage = localStorage.getItem('advertisement_id');
    if (advertisementIdFromStorage) {
      this.advertisementId = advertisementIdFromStorage;
    } else {
      console.error("No se encontró advertisement_id en el local storage");
      return;
    }

    // Call API service to get advertisement data
    this.apiService.getAdvertisementData(this.advertisementId).subscribe(
      (response) => {
        if (response.error) {
          console.error('Error al obtener los datos del anuncio:', response.message);
        } else {
          // Assign advertisement data from the response
          this.advertisementData = response.data;
          console.log(this.advertisementData);
        }
      },
      (error) => {
        console.error('Error al obtener los datos del anuncio:', error);
      }
    );

    // Call methods to retrieve programming languages, users, and comments
    this.getProgrammingLanguages();
    this.getUsers();
    this.getComments(); // Obtain comments upon component initialization
  }

  /**
   * Retrieves the list of programming languages from the API service.
   * Assigns the retrieved list to the component's programmingLanguages property.
   * Logs the retrieved programming languages to the console.
   */
  getProgrammingLanguages() {
    // Call the API service to get the list of programming languages
    this.apiService.getProgrammingLanguages().subscribe((programmingLanguages: any) => {
      // Assign the retrieved list to the component's programmingLanguages property
      this.programmingLanguages = programmingLanguages;
      // Log the retrieved programming languages to the console
      console.log('ProgrammingLanguages:', programmingLanguages);
    });
  }
  /**
   * Retrieves the list of users from the API service.
   * Logs the API response and the retrieved users to the console.
   * Finds the role_id of the current user from local storage and assigns it to the component's currentUserRoleId property.
   * Resolves the promise if the API response contains an array of users, otherwise rejects the promise.
   * @returns A promise that resolves if the API response contains an array of users, otherwise rejects the promise.
   */
  getUsers() {
    return new Promise<void>((resolve, reject) => {
      // Call the API service to get the list of users
      this.apiService.getUsers().subscribe((response: any) => {
        // Log the API response
        console.log('API response:', response);
        // Check if the response data is an array of users
        if (Array.isArray(response.data)) {
          // Assign the retrieved list of users to the component's users property
          this.users = response.data;
          // Log the retrieved users to the console
          console.log('Users:', this.users);
          // Get the role_id of the current user from local storage
          const userIdFromStorage = localStorage.getItem('user_id');
          if (userIdFromStorage) {
            // Find the current user in the list of users
            const currentUser = this.users.find((user: any) => user.id === parseInt(userIdFromStorage, 10));
            if (currentUser) {
              // Assign the role_id of the current user to the component's currentUserRoleId property
              this.currentUserRoleId = currentUser.role_id;
            }
          }
          // Log the role_id of the current user to the console
          console.log('Current User Role ID:', this.currentUserRoleId);
          // Resolve the promise
          resolve();
        } else {
          // Log an error if the response data is not an array of users
          console.error('Error: los usuarios no son un array:', response.data);
          // Reject the promise with an error message
          reject('Error: los usuarios no son un array');
        }
      }, error => {
        // Log an error if there is an error while retrieving users from the API
        console.error('Error al obtener los usuarios:', error);
        // Reject the promise with the error object
        reject(error);
      });
    });
  }

  /**
   * Retrieves the list of comments from the API service.
   * Logs the API response and the retrieved comments to the console.
   * Filters the comments based on certain criteria after retrieval.
   */
  getComments() {
    // Call the API service to get the list of comments
    this.apiService.getComments().subscribe((response: any) => {
      // Check if the response data is an array of comments
      if (Array.isArray(response.data)) {
        // Assign the retrieved list of comments to the component's comments property
        this.comments = response.data;
        // Log the retrieved comments to the console
        console.log('Comments:', this.comments);
        // Log the advertisement_id of each comment to the console
        this.comments.forEach(comment => {
          console.log('Comment advertisement_id:', comment.advertisement_id);
        });
        // Filter the comments based on certain criteria
        this.filterComments();
      } else {
        // Log an error if the response data is not an array of comments
        console.error('Error: los comentarios no son un array:', response.data);
      }
    });
  }
  /**
   * Filters the comments based on the advertisementId property.
   * Logs the advertisementId being used for filtering and the filtered comments to the console.
   */
  filterComments() {
    // Log the advertisementId being used for filtering
    console.log('Filtering comments for advertisementId:', this.advertisementId);
    // Parse the advertisementId to ensure it is a number
    const advertisementId = parseInt(this.advertisementId, 10);
    // Filter the comments based on the advertisementId
    this.filteredComments = this.comments.filter((comment: any) => {
      if (comment.advertisement_id) {
        return comment.advertisement_id === advertisementId;
      } else {
        // Log a warning if a comment does not have an advertisement_id
        console.warn('Comment without advertisement_id:', comment);
        return false;
      }
    });
    // Log the filtered comments to the console
    console.log('Filtered Comments:', this.filteredComments);
  }

  /**
   * Retrieves the name of the user with the specified userId.
   * Searches for the user in the list of users and returns their name if found, otherwise returns 'Usuario desconocido'.
   * @param userId The ID of the user
   * @returns The name of the user or 'Usuario desconocido' if not found
   */
  getUserName(userId: number): string {
    // Find the user with the specified userId in the list of users
    const user = this.users.find((user: any) => user.id === userId);
    // Return the name of the user if found, otherwise return 'Usuario desconocido'
    return user ? user.name : 'Usuario desconocido';
  }

  /**
   * Retrieves the image URL of the user with the specified userId.
   * Searches for the user in the list of users and returns their image URL if found, otherwise returns undefined.
   * @param userId The ID of the user
   * @returns The image URL of the user or undefined if not found
   */
  getUserImageUrl(userId: number): string | undefined {
    // Find the user with the specified userId in the list of users
    const user = this.users.find((user: any) => user.id === userId);
    // Return the image URL of the user if found, otherwise return undefined
    return user ? user.img : undefined;
  }


}
