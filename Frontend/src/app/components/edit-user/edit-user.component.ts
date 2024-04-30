import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  userId: string | null = null;
  userData: any = {};
  isEditing: boolean = false;
  selectedFile: File | null = null;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'] || null;
      if (this.userId) {
        this.loadUserData();
      }
    });
  }

  loadUserData() {
    this.apiService.getUserData(this.userId!).subscribe(
      userData => {
        this.userData = userData.data;
        console.log('User data:', userData);
      },
      error => {
        console.error('Error loading user data:', error);
      }
    );
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
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
            console.log('Changes saved successfully:', data);
            this.isEditing = false;
            Swal.fire('Saved!', '', 'success');
            this.router.navigate(['/userManagement']); // Redirige al usuario a la página 'userManagement' después de guardar los cambios
          },
          (error) => {
            console.error('Error saving changes:', error);
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

    // Subir la imagen al servidor
    this.apiService.uploadImage(file).subscribe(
      (response: any) => {
        if (response.url) { // Verifica si la URL de la imagen está presente en la respuesta
          // Guarda la ruta de la imagen en userData
          this.userData.img = response.url;
        } else {
          console.error('Error al subir la imagen:', response.message);
        }
      },
      (error: any) => {
        console.error('Error al subir la imagen:', error);
      }
    );
  }
}
