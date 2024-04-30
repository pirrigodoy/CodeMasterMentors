// mis-anuncios.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-mis-anuncios',
  templateUrl: './crear-anuncio.component.html',
  styleUrls: ['./crear-anuncio.component.css']
})
export class CrearAnuncioComponent implements OnInit{
  nuevoAnuncio: any = {
    user_id: localStorage.getItem('user_id') // Obtener user_id del local_storage
  };  // Objeto para almacenar los datos del nuevo anuncio
  programmingLanguages: any = [];
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {

    this.getProgrammingLanguages();
  }
  crearAnuncio(): void {
    this.apiService.crearAnuncio(this.nuevoAnuncio).subscribe((response: any) => {
      console.log('Anuncio creado:', response);
      // Aquí podrías realizar alguna acción adicional, como mostrar un mensaje de éxito o redirigir al usuario
    });
  }
  getProgrammingLanguages() {
    this.apiService.getProgrammingLanguages().subscribe((response: any) => {
        this.programmingLanguages = response.data;
        console.log('ProgrammingLanguages:', this.programmingLanguages);
    });
  }

}
