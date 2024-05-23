import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as EmailJS from 'emailjs-com';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: string = '';
  userData: any = {};
  isEditing: boolean = false;
  selectedFile: File | null = null;
  deleteCheckbox: boolean = false;
  deleteButtonClass: string = 'bg-red-700';
  deleteButtonColor: string = 'bg-gray-500';
  cities: any[] = [];
  email: string = '';
  emailPattern: any;
  errorMessage: string = '';
  born_date: string = '';
  isValidAge: boolean = true;
  imgName: string = '';
  img: string = '';

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    // Retrieve userId from the route parameters
    const userIdParam = this.route.snapshot.paramMap.get('userId');
    if (userIdParam) {
      this.userId = userIdParam;
    } else {
      console.error("No user ID provided in the URL");
    }

    // Fetch user data based on the userId
    this.apiService.getUserData(this.userId).subscribe(
      (response) => {
        if (response.error) {
          console.error('Error retrieving user data:', response.message);
        } else {
          this.userData = response.data;
          console.log(this.userData);
          // Fetch city name
          this.apiService.getCityData(this.userData.city_id).subscribe(
            (cityData: any) => {
              this.userData.city_name = cityData.data.name;
            },
            (error: any) => console.error('Error fetching city name:', error)
          );
        }
      },
      (error) => {
        console.error('Error retrieving user data:', error);
      }
    );

    // Fetch list of cities
    this.apiService.getCities().subscribe(
      (response: any) => {
        this.cities = response.data;
      },
      (error: any) => {
        console.error('Error fetching cities:', error);
      }
    );

    // Initialize EmailJS with user ID
    const EMAILJS_USER_ID = 'a68ncIwtUgoSeP9S6';
    EmailJS.init(EMAILJS_USER_ID);
  }


  toggleEdit() {
    // Toggle the editing mode
    this.isEditing = !this.isEditing;
  }

  updateDeleteButtonClass() {
    if (this.deleteCheckbox) {
      this.deleteButtonColor = 'bg-red-700'; // Changes to red if the checkbox is checked
    } else {
      this.deleteButtonColor = 'bg-gray-500'; // Reverts to gray if the checkbox is unchecked
    }
  }

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
            console.log('Cambios guardados exitosamente:', data);
            this.isEditing = false;
            Swal.fire('Saved!', '', 'success').then(() => {
              window.location.reload();
            });
          },
          (error) => {
            console.error('Error al guardar los cambios:', error);
          }
        );
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
        this.isEditing = false;
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    // Upload the image to the server
    this.apiService.uploadImage(file).subscribe(
      (response: any) => {
        if (response.url) { // Check if the image URL is present in the response
          // Save the image path in this.img
          this.img = response.url;
          // Save the image name in this.imgName
          this.imgName = file.name;
        } else {
          console.error('Error uploading the image:', response.message);
        }
      },
      (error: any) => {
        console.error('Error uploading the image:', error);
      }
    );
  }


  /**
 * Initiates the process of deleting the user's profile after confirming with a dialog.
 */
  deleteUser() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete your profile.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteUser(this.userId).subscribe(
          (response: any) => {
            console.log('Deletion response:', response);
            if (response) {
              const templateParams = {
                to_email: this.userData.email, // Make sure userData.email is defined and has a value
                subject: 'Account Deletion Confirmation',
                message: 'Your account has been successfully deleted.',
                user_name: this.userData.name
              };

              console.log('Sending email with parameters:', templateParams);

              EmailJS.send('service_b0ebhe5', 'template_5bn545g', templateParams)
                .then((emailResponse: any) => {
                  console.log('Email sent successfully:', emailResponse);
                  // User deleted successfully
                  Swal.fire(
                    'Deleted!',
                    'Your profile has been deleted.',
                    'success'
                  ).then(() => {
                    // Redirect to the home page or another appropriate location after deleting the user
                    this.authService.logout();
                    this.router.navigate(['/']);
                  });
                })
                .catch((emailError: any) => {
                  console.error('Error sending email:', emailError);
                  Swal.fire(
                    'Error',
                    'Your profile has been deleted, but there was a problem sending the confirmation email.',
                    'error'
                  ).then(() => {
                    this.authService.logout();
                    this.router.navigate(['/']);
                  });
                });
            }
          },
          (error: any) => {
            // If there is an error in the HTTP request
            console.error('Error deleting user:', error);
            Swal.fire(
              'Error',
              'There was a problem trying to delete your profile. Please try again later.',
              'error'
            );
          }
        );
      }
    });
  }



  /**
 * Validates the age of the user based on the provided birth date.
 */
  validateAge() {
    const today = new Date();
    const birthDate = new Date(this.userData.born_date);
    let ageDiff = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      ageDiff--;
    }

    // Check if the age is greater than 100 years
    if (ageDiff > 100) {
      this.isValidAge = false;
      return;
    }

    this.isValidAge = ageDiff >= 14;
  }


  /**
 * Validates the user data form fields.
 * @returns {boolean} Returns true if all form fields are valid, otherwise false.
 */
  validateForm(): boolean {
    // Validate each field of the form
    if (!this.userData.userName) {
      return false;
    }
    if (!this.userData.name) {
      return false;
    }
    // Validate email format using a regular expression
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.userData.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return false; // Return false if email format is incorrect
    }
    if (!this.userData.price_hour) {
      return false;
    }
    if (!this.userData.disponibility) {
      return false;
    }
    if (!this.userData.experience) {
      return false;
    }
    if (!this.userData.born_date) {
      return false;
    }

    // You can add more validations for other fields here
    return true;
  }



}
