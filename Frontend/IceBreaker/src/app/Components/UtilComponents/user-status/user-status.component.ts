import {Component, OnInit} from '@angular/core';
import {UserProfileService} from '../../../Services/UserProfile/user-profile.service';
import {ProfileWithStatusDTO} from '../../../DTOS/Profile/ProfileWithStatusDTO';
import {Status} from '../../../Enums/Status';
import {NgClass, NgIf} from '@angular/common';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-user-status',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    MatSlideToggle,
    FormsModule
  ],
  templateUrl: './user-status.component.html',
  styleUrl: './user-status.component.css'
})
export class UserStatusComponent implements OnInit{

  profile: ProfileWithStatusDTO | null = null;
  defaultPhoto: string = 'https://example.com/default.jpg';

  constructor(private userService: UserProfileService) {}

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile(): void {
    this.userService.getMyStatusInformation().subscribe({
      next: (data) => {
        this.profile = data;
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
      },
    });
  }

  get isActive(): boolean {
    return this.profile?.status === Status.ONLINE;
  }

  set isActive(value: boolean) {
    if (this.profile) {
      this.profile.status = value ? Status.ONLINE : Status.OFFLINE;
    }
  }

  toggleStatus(event: any): void {
    if (!this.profile) {
      console.error('Profile data is not loaded.');
      return;
    }

    const newStatus = event.checked ? Status.ONLINE : Status.OFFLINE;

    this.userService.updateStatus(this.profile.id, newStatus).subscribe({
      next: () => {
        // Update the profile status on success
        if (this.profile) {
          this.profile.status = newStatus;
          console.log(`Status updated successfully to ${newStatus}`);
        }
      },
      error: (error) => {
        // Log error and handle specific status codes
        if (error.status === 400) {
          console.error('Invalid status provided.');
        } else if (error.status === 404) {
          console.error('User not found.');
        } else {
          console.error('Unexpected error occurred:', error);
        }
        if (event.source) {
          event.source.checked = this.profile?.status === Status.ONLINE;
        }
      },
    });
  }

}
