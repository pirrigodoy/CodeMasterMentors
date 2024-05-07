import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-recibo',
  templateUrl: './recibo.component.html',
  styleUrls: ['./recibo.component.css']
})
export class ReciboComponent implements OnInit {
  receiptId!: string; // Usamos el operador de coerción "!"

  receipts: any;

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    // Obtenemos el receiptId de los parámetros de la ruta
    this.receiptId = this.route.snapshot.paramMap.get('receiptId')!;

    // Hacer la solicitud al backend para obtener el recibo correspondiente
    this.apiService.getReceipt(this.receiptId).subscribe(
      (response: any) => {
        this.receipts = response;
      },
      (error: any) => {
        console.error('Error al obtener el recibo:', error);
        // Manejar el error, por ejemplo, mostrar un mensaje al usuario
      }
    );
  }
}


