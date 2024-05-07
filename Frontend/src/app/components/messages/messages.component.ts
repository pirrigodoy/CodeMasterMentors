import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  senderId: number = parseInt(localStorage.getItem('user_id') || '0', 10);; // Inicializa senderId
  recipientId: number = 11; // Inicializa recipientId
  messages: any[] = []; // Inicializa messages como un arreglo vacío
  recipients: any[] = [];

  @ViewChild('messageInput', { static: true }) messageInput!: ElementRef<HTMLInputElement>;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadMessages();
    this.loadRecipients();
    this.loadRecipientId(); // Llama a esta función para cargar el senderId

  }

  // Función para cargar los mensajes entre senderId y recipientId
  loadMessages(): void {
    this.apiService.getMessages(this.senderId, this.recipientId).subscribe(
      (response: any[]) => {
        // Recorre cada mensaje y solicita los detalles del remitente de forma secuencial
        response.forEach((message, index) => {
          this.apiService.getUserData(message.remitente.toString()).subscribe(
            (senderDetail: any) => {
              // Asigna el nombre del remitente al mensaje
              message.senderName = senderDetail.data.name || 'Desconocido';
              // Si este es el último mensaje, actualiza la lista de mensajes
              if (index === response.length - 1) {
                this.messages = response;
              }
            },
            (error: any) => {
              console.error('Error al cargar los detalles del remitente:', error);
            }
          );
        });
      },
      (error: any) => { // Define el tipo de error como 'any'
        console.error('Error al cargar los mensajes:', error);
      }
    );
  }


  loadRecipients(): void {
    this.apiService.getUniqueRecipients(this.senderId).subscribe(
      (recipientIds: number[]) => {
        // Itera sobre cada ID de destinatario y obtén sus detalles
        recipientIds.forEach(recipientId => {
          // Haz una solicitud al servicio para obtener los detalles del destinatario
          this.apiService.getUserData(recipientId.toString()).subscribe(
            (recipientData: any) => {
              // Agrega los detalles del destinatario a la lista de destinatarios
              this.recipients.push(recipientData);
              console.log('fdfd',recipientData);
            },
            (error: any) => {
              console.error('Error al cargar los detalles del destinatario:', error);
            }
          );
        });
      },
      (error: any) => {
        console.error('Error al cargar los destinatarios:', error);
      }
    );
  }



  loadMessagesForRecipient(recipientId: number): void {
    this.recipientId = recipientId;
    console.log('Recipient ID:', recipientId);
    this.loadMessages();
  }



  // Función para enviar un nuevo mensaje
    sendMessage(event: Event): void {
      event.preventDefault(); // Evita que el formulario se envíe automáticamente

      const newMessageContent = this.messageInput.nativeElement.value.trim();

      // Verifica si el nuevo mensaje tiene contenido antes de enviarlo
      if (!newMessageContent) {
        console.error('El contenido del mensaje es requerido.');
        return;
      }

      // Obtiene la fecha actual
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString('en-US', { timeZone: 'UTC', hour12: false });

      const newMessage = {
        remitente: this.senderId,
        destinatario: this.recipientId,
        content: newMessageContent,
        date: formattedDate, // Agrega la fecha al mensaje
        estado: 1 // Establece el estado predeterminado como 1
      };

      console.log('Mensaje a enviar:', newMessage);

      this.apiService.sendMessage(newMessage).subscribe(
        (response: any) => {
          console.log('Mensaje enviado:', response);
          // Recarga los mensajes después de enviar el mensaje
          this.loadMessages();
          // Limpia el campo de texto del nuevo mensaje
          this.messageInput.nativeElement.value = '';
        },
        (error: any) => { // Define el tipo de error como 'any'
          console.error('Error al enviar el mensaje:', error);
        }
      );
    }

    loadRecipientId(): void {
      const advertisementId = localStorage.getItem('advertisement_id');
      console.log('hey', advertisementId);

      if (advertisementId === null) {
        console.error('El ID del anuncio no está disponible en el localStorage.');
        return;
      }

      // Intenta parsear el ID del anuncio a un número
      const parsedAdvertisementId = parseInt(advertisementId, 10);
      if (isNaN(parsedAdvertisementId)) {
        console.error('El ID del anuncio no es un número válido.');
        return;
      }

      console.log('ID del anuncio parseado:', parsedAdvertisementId);

      // Si el parseo fue exitoso, asigna el valor a recipientId
      this.apiService.getUserIdByAdvertisementId(parsedAdvertisementId.toString()).subscribe(
        (userId: number | undefined) => { // <- Cambio aquí
          console.log('ID del usuario obtenido:', userId);
          if (userId === undefined || userId === null) {
            console.error('El ID del usuario obtenido es inválido.');
            return;
          }
          this.recipientId = userId;
          console.log('hola', this.recipientId);
          this.loadMessages();
        },
        (error: any) => {
          console.error('Error al obtener el user_id:', error);
        }
      );

    }



}
