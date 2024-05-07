import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  applications: any = [];
  states: { id: number, name: string }[] = []; // Especificar el tipo de los elementos de this.states

  constructor(private apiService: ApiService) {
    this.states = []
  }

  ngOnInit(): void {
    this.loadApplications();
    this.loadStates();
  }

  loadApplications() {
    this.apiService.getApplications().subscribe((applications: any[]) => {
      this.applications = applications;
    });
  }

  loadStates() {
    this.apiService.getStates().subscribe((response: any) => {
      this.states = response.states; // Ajusta esto según la estructura real de los datos devueltos por la API
    });
  }

  getStateName(stateId: number): string {
    if (!this.states) {
      return ''; // O cualquier otro valor predeterminado que desees
    }

    const state = this.states.find(s => s.id === stateId);
    return state ? state.name : ''; // Retornar el nombre del estado si se encuentra, de lo contrario, retornar una cadena vacía
  }

  deleteApplication(applicationId: string) {
    Swal.fire({
      title: 'Are you sure you want to delete this application?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteApplication(applicationId).subscribe(
          response => {
            console.log('Application deleted successfully:', response);
            Swal.fire('Application deleted!', '', 'success');
          },
          error => {
            console.error('Error deleting application:', error);
            Swal.fire('Error', 'Failed to delete application', 'error');
          }
        );
      }
    });
  }
}
