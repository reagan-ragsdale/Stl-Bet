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
  teamStatsButtons: any[] = []

  public gamesList: any[] = [{name: "NBA", disabled: false}, {name: "NHL", disabled: true}, {name: "MLB", disabled: false}, {name: "NFL", disabled: true} ];
  public selectedSport = ''

  public playerData: any[] = []
  public teamData: any[] = []
  public gameData: any[] = []
  public gameDataAll: any[] = []
  public gameDataFinal: any[] = []

  playerAverageColumns: string[] = ["Player", "Points", "Assists", "Rebounds"]
  teamAverageColumns: string[] = ["Team", "Wins", "Losses", "Points Scored", "Points Allowed"]
  
  propClicked(){
    this.router.navigate(["/props"])
  }

  playerStatsClicked(){
    this.router.navigate(["/playerStats/NBA/279"])
  }

  async onSportsListClick(sport: string){
    this.selectedSport = sport
   await this.getData(sport)
  }

  async onPlayerStatsClick(stat: any){
    this.playerData = await NbaController.nbaGetPlayerStatAverageTop5(stat.dbName)
    stat.selected = true;
    this.playerStatsButtons.filter(e => e.dbName != stat.dbName).forEach(d => d.selected = false);
    

  }
   async onTeamStatsClick(stat: any){
    this.teamData = await NbaController.nbaGetTeamStatAverageTop5(stat.dbName)
    stat.selected = true;
    this.teamStatsButtons.filter(e => e.dbName != stat.dbName).forEach(d => d.selected = false);
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
      this.teamStatsButtons = [
        {selected: true,
        name: "Wins",
        dbName: "wins"},
        {selected: false,
        name: "Points Scored",
        dbName: "pointsScored"}
       ]
      this.gameData = await SportsBookController.loadSportBookByH2H(sport) 
      this.gameDataAll = await SportsBookController.loadSportBook(sport)
      var distinctGames = this.gameDataAll.map(game => game.gameId).filter((value, index, array) => array.indexOf(value === index))
      console.log(distinctGames)
      
      console.log(this.gameData)

      
      this.gameDataFinal = [...new Map(this.gameData.map(item => [item["bookId"], item])).values()]
      console.log(this.gameDataFinal)

    }
    else if(sport == "MLB"){
    
    }
    
  }

  teamClicked(teamName: string){
    console.log(teamName)
  }


  async ngOnInit(){
    this.selectedSport = this.gamesList[0].name
    await this.getData(this.selectedSport)
  }




}
