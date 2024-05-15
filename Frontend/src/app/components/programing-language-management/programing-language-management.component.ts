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

  loadProgrammingLanguages() {
    this.apiService.getProgrammingLanguages().subscribe((programmingLanguages: any[]) => {
      this.programmingLanguages = programmingLanguages;
    });
  }

  eliminarPrograma(programmingLanguageId: string) {
    Swal.fire({
      title: 'Are you sure you want to delete this Language?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteProgrammingLanguage(programmingLanguageId).subscribe(
          response => {
            console.log('Advertisement deleted successfully:', response);
            // Realizar cualquier acción adicional después de eliminar el anuncio
            Swal.fire('Advertisement deleted!', '', 'success').then(() => {
              // Refrescar la página después de eliminar el anuncio
              window.location.reload();
            });
          },
          error => {
            console.error('Error deleting advertisement:', error);
            // Manejar el error en caso de que ocurra
            Swal.fire('Error', 'Failed to delete advertisement', 'error');
          }
        );
      }
    });
  }
}
