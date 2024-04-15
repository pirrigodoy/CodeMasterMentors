import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: string = '';
  userData: any = {}; // Aquí debes definir la estructura de tu modelo de datos para el usuario
  isEditing: boolean = false;

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

  // Método para guardar los cambios en el servidor
  saveChanges() {
    this.apiService.updateUserData(this.userData).subscribe(
      (data) => {
        console.log('Cambios guardados exitosamente:', data);
        this.isEditing = false; // Desactiva la edición después de guardar los cambios
      },
      (error) => {
        console.error('Error al guardar los cambios:', error);
      }
    );
  }
}


