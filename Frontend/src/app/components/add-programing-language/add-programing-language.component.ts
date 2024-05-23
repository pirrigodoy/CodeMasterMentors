// add-programing-language.component.ts
import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-programing-language',
  templateUrl: './add-programing-language.component.html',
  styleUrls: ['./add-programing-language.component.css']
})
export class AddProgramingLanguageComponent {
  LanguageData: any = {};

  constructor(private apiService: ApiService, private router: Router) { }

  /**
 * Saves changes by adding a new programming language through the API service.
 * Redirects to the programming languages management component after successful addition.
 * Logs success and error messages and handles errors as needed.
 */
  saveChanges() {
    // Call the API service to add a new programming language
    this.apiService.addPrograma(this.LanguageData).subscribe(
      response => {
        // Log success message and perform any additional actions after adding the new program
        console.log('New programming language added successfully:', response);
        // Redirect to the programming languages management component after successful addition
        this.router.navigate(['/programingLanguagesManagement']);
      },
      error => {
        // Log error message and handle the error as needed
        console.error('Error adding programming language:', error);
        // You can implement error handling logic here, such as displaying an error message to the user
      }
    );
  }


}
