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
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-see-user-profile',
  standalone: true,
  imports: [MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule, FormsModule, NgForOf],
  templateUrl: './see-user-profile.component.html',
  styleUrl: './see-user-profile.component.css'
})
export class SeeUserProfileComponent implements OnInit{
  data: PublicUserProfileDTO | null = null;
  message: string = '';
  icebreakers: string[] = [
    'What’s your favorite hobby?',
    'Do you have any pets?',
    'What’s the last book you read?'];
  constructor(private userProfileService: UserProfileService, public dialogRef: MatDialogRef<SeeUserProfileComponent>){
  }

  ngOnInit(): void {
    this.userProfileService.selectedUser$.subscribe((user: PublicUserProfileDTO| null) => {
      this.data = user;
    });
  }

  sendMessage(): void {
    if (this.message.trim()) {
      console.log('Sending message:', this.message);
    } else {
      alert('Please enter a message.');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  selectIcebreaker(icebreaker: string): void {
    this.message = icebreaker;
  }


}
