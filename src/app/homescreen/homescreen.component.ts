import { Component, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Route, Router } from '@angular/router';
import { NbaController } from '../../shared/Controllers/NbaController';
import { SportsBookController } from '../../shared/Controllers/SportsBookController';
import { MlbController } from 'src/shared/Controllers/MlbController';
import { HostListener } from '@angular/core';
import { reusedFunctions } from '../Services/reusedFunctions';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TransformFromTimestampToMonthDayPipe } from '../customPipes/transformTimestampToMonthDay.pipe';
import { TransforFromFullTeamNameToAbvr } from '../customPipes/transformFromFullTeamNameToAbvr.pip';
import { draftKingsApiController } from '../ApiCalls/draftKingsApiCalls';
import { remult } from 'remult';
import { DbMlbGameBookData } from 'src/shared/dbTasks/DbMlbGameBookData';
import { DbGameBookData } from 'src/shared/dbTasks/DbGameBookData';
import { mlbCronFile } from '../mlbCron';
import { MlbService } from '../Services/MlbService';
import { nflApiController } from '../ApiCalls/nflApiCalls';
import { TeamInfoController } from '../../shared/Controllers/TeamInfoController';
import { NflController } from 'src/shared/Controllers/NflController';

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

  public gamesList: any[] = [{ name: "NBA", disabled: true, selected: false }, { name: "NHL", disabled: true, selected: false }, { name: "MLB", disabled: false, selected: true }, { name: "NFL", disabled: false, selected: false }];
  public selectedSport = ''
  public playerDataFinal: any[] = []
  public playerData: any[] = []
  public teamData: any[] = []
  public gameData: any[] = []
  public gameDataAll: any[] = []
  public gameDataAllFinal: any[] = []
  public gameDataFinal: any[] = []

  upcomingGamePropColumns: string[] = ["Team", "ML", "Spread", "OverUnder"]

  playerAverageColumns: string[] = []
  teamAverageColumns: string[] = []

  playerAverageColumnsNba: string[] = ["Player", "Points", "Assists", "Rebounds"]
  teamAverageColumnsNba: string[] = ["Team", "Wins", "Losses", "Points Scored", "Points Allowed"]

  playerAverageColumnsMlb: string[] = ["Player", "Home Runs", "Rbi's", "Hits", "Total Bases"]
  teamAverageColumnsMlb: string[] = ["Team", "Wins", "Losses"]

  playerAverageColumnsNfl: string[] = ["Player", "Pass Tds", "Rush Tds", "Rec Tds", "Rushing Yards", "Receiving Yards"]
  teamAverageColumnsNfl: string[] = ["Team", "Wins", "Losses"]

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
    if(team.length > 3){
      team = MlbService.mlbTeamNameToAbvr[team]
    }
    let teamId = MlbService.mlbTeamIds[team]
    this.router.navigate([`/teamStats/MLB/${teamId}`])
  }

  playerStatsClicked(playerId: number) {
    this.router.navigate([`/playerStats/${this.selectedSport}/${playerId}`])
  }

  async onSportsListClick(sport: string) {
    if(this.selectedSport != sport){
      this.selectedSport = sport
      let selected = this.gamesList.filter(e => e.name == sport)
      this.gamesList.forEach(e => e.selected = false)
      selected[0].selected = true
      await this.getData(sport)
    }
    
  }

  async onPlayerStatsClick(stat: string) {
    if(this.selectedSport == "NBA"){
      this.playerData = await NbaController.nbaGetPlayerStatAverageTop5(stat)
    }
    else if(this.selectedSport == "MLB"){
      this.playerData = await MlbController.mlbGetPlayerStatTotals(stat, 2024)
    }
    else if(this.selectedSport == "NFL"){
      this.playerData = await NflController.nflGetPlayerStatTotals(stat, 2024)
    }
    
    

    //stat.selected = true;
    //this.playerStatsButtons.filter(e => e.dbName != stat).forEach(d => d.selected = false);


  }


  
  

  unsubscribe = () => {}
  async getData(sport: string) {
    if (sport == "NBA") {
      this.playerAverageColumns = this.playerAverageColumnsNba
      this.teamAverageColumns = this.teamAverageColumnsNba
      this.gameDataAll = []
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
        let distinctTeams = allOfBook.map(team => team.teamName).filter((value, index, array) => array.indexOf(value) === index)
        let teamArray: any[] = []
        let distinctTeamsNew: any[] = []
        let teamsName = distinctTeams.filter(e => e != 'Over')
        let bothTeams = teamsName.filter(f => f != 'Under')
        if(teamsName.length > 0){
          distinctTeamsNew.push(bothTeams[0])
        }
        if(bothTeams.length > 0){
          distinctTeamsNew.push(bothTeams[1])
        }
        
        
        let teamsNameOver = distinctTeams.filter(e => e == "Over")
        if(teamsNameOver.length > 0){
          distinctTeamsNew.push(teamsNameOver[0])
        }
       
        let teamsNameUnder = distinctTeams.filter(e => e == "Under")
       
        if(teamsNameUnder.length > 0){
         distinctTeamsNew.push(teamsNameUnder[0])
        }
        
        
        distinctTeamsNew.forEach(team => {
          let allOfTeam = allOfBook.filter(e => e.teamName == team)
          if(allOfTeam.length > 0){
            teamArray.push(allOfTeam)
          }
          
        })
        let teamArrayFinal: any[] = []
        if(teamArray.length > 0){
          if(teamArray[0][0].awayTeam != teamArray[0][0].teamName){
            teamArrayFinal.push(teamArray[1])
            teamArrayFinal.push(teamArray[0])
            teamArrayFinal.push(teamArray[2])
            teamArrayFinal.push(teamArray[3])
          }
          else{teamArrayFinal = teamArray}
        }
        
        
        this.gameDataAllFinal.push(teamArrayFinal)

      })
      
      this.gameDataFinal = [...new Map(this.gameData.map(item => [item["bookId"], item])).values()]
      
    }
    else if (sport == "MLB") {
      //var unsubscribe = () => {}
      this.teamAverageColumns = this.teamAverageColumnsMlb
      this.gameDataAllFinal = []
      let result = await Promise.all([MlbController.mlbGetPlayerStatTotals('homeRuns', 2024), MlbController.mlbGetTeamStatAverageTop5("wins", 2024)])
      this.playerData = result[0]
      this.teamData = result[1]
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
      
      //var unsubscribe = () => {}
      this.teamAverageColumns = this.teamAverageColumnsNfl
      this.gameDataAllFinal = []
      let result = await Promise.all([NflController.nflGetPlayerStatTotals('touchdowns', 2024), NflController.nflGetTeamStatTotals("wins", 2024)])
      this.playerData = result[0]
      this.teamData = result[1]
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
    var taskRepo = remult.repo(DbGameBookData)
    this.unsubscribe = taskRepo
      .liveQuery({
        where: DbGameBookData.allSportFilterByMAxBookSeqBigThree({sport: sport}), orderBy: {createdAt: "asc"}
      })
      .subscribe(info => this.loadProps(info.items)) 

  }

  loadProps(change: any){
    this.gameDataAll = change
    this.gameDataAllFinal = []
    var distinctGames = this.gameDataAll.map(game => game.bookId).filter((value, index, array) => array.indexOf(value) === index)
    distinctGames.forEach(book => {
      let allOfBook = this.gameDataAll.filter(e => e.bookId == book)
      let distinctTeams = allOfBook.map(team => team.teamName).filter((value, index, array) => array.indexOf(value) === index)
      let teamArray: any[] = []
      let distinctTeamsNew: any[] = []
      let teamsName = distinctTeams.filter(e => e != 'Over')
      let bothTeams = teamsName.filter(f => f != 'Under')
      if(teamsName.length > 0){
        distinctTeamsNew.push(bothTeams[0])
      }
      if(bothTeams.length > 0){
        distinctTeamsNew.push(bothTeams[1])
      }
      
      
      let teamsNameOver = distinctTeams.filter(e => e == "Over")
      if(teamsNameOver.length > 0){
        distinctTeamsNew.push(teamsNameOver[0])
      }
     
      let teamsNameUnder = distinctTeams.filter(e => e == "Under")
     
      if(teamsNameUnder.length > 0){
       distinctTeamsNew.push(teamsNameUnder[0])
      }
      
      
      distinctTeamsNew.forEach(team => {
        let allOfTeam = allOfBook.filter(e => e.teamName == team)
        //console.log(allOfTeam)
        if(allOfTeam.length > 0){
          teamArray.push(allOfTeam)
        }
        
      })
      let teamArrayFinal: any[] = []
      if(teamArray.length > 0){
        //console.log(teamArray)
        if(teamArray[0].length > 0){
          if(teamArray[0][0].awayTeam != teamArray[0][0].teamName){
            teamArrayFinal.push(teamArray[1])
            teamArrayFinal.push(teamArray[0])
            teamArrayFinal.push(teamArray[2])
            teamArrayFinal.push(teamArray[3])
          }
          else{teamArrayFinal = teamArray}
          
        }
        
        
        
      }
      teamArrayFinal[0][0].commenceTime = reusedFunctions.formatDateString(teamArrayFinal[0][0].commenceTime.toString() )
      if(teamArrayFinal[0].length == 2 && teamArrayFinal[1].length == 2 && teamArrayFinal[2].length == 1 && teamArrayFinal[3].length == 1){
        let team1 = [teamArrayFinal[0], teamArrayFinal[2]]
        let team2 = [teamArrayFinal[1], teamArrayFinal[3]]
        let team: any[] = [team1, team2]
        this.gameDataAllFinal.push(team)
      }
      
    })
    console.log(this.gameDataAllFinal)
  }

  teamClicked(teamName: string) {
  }

  


  async ngOnInit() {
    this.selectedSport = this.gamesList.filter(e => e.selected == true)[0].name
    await this.getData(this.selectedSport)
    
  }

  ngOnDestroy(){
    this.unsubscribe()
  }

  




}
