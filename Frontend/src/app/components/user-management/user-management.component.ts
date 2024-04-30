import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router'; // Importa Router

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any = [];
  roles: any = [];

  constructor(private apiService: ApiService, private router: Router) { } // Inyecta Router en el constructor

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.apiService.getUsers().subscribe((users: any[]) => {
      this.users = users;
    });
  }

  loadRoles() {
    this.apiService.getRoles().subscribe((roles: any[]) => {
      this.roles = roles;
    });
  }

  getRoleName(roleId: string): string {
    const role = this.roles.find((role: any) => role.id === roleId);
    return role ? role.name : 'Unknown Role';
  }

  eliminarUsuario(userId: string) {
    Swal.fire({
      title: 'Are you sure you want to delete this user?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteUser(userId).subscribe(
          response => {
            console.log('User deleted successfully:', response);
            // Realizar cualquier acción adicional después de eliminar el usuario
            Swal.fire('User deleted!', '', 'success');
            // Redirigir a la página de gestión de usuarios después de eliminar el usuario
            this.router.navigate(['/user-management']);
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
