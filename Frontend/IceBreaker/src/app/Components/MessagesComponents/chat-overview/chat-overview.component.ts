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
import {generateKeyPair} from '../../E2EECompenents/KeyGenerate';
import {EncryptionService} from '../../E2EECompenents/SymmetricEncryption';
import {ExpressionBinding} from '@angular/compiler';

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
  symmetricKeys : Map<string, string> = new Map();
  currentSymmetricKey = '';
  myPublicKey = '';
  myPrivateKey = '';

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
    this.getMyOwnPublicKey(this.currentUserId);
    this.myPrivateKey = this.privateKeyService.getPrivateKey();

    this.websocketService.messageReceived$.subscribe(async (message: ChatMessageDTO) => {
      console.log('New message received in component:', message);

      if (this.selectedChat && this.selectedChat.recipientId === message.senderId) {
        this.messages.push(message);
        this.cdr.detectChanges();
      }

      await this.updateLastMessage(message);
    });

    // Fetch available chat rooms
    this.chatService.getChatRooms().subscribe({
      next: async (chatRooms) => {
        for (const chatRoom of chatRooms) {
          await this.decryptLastMessage(chatRoom);
        }
        this.chatRooms = chatRooms;
      },
      error: (err) => {
        console.error('Error fetching chat rooms:', err);
      },
    });
  }

  async selectChat(chat: ChatRoomOverviewDTO) {
    this.selectedChat = chat;
    if (this.symmetricKeys.has(this.selectedChat.chatId)) {
      // @ts-ignore
      this.currentSymmetricKey = this.symmetricKeys.get(this.selectedChat.chatId);
    } else {
      await this.fetchSymmetricKey(this.selectedChat.chatId, this.currentUserId);
    }
    if (this.recipientPublicKeys.has(chat.recipientId)) {
      console.log(`Public key already available for recipientId: ${chat.recipientId}`);
      this.currentUserPublicKey = this.recipientPublicKeys.get(chat.recipientId)!;
    } else {
      this.getRecipientPublicKey(chat.recipientId);
    }
    console.log('Public key selected:', this.currentUserPublicKey);
    this.chatService.getMessages(chat.chatId).subscribe(async (messages) => {
      this.messages = await Promise.all(
        messages.map(async (message) => {
          console.log('Symmetric key', this.currentSymmetricKey);
          message.content = EncryptionService.decryptMessage(message.content, this.currentSymmetricKey)
          return message;
        })
      );
    });


  }

  async decryptLastMessage(chatRoom: ChatRoomOverviewDTO) {
    await this.fetchSymmetricKey(chatRoom.chatId, this.currentUserId);
    console.log('Symmetric key:', this.currentSymmetricKey);
    console.log('ChatRoomID: ', chatRoom.chatId);
    chatRoom.lastMessageContent = EncryptionService.decryptMessage(chatRoom.lastMessageContent, this.currentSymmetricKey)

  }

  getRecipientPublicKey(recipientId: string) {
    console.log(`Fetching public key for recipientId: ${recipientId}`);
    this.chatService.getPublicKey(recipientId).subscribe({
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

  getMyOwnPublicKey(userId: string) {
    this.chatService.getPublicKey(userId).subscribe({
      next: (publicKey) => {
        this.myPublicKey = publicKey;
      },
      error: (err) => {
        console.error(`Error fetching public key for userId ${userId}:`, err);
      }
    });
  }


  async sendMessage() {
    if (this.messageContent.trim()) {
      // @ts-ignore
      if (this.symmetricKeys.has(this.selectedChat.chatId)) {
        // @ts-ignore
        this.currentSymmetricKey = this.symmetricKeys.get(this.selectedChat.chatId);
      } else {
        // @ts-ignore
        this.fetchSymmetricKey(this.selectedChat.chatId, this.currentUserId);
      }
      let encryptedMessage: string = '';
      if(this.currentSymmetricKey){
        encryptedMessage = EncryptionService.encryptMessage(this.messageContent, this.currentSymmetricKey);
      }
      else{
        const symmetricKey = EncryptionService.generateSymmetricKey();
        console.log('New symmetric key generated:', symmetricKey);
        const encryptedSymmetricKeyRecipient = await EncryptionService.encryptSymmetricKey(symmetricKey, this.currentUserPublicKey);
        const encryptedSymmetricKeySender = await EncryptionService.encryptSymmetricKey(symmetricKey, this.myPublicKey);
        console.log('EncryptedSymmetricKey2', encryptedSymmetricKeySender);
        // @ts-ignore
        this.uploadSymmetricKey(this.selectedChat.chatId,this.currentUserId, encryptedSymmetricKeySender);
        // @ts-ignore
        this.uploadSymmetricKey(this.selectedChat.chatId, this.selectedChat.recipientId, encryptedSymmetricKeyRecipient);

        // @ts-ignore
        console.log('Current id', this.selectedChat.chatId);
        // @ts-ignore
        this.symmetricKeys.set(this.selectedChat.chatId, symmetricKey);
        this.currentSymmetricKey = symmetricKey
        encryptedMessage = EncryptionService.encryptMessage(this.messageContent, this.currentSymmetricKey);
      }
      const message: ChatMessageDTO = {
        senderId: this.currentUserId,
        recipientId: this.selectedChat?.recipientId,
        content: encryptedMessage,
        timestamp: new Date()
      };
      this.websocketService.sendMessage(message);
      this.messages.push(message);
      await this.updateLastMessage(message);
      this.messageContent = '';
    }
  }

  fetchSymmetricKey(chatId: string, userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.chatService.getSymmetricKey(chatId, userId).subscribe({
        next: (key: string) => {
          EncryptionService.decryptSymmetricKey(key, this.myPrivateKey)
            .then((decryptedKey) => {
              this.symmetricKeys.set(chatId, decryptedKey);
              this.currentSymmetricKey = decryptedKey;
              resolve(decryptedKey); // Resolves the promise with the fetched key
            })
            .catch((decryptionError) => {
              console.error('Failed to decrypt symmetric key:', decryptionError);
              reject(decryptionError); // Rejects the promise if decryption fails
            });// Resolves the promise with the fetched key
        },
        error: (err) => {
          console.error('Failed to fetch symmetric key:', err);
          reject(err); // Rejects the promise if an error occurs
        },
      });
    });
  }



  uploadSymmetricKey(chatId: string,userId: string, symmetricKey: string): void {
    this.chatService.uploadSymmetricKey(chatId, userId, symmetricKey).subscribe({
      error: (err) => {
        console.error('Failed to upload key pair:', err);
      },
    });
  }

  private async updateLastMessage(message: ChatMessageDTO) {
    const chat = this.chatRooms.find(chat => chat.recipientId === message.recipientId || chat.recipientId === message.senderId);
    if (chat) {
      // @ts-ignore
      this.fetchSymmetricKey(this.selectedChat.chatId, this.currentUserId);
      message.content = EncryptionService.decryptMessage(message.content, this.currentSymmetricKey);
      chat.lastMessageContent = message.content;
      chat.lastMessageTimestamp = message.timestamp;

      this.cdr.detectChanges();
    }
  }

}
