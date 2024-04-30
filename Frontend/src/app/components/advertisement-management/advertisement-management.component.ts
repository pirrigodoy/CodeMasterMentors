import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgModule } from '@angular/core';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-advertisement-management',
  templateUrl: './advertisement-management.component.html',
  styleUrls: ['./advertisement-management.component.css']
})
export class AdvertisementManagementComponent implements OnInit {
  advertisements: any = [];
  router: any;


  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments() {
    this.apiService.getAdvertisements().subscribe((advertisements: any[]) => {
      this.advertisements = advertisements;
    });
  }

  eliminarAnuncio(advertisementId: string) {
    Swal.fire({
      title: 'Are you sure you want to delete this advertisement?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteAdvertisement(advertisementId).subscribe(
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
