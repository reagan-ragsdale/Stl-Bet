import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Route, Router } from '@angular/router';
import { NbaController } from '../../shared/Controllers/NbaController';
import { SportsBookController } from '../../shared/Controllers/SportsBookController';
import { MlbController } from 'src/shared/Controllers/MlbController';
import { HostListener } from '@angular/core';
import { reusedFunctions } from '../Services/reusedFunctions';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'home-screen',
  templateUrl: './homescreen.component.html',
  styleUrls: ['./homescreen.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeScreenComponent {
  
  constructor(private router: Router) { 
  }


  title = 'angulardemo1';
  opened = false;
  clicked = false;
  predictionClicked = false;
  screen: string = '';
  playerStatsButtons: any[] = []
  teamStatsButtons: any[] = []

  public gamesList: any[] = [{ name: "NBA", disabled: false }, { name: "NHL", disabled: true }, { name: "MLB", disabled: false }, { name: "NFL", disabled: true }];
  public selectedSport = ''
  public playerDataFinal: any[] = []
  public playerData: any[] = []
  public teamData: any[] = []
  public gameData: any[] = []
  public gameDataAll: any[] = []
  public gameDataAllFinal: any[] = []
  public gameDataFinal: any[] = []

  playerAverageColumns: string[] = []
  teamAverageColumns: string[] = []

  playerAverageColumnsNba: string[] = ["Player", "Points", "Assists", "Rebounds"]
  teamAverageColumnsNba: string[] = ["Team", "Wins", "Losses", "Points Scored", "Points Allowed"]

  playerAverageColumnsMlb: string[] = ["Player", "Home Runs", "Rbi's", "Hits", "Total Bases"]

  propClicked() {
    this.router.navigate(["/props"])
  }

  gameClick(bookId: string): void {
    this.router.navigate([`/props/${this.selectedSport}/${bookId}`])
  }

  sportProps(): void {
    this.router.navigate([`/props/${this.selectedSport}`])
  }

  onTeamClick(team: string){
    let teamName = reusedFunctions.addDash(team)
    this.router.navigate([`/teamStats/${teamName}`])
  }

  playerStatsClicked(playerId: number) {
    this.router.navigate([`/playerStats/${this.selectedSport}/${playerId}`])
  }

  async onSportsListClick(sport: string) {
    this.selectedSport = sport
    await this.getData(sport)
  }

  
  async onPlayerStatsClick(stat: any) {
    if(this.selectedSport == "NBA"){
      this.playerData = await NbaController.nbaGetPlayerStatAverageTop5(stat.dbName)
    }
    if(this.selectedSport == "MLB"){
      this.playerData = await MlbController.mlbGetPlayerStatAverageTop5(stat.dbName)
    }
    
    stat.selected = true;
    this.playerStatsButtons.filter(e => e.dbName != stat.dbName).forEach(d => d.selected = false);


  }
  async onTeamStatsClick(stat: any) {
    this.teamData = await NbaController.nbaGetTeamStatAverageTop5(stat.dbName)
    stat.selected = true;
    this.teamStatsButtons.filter(e => e.dbName != stat.dbName).forEach(d => d.selected = false);
  }


  async getData(sport: string) {
    if (sport == "NBA") {
      this.playerAverageColumns = this.playerAverageColumnsNba
      this.teamAverageColumns = this.teamAverageColumnsNba
      this.gameDataAllFinal = []
      this.playerData = await NbaController.nbaGetPlayerStatAverageTop5("points")

      this.playerStatsButtons = [
        {
          selected: true,
          name: "Points",
          dbName: "points"
        },
        {
          selected: false,
          name: "Assists",
          dbName: "assists"
        },
        {
          selected: false,
          name: "Rebounds",
          dbName: "rebounds"
        },
      ]
      this.teamData = await NbaController.nbaGetTeamStatAverageTop5("wins")
      this.teamStatsButtons = [
        {
          selected: true,
          name: "Wins",
          dbName: "wins"
        },
        {
          selected: false,
          name: "Points Scored",
          dbName: "pointsScored"
        }
      ]
      this.gameData = await SportsBookController.loadSportBookByH2H(sport)
      this.gameDataAll = await SportsBookController.loadAllBookDataBySportAndMaxBookSeq(sport)
      var distinctGames = this.gameDataAll.map(game => game.bookId).filter((value, index, array) => array.indexOf(value) === index)
      distinctGames.forEach(book => {
        let allOfBook = this.gameDataAll.filter(e => e.bookId == book)
        console.log(allOfBook)
        var distinctTeams = allOfBook.map(team => team.teamName).filter((value, index, array) => array.indexOf(value) === index)
        console.log(distinctTeams)
        let teamArray: any[] = []
        let distinctTeamsNew: any[] = []
        let teamsName = distinctTeams.filter(e => e != "Over" || e != "Under")
        console.log(teamsName)
        distinctTeamsNew.push(teamsName[0])
        distinctTeamsNew.push(teamsName[1])
        let teamsNameOver = distinctTeams.filter(e => e == "Over")
        distinctTeamsNew.push(teamsNameOver[0])
        let teamsNameUnder = distinctTeams.filter(e => e == "Under")
        distinctTeamsNew.push(teamsNameUnder[0])
        console.log(distinctTeamsNew)
        distinctTeamsNew.forEach(team => {
          console.log(team)
          let allOfTeam = allOfBook.filter(e => e.teamName == team)
          teamArray.push(allOfTeam)
        })
        let teamArrayFinal: any[] = []
        if(teamArray[0][0].awayTeam != teamArray[0][0].teamName){
          teamArrayFinal.push(teamArray[1])
          teamArrayFinal.push(teamArray[0])
          teamArrayFinal.push(teamArray[2])
          teamArrayFinal.push(teamArray[3])
        }
        else{teamArrayFinal = teamArray}
        this.gameDataAllFinal.push(teamArrayFinal)

      })
      console.log(this.gameDataAllFinal)
      
      this.gameDataFinal = [...new Map(this.gameData.map(item => [item["bookId"], item])).values()]
      
    }
    else if (sport == "MLB") {
      sport = 'MLB Preseason'
      this.gameDataAllFinal = []
      this.playerData = await MlbController.mlbGetPlayerStatAverageTop5("homeRuns")
      this.playerStatsButtons = [
        {
          selected: true,
          name: "Home Runs",
          dbName: "homeRuns"
        },
        {
          selected: false,
          name: "RBI's",
          dbName: "rbis"
        },
        {
          selected: false,
          name: "Hits",
          dbName: "hits"
        },
      ]
      this.teamData = await MlbController.mlbGetTeamStatAverageTop5("wins")
      this.teamStatsButtons = [
        {
          selected: true,
          name: "Wins",
          dbName: "wins"
        },
        {
          selected: false,
          name: "Runs Scored",
          dbName: "runsScored"
        },
        {
          selected: false,
          name: "Runs Allowed",
          dbName: "runsAllowed"
        }
      ]
      this.gameData = await SportsBookController.loadSportBookByH2H(sport)
      this.gameDataAll = await SportsBookController.loadAllBookDataBySportAndMaxBookSeq(sport)
      console.log(this.gameDataAll)
      var distinctGames = this.gameDataAll.map(game => game.bookId).filter((value, index, array) => array.indexOf(value) === index)
      distinctGames.forEach(book => {
        let allOfBook = this.gameDataAll.filter(e => e.bookId == book)
        var distinctTeams = allOfBook.map(team => team.teamName).filter((value, index, array) => array.indexOf(value) === index)
        let teamArray: any[] = []
        distinctTeams.forEach(team => {
          console.log(team)
          let allOfTeam = allOfBook.filter(e => e.teamName == team)
          teamArray.push(allOfTeam)
        })
        let teamArrayFinal: any[] = []
        if(teamArray[0][0].awayTeam != teamArray[0][0].teamName){
          teamArrayFinal.push(teamArray[1])
          teamArrayFinal.push(teamArray[0])
          teamArrayFinal.push(teamArray[2])
          teamArrayFinal.push(teamArray[3])
        }
        else{teamArrayFinal = teamArray}
        this.gameDataAllFinal.push(teamArrayFinal)

      })
      this.gameDataFinal = [...new Map(this.gameData.map(item => [item["bookId"], item])).values()]
      this.playerAverageColumns = this.playerAverageColumnsMlb
    }

  }

  teamClicked(teamName: string) {
    //console.log(teamName)
  }


  async ngOnInit() {
    this.selectedSport = this.gamesList[0].name
    await this.getData(this.selectedSport)
  }




}
