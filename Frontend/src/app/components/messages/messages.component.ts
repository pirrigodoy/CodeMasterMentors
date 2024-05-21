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
  showMessages: boolean = false; // Variable de bandera para mostrar los mensajes
  showMessagesForRecipient: boolean = false; // Nueva variable de bandera para mostrar los mensajes para un destinatario

  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;

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
        this.messages = response;
      },
      (error: any) => {
        console.error('Error al cargar los mensajes:', error);
      }
    );
  }

  // Función para cargar los destinatarios
  loadRecipients(): void {
    const userId = parseInt(localStorage.getItem('user_id') || '0', 10);

    if (!userId) {
      console.error('No se pudo obtener el ID del usuario logueado.');
      return;
    }

    const uniqueUserIds = new Set<number>();

    this.apiService.getUniqueRecipients(userId).subscribe(
      (recipientIds: number[]) => {
        recipientIds.forEach(recipientId => {
          uniqueUserIds.add(recipientId);
        });
      },
      (error: any) => {
        console.error('Error al cargar los destinatarios:', error);
      }
    );

    this.apiService.getUniqueSenders(userId).subscribe(
      (senderIds: number[]) => {
        senderIds.forEach(senderId => {
          uniqueUserIds.add(senderId);
        });

        uniqueUserIds.forEach(id => {
          this.apiService.getUserData(id.toString()).subscribe(
            (userData: any) => {
              this.recipients.push(userData);
            },
            (error: any) => {
              console.error('Error al cargar los detalles del usuario:', error);
            }
          );
        });
      },
      (error: any) => {
        console.error('Error al cargar los remitentes:', error);
      }
    );
  }

  // Función para cargar los mensajes para un destinatario y mostrarlos
  loadMessagesForRecipient(recipientId: number): void {
    this.recipientId = recipientId;
    this.loadMessages();
    this.showMessagesForRecipient = true;
  }

  // Método para ocultar los mensajes y mostrar el primer div nuevamente
  showRecipientList(): void {
    this.showMessagesForRecipient = false;
  }

  // Función para enviar un nuevo mensaje
  sendMessage(event: Event): void {
    event.preventDefault();

    const newMessageContent = this.messageInput.nativeElement.value.trim();

    if (!newMessageContent) {
      console.error('El contenido del mensaje es requerido.');
      return;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', { timeZone: 'UTC', hour12: false });

    const newMessage = {
      remitente: this.senderId,
      destinatario: this.recipientId,
      content: newMessageContent,
      date: formattedDate,
      estado: 1
    };

    this.apiService.sendMessage(newMessage).subscribe(
      (response: any) => {
        this.loadMessages();
        this.messageInput.nativeElement.value = '';
      },
      (error: any) => {
        console.error('Error al enviar el mensaje:', error);
      }
    );
  }

  // Función para cargar el recipientId
  loadRecipientId(): void {
    const advertisementId = localStorage.getItem('advertisement_id');

    if (advertisementId === null) {
      console.error('El ID del anuncio no está disponible en el localStorage.');
      return;
    }

    const parsedAdvertisementId = parseInt(advertisementId, 10);
    if (isNaN(parsedAdvertisementId)) {
      console.error('El ID del anuncio no es un número válido.');
      return;
    }

    this.apiService.getUserIdByAdvertisementId(parsedAdvertisementId.toString()).subscribe(
      (userId: number | undefined) => {
        if (userId === undefined || userId === null) {
          console.error('El ID del usuario obtenido es inválido.');
          return;
        }
        this.recipientId = userId;
        this.loadMessages();
      },
      (error: any) => {
        console.error('Error al obtener el user_id:', error);
      }
    );
  }

}
