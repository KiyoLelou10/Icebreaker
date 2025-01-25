import {Component, OnInit} from '@angular/core';
import {AvailableUserDTO} from '../../../DTOS/Profile/AvailableUserDTO';
import {UserProfileService} from '../../../Services/UserProfile/user-profile.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardActions, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatRipple} from '@angular/material/core';
import {MatDialog} from '@angular/material/dialog';
import {SeeUserProfileComponent} from '../../MessagesComponents/see-user-profile/see-user-profile.component';
import {UserStatusComponent} from '../../UtilComponents/user-status/user-status.component';
import {generateKeyPair} from '../../E2EECompenents/KeyGenerate';

@Component({
  selector: 'app-see-all-users',
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
    NgClass,
    NgIf,
    MatCardTitle


  ],
  templateUrl: './see-all-users.component.html',
  standalone: true,
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
