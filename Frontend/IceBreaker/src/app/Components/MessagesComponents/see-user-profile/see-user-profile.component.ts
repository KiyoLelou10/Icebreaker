import {Component, OnInit} from '@angular/core';
import {PublicUserProfileDTO} from '../../../DTOS/Profile/PublicUserProfileDTO';
import {UserProfileService} from '../../../Services/UserProfile/user-profile.service';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {ProfileNavbarDTO} from '../../../DTOS/ProfileNavbar/ProfileNavbarDTO';
import {NavbarServiceService} from '../../../Services/Navbar/navbar-service.service';
import {ChatMessageDTO} from '../../../DTOS/ChatDTOs/ChatMessageDTO';
import {WebsocketService} from '../../../Services/WebSocketServices/websocket.service';
import {catchError, firstValueFrom, Observable, of, throwError} from 'rxjs';
import {EncryptionService} from '../../E2EECompenents/SymmetricEncryption';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@Component({
  selector: 'app-see-user-profile',
  imports: [MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule, FormsModule, NgForOf, NgIf],
  templateUrl: './see-user-profile.component.html',
  standalone: true,
  styleUrl: './see-user-profile.component.css'
})
export class SeeUserProfileComponent implements OnInit{
  data: PublicUserProfileDTO | null = null;
  senderProfile: ProfileNavbarDTO | null = null;
  message: string = '';
  myPublicKey: string = '';
  icebreakers: string[] = [];


  currentLoadingMessage: string = '';
  loadingMessages: string[] = [
    'Hold on, finding the perfect icebreaker… this is rocket science! 🚀',
    'Still searching... the universe is vast, you know. 🌌',
    'Patience is a virtue, and we’re testing yours. ⏳',
    'Icebreakers are on their way, riding a snail. 🐌',
    'Crafting brilliance takes time...... 😏'
  ];
  messageInterval: any;


  constructor(private userProfileService: UserProfileService, public dialogRef: MatDialogRef<SeeUserProfileComponent>, private NavbarServiceService: NavbarServiceService, private webSocketService: WebsocketService){
  }

  ngOnInit(): void {
    let index = 0;
    this.currentLoadingMessage = this.loadingMessages[index];
    this.messageInterval = setInterval(() => {
      index = (index + 1) % this.loadingMessages.length;
      this.currentLoadingMessage = this.loadingMessages[index];
    }, 2500);




    this.userProfileService.selectedUser$.subscribe((user: PublicUserProfileDTO| null) => {
      this.data = user;
    });
    this.NavbarServiceService.profile$.subscribe({
      next: (profile) => {
        this.senderProfile = profile;
        console.log('Received profile:', profile);
      },
      error: (err) => {
        console.error('Failed to receive profile data', err);
      },
    });
    // @ts-ignore
    this.getPublicKey(this.senderProfile.id).subscribe((fetchedPublicKey) => {
      this.myPublicKey = fetchedPublicKey;
    });
    if (this.senderProfile?.id) {
      this.webSocketService.connect(this.senderProfile.id);
    }

    if (this.data?.bio) {
      this.getIceBreakers(this.data.bio).subscribe((icebreakers) => {
        this.icebreakers = [
          icebreakers["Icebreaker 1"],
          icebreakers["Icebreaker 2"],
          icebreakers["Icebreaker 3"]
        ];

      });
    }


  }

   getIceBreakers(bio: string): Observable<{
    "Icebreaker 1": string;
    "Icebreaker 2": string;
    "Icebreaker 3": string
  }> {
    console.log('Bio:', bio);
    return this.userProfileService.getIceBreakers(bio).pipe(
      catchError((err) => {
        console.error('Failed to upload key pair:', err);
        return of({ "Icebreaker 1": "", "Icebreaker 2": "", "Icebreaker 3": "" });
      })
    );

  }

  async sendMessage(): Promise<void> {
    if (!this.message.trim()) {
      alert('Please enter a message.');
      return;
    }

    // @ts-ignore
    const publicKey: string = await firstValueFrom(this.getPublicKey(this.data.id));


    if (!this.senderProfile?.id || !this.data?.id) {
      alert('Sender or recipient is not properly set.');
      return;
    }

    if (!this.webSocketService.isConnected()) {
      alert('Unable to send message. WebSocket is not connected.');
      return;
    }

    const symmetricKey = EncryptionService.generateSymmetricKey();
    console.log('New symmetric key generated:', symmetricKey);
    const encryptedSymmetricKeyRecipient = await EncryptionService.encryptSymmetricKey(symmetricKey, publicKey);
    const encryptedSymmetricKeySender = await EncryptionService.encryptSymmetricKey(symmetricKey, this.myPublicKey);
    console.log('EncryptedSymmetricKey2', encryptedSymmetricKeySender);


    const encryptedMessage = EncryptionService.encryptMessage(this.message, symmetricKey);

    const chatMessage: ChatMessageDTO = {
      senderId: this.senderProfile.id,
      recipientId: this.data.id,
      content: encryptedMessage,
      timestamp: new Date(),
    };
    this.webSocketService.sendMessage(chatMessage);
    // @ts-ignore
    this.uploadSymmetricKey(this.senderProfile.id, this.data.id, encryptedSymmetricKeySender);
    // @ts-ignore
    this.uploadSymmetricKey(this.data.id,this.senderProfile.id, encryptedSymmetricKeyRecipient);
    this.message = ''; // Clear the message input
  }


  onCancel(): void {
    this.dialogRef.close();
  }

  selectIcebreaker(icebreaker: string): void {
    this.message = icebreaker;
  }


  getPublicKey(userId: string): Observable<string> {
    return this.userProfileService.getPublicKey(userId).pipe(
      catchError((err) => {
        console.error(`Error fetching public key for userId ${userId}:`, err);
        return throwError(() => new Error('Failed to fetch public key'));
      })
    );
  }

  uploadSymmetricKey(chatId: string,userId: string, symmetricKey: string): void {
    this.userProfileService.uploadSymmetricKey(chatId, userId, symmetricKey).subscribe({
      error: (err) => {
        console.error('Failed to upload key pair:', err);
      },
    });
  }



  ngOnDestroy() {
    clearInterval(this.messageInterval);
  }

}
