// programing-language-management.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router'; // Importa Router

@Component({
  selector: 'app-programing-language-management',
  templateUrl: './programing-language-management.component.html',
  styleUrls: ['./programing-language-management.component.css']
})
export class ProgramingLanguageManagementComponent implements OnInit {
  programmingLanguages: any = [];

  constructor(private apiService: ApiService, private router: Router) { } // Inyecta Router en el constructor

  ngOnInit(): void {
    this.loadProgrammingLanguages();
  }

  /**
 * Loads the programming languages from the API service and assigns them to the component property.
 */
  loadProgrammingLanguages() {
    this.apiService.getProgrammingLanguages().subscribe((programmingLanguages: any[]) => {
      this.programmingLanguages = programmingLanguages;
    });
  }


  /**
 * Displays a confirmation dialog to delete a programming language and handles the deletion process.
 * @param {string} programmingLanguageId - The ID of the programming language to be deleted.
 */
  eliminarPrograma(programmingLanguageId: string) {
    // Display a confirmation dialog
    Swal.fire({
      title: 'Are you sure you want to delete this Language?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      // If user confirms deletion
      if (result.isConfirmed) {
        // Send request to delete the programming language
        this.apiService.deleteProgrammingLanguage(programmingLanguageId).subscribe(
          response => {
            console.log('Programming language deleted successfully:', response);
            // Perform any additional action after deleting the programming language
            Swal.fire('Programming Language deleted!', '', 'success').then(() => {
              // Refresh the page after deleting the programming language
              window.location.reload();
            });
          },
          error => {
            console.error('Error deleting programming language:', error);
            // Handle the error if it occurs
            Swal.fire('Error', 'Failed to delete programming language', 'error');
          }
        );
      }
    });
  }

}
