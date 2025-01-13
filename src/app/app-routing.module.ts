import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeScreenComponent } from './homescreen/homescreen.component';
import { PropScreenComponent } from './prop-screen/prop-screen.component';
import { PlayerStatsComponent } from './player-stats/player-stats.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { TeamStatsComponent } from './team-stats/team-stats.component';
import { LoginSignUpComponent } from './login-sign-up/login-sign-up.component';
import { PropScreenNewComponent } from './prop-screen-new/prop-screen-new.component';
import { AuthGuard } from './app-auth-guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', title:'home', component: WelcomeScreenComponent,
     /*  children: [
        {
          path: 'props', title: 'props', component: PropScreenComponent
        }
      ]*/}, 
  { path: 'sports', component: HomeScreenComponent, canActivate: [AuthGuard]},
  { path: 'props', component: PropScreenComponent, canActivate: [AuthGuard]},
  { path: 'props/:sport', component: PropScreenComponent, canActivate: [AuthGuard]},
  { path: 'props/:sport/:game', component: PropScreenComponent, canActivate: [AuthGuard]},
  { path: 'propsNew/:sport', component: PropScreenNewComponent, canActivate: [AuthGuard]},
  { path: 'propsNew/:sport/:game', component: PropScreenNewComponent, canActivate: [AuthGuard]},
  { path: 'playerStats', component: PlayerStatsComponent, canActivate: [AuthGuard]},
  { path: 'teamStats', component: TeamStatsComponent, canActivate: [AuthGuard]},
  { path: 'teamStats/:team/:id', component: TeamStatsComponent, canActivate: [AuthGuard]},
  { path: 'signup', component: LoginSignUpComponent},

  { path: 'playerStats/:sport/:id', component: PlayerStatsComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
