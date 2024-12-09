import { Routes } from '@angular/router';
import {
  CreateUserProfileComponent
} from './Components/ProfileComponents/create-user-profile/create-user-profile.component';

export const routes: Routes = [
  {path: 'changeProfile', component: CreateUserProfileComponent},
];
