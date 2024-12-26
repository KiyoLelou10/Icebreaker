import { Injectable } from '@angular/core';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {KeycloakService} from 'keycloak-angular';
import {ChatMessageDTO} from '../../DTOS/ChatMessageDTO';



@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private stompClient: Client | null = null;

  connect(senderId: string): void {
    const socket = new SockJS('http://localhost:8080/ws');

    this.stompClient = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      debug: (msg: string) => console.log(msg),
      connectHeaders: {

        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      },
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      this.subscribeToMessages(senderId);
    };

    this.stompClient.onStompError = (frame) => {
      console.error('WebSocket error:', frame.headers['message']);
    };

    this.stompClient.activate();
  }

  private subscribeToMessages(senderId: string): void {
    if (this.stompClient) {
      this.stompClient.subscribe(`/user/${senderId}/queue/messages`, (message) => {
        this.onMessageReceived(message);
      });
      console.log(`Subscribed to: /user/${senderId}/queue/messages`);
    }
  }

  sendMessage(message: ChatMessageDTO): void {
    if (this.isConnected()) {
      this.stompClient?.publish({
        destination: `/app/chat`,
        body: JSON.stringify(message),
      });
    } else {
      console.error('Cannot send message: WebSocket is not connected.');
    }
  }

  private onMessageReceived(payload: any): void {
    console.log('Message received:', JSON.parse(payload.body));
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log('WebSocket disconnected');
    }
  }
  isConnected(): boolean {
    return this.stompClient?.connected ?? false;
  }
}
