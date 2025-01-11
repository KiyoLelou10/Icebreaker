import { Routes } from '@angular/router';
import {
  CreateUserProfileComponent
} from './Components/ProfileComponents/create-user-profile/create-user-profile.component';
import {SeeAllUsersComponent} from './Components/ProfileComponents/see-all-users/see-all-users.component';
import {ChatOverviewComponent} from './Components/MessagesComponents/chat-overview/chat-overview.component';
import {SearchUserComponent} from './Components/ProfileComponents/search-user/search-user.component';

export const routes: Routes = [
  {path: 'changeProfile', component: CreateUserProfileComponent},
  {path: 'Home', component: SeeAllUsersComponent},
  {path:'chatOverview', component: ChatOverviewComponent},
  {path: 'searchUser', component: SearchUserComponent},
  {path: '', redirectTo: 'Home', pathMatch: 'full'}
];
