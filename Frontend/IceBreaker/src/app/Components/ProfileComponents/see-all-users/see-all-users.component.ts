import {Component, OnInit} from '@angular/core';
import {AvailableUserDTO} from '../../../DTOS/Profile/AvailableUserDTO';
import {UserProfileService} from '../../../Services/UserProfile/user-profile.service';
import {NgForOf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardActions, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatRipple} from '@angular/material/core';
import {MatDialog} from '@angular/material/dialog';
import {SeeUserProfileComponent} from '../../MessagesComponents/see-user-profile/see-user-profile.component';

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
    MatCardTitle
  ],
  templateUrl: './see-all-users.component.html',
  styleUrl: './see-all-users.component.css'
})
export class SeeAllUsersComponent implements OnInit{
  availableUsers: AvailableUserDTO[] = [];
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
