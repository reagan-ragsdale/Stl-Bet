import { Component, HostListener, OnInit, TemplateRef, ViewChild, ViewEncapsulation, afterRender, inject } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


import { DbMlbPlayerInfo } from 'src/shared/dbTasks/DbMlbPlayerInfo';
import { MlbController } from 'src/shared/Controllers/MlbController';
import { DbGameBookData } from 'src/shared/dbTasks/DbGameBookData';
import { SportsBookController } from 'src/shared/Controllers/SportsBookController';
import { DbPlayerPropData } from 'src/shared/dbTasks/DbPlayerPropData';
import { PlayerPropController } from 'src/shared/Controllers/PlayerPropController';
import { DbNhlPlayerInfo } from 'src/shared/dbTasks/DbNhlPlayerInfo';
import { NhlPlayerInfoController } from 'src/shared/Controllers/NhlPlayerInfoController';
import { DbNhlPlayerGameStats } from 'src/shared/dbTasks/DbNhlPlayerGameStats';
import { NhlPlayerGameStatsController } from 'src/shared/Controllers/NhlPlayerGameStatsController';
import { nbaApiController } from '../ApiCalls/nbaApiCalls';
import { NbaPlayerInfoDb } from 'src/shared/dbTasks/NbaPlayerInfoDb';
import { NbaController } from 'src/shared/Controllers/NbaController';
import { DbNbaGameStats } from 'src/shared/dbTasks/DbNbaGameStats';
import { nhlApiController } from '../ApiCalls/nhlApiCalls';
import { draftKingsApiController } from '../ApiCalls/draftKingsApiCalls';
import annotationPlugin from 'chartjs-plugin-annotation';



import { ActivatedRoute, Route, Router } from '@angular/router';
import { DbNbaTeamLogos } from 'src/shared/dbTasks/DbNbaTeamLogos';
import { DbNbaTeamGameStats } from 'src/shared/dbTasks/DbNbaTeamGameStats';
import { reusedFunctions } from '../Services/reusedFunctions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MlbService } from '../Services/MlbService';
import { Chart } from 'chart.js';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TransforFromFullTeamNameToAbvr } from '../customPipes/transformFromFullTeamNameToAbvr.pip';
import { DbMlbTeamGameStats } from 'src/shared/dbTasks/DbMlbTeamGameStats';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';
import { filter } from 'compression';
import { DBMlbPlayerGameStats } from '../../shared/dbTasks/DbMlbPlayerGameStats';
import { PlayerInfoController } from '../../shared/Controllers/PlayerInfoController';
import { DbPlayerInfo } from '../../shared/dbTasks/DbPlayerInfo';
import { DbTeamInfo } from '../../shared/dbTasks/DBTeamInfo';
import { TeamInfoController } from '../../shared/Controllers/TeamInfoController';
import { emailer } from '../../server/emailService';

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

  playerInfoTemp: DbMlbPlayerInfo[] = []
  playerInfoFinal: DbMlbPlayerInfo[] = []
  sportsBookData: DbGameBookData[] = []
  sportsBookDataFinal: DbGameBookData[] = []
  //playerPropData: DbPlayerPropData[] = []
  //playerPropDataFinal: DbPlayerPropData[] = []
  nhlPlayerInfo: DbNhlPlayerInfo[] = []
  nhlPlayerInfoFinal: DbNhlPlayerInfo[] = []
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
    if (this.selectedGame == '') {
      this.selectedSportGames = await SportsBookController.loadAllBookDataBySportAndMaxBookSeq(this.selectedSport)
      var distinctGames = this.selectedSportGames.map(game => game.bookId).filter((value, index, array) => array.indexOf(value) === index)
      distinctGames.forEach(book => {
        let allOfBook = this.selectedSportGames.filter(e => e.bookId == book)
        var distinctTeams = allOfBook.map(team => team.teamName).filter((value, index, array) => array.indexOf(value) === index)
        let teamArray: any[] = []
        distinctTeams.forEach(team => {
          let allOfTeam = allOfBook.filter(e => e.teamName == team)
          console.log(allOfTeam)
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
      this.selectedSportGames = await SportsBookController.loadAllBookDataBySportAndMaxBookSeq(this.selectedSport)
      var distinctGames = this.selectedSportGames.map(game => game.bookId).filter((value, index, array) => array.indexOf(value) === index)
      distinctGames.forEach(book => {
        let allOfBook = this.selectedSportGames.filter(e => e.bookId == book)
        var distinctTeams = allOfBook.map(team => team.teamName).filter((value, index, array) => array.indexOf(value) === index)
        let teamArray: any[] = []
        distinctTeams.forEach(team => {
          let allOfTeam = allOfBook.filter(e => e.teamName == team)
          console.log(allOfTeam)
          teamArray.push(allOfTeam)
        })
        teamArray[0].selected = false;
        this.selectedSportGamesFinal.push(teamArray)
      })
      let currentGame = this.selectedSportGamesFinal.filter(e => e[0][0].bookId == this.selectedGame)
      currentGame[0][0].selected = true;

    }
    await this.onGameClick(this.selectedGame)
  }
 
  async onGameClick(game: string) {
    this.selectedGame = game;
    
    this.router.navigate([`/props/${this.selectedSport}/${this.selectedGame}`])
    this.selectedSportGamesFinal.forEach(e => e[0].selected = false)
    let selectedGameClicked = this.selectedSportGamesFinal.filter(e => e[0][0].bookId == this.selectedGame)
    selectedGameClicked[0][0].selected = true


    this.playerPropsClicked = false;
    this.gamePropsClicked = true;
    this.displayProp();


  }





  
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

  listOfTeams: DbTeamInfo[] = []
  public teamPropFinnal: any = []
  public selectedTotalAwayProp: number = 0
  public selectedTotalHomeProp: number = 0
  async displayProp() {
    try{
      PropScreenComponent.sendEmail("Hello this is a test");
    }
    catch(error:any){
      console.log("here in prop")
      console.log(error.message)
    }
    
    this.teamPropIsLoading = true
    this.teamPropFinnal = []
    const tempProp = this.selectedSportGames.filter((x) => x.bookId == this.selectedGame);
    var name1 = '';
    this.team1GameStats = []
    this.team2GameStats = []
    this.team1GameStatsReversed = []
    this.team2GameStatsReversed = []



    var team1 = tempProp.filter((e) => e.teamName == e.homeTeam)
    var team2 = tempProp.filter((e) => e.teamName == e.awayTeam)
    let team1Temp = team1
    let team2Temp = team2
    var overUnders = tempProp.filter(e => e.teamName == "Over" || e.teamName == "Under")

    
    var team1Totals = team1Temp.filter(e => e.marketKey.toString().includes('team_totals'))
    var team2Totals = team2Temp.filter(e => e.marketKey.toString().includes('team_totals'))
    

    team1Temp = team1Temp.filter(e => e.marketKey != 'team_totals Over' && e.marketKey != 'team_totals Under')
    team2Temp = team2Temp.filter(e => e.marketKey != 'team_totals Over' && e.marketKey != 'team_totals Under')
    
    team1Temp.push(overUnders)
    team2Temp.push(overUnders)

    team1Temp.push(team1Totals)
    team2Temp.push(team2Totals)
    const listOfBets: string[] = ['h2h', 'spreads', 'totals', 'h2h_1st_3_innings', 'h2h_1st_5_innings', 'h2h_1st_7_innings', "team_totals Over"]
    let team1Final = []
    let team2Final = []
    for (let bet of listOfBets) {
      var filteredBet = []
      filteredBet = team1Temp.filter(e => {
        if (e.length > 1) {
          if (e[0].marketKey == bet || e[1].marketKey == bet) {
            
            return e
          }
        }
        else {
          return e.marketKey == bet
        }
      })

      if (filteredBet.length > 0) {
        team1Final.push(filteredBet)
      }

      filteredBet = team2Temp.filter(e => {
        if (e.length > 1) {
          if (e[0].marketKey == bet) {
            return e
          }
        }
        else {
          return e.marketKey == bet
        }
      })

      if (filteredBet.length > 0) {
        team2Final.push(filteredBet)
      }
    }

    this.teamPropFinnal.push(team2Final, team1Final)





    if (this.selectedSport == "NBA") {
      this.team1GameStats = await NbaController.nbaLoadTeamGameStatsByTeamIdAndSeason(reusedFunctions.arrayOfNBATeams[reusedFunctions.addUnderScoreToName(team1[0].teamName)], 2023)
      this.team2GameStats = await NbaController.nbaLoadTeamGameStatsByTeamIdAndSeason(reusedFunctions.arrayOfNBATeams[reusedFunctions.addUnderScoreToName(team2[0].teamName)], 2023)
    }
    else if (this.selectedSport == "MLB") {
      this.team1GameStats = await MlbController.mlbGetTeamGameStatsByTeamIdAndSeason(MlbService.mlbTeamIds[MlbService.mlbTeamNameToAbvr[team1[0].teamName]], 2024)
      this.team2GameStats = await MlbController.mlbGetTeamGameStatsByTeamIdAndSeason(MlbService.mlbTeamIds[MlbService.mlbTeamNameToAbvr[team2[0].teamName]], 2024)
      this.team1GameStatsReversed = JSON.parse(JSON.stringify(this.team1GameStats))
      this.team1GameStatsReversed = this.team1GameStatsReversed.reverse()
      this.team2GameStatsReversed = JSON.parse(JSON.stringify(this.team2GameStats))
      this.team2GameStatsReversed = this.team2GameStatsReversed.reverse()
      this.awayAlternateSpreadstemp = team2.filter(e => e.marketKey == "alternate_spreads")
      this.homeAlternateSpreadstemp = team1.filter(e => e.marketKey == "alternate_spreads")


    }
    else if (this.selectedSport == "NHL") {

    }

    else if (this.selectedSport == "NFL") {

    }

    this.playerPropData = await PlayerPropController.loadPlayerPropData(this.selectedSport, this.selectedGame)
    let uniquePlayerProps = this.playerPropData.map(e => e.marketKey).filter((value, index, array) => array.indexOf(value) === index)

    this.playerPropDataFinal = [];
    for (let prop of uniquePlayerProps) {
      let propSpecificArray: any[] = []
      let uniquePlayerNames = this.playerPropData.filter(e => e.marketKey == prop).map(e => e.playerName).filter((value, index, array) => array.indexOf(value) === index)

      for (let player of uniquePlayerNames) {
        let filteredPlayer = this.playerPropData.filter(e => e.playerName == player && e.marketKey == prop)

        propSpecificArray = propSpecificArray.concat(filteredPlayer)

      }

      this.playerPropDataFinal.push(propSpecificArray)
    }

    this.listOfTeams = await TeamInfoController.getAllTeamInfo(this.selectedSport)
    name1 = team1[0].teamName;
    
    let abvr = ''
    if (this.selectedSport == "MLB") {
      abvr = MlbService.mlbTeamNameToAbvr[name1]
    }
    this.displayPropHtml1 = ({ name: name1, abvr: abvr, commenceTime: reusedFunctions.convertTimestampToTime(team1[0].commenceTime.toString()) });

    name1 = team2[0].teamName;
    
    if (this.selectedSport == "MLB") {
      abvr = MlbService.mlbTeamNameToAbvr[name1]
    }
    
    this.displayPropHtml2 = ({ name: name1, abvr: abvr, commenceTime: reusedFunctions.convertTimestampToTime(team2[0].commenceTime.toString()) });
    

    this.computeTeamsGameStats(this.team1GameStats, this.team2GameStats)
    this.setValuesToTeamPropFinal()
    await this.loadPlayerStatData(MlbService.mlbTeamIds[MlbService.mlbTeamNameToAbvr[team1[0].teamName]], MlbService.mlbTeamIds[MlbService.mlbTeamNameToAbvr[team2[0].teamName]])
    
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

  onTeamClick(teamName: string){
    let teamId = this.listOfTeams.filter(e => e.teamNameAbvr == teamName)[0].teamId
    this.router.navigate(["/teamStats/" + this.selectedSport + "/" + teamId])
  }

  setValuesToTeamPropFinal() {
   this.arrayOfTeamBets = []
    for (let team of this.teamPropFinnal) {
      for (let prop of team) {
        let returnProp = {}
        if (prop[0].length > 1) {
          returnProp = this.getTeamStats(prop[0][0], team[0][0].teamName)
        }
        else {

          returnProp = this.getTeamStats(prop[0], team[0][0].teamName)
        }
        prop.propVariables = returnProp
      }
    }
    this.getTeamBestBets()
    
  }

  
  playerPropIsLoading: boolean = false;
  playerPropDataFinalNew: any[] = []
  async loadPlayerStatData(team1: number, team2: number) {
    this.playerPropIsLoading = true;
    this.playerPropDataFinalNew = [];
    this.arrayOfPlayerBets = [];
    this.playerStatsFinal = await MlbController.mlbGetPlayerGameStatsByTeamAndSeason([team1, team2], 2024)
    //this.playerpropDataFinal is a 3 length array with 2 props for each player within it
    //console.log(this.playerPropDataFinal)
    //for each prop type ex: batter hits
    for (let prop of this.playerPropDataFinal) {

      let playerPropNew: any[] = []
      let propNew: any[] = []
      let playerAway: any = []
      let playerHome: any = []
      //gets the unique players in that prop
      let specifcPlayers = prop.map((e: { playerName: any; }) => e.playerName).filter((value: any, index: any, array: string | any[]) => array.indexOf(value) === index)
      //for each player in that prop
      for (let player of specifcPlayers) {
        //need to check get to see what team that player is on
        try {
          let playerFiltered = this.playerStatsFinal.filter(f => f.playerName == this.playerNameSpanishConvert(player))
          if (playerFiltered[playerFiltered.length - 1].teamName == this.team2GameStats[0].teamName) {
            let playerSpecific = prop.filter((g: { playerName: any; }) => g.playerName == player)
            //console.log(playerSpecific)
            if (playerSpecific[0].description == "Over") {
              playerSpecific = playerSpecific.reverse()
            }
            playerSpecific[0].propVariables = this.getPlayerStats(playerSpecific[0])
            playerAway.push(playerSpecific)
          }
          else {
            let playerSpecific = prop.filter((g: { playerName: any; }) => g.playerName == this.playerNameSpanishConvert(player))
            if (playerSpecific[0].description == "Over") {
              playerSpecific = playerSpecific.reverse()
            }
            playerSpecific[0].propVariables = this.getPlayerStats(playerSpecific[0])
            playerHome.push(playerSpecific)
          }
          
        } catch (error: any) {
          console.log(error.message)
          console.log(player)
        }
        

      }
      
      playerAway.teamName = this.displayPropHtml2.name
      playerHome.teamName = this.displayPropHtml1.name
      playerPropNew.push(playerAway, playerHome)
      //propNew.push(playerPropNew)
      this.playerPropDataFinalNew.push(playerPropNew)




    }
    this.getPlayerBestBets()

  }
  public playerStatObj: any = {}
  public arrayOfPlayerBets: any[] = [];
  getPlayerStats(player: any) {

    try {
      var playerStats: DBMlbPlayerGameStats[] = this.playerStatsFinal.filter(e => e.playerName == this.playerNameSpanishConvert(player.playerName))
      let playerStatsReversed: DBMlbPlayerGameStats[] = JSON.parse(JSON.stringify(playerStats))
      let playerName = playerStats[0].playerName
      let marketKey = player.marketKey
      let propPoint = player.point
      let propPrice = player.price
      let teamName = ''
      let teamAgainstName = ''
      let homeAway = 'away'
      if (playerStats[0].teamName == reusedFunctions.teamNamesToAbvr[player.homeTeam]) {
        homeAway = 'home'
        teamName = reusedFunctions.teamNamesToAbvr[player.homeTeam]
        teamAgainstName = reusedFunctions.teamNamesToAbvr[player.awayTeam]
      }
      else {
        teamName = reusedFunctions.teamNamesToAbvr[player.awayTeam]
        teamAgainstName = reusedFunctions.teamNamesToAbvr[player.homeTeam]
      }
      let totalOverall = playerStats.length
      var totalHomeAway = 0
      var totalTeam = 0
      var overOverall = 0
      var overHomeAway = 0
      var averageOverall = 0
      var averageHomeAway = 0
      var averageTeam = 0
      var highOverall = 0
      var lowOverall = 100
      var highHomeAway = 0
      var lowHomeAway = 100
      var highTeam = 0
      var lowTeam = 100
      let overTeam = 0
      let tableOverall: any[] = []
      let tableHomeAway: any[] = []
      let tableTeam: any[] = []
      let overUnder = false

      if (this.selectedSport == 'MLB') {
        if (player.marketKey == 'batter_hits') {
          overOverall = playerStats.filter(e => {
            if (e.batterHits > highOverall) {
              highOverall = e.batterHits
            }
            if (e.batterHits < lowOverall) {
              lowOverall = e.batterHits
            }
            return e.batterHits < player.point
          }).length
          overHomeAway = playerStats.filter(e => {
            if (e.batterHits > highHomeAway && (reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway)) {
              highHomeAway = e.batterHits
            }
            if (e.batterHits < lowHomeAway && (reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway)) {
              lowHomeAway = e.batterHits
            }
            return e.batterHits < player.point && reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway
          }).length
          overTeam = playerStats.filter(e => {
            if (e.batterHits > highTeam && e.teamAgainstName == teamAgainstName) {
              highTeam = e.batterHits
            }
            if (e.batterHits < lowTeam && e.teamAgainstName == teamAgainstName) {
              lowTeam = e.batterHits
            }
            return e.batterHits < player.point && e.teamAgainstName == teamAgainstName
          }).length
          let totalSum = 0
          playerStats.forEach(e => {
            totalSum += e.batterHits
          })
          averageOverall = totalSum / totalOverall

          totalSum = 0
          let homeAwayGames = playerStats.filter(e => {
            return reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway
          })
          homeAwayGames.forEach(f => {
            totalSum += f.batterHits
            totalHomeAway++
          })
          averageHomeAway = totalSum / totalHomeAway
          totalSum = 0
          let teamGames = playerStats.filter(e => {
            return e.teamAgainstName == teamAgainstName
          })
          teamGames.forEach(f => {
            totalSum += f.batterHits
            totalTeam++
          })
          if (totalTeam == 0) {
            averageTeam = 0
          }
          else {
            averageTeam = totalSum / totalTeam
          }


          playerStatsReversed.forEach(e => {
            tableOverall.push({
              teamAgainstName: e.teamAgainstName,
              gameDate: e.gameDate,
              propNumber: e.batterHits,
              homeAway: reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName),
              propName: 'H'

            })
            if (reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName) == homeAway) {
              tableHomeAway.push({
                teamAgainstName: e.teamAgainstName,
                gameDate: e.gameDate,
                propNumber: e.batterHits,
                homeAway: reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName),
                propName: 'H'
              })
            }
            if (e.teamAgainstName == teamAgainstName) {
              tableTeam.push({
                teamAgainstName: e.teamAgainstName,
                gameDate: e.gameDate,
                propNumber: e.batterHits,
                homeAway: reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName),
                propName: 'H'
              })
            }


          })


        }
        else if (player.marketKey == 'batter_home_runs') {
          overOverall = playerStats.filter(e => {
            if (e.batterHomeRuns > highOverall) {
              highOverall = e.batterHomeRuns
            }
            if (e.batterHomeRuns < lowOverall) {
              lowOverall = e.batterHomeRuns
            }
            return e.batterHomeRuns < player.point
          }).length
          overHomeAway = playerStats.filter(e => {
            if (e.batterHomeRuns > highHomeAway && (reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway)) {
              highHomeAway = e.batterHomeRuns
            }
            if (e.batterHomeRuns < lowHomeAway && (reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway)) {
              lowHomeAway = e.batterHomeRuns
            }
            return e.batterHomeRuns < player.point && reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway
          }).length
          overTeam = playerStats.filter(e => {
            if (e.batterHomeRuns > highTeam && e.teamAgainstName == teamAgainstName) {
              highTeam = e.batterHomeRuns
            }
            if (e.batterHomeRuns < lowTeam && e.teamAgainstName == teamAgainstName) {
              lowTeam = e.batterHomeRuns
            }
            return e.batterHomeRuns < player.point && e.teamAgainstName == teamAgainstName
          }).length

          let totalSum = 0
          playerStats.forEach(e => {
            totalSum += e.batterHomeRuns
          })
          averageOverall = totalSum / totalOverall
          totalSum = 0
          let homeAwayGames = playerStats.filter(e => {
            return reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway
          })
          homeAwayGames.forEach(f => {
            totalSum += f.batterHomeRuns
            totalHomeAway++
          })
          averageHomeAway = totalSum / totalHomeAway


          totalSum = 0
          let teamGames = playerStats.filter(e => {
            return e.teamAgainstName == teamAgainstName
          })
          teamGames.forEach(f => {
            totalSum += f.batterHomeRuns
            totalTeam++
          })
          if (totalTeam == 0) {
            averageTeam = 0
          }
          else {
            averageTeam = totalSum / totalTeam
          }


          playerStatsReversed.forEach(e => {
            tableOverall.push({
              teamAgainstName: e.teamAgainstName,
              gameDate: e.gameDate,
              propNumber: e.batterHomeRuns,
              homeAway: reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName),
              propName: 'HR'

            })
            if (reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName) == homeAway) {
              tableHomeAway.push({
                teamAgainstName: e.teamAgainstName,
                gameDate: e.gameDate,
                propNumber: e.batterHomeRuns,
                homeAway: reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName),
                propName: 'HR'
              })
            }
            if (e.teamAgainstName == teamAgainstName) {
              tableTeam.push({
                teamAgainstName: e.teamAgainstName,
                gameDate: e.gameDate,
                propNumber: e.batterHomeRuns,
                homeAway: reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName),
                propName: 'HR'
              })
            }


          })


        }
        else if (player.marketKey == 'batter_total_bases') {
          overOverall = playerStats.filter(e => {
            if (e.batterTotalBases > highOverall) {
              highOverall = e.batterTotalBases
            }
            if (e.batterTotalBases < lowOverall) {
              lowOverall = e.batterTotalBases
            }
            return e.batterTotalBases < player.point
          }).length
          overHomeAway = playerStats.filter(e => {
            if (e.batterTotalBases > highHomeAway && (reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway)) {
              highHomeAway = e.batterTotalBases
            }
            if (e.batterTotalBases < lowHomeAway && (reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway)) {
              lowHomeAway = e.batterTotalBases
            }
            return e.batterTotalBases < player.point && reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway
          }).length
          overTeam = playerStats.filter(e => {
            if (e.batterTotalBases > highTeam && e.teamAgainstName == teamAgainstName) {
              highTeam = e.batterTotalBases
            }
            if (e.batterTotalBases < lowTeam && e.teamAgainstName == teamAgainstName) {
              lowTeam = e.batterTotalBases
            }
            return e.batterTotalBases < player.point && e.teamAgainstName == teamAgainstName
          }).length

          let totalSum = 0
          playerStats.forEach(e => {
            totalSum += e.batterTotalBases
          })
          if (totalSum == 0) {
            averageOverall = 0
          }
          else {
            averageOverall = totalSum / totalOverall
          }

          totalSum = 0
          let homeAwayGames = playerStats.filter(e => {
            return reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway
          })
          homeAwayGames.forEach(f => {
            totalSum += f.batterTotalBases
            totalHomeAway++
          })
          if (totalHomeAway == 0) {
            averageHomeAway = 0
          }
          else {
            averageHomeAway = totalSum / totalHomeAway
          }

          totalSum = 0
          let teamGames = playerStats.filter(e => {

            return e.teamAgainstName == teamAgainstName
          })
          teamGames.forEach(f => {
            totalSum += f.batterTotalBases
            totalTeam++
          })
          if (totalTeam == 0) {
            averageTeam = 0
          }
          else {
            averageTeam = totalSum / totalTeam
          }



          playerStatsReversed.forEach(e => {
            tableOverall.push({
              teamAgainstName: e.teamAgainstName,
              gameDate: e.gameDate,
              propNumber: e.batterTotalBases,
              homeAway: reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName),
              propName: 'TB'

            })
            if (reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName) == homeAway) {
              tableHomeAway.push({
                teamAgainstName: e.teamAgainstName,
                gameDate: e.gameDate,
                propNumber: e.batterTotalBases,
                homeAway: reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName),
                propName: 'TB'
              })
            }
            if (e.teamAgainstName == teamAgainstName) {
              tableTeam.push({
                teamAgainstName: e.teamAgainstName,
                gameDate: e.gameDate,
                propNumber: e.batterTotalBases,
                homeAway: reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName),
                propName: 'TB'
              })
            }


          })
        }
        else if (player.marketKey == 'batter_runs_scored') {
          overOverall = playerStats.filter(e => {
            if (e.batterRunsScored > highOverall) {
              highOverall = e.batterRunsScored
            }
            if (e.batterRunsScored < lowOverall) {
              lowOverall = e.batterRunsScored
            }
            return e.batterRunsScored < player.point
          }).length
          overHomeAway = playerStats.filter(e => {
            if (e.batterRunsScored > highHomeAway && (reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway)) {
              highHomeAway = e.batterRunsScored
            }
            if (e.batterRunsScored < lowHomeAway && (reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway)) {
              lowHomeAway = e.batterRunsScored
            }
            return e.batterRunsScored < player.point && reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway
          }).length
          overTeam = playerStats.filter(e => {
            if (e.batterRunsScored > highTeam && e.teamAgainstName == teamAgainstName) {
              highTeam = e.batterRunsScored
            }
            if (e.batterRunsScored < lowTeam && e.teamAgainstName == teamAgainstName) {
              lowTeam = e.batterRunsScored
            }
            return e.batterRunsScored < player.point && e.teamAgainstName == teamAgainstName
          }).length

          let totalSum = 0
          playerStats.forEach(e => {
            totalSum += e.batterRunsScored
          })
          if (totalSum == 0) {
            averageOverall = 0
          }
          else {
            averageOverall = totalSum / totalOverall
          }

          totalSum = 0
          let homeAwayGames = playerStats.filter(e => {
            return reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway
          })
          homeAwayGames.forEach(f => {
            totalSum += f.batterRunsScored
            totalHomeAway++
          })
          if (totalHomeAway == 0) {
            averageHomeAway = 0
          }
          else {
            averageHomeAway = totalSum / totalHomeAway
          }

          totalSum = 0
          let teamGames = playerStats.filter(e => {

            return e.teamAgainstName == teamAgainstName
          })
          teamGames.forEach(f => {
            totalSum += f.batterRunsScored
            totalTeam++
          })
          if (totalTeam == 0) {
            averageTeam = 0
          }
          else {
            averageTeam = totalSum / totalTeam
          }



          playerStatsReversed.forEach(e => {
            tableOverall.push({
              teamAgainstName: e.teamAgainstName,
              gameDate: e.gameDate,
              propNumber: e.batterRunsScored,
              homeAway: reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName),
              propName: 'R'

            })
            if (reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName) == homeAway) {
              tableHomeAway.push({
                teamAgainstName: e.teamAgainstName,
                gameDate: e.gameDate,
                propNumber: e.batterRunsScored,
                homeAway: reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName),
                propName: 'R'
              })
            }
            if (e.teamAgainstName == teamAgainstName) {
              tableTeam.push({
                teamAgainstName: e.teamAgainstName,
                gameDate: e.gameDate,
                propNumber: e.batterRunsScored,
                homeAway: reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName),
                propName: 'R'
              })
            }


          })
        }
        else if (player.marketKey == 'batter_rbis') {
          overOverall = playerStats.filter(e => {
            if (e.batterRbis > highOverall) {
              highOverall = e.batterRbis
            }
            if (e.batterRbis < lowOverall) {
              lowOverall = e.batterRbis
            }
            return e.batterRbis < player.point
          }).length
          overHomeAway = playerStats.filter(e => {
            if (e.batterRbis > highHomeAway && (reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway)) {
              highHomeAway = e.batterRbis
            }
            if (e.batterRbis < lowHomeAway && (reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway)) {
              lowHomeAway = e.batterRbis
            }
            return e.batterRbis < player.point && reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway
          }).length
          overTeam = playerStats.filter(e => {
            if (e.batterRbis > highTeam && e.teamAgainstName == teamAgainstName) {
              highTeam = e.batterRbis
            }
            if (e.batterRbis < lowTeam && e.teamAgainstName == teamAgainstName) {
              lowTeam = e.batterRbis
            }
            return e.batterRbis < player.point && e.teamAgainstName == teamAgainstName
          }).length

          let totalSum = 0
          playerStats.forEach(e => {
            totalSum += e.batterRbis
          })
          if (totalSum == 0) {
            averageOverall = 0
          }
          else {
            averageOverall = totalSum / totalOverall
          }

          totalSum = 0
          let homeAwayGames = playerStats.filter(e => {
            return reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway
          })
          homeAwayGames.forEach(f => {
            totalSum += f.batterRbis
            totalHomeAway++
          })
          if (totalHomeAway == 0) {
            averageHomeAway = 0
          }
          else {
            averageHomeAway = totalSum / totalHomeAway
          }

          totalSum = 0
          let teamGames = playerStats.filter(e => {

            return e.teamAgainstName == teamAgainstName
          })
          teamGames.forEach(f => {
            totalSum += f.batterRbis
            totalTeam++
          })
          if (totalTeam == 0) {
            averageTeam = 0
          }
          else {
            averageTeam = totalSum / totalTeam
          }



          playerStatsReversed.forEach(e => {
            tableOverall.push({
              teamAgainstName: e.teamAgainstName,
              gameDate: e.gameDate,
              propNumber: e.batterRbis,
              homeAway: reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName),
              propName: 'RBI'

            })
            if (reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName) == homeAway) {
              tableHomeAway.push({
                teamAgainstName: e.teamAgainstName,
                gameDate: e.gameDate,
                propNumber: e.batterRbis,
                homeAway: reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName),
                propName: 'RBI'
              })
            }
            if (e.teamAgainstName == teamAgainstName) {
              tableTeam.push({
                teamAgainstName: e.teamAgainstName,
                gameDate: e.gameDate,
                propNumber: e.batterRbis,
                homeAway: reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName),
                propName: 'RBI'
              })
            }


          })
        }
        else if (player.marketKey == 'batter_hits_runs_rbis') {
          overOverall = playerStats.filter(e => {
            if (e.batterHitsRunsRbis > highOverall) {
              highOverall = e.batterHitsRunsRbis
            }
            if (e.batterHitsRunsRbis < lowOverall) {
              lowOverall = e.batterHitsRunsRbis
            }
            return e.batterHitsRunsRbis < player.point
          }).length
          overHomeAway = playerStats.filter(e => {
            if (e.batterHitsRunsRbis > highHomeAway && (reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway)) {
              highHomeAway = e.batterHitsRunsRbis
            }
            if (e.batterHitsRunsRbis < lowHomeAway && (reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway)) {
              lowHomeAway = e.batterHitsRunsRbis
            }
            return e.batterHitsRunsRbis < player.point && reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway
          }).length
          overTeam = playerStats.filter(e => {
            if (e.batterHitsRunsRbis > highTeam && e.teamAgainstName == teamAgainstName) {
              highTeam = e.batterHitsRunsRbis
            }
            if (e.batterHitsRunsRbis < lowTeam && e.teamAgainstName == teamAgainstName) {
              lowTeam = e.batterHitsRunsRbis
            }
            return e.batterHitsRunsRbis < player.point && e.teamAgainstName == teamAgainstName
          }).length

          let totalSum = 0
          playerStats.forEach(e => {
            totalSum += e.batterHitsRunsRbis
          })
          if (totalSum == 0) {
            averageOverall = 0
          }
          else {
            averageOverall = totalSum / totalOverall
          }

          totalSum = 0
          let homeAwayGames = playerStats.filter(e => {
            return reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway
          })
          homeAwayGames.forEach(f => {
            totalSum += f.batterHitsRunsRbis
            totalHomeAway++
          })
          if (totalHomeAway == 0) {
            averageHomeAway = 0
          }
          else {
            averageHomeAway = totalSum / totalHomeAway
          }

          totalSum = 0
          let teamGames = playerStats.filter(e => {

            return e.teamAgainstName == teamAgainstName
          })
          teamGames.forEach(f => {
            totalSum += f.batterHitsRunsRbis
            totalTeam++
          })
          if (totalTeam == 0) {
            averageTeam = 0
          }
          else {
            averageTeam = totalSum / totalTeam
          }



          playerStatsReversed.forEach(e => {
            tableOverall.push({
              teamAgainstName: e.teamAgainstName,
              gameDate: e.gameDate,
              propNumber: e.batterHitsRunsRbis,
              homeAway: reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName),
              propName: 'H+R+RBI'

            })
            if (reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName) == homeAway) {
              tableHomeAway.push({
                teamAgainstName: e.teamAgainstName,
                gameDate: e.gameDate,
                propNumber: e.batterHitsRunsRbis,
                homeAway: reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName),
                propName: 'H+R+RBI'
              })
            }
            if (e.teamAgainstName == teamAgainstName) {
              tableTeam.push({
                teamAgainstName: e.teamAgainstName,
                gameDate: e.gameDate,
                propNumber: e.batterHitsRunsRbis,
                homeAway: reusedFunctions.getHomeAwayFromGameId(e.gameId, e.teamName),
                propName: 'H+R+RBI'
              })
            }


          })
        }

      }

      this.playerStatObj = {
        totalOverall: totalOverall,
        totalHomeAway: totalHomeAway,
        totalTeam: totalTeam,
        overOverall: overOverall,
        overHomeAway: overHomeAway,
        overTeam: overTeam,
        averageOverall: averageOverall,
        averageHomeAway: averageHomeAway,
        averageTeam: averageTeam,
        homeAway: homeAway,
        highOverall: highOverall,
        highHomeAway: highHomeAway,
        highTeam: highTeam,
        lowOverall: lowOverall == 100 ? 0 : lowOverall,
        lowHomeAway: lowHomeAway == 100 ? 0 : lowHomeAway,
        lowTeam: lowTeam == 100 ? 0 : lowTeam,
        tableOverall: tableOverall.slice(0, 10),
        tableHomeAway: tableHomeAway.slice(0, 10),
        tableTeam: tableTeam.slice(0, 10),
        overUnder: overUnder,
        teamAgainstName: teamAgainstName,
        marketKey: marketKey,
        propPoint: propPoint,
        propPrice: propPrice,
        playerName : playerName,
        playerOrTeam: 'Player',
        teamName: teamName

      }


    } catch (error: any) {
      console.log(player.playerName)
      this.playerStatObj = {
        totalOverall: 0,
        totalHomeAway: 0,
        totalTeam: 0,
        overOverall: 0,
        overHomeAway: 0,
        overTeam: 0,
        averageOverall: 0,
        averageHomeAway: 0,
        averageTeam: 0,
        homeAway: 0,
        highOverall: 0,
        highHomeAway: 0,
        highTeam: 0,
        lowOverall: 0,
        lowHomeAway: 0,
        lowTeam: 0,
        tableOverall: [],
        tableHomeAway: [],
        tableTeam: [],
        overUnder: false,
        teamAgainstName: '',
        propType: '',
        propPoint: 0,
        propPrice: 0,
        playerName: '',
        playerOrTeam: '',
        teamName: ''
      }
    }

    this.arrayOfPlayerBets.push(this.playerStatObj)
    return this.playerStatObj







  }
  public returnObj: any = {}
  public count = 0
  public arrayOfTeamBets: any[] = [];
  getTeamStats(team: DbGameBookData, teamName: string) {

    try {
      let marketKey = team.marketKey
      let propType = this.getPropType(team.marketKey)
      let propPoint = team.point
      let propPrice = team.price
      let homeAway = teamName == team.homeTeam ? 'Home' : 'Away'
      let teamAgainstName = teamName == team.homeTeam ? MlbService.mlbTeamNameToAbvr[team.awayTeam] : MlbService.mlbTeamNameToAbvr[team.homeTeam]

      let teamGameStats: DbMlbTeamGameStats[] = MlbService.mlbTeamNameToAbvr[teamName] == this.team1GameStats[0].teamName ? this.team1GameStats : this.team2GameStats
      let teamGameStatsReversed: DbMlbTeamGameStats[] = MlbService.mlbTeamNameToAbvr[teamName] == this.team1GameStats[0].teamName ? this.team1GameStatsReversed : this.team2GameStatsReversed
      let teamAgainstStats = MlbService.mlbTeamNameToAbvr[teamName] == this.team1GameStats[0].teamName ? this.team2GameStats : this.team1GameStats
      
      let teamNameNew = MlbService.mlbTeamNameToAbvr[teamName]
      
      var finalTeam: any = {}

      finalTeam.homeAway = homeAway
      finalTeam.propType = propType
      finalTeam.totalGames = teamGameStats.length
      finalTeam.totalGamesHomeAway = teamGameStats.filter(e => e.homeOrAway == homeAway).length
      finalTeam.totalGamesTeam = teamGameStats.filter(e => e.teamAgainstName == teamAgainstName).length
      finalTeam.teamAgainstTotalGames = teamAgainstStats.length
      finalTeam.teamAgainstGamesHomeAway = teamAgainstStats.filter(e => e.homeOrAway != homeAway).length
      finalTeam.teamAgainstGamesTeam = teamAgainstStats.filter(e => e.teamAgainstName == MlbService.mlbTeamNameToAbvr[teamName]).length
      finalTeam.overUnder = false

      finalTeam.averageOverall = 0
      finalTeam.averageHomeAway = 0
      finalTeam.averageTeam = 0;
      finalTeam.highOverall = 0;
      finalTeam.highHomeAway = 0;
      finalTeam.highTeam = 0;
      finalTeam.lowOverall = 0;
      finalTeam.lowHomeAway = 0;
      finalTeam.lowTeam = 0;

      let tableTemp: any[] = []
      teamGameStatsReversed.forEach(e => {
        tableTemp.push({
          teamAgainstName: e.teamAgainstName,
          gameDate: e.gameDate,
          pointsScoredOverall: e.pointsScoredOverall,
          pointsAllowedOverall: e.pointsAllowedOverall,
          homeAway: e.homeOrAway
        })
      })
      finalTeam.tableOverall = tableTemp

      tableTemp = []
      teamGameStatsReversed.forEach(e => {
        if (e.homeOrAway == homeAway) {
          tableTemp.push({
            teamAgainstName: e.teamAgainstName,
            gameDate: e.gameDate,
            pointsScoredOverall: e.pointsScoredOverall,
            pointsAllowedOverall: e.pointsAllowedOverall,
            homeAway: e.homeOrAway
          })
        }
      })
      finalTeam.tableHomeAway = tableTemp

      tableTemp = []
      teamGameStatsReversed.forEach(e => {
        if (e.teamAgainstName == teamAgainstName) {
          tableTemp.push({
            teamAgainstName: e.teamAgainstName,
            gameDate: e.gameDate,
            pointsScoredOverall: e.pointsScoredOverall,
            pointsAllowedOverall: e.pointsAllowedOverall,
            homeAway: e.homeOrAway
          })
        }
      })
      finalTeam.tableTeam = tableTemp


      if (propType == 'h2h') {
        //need to get record, chance of winning and weighted chance

        if (team.marketKey == 'h2h') {
          finalTeam.totalWins = teamGameStats.filter(e => e.result == 'W').length
          finalTeam.totalWinsHomeAway = teamGameStats.filter(e => e.result == 'W' && e.homeOrAway == homeAway).length
          finalTeam.totalWinsTeam = teamGameStats.filter(e => e.result == 'W' && e.teamAgainstName == teamAgainstName).length

          finalTeam.teamAgainstTotalWins = teamAgainstStats.filter(e => e.result == 'W').length
          finalTeam.teamAgainstWinsHomeAway = teamAgainstStats.filter(e => e.result == 'W' && e.homeOrAway != homeAway).length
          finalTeam.teamAgainstWinsTeam = teamAgainstStats.filter(e => e.result == 'W' && e.teamAgainstName == MlbService.mlbTeamNameToAbvr[teamName]).length


        }
        else if (team.marketKey == 'h2h_1st_3_innings') {
          finalTeam.totalWins = teamGameStats.filter(e => { return (e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning) > (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning) }).length
          finalTeam.totalWinsHomeAway = teamGameStats.filter(e => { return ((e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning) > (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning)) && e.homeOrAway == homeAway }).length
          finalTeam.totalWinsTeam = teamGameStats.filter(e => { return ((e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning) > (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning)) && e.teamAgainstName == teamAgainstName }).length

          finalTeam.teamAgainstTotalWins = teamAgainstStats.filter(e => { return (e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning) > (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning) }).length
          finalTeam.teamAgainstWinsHomeAway = teamAgainstStats.filter(e => { return ((e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning) > (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning)) && e.homeOrAway != homeAway }).length
          finalTeam.teamAgainstWinsTeam = teamAgainstStats.filter(e => { return ((e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning) > (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning)) && e.teamAgainstName == MlbService.mlbTeamNameToAbvr[teamName] }).length

          let tableTemp: any[] = []
          teamGameStatsReversed.forEach(e => {
            tableTemp.push({
              teamAgainstName: e.teamAgainstName,
              gameDate: e.gameDate,
              pointsScoredOverall: (e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning),
              pointsAllowedOverall: (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning),
              homeAway: e.homeOrAway
            })
          })
          finalTeam.tableOverall = tableTemp

          tableTemp = []
          teamGameStatsReversed.forEach(e => {
            if (e.homeOrAway == homeAway) {
              tableTemp.push({
                teamAgainstName: e.teamAgainstName,
                gameDate: e.gameDate,
                pointsScoredOverall: (e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning),
                pointsAllowedOverall: (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning),
                homeAway: e.homeOrAway
              })
            }
          })
          finalTeam.tableHomeAway = tableTemp

          tableTemp = []
          teamGameStatsReversed.forEach(e => {
            if (e.teamAgainstName == teamAgainstName) {
              tableTemp.push({
                teamAgainstName: e.teamAgainstName,
                gameDate: e.gameDate,
                pointsScoredOverall: (e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning),
                pointsAllowedOverall: (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning),
                homeAway: e.homeOrAway
              })
            }
          })
          finalTeam.tableTeam = tableTemp

        }
        else if (team.marketKey == 'h2h_1st_5_innings') {
          finalTeam.totalWins = teamGameStats.filter(e => { return (e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning + e.pointsScoredFourthInning + e.pointsScoredFifthInning) > (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning + e.pointsAllowedFourthInning + e.pointsAllowedFifthInning) }).length
          finalTeam.totalWinsHomeAway = teamGameStats.filter(e => { return ((e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning + e.pointsScoredFourthInning + e.pointsScoredFifthInning) > (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning + e.pointsAllowedFourthInning + e.pointsAllowedFifthInning)) && e.homeOrAway == homeAway }).length
          finalTeam.totalWinsTeam = teamGameStats.filter(e => { return ((e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning + e.pointsScoredFourthInning + e.pointsScoredFifthInning) > (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning + e.pointsScoredFourthInning + e.pointsAllowedFifthInning)) && e.teamAgainstName == teamAgainstName }).length

          finalTeam.teamAgainstTotalWins = teamAgainstStats.filter(e => { return (e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning + e.pointsScoredFourthInning + e.pointsScoredFifthInning) > (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning + e.pointsAllowedFourthInning + e.pointsAllowedFifthInning) }).length
          finalTeam.teamAgainstWinsHomeAway = teamAgainstStats.filter(e => { return ((e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning + e.pointsScoredFourthInning + e.pointsScoredFifthInning) > (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning + e.pointsAllowedFourthInning + e.pointsAllowedFifthInning)) && e.homeOrAway != homeAway }).length
          finalTeam.teamAgainstWinsTeam = teamAgainstStats.filter(e => { return ((e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning + e.pointsScoredFourthInning + e.pointsScoredFifthInning) > (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning + e.pointsAllowedFourthInning + e.pointsAllowedFifthInning)) && e.teamAgainstName == MlbService.mlbTeamNameToAbvr[teamName] }).length

          let tableTemp: any[] = []
          teamGameStatsReversed.forEach(e => {
            tableTemp.push({
              teamAgainstName: e.teamAgainstName,
              gameDate: e.gameDate,
              pointsScoredOverall: (e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning + e.pointsScoredFourthInning + e.pointsScoredFifthInning),
              pointsAllowedOverall: (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning + e.pointsAllowedFourthInning + e.pointsAllowedFifthInning),
              homeAway: e.homeOrAway
            })
          })
          finalTeam.tableOverall = tableTemp

          tableTemp = []
          teamGameStatsReversed.forEach(e => {
            if (e.homeOrAway == homeAway) {
              tableTemp.push({
                teamAgainstName: e.teamAgainstName,
                gameDate: e.gameDate,
                pointsScoredOverall: (e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning + e.pointsScoredFourthInning + e.pointsScoredFifthInning),
                pointsAllowedOverall: (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning + e.pointsAllowedFourthInning + e.pointsAllowedFifthInning),
                homeAway: e.homeOrAway
              })
            }
          })
          finalTeam.tableHomeAway = tableTemp

          tableTemp = []
          teamGameStatsReversed.forEach(e => {
            if (e.teamAgainstName == teamAgainstName) {
              tableTemp.push({
                teamAgainstName: e.teamAgainstName,
                gameDate: e.gameDate,
                pointsScoredOverall: (e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning + e.pointsScoredFourthInning + e.pointsScoredFifthInning),
                pointsAllowedOverall: (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning + e.pointsAllowedFourthInning + e.pointsAllowedFifthInning),
                homeAway: e.homeOrAway
              })
            }
          })
          finalTeam.tableTeam = tableTemp

        }
        else if (team.marketKey == 'h2h_1st_7_innings') {
          finalTeam.totalWins = teamGameStats.filter(e => { return (e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning + e.pointsScoredFourthInning + e.pointsScoredFifthInning + e.pointsScoredSixthInning + e.pointsScoredSeventhInning) > (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning + e.pointsAllowedFourthInning + e.pointsAllowedFifthInning + e.pointsAllowedSixthInning + e.pointsAllowedSeventhInning) }).length
          finalTeam.totalWinsHomeAway = teamGameStats.filter(e => { return ((e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning + e.pointsScoredFourthInning + e.pointsScoredFifthInning + e.pointsScoredSixthInning + e.pointsScoredSeventhInning) > (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning + e.pointsAllowedFourthInning + e.pointsAllowedFifthInning + e.pointsAllowedSixthInning + e.pointsAllowedSeventhInning)) && e.homeOrAway == homeAway }).length
          finalTeam.totalWinsTeam = teamGameStats.filter(e => { return ((e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning + e.pointsScoredFourthInning + e.pointsScoredFifthInning + e.pointsScoredSixthInning + e.pointsScoredSeventhInning) > (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning + e.pointsAllowedFourthInning + e.pointsAllowedFifthInning + e.pointsAllowedSixthInning + e.pointsAllowedSeventhInning)) && e.teamAgainstName == teamAgainstName }).length

          finalTeam.teamAgainstTotalWins = teamAgainstStats.filter(e => { return (e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning + e.pointsScoredFourthInning + e.pointsScoredFifthInning + e.pointsScoredSixthInning + e.pointsScoredSeventhInning) > (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning + e.pointsAllowedFourthInning + e.pointsAllowedFifthInning + e.pointsAllowedSixthInning + e.pointsAllowedSeventhInning) }).length
          finalTeam.teamAgainstWinsHomeAway = teamAgainstStats.filter(e => { return ((e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning + e.pointsScoredFourthInning + e.pointsScoredFifthInning + e.pointsScoredSixthInning + e.pointsScoredSeventhInning) > (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning + e.pointsAllowedFourthInning + e.pointsAllowedFifthInning + e.pointsAllowedSixthInning + e.pointsAllowedSeventhInning)) && e.homeOrAway != homeAway }).length
          finalTeam.teamAgainstWinsTeam = teamAgainstStats.filter(e => { return ((e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning + e.pointsScoredFourthInning + e.pointsScoredFifthInning + e.pointsScoredSixthInning + e.pointsScoredSeventhInning) > (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning + e.pointsAllowedFourthInning + e.pointsAllowedFifthInning + e.pointsAllowedSixthInning + e.pointsAllowedSeventhInning)) && e.teamAgainstName == MlbService.mlbTeamNameToAbvr[teamName] }).length


          let tableTemp: any[] = []
          teamGameStatsReversed.forEach(e => {
            tableTemp.push({
              teamAgainstName: e.teamAgainstName,
              gameDate: e.gameDate,
              pointsScoredOverall: (e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning + e.pointsScoredFourthInning + e.pointsScoredFifthInning + e.pointsScoredSixthInning + e.pointsScoredSeventhInning),
              pointsAllowedOverall: (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning + e.pointsAllowedFourthInning + e.pointsAllowedFifthInning + e.pointsAllowedSixthInning + e.pointsAllowedSeventhInning),
              homeAway: e.homeOrAway
            })
          })
          finalTeam.tableOverall = tableTemp

          tableTemp = []
          teamGameStatsReversed.forEach(e => {
            if (e.homeOrAway == homeAway) {
              tableTemp.push({
                teamAgainstName: e.teamAgainstName,
                gameDate: e.gameDate,
                pointsScoredOverall: (e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning + e.pointsScoredFourthInning + e.pointsScoredFifthInning + e.pointsScoredSixthInning + e.pointsScoredSeventhInning),
                pointsAllowedOverall: (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning + e.pointsAllowedFourthInning + e.pointsAllowedFifthInning + e.pointsAllowedSixthInning + e.pointsAllowedSeventhInning),
                homeAway: e.homeOrAway
              })
            }
          })
          finalTeam.tableHomeAway = tableTemp

          tableTemp = []
          teamGameStatsReversed.forEach(e => {
            if (e.teamAgainstName == teamAgainstName) {
              tableTemp.push({
                teamAgainstName: e.teamAgainstName,
                gameDate: e.gameDate,
                pointsScoredOverall: (e.pointsScoredFirstInning + e.pointsScoredSecondInning + e.pointsScoredThirdInning + e.pointsScoredFourthInning + e.pointsScoredFifthInning + e.pointsScoredSixthInning + e.pointsScoredSeventhInning),
                pointsAllowedOverall: (e.pointsAllowedFirstInning + e.pointsAllowedSecondInning + e.pointsAllowedThirdInning + e.pointsAllowedFourthInning + e.pointsAllowedFifthInning + e.pointsAllowedSixthInning + e.pointsAllowedSeventhInning),
                homeAway: e.homeOrAway
              })
            }
          })
          finalTeam.tableTeam = tableTemp
        }




      }
      else if (propType == 'spread') {
        // need to get record, chance of winning, weighted chance, avg, high and low
        finalTeam.totalWins = teamGameStats.filter(e => (e.pointsAllowedOverall - e.pointsScoredOverall) < team.point).length
        finalTeam.totalWinsHomeAway = teamGameStats.filter(e => ((e.pointsAllowedOverall - e.pointsScoredOverall) < team.point) && e.homeOrAway == homeAway).length
        finalTeam.totalWinsTeam = teamGameStats.filter(e => ((e.pointsAllowedOverall - e.pointsScoredOverall) < team.point) && e.teamAgainstName == teamAgainstName).length

        finalTeam.teamAgainstTotalWins = teamAgainstStats.filter(e => (e.pointsAllowedOverall - e.pointsScoredOverall) < team.point).length
        finalTeam.teamAgainstWinsHomeAway = teamAgainstStats.filter(e => ((e.pointsAllowedOverall - e.pointsScoredOverall) < team.point) && e.homeOrAway != homeAway).length
        finalTeam.teamAgainstWinsTeam = teamAgainstStats.filter(e => ((e.pointsAllowedOverall - e.pointsScoredOverall) < team.point) && e.teamAgainstName == MlbService.mlbTeamNameToAbvr[teamName]).length

        let totalSpread = 0
        teamGameStats.forEach(e => {
          totalSpread += (e.pointsAllowedOverall - e.pointsScoredOverall)
        })
        finalTeam.averageOverall = totalSpread / finalTeam.totalGames
        totalSpread = 0
        teamGameStats.forEach(e => {
          if (e.homeOrAway == homeAway) {
            totalSpread += (e.pointsAllowedOverall - e.pointsScoredOverall)
          }

        })
        finalTeam.averageHomeAway = totalSpread / finalTeam.totalGamesHomeAway
        totalSpread = 0
        teamGameStats.forEach(e => {
          if (e.teamAgainstName == teamAgainstName) {
            totalSpread += (e.pointsAllowedOverall - e.pointsScoredOverall)
          }

        })
        finalTeam.averageTeam = totalSpread / finalTeam.totalGamesTeam

        finalTeam.highOverall = this.getSpreadHighLow(homeAway, 'overall', 'high')
        finalTeam.highHomeAway = this.getSpreadHighLow(homeAway, homeAway, 'high')
        finalTeam.highTeam = this.getSpreadHighLow(homeAway, 'team', 'high')

        finalTeam.lowOverall = this.getSpreadHighLow(homeAway, 'overall', 'low')
        finalTeam.lowHomeAway = this.getSpreadHighLow(homeAway, homeAway, 'low')
        finalTeam.lowTeam = this.getSpreadHighLow(homeAway, 'team', 'low')

      }
      else if (propType == 'total') {
        // need to get record, chance of winning, weighted chance, avg, high and low

        if(team.marketKey == 'totals'){
          finalTeam.totalWins = teamGameStats.filter(e => (e.pointsAllowedOverall + e.pointsScoredOverall) < team.point).length
          finalTeam.totalWinsHomeAway = teamGameStats.filter(e => ((e.pointsAllowedOverall + e.pointsScoredOverall) < team.point) && e.homeOrAway == homeAway).length
          finalTeam.totalWinsTeam = teamGameStats.filter(e => ((e.pointsAllowedOverall + e.pointsScoredOverall) < team.point) && e.teamAgainstName == teamAgainstName).length
  
          let totalSpread = 0
          teamGameStats.forEach(e => {
            totalSpread += (e.pointsAllowedOverall + e.pointsScoredOverall)
          })
          finalTeam.averageOverall = totalSpread / finalTeam.totalGames
          totalSpread = 0
          teamGameStats.forEach(e => {
            if (e.homeOrAway == homeAway) {
              totalSpread += (e.pointsAllowedOverall + e.pointsScoredOverall)
            }
  
          })
          finalTeam.averageHomeAway = totalSpread / finalTeam.totalGamesHomeAway
          totalSpread = 0
          teamGameStats.forEach(e => {
            if (e.teamAgainstName == teamAgainstName) {
              totalSpread += (e.pointsAllowedOverall + e.pointsScoredOverall)
            }
  
          })
          finalTeam.averageTeam = totalSpread / finalTeam.totalGamesTeam
  
          finalTeam.teamAgainstTotalWins = teamAgainstStats.filter(e => (e.pointsAllowedOverall + e.pointsScoredOverall) < team.point).length
          finalTeam.teamAgainstWinsHomeAway = teamAgainstStats.filter(e => ((e.pointsAllowedOverall + e.pointsScoredOverall) < team.point) && e.homeOrAway != homeAway).length
          finalTeam.teamAgainstWinsTeam = teamAgainstStats.filter(e => ((e.pointsAllowedOverall + e.pointsScoredOverall) < team.point) && e.teamAgainstName == MlbService.mlbTeamNameToAbvr[teamName]).length
  
  
          finalTeam.highOverall = this.getTotalHighLow(homeAway, 'overall', 'high', team.marketKey)
          finalTeam.highHomeAway = this.getTotalHighLow(homeAway, homeAway, 'high', team.marketKey)
          finalTeam.highTeam = this.getTotalHighLow(homeAway, 'team', 'high', team.marketKey)
  
          finalTeam.lowOverall = this.getTotalHighLow(homeAway, 'overall', 'low', team.marketKey)
          finalTeam.lowHomeAway = this.getTotalHighLow(homeAway, homeAway, 'low', team.marketKey)
          finalTeam.lowTeam = this.getTotalHighLow(homeAway, 'team', 'low', team.marketKey)
        }
        else if(team.marketKey.includes('team_totals')){
          finalTeam.totalWins = teamGameStats.filter(e => (e.pointsScoredOverall) < team.point).length
        finalTeam.totalWinsHomeAway = teamGameStats.filter(e => ((e.pointsScoredOverall) < team.point) && e.homeOrAway == homeAway).length
        finalTeam.totalWinsTeam = teamGameStats.filter(e => ((e.pointsScoredOverall) < team.point) && e.teamAgainstName == teamAgainstName).length

        let totalSpread = 0
        teamGameStats.forEach(e => {
          totalSpread += (e.pointsScoredOverall)
        })
        finalTeam.averageOverall = totalSpread / finalTeam.totalGames
        totalSpread = 0
        teamGameStats.forEach(e => {
          if (e.homeOrAway == homeAway) {
            totalSpread += (e.pointsScoredOverall)
          }

        })
        finalTeam.averageHomeAway = totalSpread / finalTeam.totalGamesHomeAway
        totalSpread = 0
        teamGameStats.forEach(e => {
          if (e.teamAgainstName == teamAgainstName) {
            totalSpread += (e.pointsScoredOverall)
          }

        })
        finalTeam.averageTeam = totalSpread / finalTeam.totalGamesTeam

        finalTeam.teamAgainstTotalWins = teamAgainstStats.filter(e => (e.pointsScoredOverall) < team.point).length
        finalTeam.teamAgainstWinsHomeAway = teamAgainstStats.filter(e => ((e.pointsScoredOverall) < team.point) && e.homeOrAway != homeAway).length
        finalTeam.teamAgainstWinsTeam = teamAgainstStats.filter(e => ((e.pointsScoredOverall) < team.point) && e.teamAgainstName == MlbService.mlbTeamNameToAbvr[teamName]).length


        finalTeam.highOverall = this.getTotalHighLow(homeAway, 'overall', 'high', team.marketKey)
        finalTeam.highHomeAway = this.getTotalHighLow(homeAway, homeAway, 'high', team.marketKey)
        finalTeam.highTeam = this.getTotalHighLow(homeAway, 'team', 'high', team.marketKey)

        finalTeam.lowOverall = this.getTotalHighLow(homeAway, 'overall', 'low', team.marketKey)
        finalTeam.lowHomeAway = this.getTotalHighLow(homeAway, homeAway, 'low', team.marketKey)
        finalTeam.lowTeam = this.getTotalHighLow(homeAway, 'team', 'low', team.marketKey)
        }
        
      }
      this.returnObj = {
        teamName: teamNameNew,
        homeAway: finalTeam.homeAway,
        propType: finalTeam.propType,
        propPoint: propPoint,
        propPrice: propPrice,
        totalGames: finalTeam.totalGames,
        totalGamesHomeAway: finalTeam.totalGamesHomeAway,
        totalGamesTeam: finalTeam.totalGamesTeam,
        teamAgainstTotalGames: finalTeam.teamAgainstTotalGames,
        teamAgainstGamesHomeAway: finalTeam.teamAgainstGamesHomeAway,
        teamAgainstGamesTeam: finalTeam.teamAgainstGamesTeam,
        totalWins: finalTeam.totalWins,
        totalWinsHomeAway: finalTeam.totalWinsHomeAway,
        totalWinsTeam: finalTeam.totalWinsTeam,
        teamAgainstTotalWins: finalTeam.teamAgainstTotalWins,
        teamAgainstWinsHomeAway: finalTeam.teamAgainstWinsHomeAway,
        teamAgainstWinsTeam: finalTeam.teamAgainstWinsTeam,
        overUnder: finalTeam.overUnder,
        averageOverall: finalTeam.averageOverall,
        averageHomeAway: finalTeam.averageHomeAway,
        averageTeam: finalTeam.averageTeam,
        highOverall: finalTeam.highOverall,
        highHomeAway: finalTeam.highHomeAway,
        highTeam: finalTeam.highTeam,
        lowOverall: finalTeam.lowOverall,
        lowHomeAway: finalTeam.lowHomeAway,
        lowTeam: finalTeam.lowTeam,
        tableOverall: finalTeam.tableOverall.slice(0, 10),
        tableHomeAway: finalTeam.tableHomeAway.slice(0, 10),
        tableTeam: finalTeam.tableTeam.slice(0, 10),
        teamAgainstName: teamAgainstName,
        marketKey: marketKey,
        convertedMarketKey: this.displayIndividualPropTitle(marketKey),
        playerOrTeam: 'Team'

      }

    } catch (error: any) {
      console.log(error.message)
      this.returnObj = {
        teamName: '',
        homeAway: ' ',
        propType: ' ',
        propPoint: 0,
        propPrice: 0,
        totalGames: 0,
        totalGamesHomeAway: 0,
        totalGamesTeam: 0,
        teamAgainstTotalGames: 0,
        teamAgainstGamesHomeAway: 0,
        teamAgainstGamesTeam: 0,
        totalWins: 0,
        totalWinsHomeAway: 0,
        totalWinsTeam: 0,
        teamAgainstTotalWins: 0,
        teamAgainstWinsHomeAway: 0,
        teamAgainstWinsTeam: 0,
        overUnder: false,
        averageOverall: 0,
        averageHomeAway: 0,
        averageTeam: 0,
        highOverall: 0,
        highHomeAway: 0,
        highTeam: 0,
        lowOverall: 0,
        lowHomeAway: 0,
        lowTeam: 0,
        tableOverall: [],
        tableHomeAway: [],
        tableTeam: [],
        teamAgainstName: '',
        marketKey: '',
        convertedMarketKey: '',
        playerOrTeam: ''

      }
    }



    this.arrayOfTeamBets.push(this.returnObj)
    return this.returnObj

  }
  public teamBestBets: any[] = []
  //how to find best bets
  //if either overall home/away or team win percentage is over a certain number then add it to it
  //
  sliderValue: number = 80;
  getTeamBestBets() {
    this.teamBestBets = []
    for (let bet of this.arrayOfTeamBets) {
      let overallWin = bet.totalGames == 0 ? 0 : (bet.totalWins / bet.totalGames)
      let homeAwayWin = bet.totalGamesHomeAway == 0 ? 0 : (bet.totalWinsHomeAway / bet.totalGamesHomeAway)
      let teamWin = bet.totalGamesTeam == 0 ? 0 : (bet.totalWinsTeam / bet.totalGamesTeam)
      if ((overallWin > .80) || (teamWin > .80) || (homeAwayWin > .80)) {
        if(overallWin > .80){
          bet.overallHighlight = true
        }
        if(homeAwayWin > .80){
          bet.homeAwayHighlight = true
        }
        if(teamWin > .80){
          bet.teamHighlight = true
        }
          this.teamBestBets.push(bet)
      }
      else if(bet.propType == 'total'){
        if((overallWin < .2) || (teamWin < .2) || (homeAwayWin < .2)){
          if(overallWin < .2){
            bet.overallHighlight = true
          }
          if(homeAwayWin < .2){
            bet.homeAwayHighlight = true
          }
          if(teamWin < .2){
            bet.teamHighlight = true
          }
          bet.overUnder = true
          this.teamBestBets.push(bet)
        }
      }

      
      
      

    }

  }
  calculateNewBestBetTeam(){
    this.teamBestBets = []
    for (let bet of this.arrayOfTeamBets) {
      let overallWin = bet.totalGames == 0 ? 0 : (bet.totalWins / bet.totalGames)
      let homeAwayWin = bet.totalGamesHomeAway == 0 ? 0 : (bet.totalWinsHomeAway / bet.totalGamesHomeAway)
      let teamWin = bet.totalGamesTeam == 0 ? 0 : (bet.totalWinsTeam / bet.totalGamesTeam)
      if ((overallWin > (this.sliderValue/100)) || (teamWin > (this.sliderValue/100)) || (homeAwayWin > (this.sliderValue/100))) {
        if(overallWin > (this.sliderValue/100)){
          bet.overallHighlight = true
        }
        else{bet.overallHighlight = false}
        if(homeAwayWin > (this.sliderValue/100)){
          bet.homeAwayHighlight = true
        }
        else{bet.homeAwayHighlight = false}
        if(teamWin > (this.sliderValue/100)){
          bet.teamHighlight = true
        }
        else{bet.teamHighlight = false}
          this.teamBestBets.push(bet)
      }
      else if(bet.propType == 'total'){
        if((overallWin < (1-(this.sliderValue/100))) || (teamWin < (1-(this.sliderValue/100))) || (homeAwayWin < (1-(this.sliderValue/100)))){
          if(overallWin < (1-(this.sliderValue/100))){
            bet.overallHighlight = true
          }
          else{bet.overallHighlight = false}
          if(homeAwayWin < (1-(this.sliderValue/100))){
            bet.homeAwayHighlight = true
          }
          else{bet.homeAwayHighlight = false}
          if(teamWin < (1-(this.sliderValue/100))){
            bet.teamHighlight = true
          }
          else{bet.teamHighlight = false}
          bet.overUnder = true
          this.teamBestBets.push(bet)
        }
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
    for (let bet of this.arrayOfPlayerBets) {
      let overallWin = bet.totalOverall == 0 ? 0 : (bet.overOverall / bet.totalOverall)
      let homeAwayWin = bet.totalHomeAway == 0 ? 0 : (bet.overHomeAway / bet.totalHomeAway)
      let teamWin = bet.totalTeam == 0 ? 0 : (bet.overTeam / bet.totalTeam)
      if ((overallWin > (this.sliderValuePlayer/100)) || (teamWin > (this.sliderValuePlayer/100)) || (homeAwayWin > (this.sliderValuePlayer/100))) {
        if(overallWin > (this.sliderValuePlayer/100)){
          bet.overallHighlight = true
        }
        if(homeAwayWin > (this.sliderValuePlayer/100)){
          bet.homeAwayHighlight = true
        }
        if(teamWin > (this.sliderValuePlayer/100)){
          bet.teamHighlight = true
        }
          this.playerBestBets.push(bet)
      }
      else if(bet.propType == 'total'){
        if((overallWin < (1-(this.sliderValuePlayer/100))) || (teamWin < (1-(this.sliderValuePlayer/100))) || (homeAwayWin < (1-(this.sliderValuePlayer/100)))){
          if(overallWin < (1-(this.sliderValuePlayer/100))){
            bet.overallHighlight = true
          }
          if(homeAwayWin < (1-(this.sliderValuePlayer/100))){
            bet.homeAwayHighlight = true
          }
          if(teamWin < (1-(this.sliderValuePlayer/100))){
            bet.teamHighlight = true
          }
          bet.overUnder = true
          this.playerBestBets.push(bet)
        }
      }

      
      
      

    }
    this.teamPropIsLoading = false

  }
  calculateNewBestBetPlayer(){

    this.playerBestBets = []
    for (let bet of this.arrayOfPlayerBets) {
      let overallWin = bet.totalOverall == 0 ? 0 : (bet.overOverall / bet.totalOverall)
      let homeAwayWin = bet.totalHomeAway == 0 ? 0 : (bet.overHomeAway / bet.totalHomeAway)
      let teamWin = bet.totalTeam == 0 ? 0 : (bet.overTeam / bet.totalTeam)
      if ((overallWin > (this.sliderValuePlayer/100)) || (teamWin > (this.sliderValuePlayer/100)) || (homeAwayWin > (this.sliderValuePlayer/100))) {
        if(overallWin > (this.sliderValuePlayer/100)){
          bet.overallHighlight = true
        }
        else{bet.overallHighlight = false}
        if(homeAwayWin > (this.sliderValuePlayer/100)){
          bet.homeAwayHighlight = true
        }
        else{bet.homeAwayHighlight = false}
        if(teamWin > (this.sliderValuePlayer/100)){
          bet.teamHighlight = true
        }
        else{bet.teamHighlight = false}
          this.playerBestBets.push(bet)
      }
       else if((overallWin < (1-(this.sliderValuePlayer/100))) || (teamWin < (1-(this.sliderValuePlayer/100))) || (homeAwayWin < (1-(this.sliderValuePlayer/100)))){
          if(overallWin < (1-(this.sliderValuePlayer/100))){
            bet.overallHighlight = true
          }
          else{bet.overallHighlight = false}
          if(homeAwayWin < (1-(this.sliderValuePlayer/100))){
            bet.homeAwayHighlight = true
          }
          else{bet.homeAwayHighlight = false}
          if(teamWin < (1-(this.sliderValuePlayer/100))){
            bet.teamHighlight = true
          }
          else{bet.teamHighlight = false}
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
  addPropToParlay(prop:any){
    prop.isDisabled = true
    let isPlayer = prop.propVariables.playerOrTeam == 'Player' ? true : false
    if(isPlayer){
      prop.stats = this.playerStatsFinal.filter(e => e.playerName == prop.propVariables.playerName)
    }
    else{
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

  public listOfTeamProps: { [key: string]: string } = { "h2h": "Moneyline", "spreads": "Spread", "totals": "Game Total", "h2h_1st_3_innings": "Moneyline first 3 innings", "h2h_1st_5_innings": "Moneyline first 5 innings", "h2h_1st_7_innings": "Moneyline first 7 innings", "team_totals Over": "Team Total", "team_totals Under": "Team Total" }
  public listOfMoneylines: string[] = ["h2h", "h2h_1st_3_innings", "h2h_1st_5_innings", "h2h_1st_7_innings"]
  displayPropTitle(prop: any): string {
    let finalReturn = ''
    if (prop[0].length > 1) {
      finalReturn = this.listOfTeamProps[prop[0][0].marketKey]
    }
    else {
      finalReturn = this.listOfTeamProps[prop[0].marketKey]
    }

    return finalReturn
  }
  displayIndividualPropTitle(prop: string): string {
    return this.listOfTeamProps[prop]
  }

  displayPropDescription(prop: any): string {
    let finalReturn = ''

    if (prop[0].length > 1) {
      if(prop.propVariables.marketKey == 'totals'){
        let propOver = prop[0][0].price > 0 ? '+' : ''
        let one = prop[0][0].teamName + " " + prop[0][0].point + " | " + propOver + prop[0][0].price
        propOver = prop[0][1].price > 0 ? '+' : ''
        let two = prop[0][1].teamName + " " + prop[0][1].point + " | " + propOver + prop[0][1].price
        finalReturn = one + " " + two
      }
      else if(prop.propVariables.marketKey.includes('team_totals')){
        let propOver = prop[0][0].price > 0 ? '+' : ''
        let one = "Over " + prop[0][0].point + " | " + propOver + prop[0][0].price
        propOver = prop[0][1].price > 0 ? '+' : ''
        let two = "Under " + prop[0][1].point + " | " + propOver + prop[0][1].price
        finalReturn = one + " " + two
      }
      

    }
    else {
      if (this.listOfMoneylines.includes(prop[0].marketKey)) {
        let overProp = prop[0].price > 0 ? '+' : ''
        finalReturn = overProp + prop[0].price
      }
      else {
        let overProp = prop[0].price > 0 ? '+' : ''
        let overPoint = prop[0].point > 0 ? "+" : ''
        finalReturn = overPoint + prop[0].point + " | " + overProp + prop[0].price
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
    
    if(marketKey == 'totals'){
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
    else if(marketKey.includes('team_totals')){
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

  openChart(event: any) {
    if (event == 0) {
      this.chart.destroy()
    }
    if (event == 1) {
      this.createChart()
    }
  }

  createChart() {
    var historyOfProp: number[] = []


    var dataPoint: string[] = []
    var index = 1
    if (this.selectedPropHistoryName == 'h2h') {
      this.propHistory.forEach((e) => {
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

    if (this.selectedPropHistoryName == 'h2h') {
      min = min - 10
      max = max + 10
    }
    else if (this.selectedPropHistoryName == 'spreads') {
      min = min - 1
      max = max + 1
    }

    this.chart = new Chart("lineChart", {

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

  

  
  
  

  


  ngOnChanges() {
  }
  ngAfterContentInit() {
    this.selectedTab = 1;
  }
  ngAfterViewInit() {
  }
  ngOnInit() {
    Chart.register(annotationPlugin);
    this.initializeSport()
    this.getGames()
  }

  detailedStatsClicked(element: any) {
    this.router.navigate(["/playerStats/" + this.selectedSport + "/" + element.id])
  }

}

