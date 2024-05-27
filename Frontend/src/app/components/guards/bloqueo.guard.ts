import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class bloqueoGuard implements CanActivate {
  canActivate(): boolean {
    // Siempre devuelve false para bloquear el acceso
    return false;
  }
}
