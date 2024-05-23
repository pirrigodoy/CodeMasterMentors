import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router'; // Importa Router
import * as EmailJS from 'emailjs-com';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any = [];
  roles: any = [] = [];

  constructor(private apiService: ApiService, private router: Router) { } // Inyecta Router en el constructor

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
    this.getRoles();
    const EMAILJS_USER_ID = 'ZZGv2rSlsn03aidsX';
    EmailJS.init(EMAILJS_USER_ID);
  }

  /**
 * Loads users from the API.
 */
  loadUsers() {
    this.apiService.getUsers().subscribe((users: any[]) => {
      this.users = users;
    });
  }

  /**
 * Loads roles from the API.
 */
  loadRoles() {
    this.apiService.getRoles().subscribe((roles: any[]) => {
      this.roles = roles;
    });
  }

  /**
 * Retrieves roles from the API.
 * @returns A promise that resolves when roles are successfully retrieved, and rejects if there's an error.
 */
  getRoles(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Call the API service to get roles
      this.apiService.getRoles().subscribe((response: any) => {
        // Log the API response
        console.log('API response:', response);
        // Check if the response data is an array
        if (Array.isArray(response.data)) {
          // Store the roles in the component's roles property
          this.roles = response.data;
          // Log the retrieved roles
          console.log('Roles:', this.roles);
          // Resolve the promise since roles are successfully retrieved
          resolve();
        } else {
          // Log an error if the response data is not an array
          console.error('Error: roles is not an array:', response.data);
          // Reject the promise with an error message
          reject('Error: roles is not an array');
        }
      }, error => {
        // Log an error if there's an error fetching roles
        console.error('Error fetching roles:', error);
        // Reject the promise with the error
        reject(error);
      });
    });
  }

  /**
  * Retrieves the role name based on the role ID.
  * @param roleId The ID of the role to retrieve the name for.
  * @returns The name of the role if found, otherwise 'Unknown Role'.
  */
  getRoleName(roleId: string): string {
    // Find the role with the given role ID
    const role = this.roles.find((role: any) => role.id === roleId);
    // Return the name of the role if found, otherwise 'Unknown Role'
    return role ? role.name : 'Unknown Role';
  }


  /**
 * Displays a confirmation dialog to delete a user and handles the deletion process.
 * @param userId The ID of the user to be deleted.
 */
  eliminarUsuario(userId: string) {
    // Display a confirmation dialog
    Swal.fire({
      title: 'Are you sure you want to delete this user?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      // If user confirms deletion
      if (result.isConfirmed) {
        // Retrieve user data
        this.apiService.getUserData(userId).subscribe(
          userData => {
            // Extract user's email
            const userEmail = userData.data.email;
            // Check if email is present
            if (!userEmail) {
              console.error('User email is empty.');
              return;
            }
            // Extract user's name
            const userName = userData.data.name;
            console.log(userName);
            console.log(userEmail);

            // Proceed with user deletion
            this.apiService.deleteUser(userId).subscribe(
              response => {
                console.log('User deleted successfully:', response);
                // Send an email to the deleted user
                const templateParams = {
                  your_email: userEmail,
                  subject: 'Account Deletion Confirmation',
                  message: 'Your account has been successfully deleted.',
                  to_name: userName
                };

                EmailJS.send('service_32gackn', 'template_g8ykurf', templateParams)
                  .then((response: any) => {
                    console.log('Email sent successfully:', response);
                  })
                  .catch((error: any) => {
                    console.error('Error sending email:', error);
                  });

                // Display success message
                Swal.fire('User deleted!', '', 'success');
                // Redirect to user management page
                this.router.navigate(['/userManagement']);
              },
              error => {
                console.error('Error deleting user:', error);
                Swal.fire('Error', 'Failed to delete user', 'error');
              }
            );
          },
          error => {
            console.error('Error getting user data:', error);
            Swal.fire('Error', 'Failed to get user data', 'error');
          }
        );
      }
    });
  }




}
