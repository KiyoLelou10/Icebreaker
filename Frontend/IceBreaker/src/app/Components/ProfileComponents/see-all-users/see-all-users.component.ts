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
  paginatedUsers: AvailableUserDTO[][] = []; // Array of user sublists
  currentPageIndex: number = 0; // Current page index

  constructor(private userService: UserProfileService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadAvailableUsers();
  }

  loadAvailableUsers(): void {
    this.userService.getAvailableUsers().subscribe({
      next: (users) => {
        this.availableUsers = users;
        this.paginateUsers(); // Call the pagination method
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
  }

  paginateUsers(): void {
    const pageSize = 10; // Number of users per page
    this.paginatedUsers = [];

    for (let i = 0; i < this.availableUsers.length; i += pageSize) {
      this.paginatedUsers.push(this.availableUsers.slice(i, i + pageSize));
    }
  }

  openChat(id: string) {
    this.userService.getProfileById(id).subscribe(() => {
      const dialogRef = this.dialog.open(SeeUserProfileComponent, {
        width: '45%',
      });

      dialogRef.afterClosed().subscribe(() => {
        this.userService.clearSelectedUser ();
      });
    });
  }

  // Navigation methods
  nextPage(): void {
    if (this.currentPageIndex < this.paginatedUsers.length - 1) {
      this.currentPageIndex++;
    }
  }

  previousPage(): void {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
    }
  }

  // Method to get the current page of users
  get currentUsers(): AvailableUserDTO[] {
  return this.paginatedUsers[this.currentPageIndex] || [];
}
}
