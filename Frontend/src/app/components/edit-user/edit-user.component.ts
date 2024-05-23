import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  userId: string | null = null;
  userData: any = {};
  isEditing: boolean = false;
  selectedFile: File | null = null;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService) { }

  /**
 * Initializes the component.
 * Subscribes to query parameters and loads user data if the 'userId' parameter is provided.
 */
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'] || null;
      if (this.userId) {
        this.loadUserData();
      }
    });
  }


  /**
 * Loads user data for the specified user ID.
 */
  loadUserData() {
    this.apiService.getUserData(this.userId!).subscribe(
      userData => {
        this.userData = userData.data;
        console.log('User data:', userData);
      },
      error => {
        console.error('Error loading user data:', error);
      }
    );
  }


  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  /**
  * Saves changes made to user data.
  * Displays a confirmation dialog to confirm whether the user wants to save the changes.
  * If confirmed, updates the user data via the ApiService's updateUserData method.
  * If denied, cancels the operation.
  */
  saveChanges() {
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.apiService.updateUserData(this.userData).subscribe(
          (data) => {
            console.log('Changes saved successfully:', data);
            this.isEditing = false;
            Swal.fire('Saved!', '', 'success');
            this.router.navigate(['/userManagement']); // Redirects the user to the 'userManagement' page after saving changes
          },
          (error) => {
            console.error('Error saving changes:', error);
          }
        );
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
        this.isEditing = false;
      }
    });
  }

  /**
 * Handles the selection of a file for upload.
 * Uploads the selected image file to the server via the ApiService's uploadImage method.
 * Upon successful upload, saves the image URL in the userData.
 * @param {any} event - The event containing the selected file
 */
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    // Upload the image to the server
    this.apiService.uploadImage(file).subscribe(
      (response: any) => {
        if (response.url) { // Check if the image URL is present in the response
          // Save the image URL in userData
          this.userData.img = response.url;
        } else {
          console.error('Error uploading image:', response.message);
        }
      },
      (error: any) => {
        console.error('Error uploading image:', error);
      }
    );
  }

}
