import { Routes } from '@angular/router';
import {
  CreateUserProfileComponent
} from './Components/ProfileComponents/create-user-profile/create-user-profile.component';
import {SeeAllUsersComponent} from './Components/ProfileComponents/see-all-users/see-all-users.component';

export const routes: Routes = [
  {path: 'changeProfile', component: CreateUserProfileComponent},
  {path: 'Home', component: SeeAllUsersComponent},
  {path: '', redirectTo: 'Home', pathMatch: 'full'}
];
