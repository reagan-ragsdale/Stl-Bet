import { Component, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Route, Router } from '@angular/router';
import { NbaController } from '../../shared/Controllers/NbaController';
import { SportsBookController } from '../../shared/Controllers/SportsBookController';

@Component({
  selector: 'home-screen',
  templateUrl: './homescreen.component.html',
  styleUrls: ['./homescreen.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeScreenComponent {
  constructor(private router: Router){}
  title = 'angulardemo1';
  opened = false;
  clicked = false;
  predictionClicked = false;
  screen: string = '';
  playerStatsButtons: any[] = []

  public gamesList: string[] = ["NBA", "NHL", "MLB", "NFL"];
  public selectedSport = this.gamesList[0]

  public playerData: any[] = []
  public teamData: any[] = []
  public gameData: any[] = []
  public gameDataFinal: any[] = []
  
  propClicked(){
    this.router.navigate(["/props"])
  }

  playerStatsClicked(){
    this.router.navigate(["/playerStats/NBA/279"])
  }

  async onSportsListClick(sport: string){
   await this.getData(sport)
  }

  async onPlayerStatsClick(stat: any){
    this.playerData = await NbaController.nbaGetPlayerStatAverageTop5(stat.dbName)
    stat.selected = true;
    this.playerStatsButtons.filter(e => e.dbName != stat.dbName).forEach(d => d.selected = false);
    

  }


  async getData(sport: string){
    if(sport == "NBA"){
       this.playerData = await NbaController.nbaGetPlayerStatAverageTop5("points")
       this.playerStatsButtons = [
        {selected: true,
        name: "Points",
        dbName: "points"},
        {selected: false,
        name: "Assists",
        dbName: "assists"},
        {selected: false,
        name: "Rebounds",
        dbName: "rebounds"},
       ]
      this.teamData = await NbaController.nbaGetTeamStatAverageTop5("wins")
      this.gameData = await SportsBookController.loadSportBookByH2H(sport) 
      
      
      this.gameDataFinal = [...new Map(this.gameData.map(item => [item["bookId"], item])).values()]
      console.log(this.gameDataFinal)

    }
    
  }


  async ngOnInit(){
    await this.getData(this.selectedSport)
  }




}
