import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any = [];
  roles: any = [];

  constructor(private apiService: ApiService) { }

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
}
