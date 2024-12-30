import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PublicUserProfileDTO} from '../../../DTOS/Profile/PublicUserProfileDTO';
import {ProfileNavbarDTO} from '../../../DTOS/ProfileNavbar/ProfileNavbarDTO';
import {UserProfileService} from '../../../Services/UserProfile/user-profile.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {NgIf} from '@angular/common';
import {MatInput} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';


@Component({
  selector: 'app-create-user-profile',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    ReactiveFormsModule,
    MatFormField,
    NgIf,
    MatInput,
    MatButton,
    MatLabel,
    MatSelect,
    MatOption
  ],
  templateUrl: './create-user-profile.component.html',
  styleUrl: './create-user-profile.component.css'
})
export class CreateUserProfileComponent implements OnInit{

  profile: PublicUserProfileDTO|undefined;
  profileForm!: FormGroup;
  isEditing = false;

  constructor(private userProfileService: UserProfileService, private fb: FormBuilder, private cdRef: ChangeDetectorRef) {
  }
  ngOnInit() {
    this.profileForm = this.fb.group({
      userName: [{ value: '', disabled: true }, Validators.required],
      bio: [{ value: '', disabled: true }],
      age: [{ value: '', disabled: true }],
      gender: [{ value: '', disabled: true }],
      profilePhoto: [{ value: '', disabled: true }],
    });

    this.userProfileService.getMyProfile().subscribe({
      next: (profile: PublicUserProfileDTO) => {
        this.profile = profile;

        Promise.resolve().then(() => {
          this.profileForm.patchValue({
            userName: profile.userName,
            bio: profile.bio,
            age: profile.age,
            gender: profile.gender,
            profilePhoto: profile.profilePhoto,
          });
        });
      },
      error: (err) => {
        console.error('Failed to fetch profile', err);
      },
    });
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const updatedProfile = this.profileForm.getRawValue();

      console.log('Saving Profile:', updatedProfile);

      this.userProfileService.saveProfile(updatedProfile).subscribe({
        next: (response) => {
          console.log('Profile saved successfully:', response);
          this.isEditing = false;
          this.profileForm.disable();
        },
        error: (err) => {
          console.error('Failed to save profile:', err);
          alert('An error occurred while saving your profile. Please try again.');
        },
      });
    } else {
      alert('Please correct the errors in the form before saving.');
    }
  }

}
