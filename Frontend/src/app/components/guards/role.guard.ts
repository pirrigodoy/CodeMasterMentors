import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

import { AuthService } from 'src/app/services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private apiService: ApiService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const expectedRole = route.data['expectedRole'];
    return this.apiService.getUserRole().pipe(
      map(userRole => {
        if (userRole === expectedRole) {
          return true;
        } else {
          this.router.navigate(['notfound']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['notfound']);
        return of(false);
      })
    );
  }
}
