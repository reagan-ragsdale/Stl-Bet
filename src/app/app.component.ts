import { Component, NgZone, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { remult } from 'remult';
import { UsersController } from '../shared/Controllers/UsersController';
import { Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { PlayerInfoController } from 'src/shared/Controllers/PlayerInfoController';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(zone: NgZone, private router: Router) {
    remult.apiClient.wrapMessageHandling = handler => zone.run(() => handler())
  }
  remult = remult;

  searchName: string = ''
   async logout(){
    await UsersController.logout()
    remult.user = undefined;
    this.router.navigate([`/home`])
  }

  filteredSearch: any[] = []

  filterSearch(){
      this.filteredSearch = this.playerInfo.filter((e) => e.playerName.toLowerCase().includes(this.searchName.toLowerCase()))
    
  }

  loadNewPlayer(playerId: number, sport: string){

  }
  isClicked: Boolean = false;
  onSearchClicked(){
    this.isClicked = !this.isClicked
  }
  myControl = new FormControl('');
  playerInfo: any[] = []
  async ngOnInit(){
    this.playerInfo = await PlayerInfoController.loadAllSportPlayerInfo()
    this.filteredSearch = this.playerInfo
  }




}
