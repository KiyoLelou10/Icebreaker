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
    if (!this.profile) return;

    const newStatus = this.isActive ? Status.ONLINE : Status.OFFLINE;

    // Make a PATCH request to the backend
    this.userService.updateStatus(this.profile.id, newStatus).subscribe({
      next: () => {
        console.log('Status updated successfully');
      },
      error: (error) => {
        console.error('Error updating status', error);
      },
    });
  }



}
