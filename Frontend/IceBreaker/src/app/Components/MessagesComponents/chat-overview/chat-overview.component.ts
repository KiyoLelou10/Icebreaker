import {Component, OnInit} from '@angular/core';
import {ChatRoomOverviewDTO} from '../../../DTOS/ChatDTOs/ChatRoomOverviewDTO';
import {ChatMessageDTO} from '../../../DTOS/ChatDTOs/ChatMessageDTO';
import {ChatService} from '../../../Services/ChatService/chat.service';
import {MatSidenav, MatSidenavContainer, MatSidenavModule} from '@angular/material/sidenav';
import {MatList, MatListItem, MatListModule} from '@angular/material/list';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {MatLine} from '@angular/material/core';
import {MatFormField} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {getMatIconFailedToSanitizeLiteralError, MatIcon} from '@angular/material/icon';
import {MatDivider} from '@angular/material/divider';
import {MatCard} from '@angular/material/card';
import {WebsocketService} from '../../../Services/WebSocketServices/websocket.service';

@Component({
  selector: 'app-chat-overview',
  standalone: true,
  imports: [
    MatSidenavContainer,
    MatList,
    MatListItem,
    NgForOf,
    MatLine,
    DatePipe,
    NgIf,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavModule,
    MatFormField,
    FormsModule,
    MatButton,
    MatInput,
    MatIcon,
    MatIconButton,
    MatDivider,
    NgClass,
    MatListModule,
    MatCard
  ],
  templateUrl: './chat-overview.component.html',
  styleUrl: './chat-overview.component.css'
})
export class ChatOverviewComponent implements OnInit{
  chatRooms: ChatRoomOverviewDTO[] = [];
  selectedChat: ChatRoomOverviewDTO | null = null;
  messages: ChatMessageDTO[] = [];
  isLoadingMessages = false;
  messageContent: any;

  constructor(private chatService: ChatService, private webSocketService: WebsocketService) {}

  ngOnInit(): void {
    this.webSocketService.connect(this.chatService.getLoggenInUserId());
    this.loadChatRooms();
  }

  loadChatRooms(): void {
    this.chatService.getChatRooms().subscribe((rooms) => {
      this.chatRooms = rooms;
    });
  }

  selectChat(chatRoom: ChatRoomOverviewDTO): void {
    this.selectedChat = chatRoom;
    this.loadMessages(chatRoom.chatId);
    console.log(chatRoom.recipientProfilePicture);
  }

  loadMessages(chatId: string): void {
    this.isLoadingMessages = true;
    this.chatService.getMessages(chatId).subscribe((msgs) => {
      this.messages = msgs;
      this.isLoadingMessages = false;
    });
  }

  sendMessage() {
    const message: ChatMessageDTO  = {
      senderId: this.chatService.getLoggenInUserId(),
      recipientId: this.selectedChat?.recipientId,
      content: this.messageContent,
      timestamp: new Date()

    }
    this.messages.push(message);

    console.log('Sending message:', message);
    this.webSocketService.sendMessage(message);
    this.messageContent = '';
  }

  onChatRoomClick(room: ChatRoomOverviewDTO) {
    console.log(room);
  }
}
