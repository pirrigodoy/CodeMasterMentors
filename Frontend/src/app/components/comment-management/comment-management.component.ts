import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-comment-management',
  templateUrl: './comment-management.component.html',
  styleUrls: ['./comment-management.component.css']
})
export class CommentManagementComponent implements OnInit {
  comments: any = [];
  users: any = [] = [];


  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadComments();
    this.getUsers();

  }

  /**
 * Loads the comments by calling the API service's getComments method.
 * Updates the comments array with the retrieved comments.
 */
  loadComments() {
    this.apiService.getComments().subscribe((comments: any[]) => {
      this.comments = comments;

    });
  }

  /**
 * Retrieves the list of users from the API service.
 * Returns a promise that resolves when the users are successfully retrieved or rejects if there is an error.
 * @returns {Promise<void>}
 */
  getUsers(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.apiService.getUsers().subscribe(
        (response: any) => {
          console.log('Respuesta de la API:', response);
          if (Array.isArray(response.data)) {
            this.users = response.data;
            console.log('Usuarios obtenidos:', this.users);
            resolve();
          } else {
            console.error('Error: los usuarios no son un array:', response.data);
            reject('Error: los usuarios no son un array');
          }
        },
        (error) => {
          console.error('Error al obtener los usuarios:', error);
          reject(error);
        }
      );
    });
  }


 /**
 * Retrieves the name of the transmitting user corresponding to the specified user ID.
 * @param {number} userId - The ID of the transmitting user.
 * @returns {string} - The name of the transmitting user or 'Unknown User' if not found.
 */
  getTransmitter(userId: number): string {
    const user = this.users.find((user: any) => user.id === userId);
    return user ? user.name : 'Usuario desconocido';
  }

  /**
   * Retrieves the name of the receiving user corresponding to the specified user ID.
   * @param {number} userId - The ID of the receiving user.
   * @returns {string} - The name of the receiving user or 'Unknown User' if not found.
   */
  getReceiver(userId: number): string {
    const user = this.users.find((user: any) => user.id === userId);
    return user ? user.name : 'Usuario desconocido';
  }

  /**
   * Displays a confirmation dialog to ask the user if they want to delete the comment with the specified commentId.
   * If the user confirms deletion, calls the ApiService's deleteUser method to delete the comment.
   * Displays a success message if the comment is deleted successfully.
   * Displays an error message if there is an error while deleting the comment.
   * @param commentId The ID of the comment to delete
   */
  eliminarComment(commentId: string) {
    Swal.fire({
      title: 'Are you sure you want to delete this user?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteUser(commentId).subscribe(
          response => {
            console.log('User deleted successfully:', response);
            // Realizar cualquier acción adicional después de eliminar el usuario
            Swal.fire('User deleted!', '', 'success');
          },
          error => {
            console.error('Error deleting user:', error);
            // Manejar el error en caso de que ocurra
            Swal.fire('Error', 'Failed to delete user', 'error');
          }
        );
      }
    });
  }
}
