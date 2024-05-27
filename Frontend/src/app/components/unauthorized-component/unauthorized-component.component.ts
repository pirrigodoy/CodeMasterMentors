import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-not-authorized',
  template: `
    <h1>No estás autorizado para acceder a esta página.</h1>
    <p>Redirigiendo de vuelta...</p>
  `
})
export class NotAuthorizedComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Obtenemos la URL de retorno de los parámetros de consulta
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.router.navigateByUrl(returnUrl); // Redirigimos de vuelta a la URL de retorno
  }
}
