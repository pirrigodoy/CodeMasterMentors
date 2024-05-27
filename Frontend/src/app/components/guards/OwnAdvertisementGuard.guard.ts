import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class OwnAdvertisementGuard implements CanActivate {

  constructor(private apiService: ApiService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const userId = next.params['advertisementId']; // Obtener el ID de usuario de la URL
    const currentAdvertisemetnId = localStorage.getItem('advertisement_id'); // Obtener el ID de usuario autenticado

    // Verificar si el ID de usuario de la URL coincide con el ID de usuario autenticado
    const hasAccess = userId === currentAdvertisemetnId;

    if (!hasAccess) {
      // Construir la URL del perfil del usuario actual
      const url = `/advertisement/${currentAdvertisemetnId}`;

      // Redirigir al usuario a su propio perfil
      this.router.navigateByUrl(url);

      // Devolver false para evitar que el usuario acceda al perfil solicitado
      return false;
    }

    // Si el usuario tiene acceso, permitir la navegación
    return true;
  }
}
