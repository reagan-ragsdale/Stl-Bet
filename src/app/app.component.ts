import { Component, ElementRef, NgZone, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { remult } from 'remult';
import { UsersController } from '../shared/Controllers/UsersController';
import { Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { PlayerInfoController } from '../shared/Controllers/PlayerInfoController';
import { FormControl } from '@angular/forms';
import { SharedCaching } from './Services/shared-caching';
import { DbPlayerInfo } from 'src/shared/dbTasks/DbPlayerInfo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(zone: NgZone, private router: Router, private sharedCache: SharedCaching) {
    remult.apiClient.wrapMessageHandling = handler => zone.run(() => handler())
  }
  remult = remult;


  @ViewChild('playerSearchInput')
  myInput!: ElementRef;

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
    let player = this.playerInfo.filter(e => e.playerId == playerId && e.sport == sport)[0]
    this.sharedCache.changeCurrentPlayerInfo({playerId: player.playerId, playerName: player.playerName, teamId: player.teamId, teamName: player.teamName, sport: player.sport})
    this.router.navigate([`/playerStats/${sport}/${playerId}`])
  }
  

  isClicked: Boolean = false;
  onSearchClicked(){
    this.isClicked = !this.isClicked
    if(this.isClicked == true){
      setTimeout(() => {
        this.myInput.nativeElement.focus();
      }, 0);
    }
  }
  myControl = new FormControl('');
  playerInfo: DbPlayerInfo[] = []
  async ngOnInit(){
    this.playerInfo = await PlayerInfoController.loadAllSportPlayerInfo()
    this.sharedCache.changeCurrentAllPlayerInfo(this.playerInfo)
    this.filteredSearch = this.playerInfo
  }




}
