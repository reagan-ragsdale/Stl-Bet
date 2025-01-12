import { Component, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Route, Router } from '@angular/router';
import { NbaController } from '../../shared/Controllers/NbaController';
import { SportsBookController } from '../../shared/Controllers/SportsBookController';
import { MlbController } from '../../shared/Controllers/MlbController';
import { HostListener } from '@angular/core';
import { reusedFunctions } from '../Services/reusedFunctions';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TransformFromTimestampToMonthDayPipe } from '../customPipes/transformTimestampToMonthDay.pipe';
import { TransforFromFullTeamNameToAbvr } from '../customPipes/transformFromFullTeamNameToAbvr.pip';
import { draftKingsApiController } from '../ApiCalls/draftKingsApiCalls';
import { remult } from 'remult';
import { DbMlbGameBookData } from 'src/shared/dbTasks/DbMlbGameBookData';
import { DbGameBookData } from '../../shared/dbTasks/DbGameBookData';
import { mlbCronFile } from '../mlbCron';
import { MlbService } from '../Services/MlbService';
import { nflApiController } from '../ApiCalls/nflApiCalls';
import { TeamInfoController } from '../../shared/Controllers/TeamInfoController';
import { NflController } from '../../shared/Controllers/NflController';
import { NflService } from '../Services/NflService';
import { BestBetController } from '../../shared/Controllers/BestBetController';
import { NhlController } from '../../shared/Controllers/NhlController';
import { cronLoadBestBets } from '../cronJobs/cronLoadBestBets';
import { DbTeamInfo } from '../../shared/dbTasks/DBTeamInfo';
import { sportController } from '../Services/sportController';

@Component({
  selector: 'home-screen',
  templateUrl: './homescreen.component.html',
  styleUrls: ['./homescreen.component.scss'],
  //encapsulation: ViewEncapsulation.None,
})
export class HomeScreenComponent implements OnDestroy, OnInit {

  constructor(private router: Router) {
  }


  title = 'angulardemo1';
  opened = false;
  clicked = false;
  predictionClicked = false;
  screen: string = '';
  playerStatsButtons: any[] = []
  teamStatsButtons: any[] = []
  isDashboard: boolean = true;
  isBestBets: boolean = false;

  public gamesList: any[] = [{ name: "NBA", disabled: true, selected: false }, { name: "NHL", disabled: false, selected: true }, { name: "MLB", disabled: true, selected: false }, { name: "NFL", disabled: false, selected: false }];
  public selectedSport = ''
  public playerDataFinal: any[] = []
  public playerData: any[] = []
  public teamData: any[] = []
  public gameData: any[] = []
  public gameDataAll: any[] = []
  public gameDataAllFinal: any[] = []
  public gameDataFinal: any[] = []

  betCheats: any[] = []

  betCheatsColumns: string[] = ["Name", "Game", "Prop", "Point", "Price", "OverallChance", "HomeAwayChance", "TeamChance"]

  upcomingGamePropColumns: string[] = ["Team", "ML", "Spread", "OverUnder"]

  playerAverageColumns: string[] = []
  teamAverageColumns: string[] = []

  playerAverageColumnsNba: string[] = ["Player", "Points", "Assists", "Rebounds"]
  teamAverageColumnsNba: string[] = ["Team", "Wins", "Losses", "Points Scored", "Points Allowed"]

  playerAverageColumnsMlb: string[] = ["Player", "Home Runs", "Rbi's", "Hits", "Total Bases"]
  teamAverageColumnsMlb: string[] = ["Team", "Wins", "Losses"]

  playerAverageColumnsNfl: string[] = ["Player", "Pass Tds", "Rush Tds", "Rec Tds", "Rushing Yards", "Receiving Yards"]
  teamAverageColumnsNfl: string[] = ["Team", "Wins", "Losses"]

  playerAverageColumnsNhl: string[] = ["Player", "Points", "Goals", "Assists"]
  teamAverageColumnsNhl: string[] = ["Team", "Wins", "Losses", "OTL"]

  propClicked() {
    this.router.navigate(["/propsNew"])
  }

  gameClick(bookId: string): void {
    this.router.navigate([`/propsNew/${this.selectedSport}/${bookId}`])
  }

  sportProps(): void {
    this.router.navigate([`/propsNew/${this.selectedSport}`])
  }

  async onTeamClick(team: string) {
    if (team.length > 3) {
      team = MlbService.mlbTeamNameToAbvr[team]
    }
    let teamInfo = await TeamInfoController.getAllTeamInfo(this.selectedSport)
    let teamId = teamInfo.filter(e => e.teamNameAbvr == team)[0]
    this.router.navigate([`/teamStats/${this.selectedSport}/${teamId.teamId}`])
  }

  playerStatsClicked(playerId: number) {
    this.router.navigate([`/playerStats/${this.selectedSport}/${playerId}`])
  }

  async onSportsListClick(sport: string) {
    if (this.selectedSport != sport) {
      this.selectedSport = sport
      let selected = this.gamesList.filter(e => e.name == sport)
      this.gamesList.forEach(e => e.selected = false)
      selected[0].selected = true
      await this.getData(sport)
    }

  }

  async onPlayerStatsClick(stat: string) {
    this.playerData = await sportController.getDashboardPlayerData(this.selectedSport, stat)
  }




  listOfAllTeams: DbTeamInfo[] = []
  unsubscribe = () => { }
  async getData(sport: string) {
    let callResult = await Promise.all([sportController.getDashboardData(this.selectedSport), TeamInfoController.getAllTeamInfoBySports(this.gamesList.filter(e => e.disabled == false).map(e => e.name))])
    if(callResult[0] != 0){
      this.playerData = callResult[0][0]
      this.teamData = callResult[0][1]
      this.betCheats = callResult[0][2]
    }
    this.listOfAllTeams = callResult[1]
    
    if (sport == "NBA") {
      this.playerAverageColumns = this.playerAverageColumnsNba
      this.teamAverageColumns = this.teamAverageColumnsNba

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
    }
    else if (sport == "MLB") {
      this.teamAverageColumns = this.teamAverageColumnsMlb
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


      this.playerAverageColumns = this.playerAverageColumnsMlb
    }
    else if (sport == "NFL") {

      this.teamAverageColumns = this.teamAverageColumnsNfl
      this.gameDataAllFinal = []
      this.playerStatsButtons = [
        {
          selected: true,
          name: "Touchdowns",
          dbName: "touchdowns"
        },
        {
          selected: false,
          name: "Rushing Yards",
          dbName: "rushingYards"
        },
        {
          selected: false,
          name: "Receiving Yards",
          dbName: "receivingYards"
        },
      ]
      this.teamStatsButtons = [
        {
          selected: true,
          name: "Wins",
          dbName: "wins"
        },
        {
          selected: false,
          name: "Losses",
          dbName: "losses"
        }
      ]


      this.playerAverageColumns = this.playerAverageColumnsNfl
    }
    else if (sport == "NHL") {
      this.teamAverageColumns = this.teamAverageColumnsNhl
      this.playerAverageColumns = this.playerAverageColumnsNhl
      this.playerStatsButtons = [
        {
          selected: true,
          name: "Points",
          dbName: "points"
        },
        {
          selected: false,
          name: "Goals",
          dbName: "goals"
        },
        {
          selected: false,
          name: "Assists",
          dbName: "assists"
        },
      ]
      this.teamStatsButtons = [
        {
          selected: true,
          name: "Wins",
          dbName: "wins"
        },
        {
          selected: false,
          name: "Losses",
          dbName: "loss"
        }
        ,
        {
          selected: false,
          name: "Otl",
          dbName: "otl"
        }
      ]



    }
    var taskRepo = remult.repo(DbGameBookData)
    this.unsubscribe = taskRepo
      .liveQuery({
        where: DbGameBookData.allSportFilterByMAxBookSeqBigThree({ sport: sport }), orderBy: { createdAt: "asc" }
      })
      .subscribe(info => this.loadProps(info.items))

  }

  loadProps(change: any) {
    this.gameDataAll = change
    this.gameDataAllFinal = []
    var distinctGames = this.gameDataAll.map(game => game.bookId).filter((value, index, array) => array.indexOf(value) === index)
    distinctGames.forEach(book => {
      let allOfBook = this.gameDataAll.filter(e => e.bookId == book)
      let distinctTeams = allOfBook.map(team => team.teamName).filter((value, index, array) => array.indexOf(value) === index)
      let teamArray: any[] = []
      let teamNames = distinctTeams.filter(e => e.teamName != 'Both')


      let awayTeam = allOfBook.filter(e => e.teamName == allOfBook[0].awayTeam)
      let homeTeam = allOfBook.filter(e => e.teamName == allOfBook[0].homeTeam)
      awayTeam.push(allOfBook.filter(e => e.teamName == 'Both' && e.description == 'Over')[0])
      homeTeam.push(allOfBook.filter(e => e.teamName == 'Both' && e.description == 'Under')[0])

      
      if(awayTeam.length == 3 && homeTeam.length == 3){
        this.gameDataAllFinal.push([awayTeam, homeTeam])
      }
      
    })
    if (this.selectedSport == 'NFL') {
      let today = new Date()
      let dayOfWeek = today.getDay()
      const daysToAdd = (2 - dayOfWeek + 7) % 7;
      const nextTuesday = new Date(today);
      nextTuesday.setDate(today.getDate() + (daysToAdd === 0 ? 7 : daysToAdd));
      let gameTemp: any[] = []
      this.gameDataAllFinal.forEach(e => {
        if (e[0][0].commenceTime < nextTuesday) {
          gameTemp.push(e)
        }
      })
      this.gameDataAllFinal = gameTemp
    }
  }

  getTeamAbvr(teamName: string): string{
    return this.listOfAllTeams.filter(e => e.teamNameFull == teamName)[0].teamNameAbvr
  }

  teamClicked(teamName: string) {
  }




  async ngOnInit() {
    this.selectedSport = this.gamesList.filter(e => e.selected == true)[0].name
    await this.getData(this.selectedSport)

    


  }

  ngOnDestroy() {
    this.unsubscribe()
  }






}
