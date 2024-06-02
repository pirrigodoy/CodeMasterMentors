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

  validateAge() {
    const today = new Date();
    const birthDate = new Date(this.born_date);
    let ageDiff = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      ageDiff--;
    }
    if (ageDiff > 100) {
      this.isValidAge = false;
      return;
    }
    this.isValidAge = ageDiff >= 14;
  }

  onSubmit() {
    if (!this.username || !this.password || !this.role_id || !this.name || !this.email || !this.born_date || !this.city_id || !this.img) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (!this.city_id) {
      this.errorMessage = 'Please select a city.';
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Please enter a valid email.';
      return;
    }

    if (this.password.length < 8 || !(/[a-zA-Z]/.test(this.password) && /[0-9]/.test(this.password))) {
      this.errorMessage = 'Password must be at least 8 characters long and contain letters and numbers.';
      return;
    }

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
        console.log('Registration successful:', response);
        this.registerSuccess = 'Registration successful. You can now log in.';

        // Guardar el valor de role en localStorage
        localStorage.setItem('role', this.role_id);

        // Update paymentRegister in localStorage to true
        localStorage.setItem('paymentRegister', 'true');

        const templateParams = {
          to_email: this.email,
          subject: 'Welcome',
          message: 'Thank you for registering with our platform.',
          user_name: this.name
        };

        EmailJS.send('service_b0ebhe5', 'template_5bn545g', templateParams)
          .then((emailResponse: any) => {
            console.log('Email sent successfully:', emailResponse);
            this.router.navigate(['/paymentRegister']);
          })
          .catch((emailError: any) => {
            console.error('Error sending email:', emailError);
            Swal.fire(
              'Registration Successful',
              'Your account has been created, but there was an issue sending the confirmation email.',
              'warning'
            ).then(() => {
              this.router.navigate(['/paymentRegister']);
            });
          });
      },
      error: (error) => {
        console.error('Registration error:', error);
      }
    });
  }

  getRoles() {
    this.apiService.getRoles().subscribe((roles: any) => {
      this.roles = roles;
      console.log('roles:', roles);
    });
  }

  getCities() {
    this.apiService.getCities().subscribe((cities: any) => {
      this.cities = cities;
      console.log('cities:', cities);
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    this.apiService.uploadImage(file).subscribe(
      (response: any) => {
        if (response.url) {
          this.img = response.url;
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
