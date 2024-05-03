// mis-anuncios.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-mis-anuncios',
  templateUrl: './crear-anuncio.component.html',
  styleUrls: ['./crear-anuncio.component.css']
})
export class CrearAnuncioComponent implements OnInit {
  nuevoAnuncio: any = {
    user_id: localStorage.getItem('user_id') // Obtener user_id del local_storage
  };  // Objeto para almacenar los datos del nuevo anuncio
  programmingLanguages: any = [];
  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {

    this.getProgrammingLanguages();
  }
  crearAnuncio(): void {
    this.apiService.crearAnuncio(this.nuevoAnuncio).subscribe((response: any) => {
      console.log('Anuncio creado:', response);
      // Obtener el advertisement_id del localStorage
      const advertisementId = localStorage.getItem('advertisement_id');
      // Redirigir al usuario a la página de "mis-anuncios" con el ID del anuncio como parámetro
      this.router.navigate(['/mis-anuncios', advertisementId]);
    });
  }


  getProgrammingLanguages() {
    this.apiService.getProgrammingLanguages().subscribe((response: any) => {
      this.programmingLanguages = response.data;
      console.log('ProgrammingLanguages:', this.programmingLanguages);
    });
  }

}
