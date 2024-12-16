import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeScreenComponent } from './homescreen/homescreen.component';
import { PropScreenComponent } from './prop-screen/prop-screen.component';
import { PlayerStatsComponent } from './player-stats/player-stats.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { TeamStatsComponent } from './team-stats/team-stats.component';
import { LoginSignUpComponent } from './login-sign-up/login-sign-up.component';
import { PropScreenNewComponent } from './prop-screen-new/prop-screen-new.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', title:'home', component: WelcomeScreenComponent,
     /*  children: [
        {
          path: 'props', title: 'props', component: PropScreenComponent
        }
      ]*/}, 
  { path: 'sports', component: HomeScreenComponent},
  { path: 'props', component: PropScreenComponent},
  { path: 'props/:sport', component: PropScreenComponent},
  { path: 'props/:sport/:game', component: PropScreenComponent},
  { path: 'propsNew/:sport', component: PropScreenNewComponent},
  { path: 'propsNew/:sport/:game', component: PropScreenNewComponent},
  { path: 'playerStats', component: PlayerStatsComponent},
  { path: 'teamStats', component: TeamStatsComponent},
  { path: 'teamStats/:team/:id', component: TeamStatsComponent},
  { path: 'signup', component: LoginSignUpComponent},

  { path: 'playerStats/:sport/:id', component: PlayerStatsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
