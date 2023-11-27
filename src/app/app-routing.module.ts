import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeScreenComponent } from './homescreen/homescreen.component';
import { PropScreenComponent } from './prop-screen/prop-screen.component';
import { PlayerStatsComponent } from './player-stats/player-stats.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeScreenComponent},
  { path: 'props', component: PropScreenComponent},
  { path: 'playerStats', component: PlayerStatsComponent},
  { path: 'playerStats/:sport/:id', component: PlayerStatsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
