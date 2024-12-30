import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
import {MatIcon} from '@angular/material/icon';
import {MatDivider} from '@angular/material/divider';
import {MatCard} from '@angular/material/card';
import {WebsocketService} from '../../../Services/WebSocketServices/websocket.service';
import {NavbarServiceService} from '../../../Services/Navbar/navbar-service.service';
import {encryptData} from '../../E2EECompenents/Encryption';
import {PrivateKeyService} from '../../../Services/UserProfile/PrivateKey.service';
import {decryptData} from '../../E2EECompenents/Decryption';

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
export class ChatOverviewComponent implements OnInit {
  chatRooms: ChatRoomOverviewDTO[] = [];
  selectedChat: ChatRoomOverviewDTO | null = null
  messages: ChatMessageDTO[] = [];
  messageContent: string = '';
  currentUserId = ''
  currentUserPublicKey = '';
  recipientPublicKeys: Map<string, string> = new Map();

  constructor(private privateKeyService : PrivateKeyService,private navbarService: NavbarServiceService,private websocketService: WebsocketService, private chatService: ChatService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.navbarService.fetchProfile().subscribe(  {
      next: (profile) => {
        console.log('Fetched profile successfully');
      },
      error: (err) => {
        console.error('Failed to fetch profile', err);
      },
    });
    this.currentUserId = this.chatService.getLoggenInUserId();
    this.websocketService.connect(this.currentUserId);

    this.websocketService.messageReceived$.subscribe(async (message: ChatMessageDTO) => {
      console.log('New message received in component:', message);

      if (this.selectedChat && this.selectedChat.recipientId === message.senderId) {
        const privateKey: string  = this.privateKeyService.getPrivateKey();
        message.content = await decryptData(message.content, privateKey);
        this.messages.push(message);
        this.cdr.detectChanges();
      }

      this.updateLastMessage(message);
    });

    // Fetch available chat rooms
    this.chatService.getChatRooms().subscribe({
      next: (chatRooms) => {
        this.chatRooms = chatRooms;
      },
      error: (err) => {
        console.error('Error fetching chat rooms:', err);
      },
    });
  }

  selectChat(chat: ChatRoomOverviewDTO) {
    this.selectedChat = chat;
    if (this.recipientPublicKeys.has(chat.recipientId)) {
      console.log(`Public key already available for recipientId: ${chat.recipientId}`);
      this.currentUserPublicKey = this.recipientPublicKeys.get(chat.recipientId)!;
    } else {
      this.getRecipientPublicKey(chat.recipientId);
    }

    this.chatService.getMessages(chat.chatId).subscribe(async (messages) => {
      this.messages = await Promise.all(
        messages.map(async (message) => {
          // Check if the message was sent to the current user
          if (message.senderId === chat.recipientId) {
            const privateKey: string = this.privateKeyService.getPrivateKey();
            message.content = await decryptData(message.content, privateKey);
          }
          return message;
        })
      );
    });


  }

  getRecipientPublicKey(recipientId: string) {
    console.log(`Fetching public key for recipientId: ${recipientId}`);
    this.chatService.getPublicKeyOfRecipient(recipientId).subscribe({
      next: (publicKey) => {
        console.log(`Received public key for recipientId ${recipientId}: ${publicKey}`);

        this.recipientPublicKeys.set(recipientId, publicKey);
        this.currentUserPublicKey = publicKey;
      },
      error: (err) => {
        console.error(`Error fetching public key for recipientId ${recipientId}:`, err);
      }
    });
  }


  async sendMessage() {
    if (this.messageContent.trim()) {
      const encryptedMessage: string =  await encryptData(this.messageContent, this.currentUserPublicKey);
      const message: ChatMessageDTO = {
        senderId: this.currentUserId,
        recipientId: this.selectedChat?.recipientId,
        content: encryptedMessage,
        timestamp: new Date()
      };
      this.websocketService.sendMessage(message);
      this.messages.push(message);
      this.updateLastMessage(message);
      this.messageContent = '';
    }
  }

  private async updateLastMessage(message: ChatMessageDTO) {
    const chat = this.chatRooms.find(chat => chat.recipientId === message.recipientId || chat.recipientId === message.senderId);
    if (chat) {
      chat.lastMessageContent = message.content;
      chat.lastMessageTimestamp = message.timestamp;

      this.cdr.detectChanges();
    }
  }

}
