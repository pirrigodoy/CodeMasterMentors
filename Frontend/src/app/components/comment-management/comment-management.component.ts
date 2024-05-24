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
  users: any = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadComments();
    this.getUsers();
  }

  loadComments() {
    this.apiService.getComments().subscribe((comments: any[]) => {
      this.comments = comments;
    });
  }

  getUsers() {
    return new Promise<void>((resolve, reject) => {
      this.apiService.getUsers().subscribe((response: any) => {
        console.log('API response:', response);
        if (Array.isArray(response.data)) {
          this.users = response.data;
          console.log('Users:', this.users);
          resolve();
        } else {
          console.error('Error: los usuarios no son un array:', response.data);
          reject('Error: los usuarios no son un array');
        }
      }, error => {
        console.error('Error al obtener los usuarios:', error);
        reject(error);
      });
    });
  }

  getTransmitter(userId: number): string {
    const user = this.users.find((user: any) => user.id === userId);
    return user ? user.name : 'Usuario desconocido';
  }

  getReceiver(userId: number): string {
    const user = this.users.find((user: any) => user.id === userId);
    return user ? user.name : 'Usuario desconocido';
  }

  eliminarComment(commentId: string) {
    Swal.fire({
      title: 'Are you sure you want to delete this comment?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteComment(commentId).subscribe(
          response => {
            console.log('Comment deleted successfully:', response);
            // Realizar cualquier acción adicional después de eliminar el comentario
            this.loadComments();  // Recargar los comentarios después de eliminar uno
            Swal.fire('Comment deleted!', '', 'success');
          },
          error => {
            console.error('Error deleting comment:', error);
            // Manejar el error en caso de que ocurra
            Swal.fire('Error', 'Failed to delete comment', 'error');
          }
        );
      }
    });
  }
}
