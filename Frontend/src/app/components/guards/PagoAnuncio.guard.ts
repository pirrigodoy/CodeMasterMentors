import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PagoAnuncioGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    const paymentProcessed = localStorage.getItem('paymentProcessed'); // Obtener el estado del pago

    if (paymentProcessed !== 'true') {
      // Si el pago no ha sido procesado, redirigir al usuario a una página adecuada
      this.router.navigateByUrl('notfound'); // Cambia '/pagina-de-error' por la ruta deseada
      return false; // Devolver false para bloquear la navegación
    }

    // Si el pago ha sido procesado, permitir la navegación
    return true;
  }
}
