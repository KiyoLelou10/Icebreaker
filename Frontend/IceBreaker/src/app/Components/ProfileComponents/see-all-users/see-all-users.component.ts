import {Component, OnInit} from '@angular/core';
import {AvailableUserDTO} from '../../../DTOS/Profile/AvailableUserDTO';
import {UserProfileService} from '../../../Services/UserProfile/user-profile.service';
import {NgClass, NgForOf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardActions, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatRipple} from '@angular/material/core';
import {MatDialog} from '@angular/material/dialog';
import {SeeUserProfileComponent} from '../../MessagesComponents/see-user-profile/see-user-profile.component';
import {UserStatusComponent} from '../../UtilComponents/user-status/user-status.component';
import {generateKeyPair} from '../../E2EECompenents/KeyGenerate';

@Component({
  selector: 'app-see-all-users',
  standalone: true,
  imports: [
    NgForOf,
    MatButton,
    MatCard,
    MatRipple,
    MatCardHeader,
    MatCardActions,
    MatCardSubtitle,
    MatCardTitle,
    UserStatusComponent,
    NgClass
  ],
  templateUrl: './see-all-users.component.html',
  styleUrl: './see-all-users.component.css'
})
export class SeeAllUsersComponent implements OnInit{
  availableUsers: AvailableUserDTO[] = [];
  privateKey : string | undefined;
  constructor(private userService: UserProfileService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.userService.getAvailableUsers().subscribe({
      next: (users) => {
        this.availableUsers = users;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
    this.fetchPrivateKey();
  }

  fetchPrivateKey(): void {
    this.userService.getMyPrivKey().subscribe({
      next: async (key: string | null) => {
        if (key) {
          console.log('Private Key fetched successfully:', key);
          this.privateKey = key;
        } else {
          console.log('Private key is null, generating a new key pair...');
          const keyPair = await generateKeyPair();
          console.log('New key pair generated:', keyPair);
          this.userService.uploadKeyPair(keyPair.publicKey, keyPair.privateKey).subscribe({
            next: () => {
              console.log('Key pair uploaded successfully.');
            },
            error: (err) => {
              console.error('Failed to upload key pair:', err);
            },
          });
          this.privateKey = keyPair.privateKey;
        }
      },
      error: (err) => {
        console.error('Failed to fetch private key:', err);
      },
    });
  }

  openChat(id: string) {
    this.userService.getProfileById(id).subscribe(() => {
      const dialogRef = this.dialog.open(SeeUserProfileComponent, {
        width: '45%',
      });

      dialogRef.afterClosed().subscribe(() => {
        this.userService.clearSelectedUser();
      });
    });
  }
}
