import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class blockLogin implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
      // Redirigir al usuario a otra página (por ejemplo, la página de inicio)
      this.router.navigate(['/home']);
      return false;
    }

    // Permitir el acceso a la ruta
    return true;
  }
}
