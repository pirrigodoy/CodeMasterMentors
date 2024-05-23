import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgModule } from '@angular/core';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-advertisement-management',
  templateUrl: './advertisement-management.component.html',
  styleUrls: ['./advertisement-management.component.css']
})
export class AdvertisementManagementComponent implements OnInit {
  advertisements: any = [];
  router: any;
  users: any = [] = [];
  programmingLanguages: any = [] = [];


  constructor(private apiService: ApiService) { }

  /**
 * Executes necessary actions upon component initialization, such as loading comments, fetching users, and retrieving programming languages.
 */
  ngOnInit(): void {
    this.loadComments(); // Load comments when the component initializes
    this.getUsers(); // Fetch users when the component initializes
    this.getProgrammingLanguages(); // Retrieve programming languages when the component initializes
  }


  /**
 * Loads the comments by fetching the advertisements from the API service.
 */
  loadComments() {
    this.apiService.getAdvertisements().subscribe((advertisements: any[]) => {
      this.advertisements = advertisements;
    });
  }


  /**
  * Retrieves the list of users from the API service.
  * @returns A Promise that resolves when the users are successfully retrieved,
  *          or rejects with an error message if there is an error during the retrieval process.
  */
  getUsers(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.apiService.getUsers().subscribe((response: any) => {
        console.log('API response:', response);
        if (Array.isArray(response.data)) {
          this.users = response.data;
          console.log('Users:', this.users);
          resolve();
        } else {
          console.error('Error: users is not an array:', response.data);
          reject('Error: users is not an array');
        }
      }, error => {
        console.error('Error fetching users:', error);
        reject(error);
      });
    });
  }


  /**
 * Retrieves the list of programming languages from the API service.
 * @returns A Promise that resolves when the programming languages are successfully retrieved,
 *          or rejects with an error message if there is an error during the retrieval process.
 */
  getProgrammingLanguages(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.apiService.getProgrammingLanguages().subscribe((response: any) => {
        console.log('API response:', response);
        if (Array.isArray(response.data)) {
          this.programmingLanguages = response.data;
          console.log('Programming Languages:', this.programmingLanguages);
          resolve();
        } else {
          console.error('Error: programming languages is not an array:', response.data);
          reject('Error: programming languages is not an array');
        }
      }, error => {
        console.error('Error fetching programming languages:', error);
        reject(error);
      });
    });
  }

  /**
 * Retrieves the name of the user associated with the specified userId.
 * @param userId The ID of the user
 * @returns The name of the user if found, otherwise returns 'Usuario desconocido'
 */
  getUserName(userId: number): string {
    const user = this.users.find((user: any) => user.id === userId);
    return user ? user.name : 'Usuario desconocido';
  }

  /**
 * Retrieves the name of the programming language associated with the specified programmingLanguageId.
 * @param programmingLanguageId The ID of the programming language
 * @returns The name of the programming language if found, otherwise returns 'Usuario desconocido'
 */
  getProgrammingName(programmingLanguageId: number): string {
    const programmingLanguage = this.programmingLanguages.find((programmingLanguage: any) => programmingLanguage.id === programmingLanguageId);
    return programmingLanguage ? programmingLanguage.languageName : 'Usuario desconocido';
  }


  /**
 * Displays a confirmation dialog to ask the user if they want to delete the advertisement with the specified advertisementId.
 * If the user confirms deletion, calls the ApiService's deleteAdvertisement method to delete the advertisement.
 * Displays a success message if the advertisement is deleted successfully and reloads the page.
 * Displays an error message if there is an error while deleting the advertisement.
 * @param advertisementId The ID of the advertisement to delete
 */
  eliminarAnuncio(advertisementId: string) {
    // Display a confirmation dialog using SweetAlert
    Swal.fire({
      title: 'Are you sure you want to delete this advertisement?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      // Check if the user confirmed deletion
      if (result.isConfirmed) {
        // Call the API service to delete the advertisement
        this.apiService.deleteAdvertisement(advertisementId).subscribe(
          (response) => {
            // Log a success message if the advertisement is deleted successfully
            console.log('Advertisement deleted successfully:', response);
            // Display a success message using SweetAlert
            Swal.fire('Advertisement deleted!', '', 'success').then(() => {
              // Reload the page after deleting the advertisement
              window.location.reload();
            });
          },
          (error) => {
            // Log an error message if there is an error while deleting the advertisement
            console.error('Error deleting advertisement:', error);
            // Display an error message using SweetAlert
            Swal.fire('Error', 'Failed to delete advertisement', 'error');
          }
        );
      }
    });
  }





}
