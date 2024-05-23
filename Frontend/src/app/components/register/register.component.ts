import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as EmailJS from 'emailjs-com';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // Variables para almacenar los datos del formulario y mensajes de éxito/error
  isValidAge: boolean = true;
  username: string = '';
  password: string = '';
  role_id: string = '';
  name: string = '';
  email: string = '';
  born_date: string = '';
  city_id: string = '';
  cities: any = [];
  img: string = '';
  registerSuccess: string = '';
  errorMessage: string = '';
  emailPattern: any;
  roles: any = [];
  userData: any = {};
  imgName: string = '';

  // Evento emitido para ocultar el footer
  @Output() hideFooter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private apiService: ApiService, private router: Router) {
    this.hideFooter.emit(true); // Emitir el evento para ocultar el footer en el AppComponent
  }

  ngOnInit(): void {
    this.getRoles();
    this.getCities();

    const EMAILJS_USER_ID = 'a68ncIwtUgoSeP9S6';
    EmailJS.init(EMAILJS_USER_ID);
  }

  /**

Validates the age based on the birth date provided.
If the age is greater than 100, sets isValidAge to false.
*/
  validateAge() {
    const today = new Date();
    const birthDate = new Date(this.born_date);
    let ageDiff = today.getFullYear() - birthDate.getFullYear(); // Changed from const to let
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      ageDiff--;
    }
    // Check if the age is greater than 100 years
    if (ageDiff > 100) {
      this.isValidAge = false;
      return;
    }

    this.isValidAge = ageDiff >= 14; // Update isValidAge based on age difference
  }

  /**
 * Submits the registration form.
 * Validates the input fields and sends a registration request to the API service.
 * Displays error messages if any input field is empty or invalid.
 */
  onSubmit() {
    // Check if all fields are filled
    if (!this.username || !this.password || !this.role_id || !this.name || !this.email || !this.born_date || !this.city_id || !this.img) {
      this.errorMessage = 'Please fill in all fields.';
      return; // Stop execution if any field is empty
    }

    // Validate if city_id has a selected value
    if (!this.city_id) {
      this.errorMessage = 'Please select a city.';
      return; // Stop execution if city_id is empty
    }

    // Validate email format using a regular expression
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Please enter a valid email.';
      return; // Stop execution if email format is incorrect
    }

    // Validate password length and content
    if (this.password.length < 8 || !(/[a-zA-Z]/.test(this.password) && /[0-9]/.test(this.password))) {
      this.errorMessage = 'Password must be at least 8 characters long and contain letters and numbers.';
      return; // Stop execution if password doesn't meet requirements
    }

    // Send registration request to the API service
    this.apiService.register({
      username: this.username,
      role_id: this.role_id,
      name: this.name,
      email: this.email,
      password: this.password,
      born_date: this.born_date,
      city_id: this.city_id,
      img: this.img
    }).subscribe({
      next: (response) => {
        // Handle success response
        console.log('Registration successful:', response);
        // Show success message and redirect to login component
        this.registerSuccess = 'Registration successful. You can now log in.';

        // Send confirmation email
        const templateParams = {
          to_email: this.email,
          subject: 'Welcome',
          message: 'Thank you for registering with our platform.',
          user_name: this.name
        };

        EmailJS.send('service_b0ebhe5', 'template_5bn545g', templateParams)
          .then((emailResponse: any) => {
            console.log('Email sent successfully:', emailResponse);
            // Redirect to login
            this.router.navigate(['/login']);
          })
          .catch((emailError: any) => {
            console.error('Error sending email:', emailError);
            Swal.fire(
              'Registration Successful',
              'Your account has been created, but there was an issue sending the confirmation email.',
              'warning'
            ).then(() => {
              this.router.navigate(['/login']);
            });
          });
      },
      error: (error) => {
        // Handle registration request errors
        console.error('Registration error:', error);
      }
    });
  }


  /**
 * Retrieves roles from the API service and stores them in the component.
 */
  getRoles() {
    this.apiService.getRoles().subscribe((roles: any) => {
      this.roles = roles;
      console.log('roles:', roles);
    });
  }

  /**
 * Retrieves cities from the API service and stores them in the component.
 */
  getCities() {
    this.apiService.getCities().subscribe((cities: any) => {
      this.cities = cities;
      console.log('cities:', cities);
    });
  }

  /**
 * Handles the event when a file is selected for upload.
 * @param event The event containing the selected file.
 */
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
          console.error('Error uploading image:', response.message);
        }
      },
      (error: any) => {
        console.error('Error uploading image:', error);
      }
    );
  }

}
