import { Component } from '@angular/core';
import { UserProfileService } from '../../../Services/UserProfile/user-profile.service';
import { PublicUserProfileDTO } from '../../../DTOS/Profile/PublicUserProfileDTO';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.css'],
})
export class SearchUsersComponent {
  searchQuery: string = '';
  searchResults: PublicUserProfileDTO[] = [];

  constructor(private userProfileService: UserProfileService) {}

  onSearch(): void {
    if (this.searchQuery.trim() === '') {
      this.searchResults = [];
      return;
    }

    this.userProfileService.getUserByUsername(this.searchQuery.trim()).subscribe({
      next: (results) => {
        this.searchResults = results;
      },
      error: (err) => {
        console.error('Error searching for users:', err);
      },
    });
  }
}
