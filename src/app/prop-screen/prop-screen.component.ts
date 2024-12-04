import { Component, HostListener, OnInit, TemplateRef, ViewChild, ViewEncapsulation, afterRender, inject } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


import { MlbController } from 'src/shared/Controllers/MlbController';
import { DbGameBookData } from 'src/shared/dbTasks/DbGameBookData';
import { SportsBookController } from 'src/shared/Controllers/SportsBookController';
import { DbPlayerPropData } from 'src/shared/dbTasks/DbPlayerPropData';
import { PlayerPropController } from 'src/shared/Controllers/PlayerPropController';
import { DbNhlPlayerGameStats } from 'src/shared/dbTasks/DbNhlPlayerGameStats';
import { NbaPlayerInfoDb } from 'src/shared/dbTasks/NbaPlayerInfoDb';
import { NbaController } from 'src/shared/Controllers/NbaController';
import { DbNbaGameStats } from 'src/shared/dbTasks/DbNbaGameStats';
import { nhlApiController } from '../ApiCalls/nhlApiCalls';
import annotationPlugin from 'chartjs-plugin-annotation';



import { ActivatedRoute, Route, Router } from '@angular/router';
import { DbNbaTeamLogos } from 'src/shared/dbTasks/DbNbaTeamLogos';
import { DbNbaTeamGameStats } from 'src/shared/dbTasks/DbNbaTeamGameStats';
import { reusedFunctions } from '../Services/reusedFunctions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MlbService } from '../Services/MlbService';
import { Chart } from 'chart.js';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DbMlbTeamGameStats } from 'src/shared/dbTasks/DbMlbTeamGameStats';
import { filter } from 'compression';
import { DBMlbPlayerGameStats } from '../../shared/dbTasks/DbMlbPlayerGameStats';
import { PlayerInfoController } from '../../shared/Controllers/PlayerInfoController';
import { DbPlayerInfo } from '../../shared/dbTasks/DbPlayerInfo';
import { DbTeamInfo } from '../../shared/dbTasks/DBTeamInfo';
import { TeamInfoController } from '../../shared/Controllers/TeamInfoController';
import { ErrorEmailController } from '../../shared/Controllers/ErrorEmailController';
import { NflController } from '../../shared/Controllers/NflController';
import { DBNflTeamGameStats } from '../../shared/dbTasks/DbNflTeamGameStats';
import { DBNflPlayerGameStats } from '../../shared/dbTasks/DbNflPlayerGameStats';
import { NhlController } from '../../shared/Controllers/NhlController';
import { DbNhlTeamGameStats } from '../../shared/dbTasks/DbNhlTeamGameStats';
import { NhlService } from '../Services/NhlService';

@Component({
  selector: 'app-prop-screen',
  templateUrl: './prop-screen.component.html',
  styleUrls: ['./prop-screen.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [nhlApiController],
  //encapsulation: ViewEncapsulation.None,
})



export class PropScreenComponent implements OnInit {


  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    location.reload()
  }

  /*  @ViewChild('content')
   callAPIDialog!: TemplateRef<any>;
 
   @ViewChild('propStat')
   propDialog!: TemplateRef<any>; */

  private modalService = inject(NgbModal);


  public playerPropsClicked = false;
  public gamePropsClicked = true;

  home_team: string = '';
  away_team: string = '';

  public itemsInCheckout: number = 0;
  public checkoutArray: any[] = [];
  public playerPropButtonDisabled: boolean = false;

  public nbaCount: number = 0
  public sportsNew: any[] = [];
  public gameString: string = ''
  public selectedSport: any = '';
  public selectedDate: string = '';
  public selectedGame: any = '';
  public selectedGameid: string = '';
  public exit: boolean = true;
  public teamPropIsLoading: boolean = true;
  public spreadGameClicked: boolean = true;
  public spreadHalfClicked: boolean = false;
  public spreadQuarterClicked: boolean = false;
  public totalGameClicked: boolean = true;
  public totalHalfClicked: boolean = false;
  public totalQuarterClicked: boolean = false;
  public pointsScoredGameClicked: boolean = true;
  public pointsScoredHalfClicked: boolean = false;
  public pointsScoredQuarterClicked: boolean = false;
  public pointsAllowedGameClicked: boolean = true;
  public pointsAllowedHalfClicked: boolean = false;
  public pointsAllowedQuarterClicked: boolean = false;
  public moneylineGameClicked: boolean = true;
  public moneylineHalfClicked: boolean = false;
  public moneylineQuarterClicked: boolean = false;
  public moneyline2GameClicked: boolean = true;
  public moneyline2HalfClicked: boolean = false;
  public moneyline2QuarterClicked: boolean = false;
  public spread2GameClicked: boolean = true;
  public spread2HalfClicked: boolean = false;
  public spread2QuarterClicked: boolean = false;
  public total2GameClicked: boolean = true;
  public total2HalfClicked: boolean = false;
  public total2QuarterClicked: boolean = false;
  public pointsScored2GameClicked: boolean = true;
  public pointsScored2HalfClicked: boolean = false;
  public pointsScored2QuarterClicked: boolean = false;
  public pointsAllowed2GameClicked: boolean = true;
  public pointsAllowed2HalfClicked: boolean = false;
  public pointsAllowed2QuarterClicked: boolean = false;

  public team1GameVsOpponentData: any[] = []
  public displayProgressBar: boolean = false;

  public selectedPropHistoryName: string = ''
  public propHistory: DbGameBookData[] = []
  public awayAlternateSpreads: any[] = []
  public awayAlternateSpreadstemp: any[] = []
  public homeAlternateSpreadstemp: any[] = []
  public homeAlternateSpreads: any[] = []

  //charts
  public chart: any = [];
  public chart2: any;
  public spreadAndTotalChart: boolean = false




  date = new Date();



  displayedColumns: string[] = ['name', 'description', 'point', 'price', 'detailedStats'];
  displayedColumnsTeamGames: string[] = ['game', 'date', 'result'];





  constructor(
    private http: HttpClient,
    private nhlApiController: nhlApiController,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {

  }
  public notes: any = [];







  sports: any[] = [];
  playerProps: any;


  team1GameStatsDtoNHL = {}
  team2GameStatsDtoNHL = {}

  team1GameStatsDtoNFL = {}
  team2GameStatsDtoNFL = {}


  team1GameStats: any[] = []
  team2GameStats: any[] = []
  team1GameStatsReversed: any[] = []
  team2GameStatsReversed: any[] = []

  playerPropData: DbPlayerPropData[] = []
  playerPropDataFinal: any[] = []
  playerStatsFinal: any[] = []
  playerInfoAll: DbPlayerInfo[] = []




  playerPropObjectArray: any[] = [];

  public displayPropHtml1 =
    {
      name: '',
      abvr: '',
      commenceTime: ''
    };
  public displayPropHtml2 =
    {
      name: '',
      abvr: '',
      commenceTime: ''
    };

  public selectedTab: number = 0;
  listOfSupportedSports: string[] = ["NBA"];
  sportsToTitle: { [key: string]: string; } = {
    NBA: "basketball_nba",
    NFL: "americanfootball_nfl",
    MLB: "baseball_mlb",
    NHL: "icehockey_nhl"
  }
  postDateSelectedSportGames = {};
  selectedSportsDates: string[] = [];
  selectedSportGames: any[] = [];
  selectedSportGamesFinal: any[] = [];
  selectedSportsData: any;

  sportsBookData: DbGameBookData[] = []
  sportsBookDataFinal: DbGameBookData[] = []
  //playerPropData: DbPlayerPropData[] = []
  //playerPropDataFinal: DbPlayerPropData[] = []
  playerInfo: any
  playerStatData: any
  nhlPlayerStatData: DbNhlPlayerGameStats[] = []
  nhlPlayerStatDataFinal: DbNhlPlayerGameStats[] = []
  nhlPlayerStatData2022Final: DbNhlPlayerGameStats[] = []
  nhlPlayerStatData2023Final: DbNhlPlayerGameStats[] = []
  nbaPlayerStatData: DbNbaGameStats[] = []
  nbaPlayerStatDataFinal: DbNbaGameStats[] = []
  nbaPlayerStatData2022Final: DbNbaGameStats[] = []
  nbaPlayerStatData2023Final: DbNbaGameStats[] = []

  allSportTeamInfo: DbTeamInfo[] = []


  async initializeSport() {
    if (this.route.snapshot.paramMap.get('sport') != null) {
      this.selectedSport = this.route.snapshot.paramMap.get('sport')
    }
    if (this.route.snapshot.paramMap.get('game') != null) {
      this.route.paramMap.subscribe((params: { get: (arg0: string) => any; }) => {
        this.selectedGame = params.get("game")
        this.router.navigate([`/props/${this.selectedSport}/${this.selectedGame}`])
      })
    }

  }


  async getGames() {
    
    let initialData = await Promise.all([TeamInfoController.getAllTeamInfo(this.selectedSport),SportsBookController.loadAllBookDataBySportAndMaxBookSeq(this.selectedSport)])
    this.allSportTeamInfo = initialData[0]
    this.selectedSportGames = initialData[1]
    if (this.selectedGame == '') {
      var distinctGames = this.selectedSportGames.map(game => game.bookId).filter((value, index, array) => array.indexOf(value) === index)
      distinctGames.forEach(book => {
        let allOfBook = this.selectedSportGames.filter(e => e.bookId == book)
        var distinctTeams = allOfBook.map(team => team.teamName).filter((value, index, array) => array.indexOf(value) === index)
        let teamArray: any[] = []
        distinctTeams.forEach(team => {
          let allOfTeam = allOfBook.filter(e => e.teamName == team)

          teamArray.push(allOfTeam)
        })
        teamArray[0].selected = false;
        this.selectedSportGamesFinal.push(teamArray)
      })
      this.selectedGame = this.selectedSportGamesFinal[0][0][0].bookId
      this.selectedSportGamesFinal[0][0].selected = true;
      this.router.navigate([`/props/${this.selectedSport}/${this.selectedGame}`])
    }
    else {
      let sportsGamesNew: any[] = JSON.parse(JSON.stringify(this.selectedSportGames))
      var distinctGames = sportsGamesNew.map(game => game.bookId).filter((value, index, array) => array.indexOf(value) === index)
      distinctGames.forEach(book => {
        let allOfBook = sportsGamesNew.filter(e => e.bookId == book)
        var distinctTeams = allOfBook.map(team => team.teamName).filter((value, index, array) => array.indexOf(value) === index)
        let teamArray: any[] = []
        distinctTeams.forEach(team => {
          let allOfTeam = allOfBook.filter(e => e.teamName == team)
          teamArray.push(allOfTeam)
        })
        teamArray[0].selected = false;
        this.selectedSportGamesFinal.push(teamArray)
      })
      let currentGame = this.selectedSportGamesFinal.filter(e => e[0][0].bookId == this.selectedGame)
      currentGame[0][0].selected = true;

    }
    this.selectedSportGamesFinal.forEach(e => {
      let awayTeamInfo = this.allSportTeamInfo.filter(f => f.teamNameFull == e[0][0].awayTeam)
      let homeTeamInfo = this.allSportTeamInfo.filter(f => f.teamNameFull == e[0][0].homeTeam)
      e[0][0].awayTeam = awayTeamInfo[0].teamNameAbvr;
      e[0][0].homeTeam = homeTeamInfo[0].teamNameAbvr;
    })
    await this.onGameClick(this.selectedGame)
  }

  async onGameClick(game: string) {
    this.selectedGame = game;

    this.router.navigate([`/props/${this.selectedSport}/${this.selectedGame}`])
    this.selectedSportGamesFinal.forEach(e => {
      e[0].selected = false;
      
    })
    let selectedGameClicked = this.selectedSportGamesFinal.filter(e => e[0][0].bookId == this.selectedGame)
    selectedGameClicked[0][0].selected = true


    this.playerPropsClicked = false;
    this.gamePropsClicked = true;
    this.displayProp();


  }
  shouldShowSpinner:Boolean = false;





  addItemToCheckout(event: any) {
    event.isDisabled = true;
    //var bestBets = this.findBestBetsFromEvent(event);
    //bestBets.forEach(element => {
    // this.checkoutArray.push(element);
    // });
    this.checkoutArray.push(event)


  }


  isExit(event: any) {
    this.checkoutArray.forEach((e) => e.isDisabled = false)
    this.checkoutArray = [];
  }
  getArrayLength(event: any) {
    this.finalPropParlays = event;
  }

  findBestBetsFromEvent(event: any) {
    var bestBets: any = this.addBestBets(event);
    bestBets.forEach((element: any) => {
      this.checkoutArray.push(element);
    });
  }

  addBestBets(event: any): any[] {
    var bets: any[] = [];
    for (var i = 0; i < event.length; i++) {
      if ((parseFloat(event[i].percentTeam) >= .900) || (parseFloat(event[i].percentTotal) >= .950)) {
        bets.push(event[i]);
      }
    }
    return bets;
  }



  convertSport(sport: any) {
    return this.sportsToTitle[sport];
  }

  static sendEmail: (errorMessage: string) => void;

  allPropTrendData: DbGameBookData[] = []
  listOfTeamsAndPropsForCharts: any[] = []
  public teamPropFinnal: any = []
  public selectedTotalAwayProp: number = 0
  public selectedTotalHomeProp: number = 0
  team1Info: DbTeamInfo = {
    teamId: 0,
    teamNameAbvr: '',
    teamNameFull: '',
    sport: ''
  }
  team2Info: DbTeamInfo = {
    teamId: 0,
    teamNameAbvr: '',
    teamNameFull: '',
    sport: ''
  }
  awayTeamStatsDisplay: any = []
  homeTeamStatsDisplay: any = []
  async displayProp() {
    this.shouldShowSpinner = true;
    this.teamPropIsLoading = true
    this.teamPropFinnal = []
    
    let gameProps: DbGameBookData[] = this.selectedSportGames.filter(e => e.bookId == this.selectedGame)
    this.teamPropFinnal = await NhlService.getTeamPropData(gameProps, this.allSportTeamInfo)
    console.log("new prop array below")
    console.log(this.teamPropFinnal)
    this.teamPropFinnal[0].forEach((e: any) => {
      if(e.length > 1){
        
      }
      else{
        if(e.gameBookData.marketKey == 'h2h'){
          this.awayTeamStatsDisplay = e
        }
      }
      
    })
    this.teamPropFinnal[1].forEach((e: any) => {
      if(e.length > 1){
        
      }
      else{
        if(e.gameBookData.marketKey == 'h2h'){
          this.homeTeamStatsDisplay = e
        }
      }
      
    })
    this.getTeamBestBets()
   
    console.log(this.awayTeamStatsDisplay)
    console.log(this.homeTeamStatsDisplay)
   

    

   

    //this.allPropTrendData = await SportsBookController.loadAllBookDataByBookId(this.selectedGame)

    //this.computeTeamsGameStats(this.team1GameStats, this.team2GameStats)
   
    this.teamPropIsLoading = false
    this.playerPropDataFinalNew = await NhlService.getPlayerPropData(this.selectedGame, this.allSportTeamInfo)
    console.log('Player prop data final new below')
    console.log(this.playerPropDataFinalNew)
    this.getPlayerBestBets()
    
    this.shouldShowSpinner = false

    //this.calcLiveProps()
    
  }

  public team1Wins: number = 0
  public team1OverallGames: number = 0
  public team2Wins: number = 0
  public team2OverallGames: number = 0
  computeTeamsGameStats(team1: any[], team2: any[]) {

    this.team1OverallGames = team1.length
    this.team1Wins = team1.filter(e => e.result == 'W').length
    this.team2OverallGames = team2.length
    this.team2Wins = team2.filter(e => e.result == 'W').length


  }

  onTeamClick(teamName: string) {
    let teamId = this.allSportTeamInfo.filter(e => e.teamNameAbvr == teamName)[0].teamId
    this.router.navigate(["/teamStats/" + this.selectedSport + "/" + teamId])
  }

 
  playerPropsHasBeenLoaded: Boolean = false
  
  playerPropIsLoading: boolean = false;
  playerPropDataFinalNew: any[] = []
  
  public playerStatObj: any = {}
  public arrayOfPlayerBets: any[] = [];
  
  public returnObj: any = {}
  public count = 0
  public arrayOfTeamBets: any[] = [];
  public teamBestBets: any[] = []
  //how to find best bets
  //if either overall home/away or team win percentage is over a certain number then add it to it
  //
  sliderValue: number = 80;
  getTeamBestBets() {
    this.arrayOfTeamBets = []
    for(let i = 0; i < this.teamPropFinnal.length; i++){
      for(let j = 0; j < this.teamPropFinnal[i].length; j++){
        if(this.teamPropFinnal[i][j].length > 1){
          for(let k = 0; k < this.teamPropFinnal[i][j].length; k++){
            this.arrayOfTeamBets.push(this.teamPropFinnal[i][j][k])
          }

        }
        else{
          this.arrayOfTeamBets.push(this.teamPropFinnal[i][j])
        }
      }
    }
    console.log("array of team bets below")
    console.log(this.arrayOfTeamBets)
    this.teamBestBets = []
    for (let bet of this.arrayOfTeamBets) {
      if(bet.overallChance > (this.sliderValue/100) || bet.homeAwayChance > (this.sliderValue/100) || bet.teamChance > (this.sliderValue/100)){
        this.teamBestBets.push(bet)
      }
      if(bet.overallChance > (this.sliderValue/100)){
        bet.overallHighlight = true;
      }
      if(bet.homeAwayChance > (this.sliderValue/100)){
        bet.homeAwayHighlight = true;
      }
      if(bet.teamChance > (this.sliderValue/100)){
        bet.teamHighlight = true;
      }
    }

  }
  calculateNewBestBetTeam() {

    this.teamBestBets = []
    for (let bet of this.arrayOfTeamBets) {
      if(bet.overallChance > (this.sliderValue/100) || bet.homeAwayChance > (this.sliderValue/100) || bet.teamChance > (this.sliderValue/100)){
        this.teamBestBets.push(bet)
      }
      if(bet.overallChance > (this.sliderValue/100)){
        bet.overallHighlight = true;
      }
      if(bet.homeAwayChance > (this.sliderValue/100)){
        bet.homeAwayHighlight = true;
      }
      if(bet.teamChance > (this.sliderValue/100)){
        bet.teamHighlight = true;
      }
    }
  }
  public playerBestBets: any[] = []
  //how to find best bets
  //if either overall home/away or team win percentage is over a certain number then add it to it
  //
  sliderValuePlayer: number = 90;
  getPlayerBestBets() {
    this.playerBestBets = [];
    this.arrayOfPlayerBets = []
    for(let i = 0; i < this.playerPropDataFinalNew.length; i++){
      for(let j = 0; j < this.playerPropDataFinalNew[i].length; j++){
        if(this.playerPropDataFinalNew[i][j].length > 0){
          for(let k = 0; k < this.playerPropDataFinalNew[i][j].length; k++){
            for(let l = 0; l < this.playerPropDataFinalNew[i][j][k].length; l++){
              this.arrayOfPlayerBets.push(this.playerPropDataFinalNew[i][j][k][l])
            }
          }
        }
        
      }
    }
    for(let i = 0; i < this.arrayOfPlayerBets.length; i++){
      if(this.arrayOfPlayerBets[i].overallChance > (this.sliderValuePlayer/100) || this.arrayOfPlayerBets[i].homeAwayChance > (this.sliderValuePlayer/100) || this.arrayOfPlayerBets[i].teamChance > (this.sliderValuePlayer/100)){
        this.playerBestBets.push(this.arrayOfPlayerBets[i])
      }
      if(this.arrayOfPlayerBets[i].overallChance > (this.sliderValue/100)){
        this.arrayOfPlayerBets[i].overallHighlight = true;
      }
      if(this.arrayOfPlayerBets[i].homeAwayChance > (this.sliderValue/100)){
        this.arrayOfPlayerBets[i].homeAwayHighlight = true;
      }
      if(this.arrayOfPlayerBets[i].teamChance > (this.sliderValue/100)){
        this.arrayOfPlayerBets[i].teamHighlight = true;
      }
    }

    
    

  }
  calculateNewBestBetPlayer() {

    this.playerBestBets = []
    for (let bet of this.arrayOfPlayerBets) {
      let overallWin = bet.totalOverall == 0 ? 0 : (bet.overOverall / bet.totalOverall)
      let homeAwayWin = bet.totalHomeAway == 0 ? 0 : (bet.overHomeAway / bet.totalHomeAway)
      let teamWin = bet.totalTeam == 0 ? 0 : (bet.overTeam / bet.totalTeam)
      if ((overallWin > (this.sliderValuePlayer / 100)) || (teamWin > (this.sliderValuePlayer / 100)) || (homeAwayWin > (this.sliderValuePlayer / 100))) {
        if (overallWin > (this.sliderValuePlayer / 100)) {
          bet.overallHighlight = true
        }
        else { bet.overallHighlight = false }
        if (homeAwayWin > (this.sliderValuePlayer / 100)) {
          bet.homeAwayHighlight = true
        }
        else { bet.homeAwayHighlight = false }
        if (teamWin > (this.sliderValuePlayer / 100)) {
          bet.teamHighlight = true
        }
        else { bet.teamHighlight = false }
        bet.overUnder = false
        this.playerBestBets.push(bet)
      }
      else if ((overallWin < (1 - (this.sliderValuePlayer / 100)) && bet.totalOverall != 0) || (teamWin < (1 - (this.sliderValuePlayer / 100)) && bet.totalTeam != 0) || (homeAwayWin < (1 - (this.sliderValuePlayer / 100)) && bet.totalHomeAway != 0)) {
        if (overallWin < (1 - (this.sliderValuePlayer / 100))) {
          bet.overallHighlight = true

        }
        else { bet.overallHighlight = false }
        if (homeAwayWin < (1 - (this.sliderValuePlayer / 100))) {
          bet.homeAwayHighlight = true
        }
        else { bet.homeAwayHighlight = false }
        if (teamWin < (1 - (this.sliderValuePlayer / 100))) {
          bet.teamHighlight = true
        }
        else { bet.teamHighlight = false }
        bet.overUnder = true
        this.playerBestBets.push(bet)
      }






    }
  }

  loadFindHomeAwayFromGameId(gameId: string, teamName: string): string {
    return reusedFunctions.getHomeAwayFromGameId(gameId, teamName)
  }
  propParlays: any[] = []
  finalPropParlays: any[] = []
  addPropToParlay(prop: any) {
    prop.isDisabled = true
    let isPlayer = prop.propVariables.playerOrTeam == 'Player' ? true : false
    if (isPlayer) {
      prop.stats = this.playerStatsFinal.filter(e => e.playerName == prop.propVariables.playerName)
    }
    else {
      prop.stats = prop.propVariables.homeAway == 'Home' ? this.team1GameStats : this.team2GameStats;
    }
    this.finalPropParlays.push(prop)
    this.finalPropParlays = this.finalPropParlays.slice()

  }


  getPropType(prop: string): string {
    let propType = ''
    if (prop.includes('h2h')) {
      propType = 'h2h'
    }
    else if (prop.includes('spread')) {
      propType = 'spread'
    }
    else if (prop.includes('total')) {
      propType = 'total'
    }
    return propType
  }

  public listOfTeamProps: { [key: string]: string } = { "h2h": "Moneyline", "spreads": "Spread", "totals": "Game Total", "h2h_1st_3_innings": "Moneyline first 3 innings", "h2h_1st_5_innings": "Moneyline first 5 innings", "h2h_1st_7_innings": "Moneyline first 7 innings", "team_totals Over": "Team Total", "team_totals Under": "Team Total", "h2h_p1": "Moneyline First Period", "h2h_p2": "Moneyline Second Period", "h2h_p3": "Moneyline Third Period" }
  public listOfMoneylines: string[] = ["h2h", "h2h_1st_3_innings", "h2h_1st_5_innings", "h2h_1st_7_innings", 'h2h_p1', 'h2h_p2', 'h2h_p3']
  displayPropTitle(prop: any): string {
    let finalReturn = ''
    if (prop.length > 1) {
      finalReturn = this.listOfTeamProps[prop[0].gameBookData.marketKey]
    }
    else {
      finalReturn = this.listOfTeamProps[prop.gameBookData.marketKey]
    }

    return finalReturn
  }
  displayIndividualPropTitle(prop: string): string {
    return this.listOfTeamProps[prop]
  }

  displayPropDescription(prop: any): string {
    let finalReturn = ''

    if (prop.length > 1) {
      if (prop[0].gameBookData.marketKey == 'totals') {
        let propOver = prop[0].gameBookData.price > 0 ? '+' : ''
        let one = prop[0].gameBookData.teamName + " " + prop[0].gameBookData.point + " | " + propOver + prop[0].gameBookData.price
        propOver = prop[1].price > 0 ? '+' : ''
        let two = prop[1].gameBookData.teamName + " " + prop[1].gameBookData.point + " | " + propOver + prop[1].gameBookData.price
        finalReturn = one + " " + two
      }
      else if (prop[0].gameBookData.marketKey == ('team_totals Over') || prop[0].gameBookData.marketKey == ('team_totals Under')) {
        let propOver = prop[0].gameBookData.price > 0 ? '+' : ''
        let one = "Over " + prop[0].gameBookData.point + " | " + propOver + prop[0].gameBookData.price
        propOver = prop[1].gameBookData.price > 0 ? '+' : ''
        let two = "Under " + prop[1].gameBookData.point + " | " + propOver + prop[1].gameBookData.price
        finalReturn = one + " " + two
      }


    }
    else {
      if (this.listOfMoneylines.includes(prop.gameBookData.marketKey)) {
        let overProp = prop.gameBookData.price > 0 ? '+' : ''
        finalReturn = overProp + prop.gameBookData.price
      }
      else {
        let overProp = prop.gameBookData.price > 0 ? '+' : ''
        let overPoint = prop.gameBookData.point > 0 ? "+" : ''
        finalReturn = overPoint + prop.gameBookData.point + " | " + overProp + prop.gameBookData.price
      }
    }
    return finalReturn
  }






  getSpreadHighLow(homeAway: string, type: string, highLow: string): number {
    let finalSpread = 0
    if (homeAway == 'Away') {
      if (highLow == 'high') {
        if (type == 'overall') {
          finalSpread = 1000
          this.team2GameStats.forEach(e => {
            if ((e.pointsAllowedOverall - e.pointsScoredOverall) < finalSpread) {
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall);
            }
          })
        }
        else if (type == 'Away') {
          finalSpread = 1000
          this.team2GameStats.forEach(e => {
            if ((e.pointsAllowedOverall - e.pointsScoredOverall) < finalSpread && e.homeOrAway == 'Away') {
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall);
            }
          })
        }
        else if (type == 'team') {
          finalSpread = 1000
          this.team2GameStats.forEach(e => {
            if ((e.pointsAllowedOverall - e.pointsScoredOverall) < finalSpread && e.teamAgainstId == this.team1GameStats[0].teamId) {
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall);
            }
          })
        }
      }
      else {
        if (type == 'overall') {
          finalSpread = -1000
          this.team2GameStats.forEach(e => {
            if ((e.pointsAllowedOverall - e.pointsScoredOverall) > finalSpread) {
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall)
            }
          })
        }
        else if (type == 'Away') {
          finalSpread = -1000
          this.team2GameStats.forEach(e => {
            if ((e.pointsAllowedOverall - e.pointsScoredOverall) > finalSpread && e.homeOrAway == 'Away') {
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall)
            }
          })
        }
        else if (type == 'team') {
          finalSpread = -1000
          this.team2GameStats.forEach(e => {
            if ((e.pointsAllowedOverall - e.pointsScoredOverall) > finalSpread && e.teamAgainstId == this.team1GameStats[0].teamId) {
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall)
            }
          })
        }
      }

    }
    else {
      if (highLow == 'high') {
        if (type == 'overall') {
          finalSpread = 1000
          this.team1GameStats.forEach(e => {
            if ((e.pointsAllowedOverall - e.pointsScoredOverall) < finalSpread) {
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall)
            }
          })
        }
        else if (type == 'Home') {
          finalSpread = 1000
          this.team1GameStats.forEach(e => {
            if ((e.pointsAllowedOverall - e.pointsScoredOverall) < finalSpread && e.homeOrAway == 'Home') {
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall)
            }
          })
        }
        else if (type == 'team') {
          finalSpread = 1000
          this.team1GameStats.forEach(e => {
            if ((e.pointsAllowedOverall - e.pointsScoredOverall) < finalSpread && e.teamAgainstId == this.team2GameStats[0].teamId) {
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall)
            }
          })
        }
      }
      else {
        if (type == 'overall') {
          finalSpread = -1000
          this.team1GameStats.forEach(e => {
            if ((e.pointsAllowedOverall - e.pointsScoredOverall) > finalSpread) {
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall)
            }
          })
        }
        else if (type == 'Home') {
          finalSpread = -1000
          this.team1GameStats.forEach(e => {
            if ((e.pointsAllowedOverall - e.pointsScoredOverall) > finalSpread && e.homeOrAway == 'Home') {
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall)
            }
          })
        }
        else if (type == 'team') {
          finalSpread = -1000
          this.team1GameStats.forEach(e => {
            if ((e.pointsAllowedOverall - e.pointsScoredOverall) > finalSpread && e.teamAgainstId == this.team2GameStats[0].teamId) {
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall)
            }
          })
        }
      }

    }
    if (finalSpread == 1000 || finalSpread == -1000) {
      finalSpread = 0
    }
    return finalSpread
  }

  public overTrueUnderFalseAway: boolean = true
  public overTrueUnderFalseHome: boolean = true
  public totalAwayOverallChance: number = 0
  public totalHomeOverallChance: number = 0
  public totalAwayAwayChance: number = 0
  public totalHomeHomeChance: number = 0
  public totalAwayTeamChance: number = 0
  public totalHomeTeamChance: number = 0

  getTotalHighLow(homeAway: string, type: string, highLow: string, marketKey: string): number {
    let finalTotal = 0

    if (marketKey == 'totals') {
      if (homeAway == 'Away') {
        if (highLow == 'high') {
          if (type == 'overall') {
            finalTotal = 0
            this.team2GameStats.forEach(e => {
              if ((e.pointsScoredOverall + e.pointsAllowedOverall) > finalTotal) {
                finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
              }
            })
          }
          else if (type == 'Away') {
            finalTotal = 0
            this.team2GameStats.forEach(e => {
              if ((e.pointsScoredOverall + e.pointsAllowedOverall) > finalTotal && e.homeOrAway == 'Away') {
                finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
              }
            })
          }
          else if (type == 'team') {
            finalTotal = 0
            this.team2GameStats.forEach(e => {
              if ((e.pointsScoredOverall + e.pointsAllowedOverall) > finalTotal && e.teamAgainstId == this.team1GameStats[0].teamId) {
                finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
              }
            })
          }
        }
        else {
          if (type == 'overall') {
            finalTotal = 1000
            this.team2GameStats.forEach(e => {
              if ((e.pointsScoredOverall + e.pointsAllowedOverall) < finalTotal) {
                finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
              }
            })
          }
          else if (type == 'Away') {
            finalTotal = 1000
            this.team2GameStats.forEach(e => {
              if ((e.pointsScoredOverall + e.pointsAllowedOverall) < finalTotal && e.homeOrAway == 'Away') {
                finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
              }
            })
          }
          else if (type == 'team') {
            finalTotal = 1000
            this.team2GameStats.forEach(e => {
              if ((e.pointsScoredOverall + e.pointsAllowedOverall) < finalTotal && e.teamAgainstId == this.team1GameStats[0].teamId) {
                finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
              }
            })
          }
        }

      }
      else {
        if (highLow == 'high') {
          if (type == 'overall') {
            finalTotal = 0
            this.team1GameStats.forEach(e => {
              if ((e.pointsScoredOverall + e.pointsAllowedOverall) > finalTotal) {
                finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
              }
            })
          }
          else if (type == 'Home') {
            finalTotal = 0
            this.team1GameStats.forEach(e => {
              if ((e.pointsScoredOverall + e.pointsAllowedOverall) > finalTotal && e.homeOrAway == 'Home') {
                finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
              }
            })
          }
          else if (type == 'team') {
            finalTotal = 0
            this.team1GameStats.forEach(e => {
              if ((e.pointsScoredOverall + e.pointsAllowedOverall) > finalTotal && e.teamAgainstId == this.team2GameStats[0].teamId) {
                finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
              }
            })
          }
        }
        else {
          if (type == 'overall') {
            finalTotal = 1000
            this.team1GameStats.forEach(e => {
              if ((e.pointsScoredOverall + e.pointsAllowedOverall) < finalTotal) {
                finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
              }
            })
          }
          else if (type == 'Home') {
            finalTotal = 1000
            this.team1GameStats.forEach(e => {
              if ((e.pointsScoredOverall + e.pointsAllowedOverall) < finalTotal && e.homeOrAway == 'Home') {
                finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
              }
            })
          }
          else if (type == 'team') {
            finalTotal = 1000
            this.team1GameStats.forEach(e => {
              if ((e.pointsScoredOverall + e.pointsAllowedOverall) < finalTotal && e.teamAgainstId == this.team2GameStats[0].teamId) {
                finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
              }
            })
          }
        }

      }
    }
    else if (marketKey.includes('team_totals')) {
      if (homeAway == 'Away') {
        if (highLow == 'high') {
          if (type == 'overall') {
            finalTotal = 0
            this.team2GameStats.forEach(e => {
              if ((e.pointsScoredOverall) > finalTotal) {
                finalTotal = (e.pointsScoredOverall)
              }
            })
          }
          else if (type == 'Away') {
            finalTotal = 0
            this.team2GameStats.forEach(e => {
              if ((e.pointsScoredOverall) > finalTotal && e.homeOrAway == 'Away') {
                finalTotal = (e.pointsScoredOverall)
              }
            })
          }
          else if (type == 'team') {
            finalTotal = 0
            this.team2GameStats.forEach(e => {
              if ((e.pointsScoredOverall) > finalTotal && e.teamAgainstId == this.team1GameStats[0].teamId) {
                finalTotal = (e.pointsScoredOverall)
              }
            })
          }
        }
        else {
          if (type == 'overall') {
            finalTotal = 1000
            this.team2GameStats.forEach(e => {
              if ((e.pointsScoredOverall) < finalTotal) {
                finalTotal = (e.pointsScoredOverall)
              }
            })
          }
          else if (type == 'Away') {
            finalTotal = 1000
            this.team2GameStats.forEach(e => {
              if ((e.pointsScoredOverall) < finalTotal && e.homeOrAway == 'Away') {
                finalTotal = (e.pointsScoredOverall)
              }
            })
          }
          else if (type == 'team') {
            finalTotal = 1000
            this.team2GameStats.forEach(e => {
              if ((e.pointsScoredOverall) < finalTotal && e.teamAgainstId == this.team1GameStats[0].teamId) {
                finalTotal = (e.pointsScoredOverall)
              }
            })
          }
        }

      }
      else {
        if (highLow == 'high') {
          if (type == 'overall') {
            finalTotal = 0
            this.team1GameStats.forEach(e => {
              if ((e.pointsScoredOverall) > finalTotal) {
                finalTotal = (e.pointsScoredOverall)
              }
            })
          }
          else if (type == 'Home') {
            finalTotal = 0
            this.team1GameStats.forEach(e => {
              if ((e.pointsScoredOverall) > finalTotal && e.homeOrAway == 'Home') {
                finalTotal = (e.pointsScoredOverall)
              }
            })
          }
          else if (type == 'team') {
            finalTotal = 0
            this.team1GameStats.forEach(e => {
              if ((e.pointsScoredOverall) > finalTotal && e.teamAgainstId == this.team2GameStats[0].teamId) {
                finalTotal = (e.pointsScoredOverall)
              }
            })
          }
        }
        else {
          if (type == 'overall') {
            finalTotal = 1000
            this.team1GameStats.forEach(e => {
              if ((e.pointsScoredOverall) < finalTotal) {
                finalTotal = (e.pointsScoredOverall)
              }
            })
          }
          else if (type == 'Home') {
            finalTotal = 1000
            this.team1GameStats.forEach(e => {
              if ((e.pointsScoredOverall) < finalTotal && e.homeOrAway == 'Home') {
                finalTotal = (e.pointsScoredOverall)
              }
            })
          }
          else if (type == 'team') {
            finalTotal = 1000
            this.team1GameStats.forEach(e => {
              if ((e.pointsScoredOverall) < finalTotal && e.teamAgainstId == this.team2GameStats[0].teamId) {
                finalTotal = (e.pointsScoredOverall)
              }
            })
          }
        }

      }
    }


    if (finalTotal == 1000) {
      finalTotal = 0
    }
    return finalTotal
  }

  liveMoneylineStats = ['Winning After', 'Winning by X', 'Scoring']
  liveProps: any = [{}, {}]
  calcLiveProps() {
    let team1New: any = this.team1GameStats.slice()
    let team2New: any = this.team2GameStats.slice()

    team1New.number = 0;
    team1New.inning = 1;
    team2New.number = 0;
    team2New.inning = 1;
    //this.liveProps.push(this.team1GameStats, this.team2GameStats)
    this.liveProps[0].stats = team2New
    this.liveProps[1].stats = team1New
    this.liveProps[0].number = 1
    this.liveProps[1].number = 1
    this.liveProps[0].selectedDropDown = this.selectedDropDown
    this.liveProps[1].selectedDropDown = this.selectedDropDown
  }

  calcNewLiveProp(index: number) {
    this.destroyBarCharts(index);
    this.createBarChart(index)

  }


  public barChart0: any;
  public barChart1: any;
  barData: any[] = [];

  selectedDropDown: string = this.liveMoneylineStats[0]
  /* getChartData(){
    
    
  } */
  destroyBarCharts(index: number) {
    if (index == 0) {
      this.barChart0.destroy()
    }
    if (index == 1) {
      this.barChart1.destroy()
    }


  }

  createBarChart(index?: number) {
    this.barData = []
    //loop thorugh each game. for winning after we use the inning loop 
    //for winning by we also loop thorugh each inning and look for the first appearance of the margin
    //for score we loop through each inning and look for the first instance of that score happening
    let highestScoreTeam = 0;
    for (let team of this.liveProps) {
      let barChartFinal: any[] = []
      if (this.selectedSport == 'MLB') {
        let teamStats: DbMlbTeamGameStats[] = team.stats
        if (team.selectedDropDown == 'Winning After') {
          for (let i = 1; i < 9; i++) {
            let totalInningChance = 0;
            let totalGames = 0
            let totalWins = 0
            if (i == 1) {
              let filteredGames: DbMlbTeamGameStats[] = []
              filteredGames = teamStats.filter(game => game.pointsScoredFirstInning > game.pointsAllowedFirstInning)

              let gamesWon = filteredGames.filter(e => e.result == 'W')
              totalGames = filteredGames.length
              totalWins = gamesWon.length
            }
            else if (i == 2) {
              let filteredGames = teamStats.filter(game => (game.pointsScoredFirstInning + game.pointsScoredSecondInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning))



              let gamesWon = filteredGames.filter(e => e.result == 'W')
              totalGames = filteredGames.length
              totalWins = gamesWon.length
            }
            else if (i == 3) {
              let filteredGames = teamStats.filter(game => (game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning))
              let gamesWon = filteredGames.filter(e => e.result == 'W')
              totalGames = filteredGames.length
              totalWins = gamesWon.length
            }
            else if (i == 4) {
              let filteredGames = teamStats.filter(game => (game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning))
              let gamesWon = filteredGames.filter(e => e.result == 'W')
              totalGames = filteredGames.length
              totalWins = gamesWon.length
            }
            else if (i == 5) {
              let filteredGames = teamStats.filter(game => (game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning + game.pointsScoredFifthInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning + game.pointsAllowedFifthInning))
              let gamesWon = filteredGames.filter(e => e.result == 'W')
              totalGames = filteredGames.length
              totalWins = gamesWon.length
            }
            else if (i == 6) {
              let filteredGames = teamStats.filter(game => (game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning + game.pointsScoredFifthInning + game.pointsScoredFifthInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning + game.pointsAllowedFifthInning + game.pointsAllowedSixthInning))
              let gamesWon = filteredGames.filter(e => e.result == 'W')
              totalGames = filteredGames.length
              totalWins = gamesWon.length
            }
            else if (i == 7) {
              let filteredGames = teamStats.filter(game => (game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning + game.pointsScoredFifthInning + game.pointsScoredFifthInning + game.pointsScoredSeventhInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning + game.pointsAllowedFifthInning + game.pointsAllowedSixthInning + game.pointsAllowedSeventhInning))
              let gamesWon = filteredGames.filter(e => e.result == 'W')
              totalGames = filteredGames.length
              totalWins = gamesWon.length
            }
            else if (i == 8) {
              let filteredGames = teamStats.filter(game => (game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning + game.pointsScoredFifthInning + game.pointsScoredFifthInning + game.pointsScoredSeventhInning + game.pointsScoredEigthInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning + game.pointsAllowedFifthInning + game.pointsAllowedSixthInning + game.pointsAllowedSeventhInning + game.pointsAllowedEigthInning))
              let gamesWon = filteredGames.filter(e => e.result == 'W')
              totalGames = filteredGames.length
              totalWins = gamesWon.length
            }

            //totalInningChance = totalWins/this.team1GameStats.length

            totalInningChance = totalWins / totalGames
            barChartFinal.push(totalInningChance * 100)
          }
        }
        else if (team.selectedDropDown == 'Scoring') {
          highestScoreTeam = 0
          // find game where in any combo of innings they scored more than the number
          let highestScore = 0
          teamStats.forEach(e => {
            if (e.pointsScoredOverall > highestScore) {
              highestScore = e.pointsScoredOverall
            }
          })
          highestScoreTeam = highestScore
          for (let i = 1; i <= highestScore; i++) {
            let filteredGames = teamStats.filter(game => game.pointsScoredOverall >= i)
            let totalWins = filteredGames.filter(e => e.result == 'W')
            let totalChance = filteredGames.length == 0 ? 0 : totalWins.length / filteredGames.length
            barChartFinal.push(totalChance * 100)

          }

        }
        else if (team.selectedDropDown == 'Winning by X') {
          highestScoreTeam = 0;
          teamStats.forEach(e => {
            if ((e.pointsScoredOverall - e.pointsAllowedOverall) > highestScoreTeam) {
              highestScoreTeam = (e.pointsScoredOverall - e.pointsAllowedOverall)
            }
          })
          for (let i = 1; i <= highestScoreTeam; i++) {
            let filteredGames = teamStats.filter(game => ((game.pointsScoredFirstInning - game.pointsAllowedFirstInning) == i) || (((game.pointsScoredFirstInning + game.pointsScoredSecondInning) - (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning)) == i) || (((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning) - (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning)) == i) || (((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning) - (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning)) == i) || (((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning + game.pointsScoredFifthInning) - (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning + game.pointsAllowedFifthInning)) == i) || (((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning + game.pointsScoredFifthInning + game.pointsScoredSixthInning) - (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning + game.pointsAllowedFifthInning + game.pointsAllowedSixthInning)) == i) || (((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning + game.pointsScoredFifthInning + game.pointsScoredSixthInning + game.pointsScoredEigthInning) - (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning + game.pointsAllowedFifthInning + game.pointsAllowedSixthInning + game.pointsAllowedSeventhInning)) == i) || (((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning + game.pointsScoredFifthInning + game.pointsScoredSixthInning + game.pointsScoredSeventhInning + game.pointsScoredEigthInning) - (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning + game.pointsAllowedFifthInning + game.pointsAllowedSixthInning + game.pointsAllowedSeventhInning + game.pointsAllowedEigthInning)) == i) || (((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning + game.pointsScoredFifthInning + game.pointsScoredSixthInning + game.pointsScoredSeventhInning + game.pointsScoredEigthInning + game.pointsScoredNinthInning) - (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning + game.pointsAllowedFifthInning + game.pointsAllowedSixthInning + game.pointsAllowedSeventhInning + game.pointsAllowedEigthInning + game.pointsAllowedNinthInning)) == i))
            let totalWins = filteredGames.filter(e => e.result == 'W')
            let totalChance = filteredGames.length == 0 ? 0 : totalWins.length / filteredGames.length
            barChartFinal.push(totalChance * 100)
          }

        }
      }
      else if (this.selectedSport == 'NFL') {
        let teamStats: DBNflTeamGameStats[] = team.stats
        if (team.selectedDropDown == 'Winning After') {
          for (let i = 1; i < 5; i++) {
            let totalInningChance = 0;
            let totalGames = 0
            let totalWins = 0
            if (i == 1) {
              let filteredGames: DBNflTeamGameStats[] = []
              filteredGames = teamStats.filter(game => game.pointsScoredFirstQuarter > game.pointsAllowedFirstQuarter)

              let gamesWon = filteredGames.filter(e => e.result == 'W')
              totalGames = filteredGames.length
              totalWins = gamesWon.length
            }
            else if (i == 2) {
              let filteredGames = teamStats.filter(game => (game.pointsScoredFirstQuarter + game.pointsScoredSecondQuarter) > (game.pointsAllowedFirstQuarter + game.pointsAllowedSecondQuarter))



              let gamesWon = filteredGames.filter(e => e.result == 'W')
              totalGames = filteredGames.length
              totalWins = gamesWon.length
            }
            else if (i == 3) {
              let filteredGames = teamStats.filter(game => (game.pointsScoredFirstQuarter + game.pointsScoredSecondQuarter + game.pointsScoredThirdQuarter) > (game.pointsAllowedFirstQuarter + game.pointsAllowedSecondQuarter + game.pointsAllowedThirdQuarter))
              let gamesWon = filteredGames.filter(e => e.result == 'W')
              totalGames = filteredGames.length
              totalWins = gamesWon.length
            }
            else if (i == 4) {
              let filteredGames = teamStats.filter(game => (game.pointsScoredFirstQuarter + game.pointsScoredSecondQuarter + game.pointsScoredThirdQuarter + game.pointsScoredFourthQuarter) > (game.pointsAllowedFirstQuarter + game.pointsAllowedSecondQuarter + game.pointsAllowedThirdQuarter + game.pointsAllowedFourthQuarter))
              let gamesWon = filteredGames.filter(e => e.result == 'W')
              totalGames = filteredGames.length
              totalWins = gamesWon.length
            }

            //totalInningChance = totalWins/this.team1GameStats.length

            totalInningChance = totalWins / totalGames
            barChartFinal.push(totalInningChance * 100)
          }
        }
        else if (team.selectedDropDown == 'Scoring') {
          highestScoreTeam = 0
          // find game where in any combo of innings they scored more than the number
          let highestScore = 0
          teamStats.forEach(e => {
            if (e.pointsScoredOverall > highestScore) {
              highestScore = e.pointsScoredOverall
            }
          })
          highestScoreTeam = highestScore
          for (let i = 1; i <= highestScore; i++) {
            let filteredGames = teamStats.filter(game => game.pointsScoredOverall >= i)
            let totalWins = filteredGames.filter(e => e.result == 'W')
            let totalChance = filteredGames.length == 0 ? 0 : totalWins.length / filteredGames.length
            barChartFinal.push(totalChance * 100)

          }

        }
        else if (team.selectedDropDown == 'Winning by X') {
          highestScoreTeam = 0;
          teamStats.forEach(e => {
            if ((e.pointsScoredOverall - e.pointsAllowedOverall) > highestScoreTeam) {
              highestScoreTeam = (e.pointsScoredOverall - e.pointsAllowedOverall)
            }
          })
          for (let i = 1; i <= highestScoreTeam; i++) {
            let filteredGames = teamStats.filter(game => ((game.pointsScoredFirstQuarter - game.pointsAllowedFirstQuarter) == i) || (((game.pointsScoredFirstQuarter + game.pointsScoredSecondQuarter) - (game.pointsAllowedFirstQuarter + game.pointsAllowedSecondQuarter)) == i) || (((game.pointsScoredFirstQuarter + game.pointsScoredSecondQuarter + game.pointsScoredThirdQuarter) - (game.pointsAllowedFirstQuarter + game.pointsAllowedSecondQuarter + game.pointsAllowedThirdQuarter)) == i) || (((game.pointsScoredFirstQuarter + game.pointsScoredSecondQuarter + game.pointsScoredThirdQuarter + game.pointsScoredFourthQuarter) - (game.pointsAllowedFirstQuarter + game.pointsAllowedSecondQuarter + game.pointsAllowedThirdQuarter + game.pointsAllowedFourthQuarter)) == i))
            let totalWins = filteredGames.filter(e => e.result == 'W')
            let totalChance = filteredGames.length == 0 ? 0 : totalWins.length / filteredGames.length
            barChartFinal.push(totalChance * 100)
          }

        }
      }


      this.barData.push(barChartFinal)

    }

    if (index == undefined) {
      let labels: string[] = []
      if (this.selectedSport == "MLB") {
        labels = ['1', '2', '3', '4', '5', '6', '7', '8']
      }
      else if (this.selectedSport == "NFL") {
        labels = ['1', '2', '3']
      }
      this.barChart0 = new Chart("MyChart0", {
        type: 'bar', //this denotes tha type of chart

        data: {// values on X-Axis

          labels: labels,
          datasets: [
            {
              label: "Win Chance",
              data: this.barData[0],
              backgroundColor: 'blue'
            }
          ]
        },
        options: {
          aspectRatio: 2.5
        }

      });
      this.barChart1 = new Chart("MyChart1", {
        type: 'bar', //this denotes tha type of chart

        data: {// values on X-Axis
          labels: labels,
          datasets: [
            {
              label: "Win Chance",
              data: this.barData[1],
              backgroundColor: 'blue'
            }
          ]
        },
        options: {
          aspectRatio: 2.5
        }

      });
    }
    else if (index == 0) {
      if (this.liveProps[0].selectedDropDown != 'Winning After') {
        this.barData[0].labels = []
        let highestTeamScore = 0
        if (this.liveProps[0].selectedDropDown = 'Winning By X') {
          this.liveProps[0].stats.forEach((game: { pointsScoredOverall: number }) => {
            if (game.pointsScoredOverall > highestTeamScore) {
              highestTeamScore = game.pointsScoredOverall
            }
          })
          for (let i = 1; i <= highestTeamScore; i++) {
            this.barData[0].labels.push(i.toString())
          }
        }
        else {
          this.liveProps[0].stats.forEach((game: {
            pointsAllowedOverall: number; pointsScoredOverall: number
          }) => {
            if ((game.pointsScoredOverall - game.pointsAllowedOverall) > highestTeamScore) {
              highestTeamScore = (game.pointsScoredOverall - game.pointsAllowedOverall)
            }
          })
          for (let i = 1; i <= highestTeamScore; i++) {
            this.barData[0].labels.push(i.toString())
          }
        }

      }
      else {
        if (this.selectedSport == 'MLB') {
          this.barData[0].labels = ['1', '2', '3', '4', '5', '6', '7', '8']
        }
        else if (this.selectedSport == 'NFL') {
          this.barData[0].labels = ['1', '2', '3']
        }

      }
      this.barChart0 = new Chart("MyChart0", {
        type: 'bar', //this denotes tha type of chart

        data: {// values on X-Axis
          labels: this.barData[0].labels,
          datasets: [
            {
              label: "Win Chance",
              data: this.barData[0],
              backgroundColor: 'blue'
            }
          ]
        },
        options: {
          aspectRatio: 2.5
        }

      });

    }
    else if (index == 1) {
      if (this.liveProps[1].selectedDropDown != 'Winning After') {
        this.barData[1].labels = []
        let highestTeamScore = 0
        if (this.liveProps[1].selectedDropDown = 'Winning By X') {
          this.liveProps[1].stats.forEach((game: { pointsScoredOverall: number }) => {
            if (game.pointsScoredOverall > highestTeamScore) {
              highestTeamScore = game.pointsScoredOverall
            }
          })
          for (let i = 1; i <= highestTeamScore; i++) {
            this.barData[1].labels.push(i.toString())
          }
        }
        else {
          this.liveProps[1].stats.forEach((game: {
            pointsAllowedOverall: number; pointsScoredOverall: number
          }) => {
            if ((game.pointsScoredOverall - game.pointsAllowedOverall) > highestTeamScore) {
              highestTeamScore = (game.pointsScoredOverall - game.pointsAllowedOverall)
            }
          })
          for (let i = 1; i <= highestTeamScore; i++) {
            this.barData[1].labels.push(i.toString())
          }
        }
      }
      else {
        if (this.selectedSport == 'MLB') {
          this.barData[0].labels = ['1', '2', '3', '4', '5', '6', '7', '8']
        }
        else if (this.selectedSport == 'NFL') {
          this.barData[0].labels = ['1', '2', '3']
        }
      }
      this.barChart1 = new Chart("MyChart1", {
        type: 'bar', //this denotes tha type of chart

        data: {// values on X-Axis
          labels: this.barData[1].labels,
          datasets: [
            {
              label: "Win Chance",
              data: this.barData[1],
              backgroundColor: 'blue'
            }
          ]
        },
        options: {
          aspectRatio: 2.5
        }

      });
    }

  }
  selectedTabIndex = 0
  async onTabChange(event: any) {
    this.selectedTabIndex = event.index
    /* if(event.index == 1 && this.playerPropsHasBeenLoaded == false){
      
      await this.loadPlayerProps();
    } */
  }
  onChartSearch(index: number) {
    this.destroyBarCharts(index);
    this.createBarChart(index)
  }

  playerClicked(player: string) {
    let playerInfo = this.playerStatsFinal.filter(e => e.playerName == player)[0]
    let playerId = playerInfo.playerId
    this.router.navigate([`/playerStats/${this.selectedSport}/${playerId}`])
  }





  moneyLineTableColumns: string[] = ["TeamAgainst", "Date", "Score"]





  /* async propTrend(teamName: string, prop: string, homeAway: string, content: TemplateRef<any>) {
    
    teamInfo.type = prop
    
    if (prop == 'totals') {
      this.propHistory = await SportsBookController.loadAllBookDataBySportAndBookIdAndProp(this.selectedSport, this.selectedGame, prop)
    }
    else {
      this.propHistory = await SportsBookController.loadAllBookDataBySportAndBookIdAndTeamAndProp(this.selectedSport, this.selectedGame, teamName, prop)
    }
    var teamInfo: any = {}
    if (homeAway == 'away') {
      let teamTable = JSON.parse(JSON.stringify(this.team2GameStats))
      teamTable = teamTable.reverse()
      

      let teamTableHomeAway = teamTable.filter((e: { homeOrAway: string; }) => e.homeOrAway == 'Away')
      let teamTableVsTeam = teamTable.filter((e: { teamAgainstId: any; }) => e.teamAgainstId == this.team1GameStats[0].teamId)

      teamTable = teamTable.slice(0, 9)
      teamTableHomeAway = teamTableHomeAway.slice(0,9)
      teamTableVsTeam = teamTableVsTeam.slice(0,9)

      if(teamInfo.type == 'Moneyline'){
        teamInfo.percentChance
        teamInfo.weightedPercentChance
        teamInfo.average
        teamInfo.averageFor
        teamInfo.averageAgainst
        teamInfo.high
        teamInfo.low
        teamInfo.teamGamesWonOverall = this.team2GameStatsDtoMLB.gamesWon
        teamInfo.teamGamesLostOverall = this.team2GameStatsDtoMLB.gamesLost
        teamInfo.teamAgainstGamesWonOverall = this.team1GameStatsDtoMLB.gamesWon
        teamInfo.teamAgainstGamesLostOverall = this.team1GameStatsDtoMLB.gamesLost
        teamInfo.teamGamesWonHomeAway = this.team2GameStatsDtoMLB.gamesWonAway
        teamInfo.teamGamesLostHomeAway = this.team2GameStatsDtoMLB.gamesLostAway
        teamInfo.teamAgainstGamesWonHomeAway = this.team1GameStatsDtoMLB.gamesWonHome
        teamInfo.teamAgainstGamesLostHomeAway = this.team1GameStatsDtoMLB.gamesLostHome
        teamInfo.teamGamesWonTeam = this.team2GameStatsDtoMLB.gamesWonVsOpponent
        teamInfo.teamGamesLostTeam = this.team2GameStatsDtoMLB.gamesLostVsOpponent
        teamInfo.teamAgainstGamesWonTeam = this.team1GameStatsDtoMLB.gamesWonVsOpponent
        teamInfo.teamAgainstGamesLostTeam = this.team1GameStatsDtoMLB.gamesLostVsOpponent
      }
      else if(teamInfo.type == 'Spread'){
        teamInfo.teamGamesWonOverall = this.awaySpreadOverallChance
        teamInfo.teamGamesLostOverall = 1-this.awaySpreadOverallChance
        teamInfo.teamAgainstGamesWonOverall = this.team1GameStatsDtoMLB.gamesWon
        teamInfo.teamAgainstGamesLostOverall = this.team1GameStatsDtoMLB.gamesLost
        teamInfo.teamGamesWonHomeAway = this.team2GameStatsDtoMLB.gamesWonAway
        teamInfo.teamGamesLostHomeAway = this.team2GameStatsDtoMLB.gamesLostAway
        teamInfo.teamAgainstGamesWonHomeAway = this.team1GameStatsDtoMLB.gamesWonHome
        teamInfo.teamAgainstGamesLostHomeAway = this.team1GameStatsDtoMLB.gamesLostHome
        teamInfo.teamGamesWonTeam = this.team2GameStatsDtoMLB.gamesWonVsOpponent
        teamInfo.teamGamesLostTeam = this.team2GameStatsDtoMLB.gamesLostVsOpponent
        teamInfo.teamAgainstGamesWonTeam = this.team1GameStatsDtoMLB.gamesWonVsOpponent
        teamInfo.teamAgainstGamesLostTeam = this.team1GameStatsDtoMLB.gamesLostVsOpponent
      }
      else if(teamInfo.type == 'Total'){
        teamInfo.teamGamesWonOverall = this.team2GameStatsDtoMLB.gamesWon
        teamInfo.teamGamesLostOverall = this.team2GameStatsDtoMLB.gamesLost
        teamInfo.teamAgainstGamesWonOverall = this.team1GameStatsDtoMLB.gamesWon
        teamInfo.teamAgainstGamesLostOverall = this.team1GameStatsDtoMLB.gamesLost
        teamInfo.teamGamesWonHomeAway = this.team2GameStatsDtoMLB.gamesWonAway
        teamInfo.teamGamesLostHomeAway = this.team2GameStatsDtoMLB.gamesLostAway
        teamInfo.teamAgainstGamesWonHomeAway = this.team1GameStatsDtoMLB.gamesWonHome
        teamInfo.teamAgainstGamesLostHomeAway = this.team1GameStatsDtoMLB.gamesLostHome
        teamInfo.teamGamesWonTeam = this.team2GameStatsDtoMLB.gamesWonVsOpponent
        teamInfo.teamGamesLostTeam = this.team2GameStatsDtoMLB.gamesLostVsOpponent
        teamInfo.teamAgainstGamesWonTeam = this.team1GameStatsDtoMLB.gamesWonVsOpponent
        teamInfo.teamAgainstGamesLostTeam = this.team1GameStatsDtoMLB.gamesLostVsOpponent
      }
      

      teamInfo.teamTable = teamTable
      teamInfo.teamTableHomeAway = teamTableHomeAway
      teamInfo.teamTableVsTeam = teamTableVsTeam

      if(prop == 'Spread'){
        teamInfo.averageSpreadOverall = this.team2GameStatsDtoMLB.spreadGame
          teamInfo.averageSpreadHomeAway = this.team2GameStatsDtoMLB.spreadAway
          teamInfo.averageSpreadVsTeam = this.team2GameStatsDtoMLB.spreadVsOpponent
      }
    }
    else {
      let teamTable = JSON.parse(JSON.stringify(this.team1GameStats))
      teamTable = teamTable.reverse()

      let teamTableHomeAway = teamTable.filter((e: { homeOrAway: string; }) => e.homeOrAway == 'Home')
      let teamTableVsTeam = teamTable.filter((e: { teamAgainstId: any; }) => e.teamAgainstId == this.team2GameStats[0].teamId)

      teamTable = teamTable.slice(0, 9)
      teamTableHomeAway = teamTableHomeAway.slice(0,9)
      teamTableVsTeam = teamTableVsTeam.slice(0,9)
      
      teamInfo.teamGamesWonOverall = this.team1GameStatsDtoMLB.gamesWon
      teamInfo.teamGamesLostOverall = this.team1GameStatsDtoMLB.gamesLost
      teamInfo.teamAgainstGamesWonOverall = this.team2GameStatsDtoMLB.gamesWon
      teamInfo.teamAgainstGamesLostOverall = this.team2GameStatsDtoMLB.gamesLost
      teamInfo.teamGamesWonHomeAway = this.team1GameStatsDtoMLB.gamesWonHome
      teamInfo.teamGamesLostHomeAway = this.team1GameStatsDtoMLB.gamesLostHome
      teamInfo.teamAgainstGamesWonHomeAway = this.team2GameStatsDtoMLB.gamesWonAway
      teamInfo.teamAgainstGamesLostHomeAway = this.team2GameStatsDtoMLB.gamesLostAway
      teamInfo.teamGamesWonTeam = this.team1GameStatsDtoMLB.gamesWonVsOpponent
      teamInfo.teamGamesLostTeam = this.team1GameStatsDtoMLB.gamesLostVsOpponent
      teamInfo.teamAgainstGamesWonTeam = this.team2GameStatsDtoMLB.gamesWonVsOpponent
      teamInfo.teamAgainstGamesLostTeam = this.team2GameStatsDtoMLB.gamesLostVsOpponent

      teamInfo.teamTable = teamTable
      teamInfo.teamTableHomeAway = teamTableHomeAway
      teamInfo.teamTableVsTeam = teamTableVsTeam

      if(prop == 'Spread'){
        teamInfo.averageSpreadOverall = this.team2GameStatsDtoMLB.spreadGame
          teamInfo.averageSpreadHomeAway = this.team2GameStatsDtoMLB.spreadAway
          teamInfo.averageSpreadVsTeam = this.team2GameStatsDtoMLB.spreadVsOpponent
      }
    }


    let dialogRef = this.dialog.open(this.callAPIDialog, { data: teamInfo, width: '800px', height: '600px' });
  

  } */

  openChart(index: number, teamName: string, teamIndex: number, marketKey: string) {
    console.log(teamName)
    console.log(this.allPropTrendData)
    let filteredPropHistory = this.allPropTrendData.filter(e => e.teamName == teamName && e.marketKey == marketKey)
    this.createTrendChartData = [filteredPropHistory, marketKey]
  }
  destroySelectedChart(index: number, teamIndex: number) {
    this.listOfTeamsAndPropsForCharts[teamIndex][index].destroy()
  }

  chartVariable: any;
  createTrendChartData: any[] = []
  createChart(index: number, teamName: string, marketKey: string, teamIndex: number) {




    var historyOfProp: number[] = []

    let filteredPropTrend = this.allPropTrendData.filter(e => e.teamName == teamName && e.marketKey == marketKey)



    var dataPoint: string[] = []
    var index = 1
    if (marketKey == 'h2h') {
      filteredPropTrend.forEach((e) => {
        historyOfProp.push(e.price)
        if (e.createdAt) {
          dataPoint.push("f")
        }

      })
    }
    else if (this.selectedPropHistoryName == 'spreads' || this.selectedPropHistoryName == 'totals') {
      this.propHistory.forEach((e) => {
        historyOfProp.push(e.point)
        if (e.createdAt) {
          dataPoint.push("h")
          //dataPoint.push(e.createdAt.toString())
        }

      })
    }
    /* this.propHistory.forEach((e) => {
      historyOfProp.push(e.price)
      if(e.createdAt){
        dataPoint.push(e.createdAt.toString())
      }
      
    }) */
    let finalLabel: string[] = []
    dataPoint.forEach(d => {
      //finalLabel.push(reusedFunctions.convertDateToDateTime(d))
      finalLabel.push("d")
    })



    var annotation: any[] = []

    var fullDisplayDataSet = [{
      label: "Price",
      data: historyOfProp,
      backgroundColor: 'blue',
      showLine: true
    }]

    var max: number = 0
    var min: number = 0
    var count: number = 0
    historyOfProp.forEach(e => {
      if (count == 0) {
        min = e
        max = e
        count++
      }
      if (e > max) {
        max = e
      }
      if (e < min) {
        min = e
      }
    })

    if (marketKey == 'h2h') {
      min = min - 10
      max = max + 10
    }
    else if (marketKey == 'spreads') {
      min = min - 1
      max = max + 1
    }
    console.log(this.listOfTeamsAndPropsForCharts[teamIndex][index])
    let newName: string = this.listOfTeamsAndPropsForCharts[teamIndex][index]
    this.chartVariable = new Chart(newName, {

      type: 'line',

      data: {// values on X-Axis
        labels: finalLabel,
        datasets: fullDisplayDataSet,

      },
      options: {
        elements: {
          point: {
            radius: 3
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Points by Game'
          },


          annotation: {
            common: {
              drawTime: 'beforeDatasetsDraw'
            },
            annotations:
              annotation

          }
        },
        scales: {
          y: {
            min: min,
            max: max
          }
        },
        maintainAspectRatio: false,
        responsive: true
      }

    });

  }

  createChart2() {
    var historyOfProp: number[] = []


    var dataPoint: string[] = []
    var index = 1
    this.propHistory.forEach((e) => {
      historyOfProp.push(e.price)
      if (e.createdAt) {
        dataPoint.push(e.createdAt.toString())
      }

    })



    let finalLabel: string[] = []
    dataPoint.forEach(d => {
      finalLabel.push(reusedFunctions.convertDateToDateTime(d))
    })



    var annotation: any[] = []

    var fullDisplayDataSet = [{
      label: "Price",
      data: historyOfProp,
      backgroundColor: 'blue',
      showLine: true
    }]

    var max: number = 0
    var min: number = 0
    var count: number = 0
    historyOfProp.forEach(e => {
      if (count == 0) {
        min = e
        max = e
        count++
      }
      if (e > max) {
        max = e
      }
      if (e < min) {
        min = e
      }
    })


    min = min - 10
    max = max + 10

    this.chart2 = new Chart("lineChart2", {

      type: 'line',

      data: {// values on X-Axis
        labels: finalLabel,
        datasets: fullDisplayDataSet,

      },
      options: {
        elements: {
          point: {
            radius: 3
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Points by Game'
          },


          annotation: {
            common: {
              drawTime: 'beforeDatasetsDraw'
            },
            annotations:
              annotation

          }
        },
        scales: {
          y: {
            min: min,
            max: max
          }
        },
        maintainAspectRatio: false,
        responsive: true
      }

    });
  }

  onChartClose() {
    this.dialog.closeAll()
    this.chart.destroy()
    this.chart2.destroy()
  }







  playerNameSpanishConvert(playerName: string): string {
    var name = playerName;
    if (name.includes("á")) {
      name = name.replaceAll("á", "a")
    }
    if (name.includes("é")) {
      name = name.replaceAll("é", "e")
    }
    if (name.includes("í")) {
      name = name.replaceAll("í", "i")
    }
    if (name.includes("ñ")) {
      name = name.replaceAll("ñ", "n")
    }
    if (name.includes("ó")) {
      name = name.replaceAll("ó", "o")
    }
    if (name.includes("ú")) {
      name = name.replaceAll("ú", "u")
    }


    return name
  }






  handleClick(event: Event){
    event.stopPropagation();
  }



  ngOnChanges() {
  }
  ngAfterContentInit() {
    this.selectedTab = 1;
  }
  ngAfterViewInit() {
  }
  ngOnInit() {
    this.allSportTeamInfo = []
    //Chart.register(annotationPlugin);
    this.initializeSport()
    this.getGames()
    //this.createBarChart();
    //ErrorEmailController.sendEmailError("This is the test email")
  }

  detailedStatsClicked(element: any) {
    this.router.navigate(["/playerStats/" + this.selectedSport + "/" + element.id])
  }

}

