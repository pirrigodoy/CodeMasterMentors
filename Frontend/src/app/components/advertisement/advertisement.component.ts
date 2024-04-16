import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.css']
})
export class AdvertisementComponent implements OnInit {
  advertisementId: string = '';
  advertisementData: any = {}; // Debes definir la estructura de tu modelo de datos para el anuncio
  programmingLanguages: any = [];

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    const advertisementIdParam = this.route.snapshot.paramMap.get('advertisementId');
    if (advertisementIdParam) {
      this.advertisementId = advertisementIdParam;
    } else {
      console.error("No se proporcionó un ID de anuncio en la URL");
      return;
    }

    this.apiService.getAdvertisementData(this.advertisementId).subscribe(
      (response) => {
        if (response.error) {
          console.error('Error al obtener los datos del anuncio:', response.message);
        } else {
          this.advertisementData = response.data;
          console.log(this.advertisementData);
        }
      },
      (error) => {
        console.error('Error al obtener los datos del anuncio:', error);
      }
    );

    this.getProgrammingLanguages();

  }

  getProgrammingLanguages() {
    this.apiService.getProgrammingLanguages().subscribe((programmingLanguages: any) => {
      this.programmingLanguages = programmingLanguages;
       console.log('ProgrammingLanguages:', programmingLanguages);
    });
  }
}

