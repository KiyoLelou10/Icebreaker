import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatCard} from '@angular/material/card';
import {MatRipple} from '@angular/material/core';
import {NgClass, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {AvailableUserDTO} from '../../../DTOS/Profile/AvailableUserDTO';
import {UserProfileService} from '../../../Services/UserProfile/user-profile.service';
import {Status} from '../../../Enums/Status';
import {MatButton} from '@angular/material/button';
import {SeeUserProfileComponent} from '../../MessagesComponents/see-user-profile/see-user-profile.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-search-user',
  standalone: true,
  imports: [
    FormsModule,
    MatCard,
    MatRipple,
    NgClass,
    NgForOf,
    NgIf,
    MatButton,
    TitleCasePipe
  ],
  templateUrl: './search-user.component.html',
  styleUrl: './search-user.component.css'
})
export class SearchUserComponent implements OnInit{


  searchQuery: string = '';
  availableUsers: AvailableUserDTO[] = [];
  isLoading: boolean = false;

  constructor(private userService: UserProfileService, private dialog: MatDialog) {}

  ngOnInit(): void {}

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.availableUsers = [];
      return;
    }

    this.isLoading = true;

    this.userService.searchUsers(this.searchQuery).subscribe({
      next: (users) => {
        this.availableUsers = users;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error searching users:', err);
        this.isLoading = false;
      },
    });
  }


    //Tip For Bilal: Change the searchUser method in the service to return the list of users based on the search query
    //this method below would work as it is then just remove the above function which is just there for testing


    /*
    this.userService.searchUsers(this.n).subscribe({
      next: (users) => {
        this.availableUsers = users;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error searching users:', err);
        this.isLoading = false;
      },
    });

      */


  openChat(id: string) {
    this.userService.getProfileById(id).subscribe(() => {
      const dialogRef = this.dialog.open(SeeUserProfileComponent, {
        width: '50%',
      });

      dialogRef.afterClosed().subscribe(() => {
        this.userService.clearSelectedUser();
      });
    });
  }
}
