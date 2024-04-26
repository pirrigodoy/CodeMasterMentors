import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: string = '';
  userData: any = {}; // Aquí debes definir la estructura de tu modelo de datos para el usuario
  isEditing: boolean = false;
  selectedFile: File | null = null; 
  
  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    const userIdParam = this.route.snapshot.paramMap.get('userId');
    if (userIdParam) {
      this.userId = userIdParam;
    } else {
      console.error("No se proporcionó un ID de usuario en la URL");
    }

    this.apiService.getUserData(this.userId).subscribe(
      (response) => {
        if (response.error) {
          console.error('Error al obtener los datos del usuario:', response.message);
        } else {
          this.userData = response.data;
          console.log(this.userData);
        }
      },
      (error) => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    );
  }

  // Método para activar/desactivar la edición
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
    }).then((result: any) => { // Aquí especificamos el tipo de 'result' como 'any'
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.apiService.updateUserData(this.userData).subscribe(
          (data) => {
            console.log('Cambios guardados exitosamente:', data);
            this.isEditing = false; // Desactiva la edición después de guardar los cambios
            Swal.fire('Saved!', '', 'success');
          },
          (error) => {
            console.error('Error al guardar los cambios:', error);
          }
        );
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
        this.isEditing = false; // Desactiva la edición si el usuario elige no guardar los cambios
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;

    // Convertir la imagen seleccionada a base64
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.userData.img = e.target.result; // Asignar la cadena base64 a la propiedad 'img'
    };
    reader.readAsDataURL(file);
  }
}
