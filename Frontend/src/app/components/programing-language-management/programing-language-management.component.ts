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

}
