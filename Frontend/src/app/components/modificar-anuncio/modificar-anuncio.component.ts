import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-modificar-anuncio',
  templateUrl: './modificar-anuncio.component.html',
  styleUrls: ['./modificar-anuncio.component.css']
})
export class ModificarAnuncioComponent implements OnInit {
  advertisement: any = {};
  programmingLanguages: any = {};
  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    // Obtenemos el advertisementId del localStorage
    const advertisementId = localStorage.getItem('advertisement_id');
    
    // Verificamos si advertisementId no es null
    if (advertisementId !== null) {
      // Llamamos al método getAdvertisementById del ApiService para obtener los datos del anuncio
      this.apiService.getAdvertisementById(advertisementId).subscribe((advertisement: any) => {
        this.advertisement = advertisement.data;
        console.log('Advertisement:', advertisement);
      });

      this.apiService.getProgrammingLanguages().subscribe((programmingLanguages: any[]) => {
        this.programmingLanguages = programmingLanguages;
        console.log('Programming Languages:', programmingLanguages);
      });
    } else {
      console.error('No se encontró advertisement_id en el localStorage.');
      // Puedes manejar este caso de acuerdo a tus necesidades, por ejemplo, redirigiendo a otra página.
    }

    
  }
  
  updateAdvertisement(): void {
    this.apiService.updateAdvertisement(this.advertisement).subscribe((response: any) => {
      // Manejar la respuesta del servidor según sea necesario
      console.log('Advertisement updated:', response);
    }, (error: any) => {
      // Manejar el error
      console.error('Error updating advertisement:', error);
    });
  }
}
