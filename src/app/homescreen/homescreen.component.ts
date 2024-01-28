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

  public gamesList: string[] = ["NBA", "NHL", "MLB", "NFL"];
  public selectedSport = this.gamesList[0]

  public playerData: any[] = []
  public teamData: any[] = []
  public gameData: any[] = []
  
  propClicked(){
    this.router.navigate(["/props"])
  }

  playerStatsClicked(){
    this.router.navigate(["/playerStats/NBA/279"])
  }

  async onSportsListClick(sport: string){
   await this.getData(sport)
  }


  async getData(sport: string){
    if(sport == "NBA"){
      /*
       this.playerData = [{playerName: "Joel Em", points: 21, assists: 5, totReb: 11},
      {playerName: "Jays", points: 21, assists: 5, totReb: 11},
      {playerName: "nikola", points: 21, assists: 5, totReb: 11},
      {playerName: "luka", points: 21, assists: 5, totReb: 11},
      {playerName: "asdf", points: 21, assists: 5, totReb: 11}] */
      
       this.playerData = await NbaController.nbaGetPlayerStatAverageTop5("points")
       console.log(this.playerData)
       /*
      this.teamData = await NbaController.nbaGetTeamStatAverageTop5("wins")
      this.gameData = await SportsBookController.loadSportBookByH2H(sport) */
    }
    
  }


  async ngOnInit(){
    await this.getData(this.selectedSport)
  }




}
