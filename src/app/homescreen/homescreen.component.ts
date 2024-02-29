import { Component, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Route, Router } from '@angular/router';
import { NbaController } from '../../shared/Controllers/NbaController';
import { SportsBookController } from '../../shared/Controllers/SportsBookController';
import { MlbController } from 'src/shared/Controllers/MlbController';
import { HostListener } from '@angular/core';

@Component({
  selector: 'home-screen',
  templateUrl: './homescreen.component.html',
  styleUrls: ['./homescreen.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeScreenComponent {
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    location.reload()
  }
  constructor(private router: Router) { }
  title = 'angulardemo1';
  opened = false;
  clicked = false;
  predictionClicked = false;
  screen: string = '';
  playerStatsButtons: any[] = []
  teamStatsButtons: any[] = []

  public gamesList: any[] = [{ name: "NBA", disabled: false }, { name: "NHL", disabled: true }, { name: "MLB", disabled: false }, { name: "NFL", disabled: true }];
  public selectedSport = ''

  public playerData: any[] = []
  public teamData: any[] = []
  public gameData: any[] = []
  public gameDataAll: any[] = []
  public gameDataAllFinal: any[] = []
  public gameDataFinal: any[] = []

  playerAverageColumns: string[] = ["Player", "Points", "Assists", "Rebounds"]
  teamAverageColumns: string[] = ["Team", "Wins", "Losses", "Points Scored", "Points Allowed"]

  propClicked() {
    this.router.navigate(["/props"])
  }

  gameClick(bookId: string): void {
    this.router.navigate([`/props/${this.selectedSport}/${bookId}`])
  }

  sportProps(): void {
    this.router.navigate([`/props/${this.selectedSport}`])
  }

  playerStatsClicked() {
    this.router.navigate(["/playerStats/NBA/279"])
  }

  async onSportsListClick(sport: string) {
    this.selectedSport = sport
    await this.getData(sport)
  }

  async onPlayerStatsClick(stat: any) {
    this.playerData = await NbaController.nbaGetPlayerStatAverageTop5(stat.dbName)
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
      this.gameDataAll = await SportsBookController.loadSportBook(sport)
      var distinctGames = this.gameDataAll.map(game => game.bookId).filter((value, index, array) => array.indexOf(value) === index)
      distinctGames.forEach(book => {
        let allOfBook = this.gameDataAll.filter(e => e.bookId == book)
        var distinctTeams = allOfBook.map(team => team.teamName).filter((value, index, array) => array.indexOf(value) === index)
        let teamArray: any[] = []
        distinctTeams.forEach(team => {
          let allOfTeam = allOfBook.filter(e => e.teamName == team)
          teamArray.push(allOfTeam)
        })
        this.gameDataAllFinal.push(teamArray)
      })
      //console.log(this.gameDataAllFinal)
      /* let team1 = [{
        homeTeam: "Toronto Raptors Lakers",
        awayTeam: "Brooklyn Nets",
        marketKey: "h2h",
        point: 0,
        price: 110,
        teamName: "Brooklyn Nets"
      },
      {homeTeam: "Toronto Raptors",
      awayTeam: "Brooklyn Nets",
      marketKey: "spread",
      point: 2,
      price: -110,
      teamName: "Brooklyn Nets"}]
      
      let team2 = [{
        homeTeam: "Toronto Raptors",
        awayTeam: "Brooklyn Nets",
        marketKey: "h2h",
        point: 0,
        price: -130,
        teamName: "Toronto Raptors"
      },
      {homeTeam: "Toronto Raptors",
      awayTeam: "Brooklyn Nets",
      marketKey: "spread",
      point: -2,
      price: -110,
      teamName: "Toronto Raptors"}]

      let over = [{homeTeam: "Toronto Raptors",
      awayTeam: "Brooklyn Nets",
      marketKey: "spread",
      point: 231.5,
      price: -110,
      teamName: "Over"}]
      let under = [{homeTeam: "Toronto Raptors",
      awayTeam: "Brooklyn Nets",
      marketKey: "spread",
      point: 231.5,
      price: -110,
      teamName: "Under"}]

      let final: any[] = [team1, team2, over, under]

      this.gameDataAllFinal.push(final)
       */
      this.gameDataFinal = [...new Map(this.gameData.map(item => [item["bookId"], item])).values()]
      //console.log(this.gameDataFinal)

    }
    else if (sport == "MLB") {
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
      this.gameDataAll = await SportsBookController.loadSportBook(sport)
      var distinctGames = this.gameDataAll.map(game => game.bookId).filter((value, index, array) => array.indexOf(value) === index)
      distinctGames.forEach(book => {
        let allOfBook = this.gameDataAll.filter(e => e.bookId == book)
        var distinctTeams = allOfBook.map(team => team.teamName).filter((value, index, array) => array.indexOf(value) === index)
        let teamArray: any[] = []
        distinctTeams.forEach(team => {
          let allOfTeam = allOfBook.filter(e => e.teamName == team)
          teamArray.push(allOfTeam)
        })
        this.gameDataAllFinal.push(teamArray)
      })
      this.gameDataFinal = [...new Map(this.gameData.map(item => [item["bookId"], item])).values()]

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
