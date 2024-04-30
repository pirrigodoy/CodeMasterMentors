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


  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments() {
    this.apiService.getComments().subscribe((comments: any[]) => {
      this.comments = comments;

    });
  }

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
