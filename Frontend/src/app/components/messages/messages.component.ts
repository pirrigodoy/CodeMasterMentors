import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  senderId: number = parseInt(localStorage.getItem('user_id') || '0', 10); // Inicializa senderId
  recipientId: number = 11; // Inicializa recipientId
  messages: any[] = []; // Inicializa messages como un arreglo vacío
  recipients: any[] = [];
  showMessages: boolean = false; // Variable de bandera para mostrar los mensajes
  users: any[] = []; // Asegúrate de que esto es un array

  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadMessages();
    this.loadRecipients();
    this.loadRecipientId();
    this.getUsers();
  }

  loadMessages(): void {
    this.apiService.getMessages(this.senderId, this.recipientId).subscribe(
      (response: any[]) => {
        response.forEach((message, index) => {
          this.apiService.getUserData(message.remitente.toString()).subscribe(
            (senderDetail: any) => {
              message.senderName = senderDetail.data.name || 'Desconocido';
              message.senderImage = senderDetail.data.img || 'ruta/por/defecto/a/la/imagen.png'; // Actualiza la ruta por defecto según tus necesidades

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
      (error: any) => {
        console.error('Error al cargar los mensajes:', error);
      }
    );
  }

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

  loadMessagesForRecipient(recipientId: number): void {
    this.recipientId = recipientId;
    this.loadMessages();
    this.showMessages = true;
  }

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

  getUsers(): void {
    this.apiService.getUsers().subscribe(
      (response: any) => {
        this.users = response.data;
      },
      (error: any) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  getUserImageUrl(userId: number): string | undefined {
    const user = this.users.find((user: any) => user.id === userId);
    return user ? user.img : undefined;
  }


}
