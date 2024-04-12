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
  userData: any; // Aquí debes definir la estructura de tu modelo de datos para el usuario
  isEditing: boolean = false;

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    // Verifica si el parámetro 'userId' está presente en la ruta actual
    const userIdParam = this.route.snapshot.paramMap.get('userId');
    if (userIdParam) {
      // Asigna el valor solo si el parámetro 'userId' está presente
      this.userId = userIdParam;
    } else {
      // Maneja el caso en el que no se proporciona un ID de usuario en la URL
      console.error("No se proporcionó un ID de usuario en la URL");
    }

    // Llama a tu método API para obtener los datos del usuario
    this.apiService.getUserData(this.userId).subscribe(
      (data) => {
        this.userData = data;
      },
      (error) => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    );
  }

  // Método para activar/desactivar la edición
  toggleEdit() {
    if (this.isEditing) {
      // Si ya se está editando, guarda los cambios
      this.saveChanges();
    } else {
      // Si no se está editando, habilita la edición
      this.isEditing = true;
    }
  }

  // Método para guardar los cambios en el servidor
  saveChanges() {
    // Llama a tu método API para enviar los datos actualizados al servidor
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
