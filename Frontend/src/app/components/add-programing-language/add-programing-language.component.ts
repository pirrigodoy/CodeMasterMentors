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

  saveChanges() {
    // Llama al servicio API para agregar un nuevo programa
    this.apiService.addPrograma(this.LanguageData).subscribe(
      response => {
        console.log('New programming language added successfully:', response);
        // Realiza cualquier acción adicional después de agregar el nuevo programa
        this.router.navigate(['/programingLanguagesManagement']); // Redirige al componente de gestión de lenguajes de programación
      },
      error => {
        console.error('Error adding programming language:', error);
        // Maneja el error según sea necesario
      }
    );
  }
}
