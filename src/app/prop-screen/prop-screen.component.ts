import { Component, HostListener, OnInit, TemplateRef, ViewChild, ViewEncapsulation, afterRender, inject } from '@angular/core';
import { SportsTitleToName } from '../sports-titel-to-name';
import { SelectedSportsData } from '../selected-sports-data';
import { GameId } from '../game-id';
import { PropData } from '../prop-data';
import { PlayerProp } from '../player-prop';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MlbPlayerid } from '../mlb-playerid';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


import { DbMlbPlayerInfo } from 'src/shared/dbTasks/DbMlbPlayerInfo';
import { MlbController } from 'src/shared/Controllers/MlbController';
import { ISportsBook } from '../isports-book';
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
import { SportsNameToId } from '../sports-name-to-id';
import { DbNbaGameStats } from 'src/shared/dbTasks/DbNbaGameStats';
import { nhlApiController } from '../ApiCalls/nhlApiCalls';
import { draftKingsApiController } from '../ApiCalls/draftKingsApiCalls';
import annotationPlugin from 'chartjs-plugin-annotation';

import { ArrayOfDates } from '../array-of-dates';


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
import { TransformFromTimestampToTimePipe } from '../customPipes/transformFromTimestampToTime.pipe';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';
import { filter } from 'compression';
import { DBMlbPlayerGameStats } from '../../shared/dbTasks/DbMlbPlayerGameStats';
import { PlayerInfoController } from '../../shared/Controllers/PlayerInfoController';
import { DbPlayerInfo } from '../../shared/dbTasks/DbPlayerInfo';

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
  expandedElement: PlayerProp[] | null | undefined;


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
  public homeAlternateSpreadstemp: any[] =[]
  public homeAlternateSpreads: any[] = []

  //charts
  public chart: any = [];
  public chart2: any;
  public spreadAndTotalChart: boolean = false




  date = new Date();

  //API strings
  pre_initial_prop = "https://api.the-odds-api.com/v4/sports/";
  post_initial_prop = "/odds/?apiKey=5ab6923d5aa0ae822b05168709bb910c&regions=us&markets=h2h,spreads,totals&bookmakers=draftkings&oddsFormat=american";

  pre_get_games = "https://api.the-odds-api.com/v4/sports/";
  post_get_games = "/scores?apiKey=5ab6923d5aa0ae822b05168709bb910c";

  displayedColumns: string[] = ['name', 'description', 'point', 'price', 'detailedStats'];
  displayedColumnsTeamGames: string[] = ['game', 'date', 'result'];
  displayedTeamAgainstColums: string[] = ["date", "result", "q1Points"];
  displayedTeamAgainstColums2: string[] = ["q2Points", "q3Points", "q4Points"];





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

  team1GameStatsDtoNBA = {
    gamesWon: 0,
    gamesLost: 0,
    gamesWonVsOpponent: 0,
    gamesLostVsOpponent: 0,
    gamesWonHome: 0,
    gamesLostHome: 0,
    gamesWonAway: 0,
    gamesLostAway: 0,
    halfOneWon: 0,
    halfOneLost: 0,
    halfTwoWon: 0,
    halfTwoLost: 0,
    quarterOneWon: 0,
    quarterOneLost: 0,
    quarterTwoWon: 0,
    quarterTwoLost: 0,
    quarterThreeWon: 0,
    quarterThreeLost: 0,
    quarterFourWon: 0,
    quarterFourLost: 0,
    halfOneWonVsOpponent: 0,
    halfOneLostVsOpponent: 0,
    halfTwoWonVsOpponent: 0,
    halfTwoLostVsOpponent: 0,
    quarterOneWonVsOpponent: 0,
    quarterOneLostVsOpponent: 0,
    quarterTwoWonVsOpponent: 0,
    quarterTwoLostVsOpponent: 0,
    quarterThreeWonVsOpponent: 0,
    quarterThreeLostVsOpponent: 0,
    quarterFourWonVsOpponent: 0,
    quarterFourLostVsOpponent: 0,
    halfOneWonHome: 0,
    halfOneLostHome: 0,
    halfOneWonAway: 0,
    halfOneLostAway: 0,
    halfTwoWonHome: 0,
    halfTwoLostHome: 0,
    halfTwoWonAway: 0,
    halfTwoLostAway: 0,
    quarterOneWonHome: 0,
    quarterOneLostHome: 0,
    quarterOneWonAway: 0,
    quarterOneLostAway: 0,
    quarterTwoWonHome: 0,
    quarterTwoLostHome: 0,
    quarterTwoWonAway: 0,
    quarterTwoLostAway: 0,
    quarterThreeWonHome: 0,
    quarterThreeLostHome: 0,
    quarterThreeWonAway: 0,
    quarterThreeLostAway: 0,
    quarterFourWonHome: 0,
    quarterFourLostHome: 0,
    quarterFourWonAway: 0,
    quarterFourLostAway: 0,
    spreadGame: 0,
    spreadFirstHalf: 0,
    spreadSecondHalf: 0,
    spreadFirstQuarter: 0,
    spreadSecondQuarter: 0,
    spreadThirdQuarter: 0,
    spreadFourthQuarter: 0,
    spreadVsOpponent: 0,
    spreadFirstHalfVsOpponent: 0,
    spreadSecondHalfVsOpponent: 0,
    spreadFirstQuarterVsOpponent: 0,
    spreadSecondQuarterVsOpponet: 0,
    spreadThirdQuarterVsOpponent: 0,
    spreadFourthQuarterVsOpponent: 0,
    spreadHome: 0,
    spreadHomeFirstHalf: 0,
    spreadHomeSecondHalf: 0,
    spreadHomeFirstQuarter: 0,
    spreadHomeSecondQuarter: 0,
    spreadHomeThirdQuarter: 0,
    spreadHomeFourthQuarter: 0,
    spreadAway: 0,
    spreadAwayFirstHalf: 0,
    spreadAwaySecondHalf: 0,
    spreadAwayFirstQuarter: 0,
    spreadAwaySecondQuarter: 0,
    spreadAwayThirdQuarter: 0,
    spreadAwayFourthQuarter: 0,
    totalOverall: 0,
    totalOverallFirstHalf: 0,
    totalOverallSecondHalf: 0,
    totalOverallFirstQuarter: 0,
    totalOverallSecondQuarter: 0,
    totalOverallThirdQuarter: 0,
    totalOverallFourthQuarter: 0,
    totalVsTeam: 0,
    totalVsTeamFirstHalf: 0,
    totalVsTeamSecondHalf: 0,
    totalVsTeamFirstQuarter: 0,
    totalVsTeamSecondQuarter: 0,
    totalVsTeamThirdQuarter: 0,
    totalVsTeamFourthQuarter: 0,
    totalHome: 0,
    totalHomeFirstHalf: 0,
    totalHomeSecondHalf: 0,
    totalHomeFirstQuarter: 0,
    totalHomeSecondQuarter: 0,
    totalHomeThirdQuarter: 0,
    totalHomeFourthQuarter: 0,
    totalAway: 0,
    totalAwayFirstHalf: 0,
    totalAwaySecondHalf: 0,
    totalAwayFirstQuarter: 0,
    totalAwaySecondQuarter: 0,
    totalAwayThirdQuarter: 0,
    totalAwayFourthQuarter: 0,
    pointsScoredOverallGame: 0,
    pointsScoredOverallFirstHalf: 0,
    pointsScoredOverallSecondHalf: 0,
    pointsScoredOverallFirstQuarter: 0,
    pointsScoredOverallSecondQuarter: 0,
    pointsScoredOverallThirdQuarter: 0,
    pointsScoredOverallFourthQuarter: 0,
    pointsScoredVsTeamGame: 0,
    pointsScoredVsTeamFirstHalf: 0,
    pointsScoredVsTeamSecondHalf: 0,
    pointsScoredVsTeamFirstQuarter: 0,
    pointsScoredVsTeamSecondQuarter: 0,
    pointsScoredVsTeamThirdQuarter: 0,
    pointsScoredVsTeamFourthQuarter: 0,
    pointsScoredHomeGame: 0,
    pointsScoredHomeFirstHalf: 0,
    pointsScoredHomeSecondHalf: 0,
    pointsScoredHomeFirstQuarter: 0,
    pointsScoredHomeSecondQuarter: 0,
    pointsScoredHomeThirdQuarter: 0,
    pointsScoredHomeFourthQuarter: 0,
    pointsScoredAwayGame: 0,
    pointsScoredAwayFirstHalf: 0,
    pointsScoredAwaySecondHalf: 0,
    pointsScoredAwayFirstQuarter: 0,
    pointsScoredAwaySecondQuarter: 0,
    pointsScoredAwayThirdQuarter: 0,
    pointsScoredAwayFourthQuarter: 0,
    pointsAllowedOverallGame: 0,
    pointsAllowedOverallFirstHalf: 0,
    pointsAllowedOverallSecondHalf: 0,
    pointsAllowedOverallFirstQuarter: 0,
    pointsAllowedOverallSecondQuarter: 0,
    pointsAllowedOverallThirdQuarter: 0,
    pointsAllowedOverallFourthQuarter: 0,
    pointsAllowedVsTeamGame: 0,
    pointsAllowedVsTeamFirstHalf: 0,
    pointsAllowedVsTeamSecondHalf: 0,
    pointsAllowedVsTeamFirstQuarter: 0,
    pointsAllowedVsTeamSecondQuarter: 0,
    pointsAllowedVsTeamThirdQuarter: 0,
    pointsAllowedVsTeamFourthQuarter: 0,
    pointsAllowedHomeGame: 0,
    pointsAllowedHomeFirstHalf: 0,
    pointsAllowedHomeSecondHalf: 0,
    pointsAllowedHomeFirstQuarter: 0,
    pointsAllowedHomeSecondQuarter: 0,
    pointsAllowedHomeThirdQuarter: 0,
    pointsAllowedHomeFourthQuarter: 0,
    pointsAllowedAwayGame: 0,
    pointsAllowedAwayFirstHalf: 0,
    pointsAllowedAwaySecondHalf: 0,
    pointsAllowedAwayFirstQuarter: 0,
    pointsAllowedAwaySecondQuarter: 0,
    pointsAllowedAwayThirdQuarter: 0,
    pointsAllowedAwayFourthQuarter: 0,
  }
  team2GameStatsDtoNBA = {
    gamesWon: 0,
    gamesLost: 0,
    gamesWonVsOpponent: 0,
    gamesLostVsOpponent: 0,
    gamesWonHome: 0,
    gamesLostHome: 0,
    gamesWonAway: 0,
    gamesLostAway: 0,
    halfOneWon: 0,
    halfOneLost: 0,
    halfTwoWon: 0,
    halfTwoLost: 0,
    quarterOneWon: 0,
    quarterOneLost: 0,
    quarterTwoWon: 0,
    quarterTwoLost: 0,
    quarterThreeWon: 0,
    quarterThreeLost: 0,
    quarterFourWon: 0,
    quarterFourLost: 0,
    halfOneWonVsOpponent: 0,
    halfOneLostVsOpponent: 0,
    halfTwoWonVsOpponent: 0,
    halfTwoLostVsOpponent: 0,
    quarterOneWonVsOpponent: 0,
    quarterOneLostVsOpponent: 0,
    quarterTwoWonVsOpponent: 0,
    quarterTwoLostVsOpponent: 0,
    quarterThreeWonVsOpponent: 0,
    quarterThreeLostVsOpponent: 0,
    quarterFourWonVsOpponent: 0,
    quarterFourLostVsOpponent: 0,
    halfOneWonHome: 0,
    halfOneLostHome: 0,
    halfOneWonAway: 0,
    halfOneLostAway: 0,
    halfTwoWonHome: 0,
    halfTwoLostHome: 0,
    halfTwoWonAway: 0,
    halfTwoLostAway: 0,
    quarterOneWonHome: 0,
    quarterOneLostHome: 0,
    quarterOneWonAway: 0,
    quarterOneLostAway: 0,
    quarterTwoWonHome: 0,
    quarterTwoLostHome: 0,
    quarterTwoWonAway: 0,
    quarterTwoLostAway: 0,
    quarterThreeWonHome: 0,
    quarterThreeLostHome: 0,
    quarterThreeWonAway: 0,
    quarterThreeLostAway: 0,
    quarterFourWonHome: 0,
    quarterFourLostHome: 0,
    quarterFourWonAway: 0,
    quarterFourLostAway: 0,
    spreadGame: 0,
    spreadFirstHalf: 0,
    spreadSecondHalf: 0,
    spreadFirstQuarter: 0,
    spreadSecondQuarter: 0,
    spreadThirdQuarter: 0,
    spreadFourthQuarter: 0,
    spreadVsOpponent: 0,
    spreadFirstHalfVsOpponent: 0,
    spreadSecondHalfVsOpponent: 0,
    spreadFirstQuarterVsOpponent: 0,
    spreadSecondQuarterVsOpponet: 0,
    spreadThirdQuarterVsOpponent: 0,
    spreadFourthQuarterVsOpponent: 0,
    spreadHome: 0,
    spreadHomeFirstHalf: 0,
    spreadHomeSecondHalf: 0,
    spreadHomeFirstQuarter: 0,
    spreadHomeSecondQuarter: 0,
    spreadHomeThirdQuarter: 0,
    spreadHomeFourthQuarter: 0,
    spreadAway: 0,
    spreadAwayFirstHalf: 0,
    spreadAwaySecondHalf: 0,
    spreadAwayFirstQuarter: 0,
    spreadAwaySecondQuarter: 0,
    spreadAwayThirdQuarter: 0,
    spreadAwayFourthQuarter: 0,
    totalOverall: 0,
    totalOverallFirstHalf: 0,
    totalOverallSecondHalf: 0,
    totalOverallFirstQuarter: 0,
    totalOverallSecondQuarter: 0,
    totalOverallThirdQuarter: 0,
    totalOverallFourthQuarter: 0,
    totalVsTeam: 0,
    totalVsTeamFirstHalf: 0,
    totalVsTeamSecondHalf: 0,
    totalVsTeamFirstQuarter: 0,
    totalVsTeamSecondQuarter: 0,
    totalVsTeamThirdQuarter: 0,
    totalVsTeamFourthQuarter: 0,
    totalHome: 0,
    totalHomeFirstHalf: 0,
    totalHomeSecondHalf: 0,
    totalHomeFirstQuarter: 0,
    totalHomeSecondQuarter: 0,
    totalHomeThirdQuarter: 0,
    totalHomeFourthQuarter: 0,
    totalAway: 0,
    totalAwayFirstHalf: 0,
    totalAwaySecondHalf: 0,
    totalAwayFirstQuarter: 0,
    totalAwaySecondQuarter: 0,
    totalAwayThirdQuarter: 0,
    totalAwayFourthQuarter: 0,
    pointsScoredOverallGame: 0,
    pointsScoredOverallFirstHalf: 0,
    pointsScoredOverallSecondHalf: 0,
    pointsScoredOverallFirstQuarter: 0,
    pointsScoredOverallSecondQuarter: 0,
    pointsScoredOverallThirdQuarter: 0,
    pointsScoredOverallFourthQuarter: 0,
    pointsScoredVsTeamGame: 0,
    pointsScoredVsTeamFirstHalf: 0,
    pointsScoredVsTeamSecondHalf: 0,
    pointsScoredVsTeamFirstQuarter: 0,
    pointsScoredVsTeamSecondQuarter: 0,
    pointsScoredVsTeamThirdQuarter: 0,
    pointsScoredVsTeamFourthQuarter: 0,
    pointsScoredHomeGame: 0,
    pointsScoredHomeFirstHalf: 0,
    pointsScoredHomeSecondHalf: 0,
    pointsScoredHomeFirstQuarter: 0,
    pointsScoredHomeSecondQuarter: 0,
    pointsScoredHomeThirdQuarter: 0,
    pointsScoredHomeFourthQuarter: 0,
    pointsScoredAwayGame: 0,
    pointsScoredAwayFirstHalf: 0,
    pointsScoredAwaySecondHalf: 0,
    pointsScoredAwayFirstQuarter: 0,
    pointsScoredAwaySecondQuarter: 0,
    pointsScoredAwayThirdQuarter: 0,
    pointsScoredAwayFourthQuarter: 0,
    pointsAllowedOverallGame: 0,
    pointsAllowedOverallFirstHalf: 0,
    pointsAllowedOverallSecondHalf: 0,
    pointsAllowedOverallFirstQuarter: 0,
    pointsAllowedOverallSecondQuarter: 0,
    pointsAllowedOverallThirdQuarter: 0,
    pointsAllowedOverallFourthQuarter: 0,
    pointsAllowedVsTeamGame: 0,
    pointsAllowedVsTeamFirstHalf: 0,
    pointsAllowedVsTeamSecondHalf: 0,
    pointsAllowedVsTeamFirstQuarter: 0,
    pointsAllowedVsTeamSecondQuarter: 0,
    pointsAllowedVsTeamThirdQuarter: 0,
    pointsAllowedVsTeamFourthQuarter: 0,
    pointsAllowedHomeGame: 0,
    pointsAllowedHomeFirstHalf: 0,
    pointsAllowedHomeSecondHalf: 0,
    pointsAllowedHomeFirstQuarter: 0,
    pointsAllowedHomeSecondQuarter: 0,
    pointsAllowedHomeThirdQuarter: 0,
    pointsAllowedHomeFourthQuarter: 0,
    pointsAllowedAwayGame: 0,
    pointsAllowedAwayFirstHalf: 0,
    pointsAllowedAwaySecondHalf: 0,
    pointsAllowedAwayFirstQuarter: 0,
    pointsAllowedAwaySecondQuarter: 0,
    pointsAllowedAwayThirdQuarter: 0,
    pointsAllowedAwayFourthQuarter: 0,
  }
  team1GameStatsDtoMLB = {
    gamesWon: 0,
    gamesLost: 0,
    gamesWonVsOpponent: 0,
    gamesLostVsOpponent: 0,
    gamesWonHome: 0,
    gamesLostHome: 0,
    gamesWonAway: 0,
    gamesLostAway: 0,
    inningOneWon: 0,
    inningOneLost: 0,
    inningTwoWon: 0,
    inningTwoLost: 0,
    inningThreeWon: 0,
    inningThreeLost: 0,
    inningFourWon: 0,
    inningFourLost: 0,
    inningFiveWon: 0,
    inningFiveLost: 0,
    inningSixWon: 0,
    inningSixLost: 0,
    inningSevenWon: 0,
    inningSevenLost: 0,
    inningEightWon: 0,
    inningEightLost: 0,
    inningNineWon: 0,
    inningNineLost: 0,
    inningOneWonVsOpponent: 0,
    inningOneLostVsOpponent: 0,
    inningTwoWonVsOpponent: 0,
    inningTwoLostVsOpponent: 0,
    inningThreeWonVsOpponent: 0,
    inningThreeLostVsOpponent: 0,
    inningFourWonVsOpponent: 0,
    inningFourLostVsOpponent: 0,
    inningFiveWonVsOpponent: 0,
    inningFiveLostVsOpponent: 0,
    inningSixWonVsOpponent: 0,
    inningSixLostVsOpponent: 0,
    inningSevenWonVsOpponent: 0,
    inningSevenLostVsOpponent: 0,
    inningEightWonVsOpponent: 0,
    inningEightLostVsOpponent: 0,
    inningNineWonVsOpponent: 0,
    inningNineLostVsOpponent: 0,
    inningOneWonHome: 0,
    inningOneLostHome: 0,
    inningTwoWonHome: 0,
    inningTwoLostHome: 0,
    inningThreeWonHome: 0,
    inningThreeLostHome: 0,
    inningFourWonHome: 0,
    inningFourLostHome: 0,
    inningFiveWonHome: 0,
    inningFiveLostHome: 0,
    inningSixWonHome: 0,
    inningSixLostHome: 0,
    inningSevenWonHome: 0,
    inningSevenLostHome: 0,
    inningEightWonHome: 0,
    inningEightLostHome: 0,
    inningNineWonHome: 0,
    inningNineLostHome: 0,
    inningOneWonAway: 0,
    inningOneLostAway: 0,
    inningTwoWonAway: 0,
    inningTwoLostAway: 0,
    inningThreeWonAway: 0,
    inningThreeLostAway: 0,
    inningFourWonAway: 0,
    inningFourLostAway: 0,
    inningFiveWonAway: 0,
    inningFiveLostAway: 0,
    inningSixWonAway: 0,
    inningSixLostAway: 0,
    inningSevenWonAway: 0,
    inningSevenLostAway: 0,
    inningEightWonAway: 0,
    inningEightLostAway: 0,
    inningNineWonAway: 0,
    inningNineLostAway: 0,
    spreadGame: 0,
    spreadFirstInning: 0,
    spreadSecondInning: 0,
    spreadThirdInning: 0,
    spreadFourthInning: 0,
    spreadFifthInning: 0,
    spreadSixthInning: 0,
    spreadSeventhInning: 0,
    spreadEighthInning: 0,
    spreadNinthInning: 0,
    spreadVsOpponent: 0,
    spreadFirstInningVsOpponent: 0,
    spreadSecondInningVsOpponent: 0,
    spreadThirdInningVsOpponent: 0,
    spreadFourthInningVsOpponent: 0,
    spreadFifthInningVsOpponent: 0,
    spreadSixthInningVsOpponent: 0,
    spreadSeventhInningVsOpponent: 0,
    spreadEighthInningVsOpponent: 0,
    spreadNinthInningVsOpponent: 0,
    spreadHome: 0,
    spreadFirstInningHome: 0,
    spreadSecondInningHome: 0,
    spreadThirdInningHome: 0,
    spreadFourthInningHome: 0,
    spreadFifthInningHome: 0,
    spreadSixthInningHome: 0,
    spreadSeventhInningHome: 0,
    spreadEighthInningHome: 0,
    spreadNinthInningHome: 0,
    spreadAway: 0,
    spreadFirstInningAway: 0,
    spreadSecondInningAway: 0,
    spreadThirdInningAway: 0,
    spreadFourthInningAway: 0,
    spreadFifthInningAway: 0,
    spreadSixthInningAway: 0,
    spreadSeventhInningAway: 0,
    spreadEighthInningAway: 0,
    spreadNinthInningAway: 0,
    totalOverall: 0,
    totalFirstInning: 0,
    totalSecondInning: 0,
    totalThirdInning: 0,
    totalFourthInning: 0,
    totalFifthInning: 0,
    totalSixthInning: 0,
    totalSeventhInning: 0,
    totalEighthInning: 0,
    totalNinthInning: 0,
    totalVsTeam: 0,
    totalFirstInningVsOpponent: 0,
    totalSecondInningVsOpponent: 0,
    totalThirdInningVsOpponent: 0,
    totalFourthInningVsOpponent: 0,
    totalFifthInningVsOpponent: 0,
    totalSixthInningVsOpponent: 0,
    totalSeventhInningVsOpponent: 0,
    totalEighthInningVsOpponent: 0,
    totalNinthInningVsOpponent: 0,
    totalHome: 0,
    totalFirstInningHome: 0,
    totalSecondInningHome: 0,
    totalThirdInningHome: 0,
    totalFourthInningHome: 0,
    totalFifthInningHome: 0,
    totalSixthInningHome: 0,
    totalSeventhInningHome: 0,
    totalEighthInningHome: 0,
    totalNinthInningHome: 0,
    totalAway: 0,
    totalFirstInningAway: 0,
    totalSecondInningAway: 0,
    totalThirdInningAway: 0,
    totalFourthInningAway: 0,
    totalFifthInningAway: 0,
    totalSixthInningAway: 0,
    totalSeventhInningAway: 0,
    totalEighthInningAway: 0,
    totalNinthInningAway: 0,
    pointsScoredOverallGame: 0,
    pointsScoredOverallFirstInning: 0,
    pointsScoredOverallSecondInning: 0,
    pointsScoredOverallThirdInning: 0,
    pointsScoredOverallFourthInning: 0,
    pointsScoredOverallFifthInning: 0,
    pointsScoredOverallSixthInning: 0,
    pointsScoredOverallSeventhInning: 0,
    pointsScoredOverallEighthInning: 0,
    pointsScoredOverallNinthInning: 0,
    pointsScoredVsTeamGame: 0,
    pointsScoredFirstInningVsOpponent: 0,
    pointsScoredSecondInningVsOpponent: 0,
    pointsScoredThirdInningVsOpponent: 0,
    pointsScoredFourthInningVsOpponent: 0,
    pointsScoredFifthInningVsOpponent: 0,
    pointsScoredSixthInningVsOpponent: 0,
    pointsScoredSeventhInningVsOpponent: 0,
    pointsScoredEighthInningVsOpponent: 0,
    pointsScoredNinthInningVsOpponent: 0,
    pointsScoredHomeGame: 0,
    pointsScoredFirstInningHome: 0,
    pointsScoredSecondInningHome: 0,
    pointsScoredThirdInningHome: 0,
    pointsScoredFourthInningHome: 0,
    pointsScoredFifthInningHome: 0,
    pointsScoredSixthInningHome: 0,
    pointsScoredSeventhInningHome: 0,
    pointsScoredEighthInningHome: 0,
    pointsScoredNinthInningHome: 0,
    pointsScoredAwayGame: 0,
    pointsScoredFirstInningAway: 0,
    pointsScoredSecondInningAway: 0,
    pointsScoredThirdInningAway: 0,
    pointsScoredFourthInningAway: 0,
    pointsScoredFifthInningAway: 0,
    pointsScoredSixthInningAway: 0,
    pointsScoredSeventhInningAway: 0,
    pointsScoredEighthInningAway: 0,
    pointsScoredNinthInningAway: 0,
    pointsAllowedOverallGame: 0,
    pointsAllowedOverallFirstInning: 0,
    pointsAllowedOverallSecondInning: 0,
    pointsAllowedOverallThirdInning: 0,
    pointsAllowedOverallFourthInning: 0,
    pointsAllowedOverallFifthInning: 0,
    pointsAllowedOverallSixthInning: 0,
    pointsAllowedOverallSeventhInning: 0,
    pointsAllowedOverallEighthInning: 0,
    pointsAllowedOverallNinthInning: 0,
    pointsAllowedVsTeamGame: 0,
    pointsAllowedFirstInningVsOpponent: 0,
    pointsAllowedSecondInningVsOpponent: 0,
    pointsAllowedThirdInningVsOpponent: 0,
    pointsAllowedFourthInningVsOpponent: 0,
    pointsAllowedFifthInningVsOpponent: 0,
    pointsAllowedSixthInningVsOpponent: 0,
    pointsAllowedSeventhInningVsOpponent: 0,
    pointsAllowedEighthInningVsOpponent: 0,
    pointsAllowedNinthInningVsOpponent: 0,
    pointsAllowedHomeGame: 0,
    pointsAllowedFirstInningHome: 0,
    pointsAllowedSecondInningHome: 0,
    pointsAllowedThirdInningHome: 0,
    pointsAllowedFourthInningHome: 0,
    pointsAllowedFifthInningHome: 0,
    pointsAllowedSixthInningHome: 0,
    pointsAllowedSeventhInningHome: 0,
    pointsAllowedEighthInningHome: 0,
    pointsAllowedNinthInningHome: 0,
    pointsAllowedAwayGame: 0,
    pointsAllowedFirstInningAway: 0,
    pointsAllowedSecondInningAway: 0,
    pointsAllowedThirdInningAway: 0,
    pointsAllowedFourthInningAway: 0,
    pointsAllowedFifthInningAway: 0,
    pointsAllowedSixthInningAway: 0,
    pointsAllowedSeventhInningAway: 0,
    pointsAllowedEighthInningAway: 0,
    pointsAllowedNinthInningAway: 0
  }

  team2GameStatsDtoMLB = {
    gamesWon: 0,
    gamesLost: 0,
    gamesWonVsOpponent: 0,
    gamesLostVsOpponent: 0,
    gamesWonHome: 0,
    gamesLostHome: 0,
    gamesWonAway: 0,
    gamesLostAway: 0,
    inningOneWon: 0,
    inningOneLost: 0,
    inningTwoWon: 0,
    inningTwoLost: 0,
    inningThreeWon: 0,
    inningThreeLost: 0,
    inningFourWon: 0,
    inningFourLost: 0,
    inningFiveWon: 0,
    inningFiveLost: 0,
    inningSixWon: 0,
    inningSixLost: 0,
    inningSevenWon: 0,
    inningSevenLost: 0,
    inningEightWon: 0,
    inningEightLost: 0,
    inningNineWon: 0,
    inningNineLost: 0,
    inningOneWonVsOpponent: 0,
    inningOneLostVsOpponent: 0,
    inningTwoWonVsOpponent: 0,
    inningTwoLostVsOpponent: 0,
    inningThreeWonVsOpponent: 0,
    inningThreeLostVsOpponent: 0,
    inningFourWonVsOpponent: 0,
    inningFourLostVsOpponent: 0,
    inningFiveWonVsOpponent: 0,
    inningFiveLostVsOpponent: 0,
    inningSixWonVsOpponent: 0,
    inningSixLostVsOpponent: 0,
    inningSevenWonVsOpponent: 0,
    inningSevenLostVsOpponent: 0,
    inningEightWonVsOpponent: 0,
    inningEightLostVsOpponent: 0,
    inningNineWonVsOpponent: 0,
    inningNineLostVsOpponent: 0,
    inningOneWonHome: 0,
    inningOneLostHome: 0,
    inningTwoWonHome: 0,
    inningTwoLostHome: 0,
    inningThreeWonHome: 0,
    inningThreeLostHome: 0,
    inningFourWonHome: 0,
    inningFourLostHome: 0,
    inningFiveWonHome: 0,
    inningFiveLostHome: 0,
    inningSixWonHome: 0,
    inningSixLostHome: 0,
    inningSevenWonHome: 0,
    inningSevenLostHome: 0,
    inningEightWonHome: 0,
    inningEightLostHome: 0,
    inningNineWonHome: 0,
    inningNineLostHome: 0,
    inningOneWonAway: 0,
    inningOneLostAway: 0,
    inningTwoWonAway: 0,
    inningTwoLostAway: 0,
    inningThreeWonAway: 0,
    inningThreeLostAway: 0,
    inningFourWonAway: 0,
    inningFourLostAway: 0,
    inningFiveWonAway: 0,
    inningFiveLostAway: 0,
    inningSixWonAway: 0,
    inningSixLostAway: 0,
    inningSevenWonAway: 0,
    inningSevenLostAway: 0,
    inningEightWonAway: 0,
    inningEightLostAway: 0,
    inningNineWonAway: 0,
    inningNineLostAway: 0,
    spreadGame: 0,
    spreadFirstInning: 0,
    spreadSecondInning: 0,
    spreadThirdInning: 0,
    spreadFourthInning: 0,
    spreadFifthInning: 0,
    spreadSixthInning: 0,
    spreadSeventhInning: 0,
    spreadEighthInning: 0,
    spreadNinthInning: 0,
    spreadVsOpponent: 0,
    spreadFirstInningVsOpponent: 0,
    spreadSecondInningVsOpponent: 0,
    spreadThirdInningVsOpponent: 0,
    spreadFourthInningVsOpponent: 0,
    spreadFifthInningVsOpponent: 0,
    spreadSixthInningVsOpponent: 0,
    spreadSeventhInningVsOpponent: 0,
    spreadEighthInningVsOpponent: 0,
    spreadNinthInningVsOpponent: 0,
    spreadHome: 0,
    spreadFirstInningHome: 0,
    spreadSecondInningHome: 0,
    spreadThirdInningHome: 0,
    spreadFourthInningHome: 0,
    spreadFifthInningHome: 0,
    spreadSixthInningHome: 0,
    spreadSeventhInningHome: 0,
    spreadEighthInningHome: 0,
    spreadNinthInningHome: 0,
    spreadAway: 0,
    spreadFirstInningAway: 0,
    spreadSecondInningAway: 0,
    spreadThirdInningAway: 0,
    spreadFourthInningAway: 0,
    spreadFifthInningAway: 0,
    spreadSixthInningAway: 0,
    spreadSeventhInningAway: 0,
    spreadEighthInningAway: 0,
    spreadNinthInningAway: 0,
    totalOverall: 0,
    totalFirstInning: 0,
    totalSecondInning: 0,
    totalThirdInning: 0,
    totalFourthInning: 0,
    totalFifthInning: 0,
    totalSixthInning: 0,
    totalSeventhInning: 0,
    totalEighthInning: 0,
    totalNinthInning: 0,
    totalVsTeam: 0,
    totalFirstInningVsOpponent: 0,
    totalSecondInningVsOpponent: 0,
    totalThirdInningVsOpponent: 0,
    totalFourthInningVsOpponent: 0,
    totalFifthInningVsOpponent: 0,
    totalSixthInningVsOpponent: 0,
    totalSeventhInningVsOpponent: 0,
    totalEighthInningVsOpponent: 0,
    totalNinthInningVsOpponent: 0,
    totalHome: 0,
    totalFirstInningHome: 0,
    totalSecondInningHome: 0,
    totalThirdInningHome: 0,
    totalFourthInningHome: 0,
    totalFifthInningHome: 0,
    totalSixthInningHome: 0,
    totalSeventhInningHome: 0,
    totalEighthInningHome: 0,
    totalNinthInningHome: 0,
    totalAway: 0,
    totalFirstInningAway: 0,
    totalSecondInningAway: 0,
    totalThirdInningAway: 0,
    totalFourthInningAway: 0,
    totalFifthInningAway: 0,
    totalSixthInningAway: 0,
    totalSeventhInningAway: 0,
    totalEighthInningAway: 0,
    totalNinthInningAway: 0,
    pointsScoredOverallGame: 0,
    pointsScoredOverallFirstInning: 0,
    pointsScoredOverallSecondInning: 0,
    pointsScoredOverallThirdInning: 0,
    pointsScoredOverallFourthInning: 0,
    pointsScoredOverallFifthInning: 0,
    pointsScoredOverallSixthInning: 0,
    pointsScoredOverallSeventhInning: 0,
    pointsScoredOverallEighthInning: 0,
    pointsScoredOverallNinthInning: 0,
    pointsScoredVsTeamGame: 0,
    pointsScoredFirstInningVsOpponent: 0,
    pointsScoredSecondInningVsOpponent: 0,
    pointsScoredThirdInningVsOpponent: 0,
    pointsScoredFourthInningVsOpponent: 0,
    pointsScoredFifthInningVsOpponent: 0,
    pointsScoredSixthInningVsOpponent: 0,
    pointsScoredSeventhInningVsOpponent: 0,
    pointsScoredEighthInningVsOpponent: 0,
    pointsScoredNinthInningVsOpponent: 0,
    pointsScoredHomeGame: 0,
    pointsScoredFirstInningHome: 0,
    pointsScoredSecondInningHome: 0,
    pointsScoredThirdInningHome: 0,
    pointsScoredFourthInningHome: 0,
    pointsScoredFifthInningHome: 0,
    pointsScoredSixthInningHome: 0,
    pointsScoredSeventhInningHome: 0,
    pointsScoredEighthInningHome: 0,
    pointsScoredNinthInningHome: 0,
    pointsScoredAwayGame: 0,
    pointsScoredFirstInningAway: 0,
    pointsScoredSecondInningAway: 0,
    pointsScoredThirdInningAway: 0,
    pointsScoredFourthInningAway: 0,
    pointsScoredFifthInningAway: 0,
    pointsScoredSixthInningAway: 0,
    pointsScoredSeventhInningAway: 0,
    pointsScoredEighthInningAway: 0,
    pointsScoredNinthInningAway: 0,
    pointsAllowedOverallGame: 0,
    pointsAllowedOverallFirstInning: 0,
    pointsAllowedOverallSecondInning: 0,
    pointsAllowedOverallThirdInning: 0,
    pointsAllowedOverallFourthInning: 0,
    pointsAllowedOverallFifthInning: 0,
    pointsAllowedOverallSixthInning: 0,
    pointsAllowedOverallSeventhInning: 0,
    pointsAllowedOverallEighthInning: 0,
    pointsAllowedOverallNinthInning: 0,
    pointsAllowedVsTeamGame: 0,
    pointsAllowedFirstInningVsOpponent: 0,
    pointsAllowedSecondInningVsOpponent: 0,
    pointsAllowedThirdInningVsOpponent: 0,
    pointsAllowedFourthInningVsOpponent: 0,
    pointsAllowedFifthInningVsOpponent: 0,
    pointsAllowedSixthInningVsOpponent: 0,
    pointsAllowedSeventhInningVsOpponent: 0,
    pointsAllowedEighthInningVsOpponent: 0,
    pointsAllowedNinthInningVsOpponent: 0,
    pointsAllowedHomeGame: 0,
    pointsAllowedFirstInningHome: 0,
    pointsAllowedSecondInningHome: 0,
    pointsAllowedThirdInningHome: 0,
    pointsAllowedFourthInningHome: 0,
    pointsAllowedFifthInningHome: 0,
    pointsAllowedSixthInningHome: 0,
    pointsAllowedSeventhInningHome: 0,
    pointsAllowedEighthInningHome: 0,
    pointsAllowedNinthInningHome: 0,
    pointsAllowedAwayGame: 0,
    pointsAllowedFirstInningAway: 0,
    pointsAllowedSecondInningAway: 0,
    pointsAllowedThirdInningAway: 0,
    pointsAllowedFourthInningAway: 0,
    pointsAllowedFifthInningAway: 0,
    pointsAllowedSixthInningAway: 0,
    pointsAllowedSeventhInningAway: 0,
    pointsAllowedEighthInningAway: 0,
    pointsAllowedNinthInningAway: 0
  }

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
  playerStatsFinal:any[] = []
  playerInfoAll: DbPlayerInfo[] = []



  playerPropsArray: PlayerProp[] = [{
    name: '',
    id: '',
    description: '',
    price: '',
    point: '',
    event: '',
    isDisabled: false,
    percentTotal: '',
    percentTeam: '',
    avgTotal: '',
    avgTeam: '',
    team1: '',
    team2: '',
    isOpened: false,
    teamAgainst: '',
    averageDifferential: '',
    gamesPlayed: "",
    gamesPlayedvsTeam: "",
    average2022: "",
    average2022vsTeam: ""
  }];
  mlbPlayerId: MlbPlayerid[] = [{
    Name: '',
    Id: '',
    teamName: '',
    teamId: ''
  }]
  playerPropObjectArray: any[] = [];
  public dates: string[] = [];
  public games: GameId[] = [];

  public displayPropHtml1 =
    {
      name: '',
      abvr: '',
      h2h: 0,
      spreadPoint: 0,
      spreadPrice: 0,
      totalPoint: 0,
      totalPrice: 0,
      commenceTime: ''
    };
  public displayPropHtml2 =
    {
      name: '',
      abvr: '',
      h2h: 0,
      spreadPoint: 0,
      spreadPrice: 0,
      totalPoint: 0,
      totalPrice: 0,
      commenceTime: ''
    };

  public selectedTab: number = 0;
  listOfSupportedSports: string[] = ["NBA"];
  sportsToTitle: SportsTitleToName = {
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
  gamePropData: ISportsBook[] = []
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


  initializeSport(): void {
    if (this.route.snapshot.paramMap.get('sport') != null) {
      this.selectedSport = this.route.snapshot.paramMap.get('sport')
    }
    if (this.route.snapshot.paramMap.get('game') != null) {

      //this.selectedGame = this.route.params.subscribe((newPathParams) => console.log(newPathParams));
      //this.selectedGame = this.route.snapshot.paramMap.get('game')
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

  /* public trimSports(sports: any) {
    //need to figure out a way to order the sports but for now just show the main ones

    sports.forEach((sport: { title: string; }) => {
      this.listOfSupportedSports.forEach(s => {
        if (sport.title == s) {
          this.sportsNew.push(sport);
        }
      })
    });
    this.selectedSport = this.sportsNew[0].title;
  } */

  setSelectedDate(date: string) {
    this.selectedDate = date;
  }
  setSelectedSport(sport: string) {
    this.selectedSport = sport;
  }
  setSelectedGame(game: string) {
    this.selectedGame = game
  }




  /* async onSportClick(sport: any) {
    this.selectedDate = ''
    this.setSelectedSport(sport.tab.textLabel);
    //await this.checkSportPlayerInfoDb();
    //await this.checkPlayerInfoDb();
    this.sportsBookDataFinal = await SportsBookController.loadSportBook(this.selectedSport)
    //await this.checkSportsBookDb();

    this.updateDates();




  } */
  /* onDateClick(date: any) {
    this.setSelectedDate(date.tab.textLabel);
    this.updateGames();
  } */
  async onGameClick(game: string) {
    this.setSelectedGame(game);
    /* this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams:  this.selectedGame,
        queryParamsHandling: 'merge'
      }
    ); */
    this.router.navigate([`/props/${this.selectedSport}/${this.selectedGame}`])
    this.selectedSportGamesFinal.forEach(e => e[0].selected = false)
    let selectedGame = this.selectedSportGamesFinal.filter(e => e[0][0].bookId == this.selectedGame)
    selectedGame[0][0].selected = true


    this.playerPropsClicked = false;
    this.gamePropsClicked = true;
    this.displayProp();


  }





  //adding items to checkout
  addPropToChechout(event: any) {
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
    this.checkoutArray = event;
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


  testFunc(event: any) {
  }

  convertSport(sport: any) {
    return this.sportsToTitle[sport];
  }



  updateDates() {
    this.dates = [];
    this.sportsBookDataFinal.forEach((x) => {
      if (!this.dates.includes(reusedFunctions.convertDate(x.commenceTime))) {
        this.dates.push(reusedFunctions.convertDate(x.commenceTime));
      }
    });
    this.setSelectedDate(this.dates[0])
    this.updateGames();
  }
  updateGames() {
    this.games = [];
    this.sportsBookDataFinal.forEach((x) => {
      if (this.selectedDate == reusedFunctions.convertDate(x.commenceTime)) {
        let check = this.games.filter((e) => e.id == x.bookId)
        if (check.length == 0) {
          this.games.push({ game: `${x.homeTeam} vs ${x.awayTeam}`, id: x.bookId });
        }

      }
    });
  }
  public teamPropFinnal: any = []
  public selectedTotalAwayProp: number = 0
  public selectedTotalHomeProp: number = 0
  async displayProp() {
    this.teamPropIsLoading = true

    const tempProp = this.selectedSportGames.filter((x) => x.bookId == this.selectedGame);
    var name1 = '';
    var h2h = 0;
    var spreadPoint = 0;
    var spreadPrice = 0;
    var totalPoint = 0;
    var totalPrice = 0
    var teamInfo: any[] = []
    var logo = ''
    this.team1GameStats = []
    this.team2GameStats = []
    this.team1GameStatsReversed = []
    this.team2GameStatsReversed = []



    var team1 = tempProp.filter((e) => e.teamName == e.homeTeam)
    var team2 = tempProp.filter((e) => e.teamName == e.awayTeam)
    console.log(team1)

    let distinctProps = tempProp.map(e => e.marketKey).filter((value,index,array) => array.indexOf(value) === index)
   


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
    
    //the player prop data brings back every single prop and each of those props has two entries per person if its over or under
    //need to go through each distinct prop and find the ones per name and then load those into the final array 
    
    for(let prop of uniquePlayerProps){
      let propSpecificArray: any[] = []
      let uniquePlayerNames = this.playerPropData.filter(e => e.marketKey == prop).map(e => e.playerName).filter((value, index, array) => array.indexOf(value) === index)
      
      for(let player of uniquePlayerNames){
        let filteredPlayer = this.playerPropData.filter(e => e.playerName == player && e.marketKey == prop)
        
        propSpecificArray = propSpecificArray.concat(filteredPlayer)
        
      }
      
      this.playerPropDataFinal.push(propSpecificArray)
    }
    
    
    

    //figure out a way to display the team props with ngfor just like the player props. 
    //That means I need to refactor how the array gets populated

    name1 = team1[0].teamName;
    h2h = team1.filter((e) => e.marketKey == "h2h")[0].price;
    let spreadProp = team1.filter((e) => e.marketKey == "spreads")
    if (spreadProp.length > 0) {
      spreadPoint = spreadProp[0].point
    }
    else {
      spreadPoint = 0
    }
    let spreadPriceProp = team1.filter((e) => e.marketKey == "spreads")
    if (spreadPriceProp.length > 0) {
      spreadPrice = spreadPriceProp[0].price
    }
    else {
      spreadPrice = 0
    }
    totalPoint = tempProp.filter((e) => e.marketKey == "totals" && e.teamName == "Over")[0].point;
    totalPrice = tempProp.filter((e) => e.marketKey == "totals" && e.teamName == "Over")[0].price;
    this.selectedTotalAwayProp = totalPoint
    this.calculateNewTotalChance(totalPoint, 'away')
    this.homeAlternateSpreadstemp.forEach(e => {
      this.homeAlternateSpreads.push({point: e.point, price: e.price})
    })
    this.homeAlternateSpreads.push({point: spreadPoint, price: spreadPrice})
    this.homeAlternateSpreads = this.homeAlternateSpreads.sort(function (a, b) { return a.point - b.point })
    this.homeAlternateSpreads = this.homeAlternateSpreads.filter((value, index, array) => array.indexOf(value) === index)
    this.team1SelectedSpreadPoint = spreadPoint
    this.team1SelectedSpreadPrice = spreadPrice
    let abvr = ''
    if (this.selectedSport == "MLB") {
      abvr = MlbService.mlbTeamNameToAbvr[name1]
    }
    this.displayPropHtml1 = ({ name: name1, abvr: abvr, h2h: h2h, spreadPoint: spreadPoint, spreadPrice: spreadPrice, totalPoint: totalPoint, totalPrice: totalPrice, commenceTime: reusedFunctions.convertTimestampToTime(spreadPriceProp[0].commenceTime.toString()) });
    
    name1 = team2[0].teamName;
    h2h = team2.filter((e) => e.marketKey == "h2h")[0].price;
    spreadProp = team2.filter((e) => e.marketKey == "spreads")
    if (spreadProp.length > 0) {
      spreadPoint = spreadProp[0].point
    }
    else {
      spreadPoint = 0
    }
    spreadPriceProp = team2.filter((e) => e.marketKey == "spreads")
    if (spreadPriceProp.length > 0) {
      spreadPrice = spreadPriceProp[0].price
    }
    else {
      spreadPrice = 0
    }
    if (this.selectedSport == "MLB") {
      abvr = MlbService.mlbTeamNameToAbvr[name1]
    }
    this.awayAlternateSpreadstemp.forEach(e => {
      this.awayAlternateSpreads.push({point: e.point, price: e.price})
    })
    this.awayAlternateSpreads.push({point: spreadPoint, price: spreadPrice})
    this.awayAlternateSpreads = this.awayAlternateSpreads.sort(function (a, b) { return a.point - b.point })
    this.awayAlternateSpreads = this.awayAlternateSpreads.filter((value, index, array) => array.indexOf(value) === index)
    totalPoint = tempProp.filter((e) => e.marketKey == "totals" && e.teamName == "Under")[0].point;
    totalPrice = tempProp.filter((e) => e.marketKey == "totals" && e.teamName == "Under")[0].price;
    this.calculateNewTotalChance(totalPoint, 'home')
    this.displayPropHtml2 = ({ name: name1, abvr: abvr, h2h: h2h, spreadPoint: spreadPoint, spreadPrice: spreadPrice, totalPoint: totalPoint, totalPrice: totalPrice, commenceTime: reusedFunctions.convertTimestampToTime(spreadPriceProp[0].commenceTime.toString()) });
    this.team2SelectedSpreadPoint = spreadPoint
    this.team2SelectedSpreadPrice = spreadPrice

    this.computeTeamsGameStats(this.team1GameStats, this.team2GameStats)
    await this.loadPlayerStatData(MlbService.mlbTeamIds[MlbService.mlbTeamNameToAbvr[team1[0].teamName]], MlbService.mlbTeamIds[MlbService.mlbTeamNameToAbvr[team2[0].teamName]])
    this.teamPropIsLoading = false
  }

  computeTeamsGameStats(team1: any[], team2: any[]) {
    if (this.selectedSport == "NBA") {
      this.team1GameVsOpponentData = []
      this.team1GameStatsDtoNBA = {
        gamesWon: 0,
        gamesLost: 0,
        gamesWonVsOpponent: 0,
        gamesLostVsOpponent: 0,
        gamesWonHome: 0,
        gamesLostHome: 0,
        gamesWonAway: 0,
        gamesLostAway: 0,
        halfOneWon: 0,
        halfOneLost: 0,
        halfTwoWon: 0,
        halfTwoLost: 0,
        quarterOneWon: 0,
        quarterOneLost: 0,
        quarterTwoWon: 0,
        quarterTwoLost: 0,
        quarterThreeWon: 0,
        quarterThreeLost: 0,
        quarterFourWon: 0,
        quarterFourLost: 0,
        halfOneWonVsOpponent: 0,
        halfOneLostVsOpponent: 0,
        halfTwoWonVsOpponent: 0,
        halfTwoLostVsOpponent: 0,
        quarterOneWonVsOpponent: 0,
        quarterOneLostVsOpponent: 0,
        quarterTwoWonVsOpponent: 0,
        quarterTwoLostVsOpponent: 0,
        quarterThreeWonVsOpponent: 0,
        quarterThreeLostVsOpponent: 0,
        quarterFourWonVsOpponent: 0,
        quarterFourLostVsOpponent: 0,
        halfOneWonHome: 0,
        halfOneLostHome: 0,
        halfOneWonAway: 0,
        halfOneLostAway: 0,
        halfTwoWonHome: 0,
        halfTwoLostHome: 0,
        halfTwoWonAway: 0,
        halfTwoLostAway: 0,
        quarterOneWonHome: 0,
        quarterOneLostHome: 0,
        quarterOneWonAway: 0,
        quarterOneLostAway: 0,
        quarterTwoWonHome: 0,
        quarterTwoLostHome: 0,
        quarterTwoWonAway: 0,
        quarterTwoLostAway: 0,
        quarterThreeWonHome: 0,
        quarterThreeLostHome: 0,
        quarterThreeWonAway: 0,
        quarterThreeLostAway: 0,
        quarterFourWonHome: 0,
        quarterFourLostHome: 0,
        quarterFourWonAway: 0,
        quarterFourLostAway: 0,
        spreadGame: 0,
        spreadFirstHalf: 0,
        spreadSecondHalf: 0,
        spreadFirstQuarter: 0,
        spreadSecondQuarter: 0,
        spreadThirdQuarter: 0,
        spreadFourthQuarter: 0,
        spreadVsOpponent: 0,
        spreadFirstHalfVsOpponent: 0,
        spreadSecondHalfVsOpponent: 0,
        spreadFirstQuarterVsOpponent: 0,
        spreadSecondQuarterVsOpponet: 0,
        spreadThirdQuarterVsOpponent: 0,
        spreadFourthQuarterVsOpponent: 0,
        spreadHome: 0,
        spreadHomeFirstHalf: 0,
        spreadHomeSecondHalf: 0,
        spreadHomeFirstQuarter: 0,
        spreadHomeSecondQuarter: 0,
        spreadHomeThirdQuarter: 0,
        spreadHomeFourthQuarter: 0,
        spreadAway: 0,
        spreadAwayFirstHalf: 0,
        spreadAwaySecondHalf: 0,
        spreadAwayFirstQuarter: 0,
        spreadAwaySecondQuarter: 0,
        spreadAwayThirdQuarter: 0,
        spreadAwayFourthQuarter: 0,
        totalOverall: 0,
        totalOverallFirstHalf: 0,
        totalOverallSecondHalf: 0,
        totalOverallFirstQuarter: 0,
        totalOverallSecondQuarter: 0,
        totalOverallThirdQuarter: 0,
        totalOverallFourthQuarter: 0,
        totalVsTeam: 0,
        totalVsTeamFirstHalf: 0,
        totalVsTeamSecondHalf: 0,
        totalVsTeamFirstQuarter: 0,
        totalVsTeamSecondQuarter: 0,
        totalVsTeamThirdQuarter: 0,
        totalVsTeamFourthQuarter: 0,
        totalHome: 0,
        totalHomeFirstHalf: 0,
        totalHomeSecondHalf: 0,
        totalHomeFirstQuarter: 0,
        totalHomeSecondQuarter: 0,
        totalHomeThirdQuarter: 0,
        totalHomeFourthQuarter: 0,
        totalAway: 0,
        totalAwayFirstHalf: 0,
        totalAwaySecondHalf: 0,
        totalAwayFirstQuarter: 0,
        totalAwaySecondQuarter: 0,
        totalAwayThirdQuarter: 0,
        totalAwayFourthQuarter: 0,
        pointsScoredOverallGame: 0,
        pointsScoredOverallFirstHalf: 0,
        pointsScoredOverallSecondHalf: 0,
        pointsScoredOverallFirstQuarter: 0,
        pointsScoredOverallSecondQuarter: 0,
        pointsScoredOverallThirdQuarter: 0,
        pointsScoredOverallFourthQuarter: 0,
        pointsScoredVsTeamGame: 0,
        pointsScoredVsTeamFirstHalf: 0,
        pointsScoredVsTeamSecondHalf: 0,
        pointsScoredVsTeamFirstQuarter: 0,
        pointsScoredVsTeamSecondQuarter: 0,
        pointsScoredVsTeamThirdQuarter: 0,
        pointsScoredVsTeamFourthQuarter: 0,
        pointsScoredHomeGame: 0,
        pointsScoredHomeFirstHalf: 0,
        pointsScoredHomeSecondHalf: 0,
        pointsScoredHomeFirstQuarter: 0,
        pointsScoredHomeSecondQuarter: 0,
        pointsScoredHomeThirdQuarter: 0,
        pointsScoredHomeFourthQuarter: 0,
        pointsScoredAwayGame: 0,
        pointsScoredAwayFirstHalf: 0,
        pointsScoredAwaySecondHalf: 0,
        pointsScoredAwayFirstQuarter: 0,
        pointsScoredAwaySecondQuarter: 0,
        pointsScoredAwayThirdQuarter: 0,
        pointsScoredAwayFourthQuarter: 0,
        pointsAllowedOverallGame: 0,
        pointsAllowedOverallFirstHalf: 0,
        pointsAllowedOverallSecondHalf: 0,
        pointsAllowedOverallFirstQuarter: 0,
        pointsAllowedOverallSecondQuarter: 0,
        pointsAllowedOverallThirdQuarter: 0,
        pointsAllowedOverallFourthQuarter: 0,
        pointsAllowedVsTeamGame: 0,
        pointsAllowedVsTeamFirstHalf: 0,
        pointsAllowedVsTeamSecondHalf: 0,
        pointsAllowedVsTeamFirstQuarter: 0,
        pointsAllowedVsTeamSecondQuarter: 0,
        pointsAllowedVsTeamThirdQuarter: 0,
        pointsAllowedVsTeamFourthQuarter: 0,
        pointsAllowedHomeGame: 0,
        pointsAllowedHomeFirstHalf: 0,
        pointsAllowedHomeSecondHalf: 0,
        pointsAllowedHomeFirstQuarter: 0,
        pointsAllowedHomeSecondQuarter: 0,
        pointsAllowedHomeThirdQuarter: 0,
        pointsAllowedHomeFourthQuarter: 0,
        pointsAllowedAwayGame: 0,
        pointsAllowedAwayFirstHalf: 0,
        pointsAllowedAwaySecondHalf: 0,
        pointsAllowedAwayFirstQuarter: 0,
        pointsAllowedAwaySecondQuarter: 0,
        pointsAllowedAwayThirdQuarter: 0,
        pointsAllowedAwayFourthQuarter: 0,
      }
      this.team2GameStatsDtoNBA = {
        gamesWon: 0,
        gamesLost: 0,
        gamesWonVsOpponent: 0,
        gamesLostVsOpponent: 0,
        gamesWonHome: 0,
        gamesLostHome: 0,
        gamesWonAway: 0,
        gamesLostAway: 0,
        halfOneWon: 0,
        halfOneLost: 0,
        halfTwoWon: 0,
        halfTwoLost: 0,
        quarterOneWon: 0,
        quarterOneLost: 0,
        quarterTwoWon: 0,
        quarterTwoLost: 0,
        quarterThreeWon: 0,
        quarterThreeLost: 0,
        quarterFourWon: 0,
        quarterFourLost: 0,
        halfOneWonVsOpponent: 0,
        halfOneLostVsOpponent: 0,
        halfTwoWonVsOpponent: 0,
        halfTwoLostVsOpponent: 0,
        quarterOneWonVsOpponent: 0,
        quarterOneLostVsOpponent: 0,
        quarterTwoWonVsOpponent: 0,
        quarterTwoLostVsOpponent: 0,
        quarterThreeWonVsOpponent: 0,
        quarterThreeLostVsOpponent: 0,
        quarterFourWonVsOpponent: 0,
        quarterFourLostVsOpponent: 0,
        halfOneWonHome: 0,
        halfOneLostHome: 0,
        halfOneWonAway: 0,
        halfOneLostAway: 0,
        halfTwoWonHome: 0,
        halfTwoLostHome: 0,
        halfTwoWonAway: 0,
        halfTwoLostAway: 0,
        quarterOneWonHome: 0,
        quarterOneLostHome: 0,
        quarterOneWonAway: 0,
        quarterOneLostAway: 0,
        quarterTwoWonHome: 0,
        quarterTwoLostHome: 0,
        quarterTwoWonAway: 0,
        quarterTwoLostAway: 0,
        quarterThreeWonHome: 0,
        quarterThreeLostHome: 0,
        quarterThreeWonAway: 0,
        quarterThreeLostAway: 0,
        quarterFourWonHome: 0,
        quarterFourLostHome: 0,
        quarterFourWonAway: 0,
        quarterFourLostAway: 0,
        spreadGame: 0,
        spreadFirstHalf: 0,
        spreadSecondHalf: 0,
        spreadFirstQuarter: 0,
        spreadSecondQuarter: 0,
        spreadThirdQuarter: 0,
        spreadFourthQuarter: 0,
        spreadVsOpponent: 0,
        spreadFirstHalfVsOpponent: 0,
        spreadSecondHalfVsOpponent: 0,
        spreadFirstQuarterVsOpponent: 0,
        spreadSecondQuarterVsOpponet: 0,
        spreadThirdQuarterVsOpponent: 0,
        spreadFourthQuarterVsOpponent: 0,
        spreadHome: 0,
        spreadHomeFirstHalf: 0,
        spreadHomeSecondHalf: 0,
        spreadHomeFirstQuarter: 0,
        spreadHomeSecondQuarter: 0,
        spreadHomeThirdQuarter: 0,
        spreadHomeFourthQuarter: 0,
        spreadAway: 0,
        spreadAwayFirstHalf: 0,
        spreadAwaySecondHalf: 0,
        spreadAwayFirstQuarter: 0,
        spreadAwaySecondQuarter: 0,
        spreadAwayThirdQuarter: 0,
        spreadAwayFourthQuarter: 0,
        totalOverall: 0,
        totalOverallFirstHalf: 0,
        totalOverallSecondHalf: 0,
        totalOverallFirstQuarter: 0,
        totalOverallSecondQuarter: 0,
        totalOverallThirdQuarter: 0,
        totalOverallFourthQuarter: 0,
        totalVsTeam: 0,
        totalVsTeamFirstHalf: 0,
        totalVsTeamSecondHalf: 0,
        totalVsTeamFirstQuarter: 0,
        totalVsTeamSecondQuarter: 0,
        totalVsTeamThirdQuarter: 0,
        totalVsTeamFourthQuarter: 0,
        totalHome: 0,
        totalHomeFirstHalf: 0,
        totalHomeSecondHalf: 0,
        totalHomeFirstQuarter: 0,
        totalHomeSecondQuarter: 0,
        totalHomeThirdQuarter: 0,
        totalHomeFourthQuarter: 0,
        totalAway: 0,
        totalAwayFirstHalf: 0,
        totalAwaySecondHalf: 0,
        totalAwayFirstQuarter: 0,
        totalAwaySecondQuarter: 0,
        totalAwayThirdQuarter: 0,
        totalAwayFourthQuarter: 0,
        pointsScoredOverallGame: 0,
        pointsScoredOverallFirstHalf: 0,
        pointsScoredOverallSecondHalf: 0,
        pointsScoredOverallFirstQuarter: 0,
        pointsScoredOverallSecondQuarter: 0,
        pointsScoredOverallThirdQuarter: 0,
        pointsScoredOverallFourthQuarter: 0,
        pointsScoredVsTeamGame: 0,
        pointsScoredVsTeamFirstHalf: 0,
        pointsScoredVsTeamSecondHalf: 0,
        pointsScoredVsTeamFirstQuarter: 0,
        pointsScoredVsTeamSecondQuarter: 0,
        pointsScoredVsTeamThirdQuarter: 0,
        pointsScoredVsTeamFourthQuarter: 0,
        pointsScoredHomeGame: 0,
        pointsScoredHomeFirstHalf: 0,
        pointsScoredHomeSecondHalf: 0,
        pointsScoredHomeFirstQuarter: 0,
        pointsScoredHomeSecondQuarter: 0,
        pointsScoredHomeThirdQuarter: 0,
        pointsScoredHomeFourthQuarter: 0,
        pointsScoredAwayGame: 0,
        pointsScoredAwayFirstHalf: 0,
        pointsScoredAwaySecondHalf: 0,
        pointsScoredAwayFirstQuarter: 0,
        pointsScoredAwaySecondQuarter: 0,
        pointsScoredAwayThirdQuarter: 0,
        pointsScoredAwayFourthQuarter: 0,
        pointsAllowedOverallGame: 0,
        pointsAllowedOverallFirstHalf: 0,
        pointsAllowedOverallSecondHalf: 0,
        pointsAllowedOverallFirstQuarter: 0,
        pointsAllowedOverallSecondQuarter: 0,
        pointsAllowedOverallThirdQuarter: 0,
        pointsAllowedOverallFourthQuarter: 0,
        pointsAllowedVsTeamGame: 0,
        pointsAllowedVsTeamFirstHalf: 0,
        pointsAllowedVsTeamSecondHalf: 0,
        pointsAllowedVsTeamFirstQuarter: 0,
        pointsAllowedVsTeamSecondQuarter: 0,
        pointsAllowedVsTeamThirdQuarter: 0,
        pointsAllowedVsTeamFourthQuarter: 0,
        pointsAllowedHomeGame: 0,
        pointsAllowedHomeFirstHalf: 0,
        pointsAllowedHomeSecondHalf: 0,
        pointsAllowedHomeFirstQuarter: 0,
        pointsAllowedHomeSecondQuarter: 0,
        pointsAllowedHomeThirdQuarter: 0,
        pointsAllowedHomeFourthQuarter: 0,
        pointsAllowedAwayGame: 0,
        pointsAllowedAwayFirstHalf: 0,
        pointsAllowedAwaySecondHalf: 0,
        pointsAllowedAwayFirstQuarter: 0,
        pointsAllowedAwaySecondQuarter: 0,
        pointsAllowedAwayThirdQuarter: 0,
        pointsAllowedAwayFourthQuarter: 0,
      }
      var i
      team1.forEach(e => {
        e.result == "Win" ? this.team1GameStatsDtoNBA.gamesWon += 1 : this.team1GameStatsDtoNBA.gamesLost += 1
        e.teamAgainstId == team2[0].teamId ? (e.result == "Win" ? this.team1GameStatsDtoNBA.gamesWonVsOpponent += 1 : this.team1GameStatsDtoNBA.gamesLostVsOpponent += 1) : i = 0;
        e.homeOrAway == "Home" ? (e.result == "Win" ? this.team1GameStatsDtoNBA.gamesWonHome += 1 : this.team1GameStatsDtoNBA.gamesLostHome += 1) : (e.result == "Win" ? this.team1GameStatsDtoNBA.gamesWonAway += 1 : this.team1GameStatsDtoNBA.gamesLostAway += 1);
        e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team1GameStatsDtoNBA.quarterOneWon += 1 : this.team1GameStatsDtoNBA.quarterOneLost += 1;
        e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team1GameStatsDtoNBA.quarterTwoWon += 1 : this.team1GameStatsDtoNBA.quarterTwoLost += 1;
        e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team1GameStatsDtoNBA.quarterThreeWon += 1 : this.team1GameStatsDtoNBA.quarterThreeLost += 1;
        e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team1GameStatsDtoNBA.quarterFourWon += 1 : this.team1GameStatsDtoNBA.quarterFourLost += 1;
        (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team1GameStatsDtoNBA.halfOneWon += 1 : this.team1GameStatsDtoNBA.halfOneLost += 1;
        (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team1GameStatsDtoNBA.halfTwoWon += 1 : this.team1GameStatsDtoNBA.halfTwoLost += 1;
        this.team1GameStatsDtoNBA.spreadGame += (e.pointsAllowedOverall - e.pointsScoredOverall);
        this.team1GameStatsDtoNBA.spreadFirstHalf += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
        this.team1GameStatsDtoNBA.spreadSecondHalf += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
        this.team1GameStatsDtoNBA.spreadFirstQuarter += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
        this.team1GameStatsDtoNBA.spreadSecondQuarter += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
        this.team1GameStatsDtoNBA.spreadThirdQuarter += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
        this.team1GameStatsDtoNBA.spreadFourthQuarter += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
        this.team1GameStatsDtoNBA.totalOverall += e.pointsScoredOverall + e.pointsAllowedOverall;
        this.team1GameStatsDtoNBA.totalOverallFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
        this.team1GameStatsDtoNBA.totalOverallSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
        this.team1GameStatsDtoNBA.totalOverallFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
        this.team1GameStatsDtoNBA.totalOverallSecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
        this.team1GameStatsDtoNBA.totalOverallThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
        this.team1GameStatsDtoNBA.totalOverallFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
        this.team1GameStatsDtoNBA.pointsScoredOverallGame += e.pointsScoredOverall
        this.team1GameStatsDtoNBA.pointsScoredOverallFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter
        this.team1GameStatsDtoNBA.pointsScoredOverallSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
        this.team1GameStatsDtoNBA.pointsScoredOverallFirstQuarter += e.pointsScoredFirstQuarter
        this.team1GameStatsDtoNBA.pointsScoredOverallSecondQuarter += e.pointsScoredSecondQuarter
        this.team1GameStatsDtoNBA.pointsScoredOverallThirdQuarter += e.pointsScoredThirdQuarter
        this.team1GameStatsDtoNBA.pointsScoredOverallFourthQuarter += e.pointsScoredFourthQuarter
        this.team1GameStatsDtoNBA.pointsAllowedOverallGame += e.pointsAllowedOverall
        this.team1GameStatsDtoNBA.pointsAllowedOverallFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
        this.team1GameStatsDtoNBA.pointsAllowedOverallSecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
        this.team1GameStatsDtoNBA.pointsAllowedOverallFirstQuarter += e.pointsAllowedFirstQuarter
        this.team1GameStatsDtoNBA.pointsAllowedOverallSecondQuarter += e.pointsAllowedSecondQuarter
        this.team1GameStatsDtoNBA.pointsAllowedOverallThirdQuarter += e.pointsAllowedThirdQuarter
        this.team1GameStatsDtoNBA.pointsAllowedOverallFourthQuarter += e.pointsAllowedFourthQuarter

        if (e.teamAgainstId == team2[0].teamId) {
          if (e.homeOrAway == "Home") {
            this.team1GameVsOpponentData.push({ data: e, homeOrAway: "home" })
          }
          else {
            this.team1GameVsOpponentData.push({ data: e, homeOrAway: "away" })
          }

          e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team1GameStatsDtoNBA.quarterOneWonVsOpponent += 1 : this.team1GameStatsDtoNBA.quarterOneLostVsOpponent += 1;
          e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team1GameStatsDtoNBA.quarterTwoWonVsOpponent += 1 : this.team1GameStatsDtoNBA.quarterTwoLostVsOpponent += 1;
          e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team1GameStatsDtoNBA.quarterThreeWonVsOpponent += 1 : this.team1GameStatsDtoNBA.quarterThreeLostVsOpponent += 1;
          e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team1GameStatsDtoNBA.quarterFourWonVsOpponent += 1 : this.team1GameStatsDtoNBA.quarterFourLostVsOpponent += 1;
          (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team1GameStatsDtoNBA.halfOneWonVsOpponent += 1 : this.team1GameStatsDtoNBA.halfOneLostVsOpponent += 1;
          (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team1GameStatsDtoNBA.halfTwoWonVsOpponent += 1 : this.team1GameStatsDtoNBA.halfTwoLostVsOpponent += 1;
          this.team1GameStatsDtoNBA.spreadVsOpponent += (e.pointsAllowedOverall - e.pointsScoredOverall);
          this.team1GameStatsDtoNBA.spreadFirstHalfVsOpponent += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
          this.team1GameStatsDtoNBA.spreadSecondHalfVsOpponent += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
          this.team1GameStatsDtoNBA.spreadFirstQuarterVsOpponent += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
          this.team1GameStatsDtoNBA.spreadSecondQuarterVsOpponet += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
          this.team1GameStatsDtoNBA.spreadThirdQuarterVsOpponent += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
          this.team1GameStatsDtoNBA.spreadFourthQuarterVsOpponent += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
          this.team1GameStatsDtoNBA.totalVsTeam += e.pointsScoredOverall + e.pointsAllowedOverall;
          this.team1GameStatsDtoNBA.totalVsTeamFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
          this.team1GameStatsDtoNBA.totalVsTeamSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
          this.team1GameStatsDtoNBA.totalVsTeamFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
          this.team1GameStatsDtoNBA.totalVsTeamSecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
          this.team1GameStatsDtoNBA.totalVsTeamThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
          this.team1GameStatsDtoNBA.totalVsTeamFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
          this.team1GameStatsDtoNBA.pointsScoredVsTeamGame += e.pointsScoredOverall
          this.team1GameStatsDtoNBA.pointsScoredVsTeamFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter
          this.team1GameStatsDtoNBA.pointsScoredVsTeamSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
          this.team1GameStatsDtoNBA.pointsScoredVsTeamFirstQuarter += e.pointsScoredFirstQuarter
          this.team1GameStatsDtoNBA.pointsScoredVsTeamSecondQuarter += e.pointsScoredSecondQuarter
          this.team1GameStatsDtoNBA.pointsScoredVsTeamThirdQuarter += e.pointsScoredThirdQuarter
          this.team1GameStatsDtoNBA.pointsScoredVsTeamFourthQuarter += e.pointsScoredFourthQuarter
          this.team1GameStatsDtoNBA.pointsAllowedVsTeamGame += e.pointsAllowedOverall
          this.team1GameStatsDtoNBA.pointsAllowedVsTeamFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
          this.team1GameStatsDtoNBA.pointsAllowedVsTeamSecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
          this.team1GameStatsDtoNBA.pointsAllowedVsTeamFirstQuarter += e.pointsAllowedFirstQuarter
          this.team1GameStatsDtoNBA.pointsAllowedVsTeamSecondQuarter += e.pointsAllowedSecondQuarter
          this.team1GameStatsDtoNBA.pointsAllowedVsTeamThirdQuarter += e.pointsAllowedThirdQuarter
          this.team1GameStatsDtoNBA.pointsAllowedVsTeamFourthQuarter += e.pointsAllowedFourthQuarter
        }
        if (e.homeOrAway == "Home") {
          e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team1GameStatsDtoNBA.quarterOneWonHome += 1 : this.team1GameStatsDtoNBA.quarterOneLostHome += 1;
          e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team1GameStatsDtoNBA.quarterTwoWonHome += 1 : this.team1GameStatsDtoNBA.quarterTwoLostHome += 1;
          e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team1GameStatsDtoNBA.quarterThreeWonHome += 1 : this.team1GameStatsDtoNBA.quarterThreeLostHome += 1;
          e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team1GameStatsDtoNBA.quarterFourWonHome += 1 : this.team1GameStatsDtoNBA.quarterFourLostHome += 1;
          (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team1GameStatsDtoNBA.halfOneWonHome += 1 : this.team1GameStatsDtoNBA.halfOneLostHome += 1;
          (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team1GameStatsDtoNBA.halfTwoWonHome += 1 : this.team1GameStatsDtoNBA.halfTwoLostHome += 1;
          this.team1GameStatsDtoNBA.spreadHome += (e.pointsAllowedOverall - e.pointsScoredOverall);
          this.team1GameStatsDtoNBA.spreadHomeFirstHalf += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
          this.team1GameStatsDtoNBA.spreadHomeSecondHalf += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
          this.team1GameStatsDtoNBA.spreadHomeFirstQuarter += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
          this.team1GameStatsDtoNBA.spreadHomeSecondQuarter += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
          this.team1GameStatsDtoNBA.spreadHomeThirdQuarter += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
          this.team1GameStatsDtoNBA.spreadHomeFourthQuarter += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
          this.team1GameStatsDtoNBA.totalHome += e.pointsScoredOverall + e.pointsAllowedOverall;
          this.team1GameStatsDtoNBA.totalHomeFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
          this.team1GameStatsDtoNBA.totalHomeSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
          this.team1GameStatsDtoNBA.totalHomeFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
          this.team1GameStatsDtoNBA.totalHomeSecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
          this.team1GameStatsDtoNBA.totalHomeThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
          this.team1GameStatsDtoNBA.totalHomeFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
          this.team1GameStatsDtoNBA.pointsScoredHomeGame += e.pointsScoredOverall
          this.team1GameStatsDtoNBA.pointsScoredHomeFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter
          this.team1GameStatsDtoNBA.pointsScoredHomeSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
          this.team1GameStatsDtoNBA.pointsScoredHomeFirstQuarter += e.pointsScoredFirstQuarter
          this.team1GameStatsDtoNBA.pointsScoredHomeSecondQuarter += e.pointsScoredSecondQuarter
          this.team1GameStatsDtoNBA.pointsScoredHomeThirdQuarter += e.pointsScoredThirdQuarter
          this.team1GameStatsDtoNBA.pointsScoredHomeFourthQuarter += e.pointsScoredFourthQuarter
          this.team1GameStatsDtoNBA.pointsAllowedHomeGame += e.pointsAllowedOverall
          this.team1GameStatsDtoNBA.pointsAllowedHomeFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
          this.team1GameStatsDtoNBA.pointsAllowedHomeSecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
          this.team1GameStatsDtoNBA.pointsAllowedHomeFirstQuarter += e.pointsAllowedFirstQuarter
          this.team1GameStatsDtoNBA.pointsAllowedHomeSecondQuarter += e.pointsAllowedSecondQuarter
          this.team1GameStatsDtoNBA.pointsAllowedHomeThirdQuarter += e.pointsAllowedThirdQuarter
          this.team1GameStatsDtoNBA.pointsAllowedHomeFourthQuarter += e.pointsAllowedFourthQuarter

        }
        else if (e.homeOrAway == "Away") {
          e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team1GameStatsDtoNBA.quarterOneWonAway += 1 : this.team1GameStatsDtoNBA.quarterOneLostAway += 1;
          e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team1GameStatsDtoNBA.quarterTwoWonAway += 1 : this.team1GameStatsDtoNBA.quarterTwoLostAway += 1;
          e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team1GameStatsDtoNBA.quarterThreeWonAway += 1 : this.team1GameStatsDtoNBA.quarterThreeLostAway += 1;
          e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team1GameStatsDtoNBA.quarterFourWonAway += 1 : this.team1GameStatsDtoNBA.quarterFourLostAway += 1;
          (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team1GameStatsDtoNBA.halfOneWonAway += 1 : this.team1GameStatsDtoNBA.halfOneLostAway += 1;
          (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team1GameStatsDtoNBA.halfTwoWonAway += 1 : this.team1GameStatsDtoNBA.halfTwoLostAway += 1;
          this.team1GameStatsDtoNBA.spreadAway += (e.pointsAllowedOverall - e.pointsScoredOverall);
          this.team1GameStatsDtoNBA.spreadAwayFirstHalf += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
          this.team1GameStatsDtoNBA.spreadAwaySecondHalf += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
          this.team1GameStatsDtoNBA.spreadAwayFirstQuarter += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
          this.team1GameStatsDtoNBA.spreadAwaySecondQuarter += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
          this.team1GameStatsDtoNBA.spreadAwayThirdQuarter += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
          this.team1GameStatsDtoNBA.spreadAwayFourthQuarter += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
          this.team1GameStatsDtoNBA.totalAway += e.pointsScoredOverall + e.pointsAllowedOverall;
          this.team1GameStatsDtoNBA.totalAwayFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
          this.team1GameStatsDtoNBA.totalAwaySecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
          this.team1GameStatsDtoNBA.totalAwayFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
          this.team1GameStatsDtoNBA.totalAwaySecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
          this.team1GameStatsDtoNBA.totalAwayThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
          this.team1GameStatsDtoNBA.totalAwayFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
          this.team1GameStatsDtoNBA.pointsScoredAwayGame += e.pointsScoredOverall
          this.team1GameStatsDtoNBA.pointsScoredAwayFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter
          this.team1GameStatsDtoNBA.pointsScoredAwaySecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
          this.team1GameStatsDtoNBA.pointsScoredAwayFirstQuarter += e.pointsScoredFirstQuarter
          this.team1GameStatsDtoNBA.pointsScoredAwaySecondQuarter += e.pointsScoredSecondQuarter
          this.team1GameStatsDtoNBA.pointsScoredAwayThirdQuarter += e.pointsScoredThirdQuarter
          this.team1GameStatsDtoNBA.pointsScoredAwayFourthQuarter += e.pointsScoredFourthQuarter
          this.team1GameStatsDtoNBA.pointsAllowedAwayGame += e.pointsAllowedOverall
          this.team1GameStatsDtoNBA.pointsAllowedAwayFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
          this.team1GameStatsDtoNBA.pointsAllowedAwaySecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
          this.team1GameStatsDtoNBA.pointsAllowedAwayFirstQuarter += e.pointsAllowedFirstQuarter
          this.team1GameStatsDtoNBA.pointsAllowedAwaySecondQuarter += e.pointsAllowedSecondQuarter
          this.team1GameStatsDtoNBA.pointsAllowedAwayThirdQuarter += e.pointsAllowedThirdQuarter
          this.team1GameStatsDtoNBA.pointsAllowedAwayFourthQuarter += e.pointsAllowedFourthQuarter
        }


      })

      team2.forEach(e => {
        e.result == "Win" ? this.team2GameStatsDtoNBA.gamesWon += 1 : this.team2GameStatsDtoNBA.gamesLost += 1
        e.teamAgainstId == team1[0].teamId ? (e.result == "Win" ? this.team2GameStatsDtoNBA.gamesWonVsOpponent += 1 : this.team2GameStatsDtoNBA.gamesLostVsOpponent += 1) : i = 0;
        e.homeOrAway == "Home" ? (e.result == "Win" ? this.team2GameStatsDtoNBA.gamesWonHome += 1 : this.team2GameStatsDtoNBA.gamesLostHome += 1) : (e.result == "Win" ? this.team2GameStatsDtoNBA.gamesWonAway += 1 : this.team2GameStatsDtoNBA.gamesLostAway += 1);
        e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team2GameStatsDtoNBA.quarterOneWon += 1 : this.team2GameStatsDtoNBA.quarterOneLost += 1;
        e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team2GameStatsDtoNBA.quarterTwoWon += 1 : this.team2GameStatsDtoNBA.quarterTwoLost += 1;
        e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team2GameStatsDtoNBA.quarterThreeWon += 1 : this.team2GameStatsDtoNBA.quarterThreeLost += 1;
        e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team2GameStatsDtoNBA.quarterFourWon += 1 : this.team2GameStatsDtoNBA.quarterFourLost += 1;
        (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team2GameStatsDtoNBA.halfOneWon += 1 : this.team2GameStatsDtoNBA.halfOneLost += 1;
        (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team2GameStatsDtoNBA.halfTwoWon += 1 : this.team2GameStatsDtoNBA.halfTwoLost += 1;
        this.team2GameStatsDtoNBA.spreadGame += (e.pointsAllowedOverall - e.pointsScoredOverall);
        this.team2GameStatsDtoNBA.spreadFirstHalf += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
        this.team2GameStatsDtoNBA.spreadSecondHalf += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
        this.team2GameStatsDtoNBA.spreadFirstQuarter += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
        this.team2GameStatsDtoNBA.spreadSecondQuarter += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
        this.team2GameStatsDtoNBA.spreadThirdQuarter += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
        this.team2GameStatsDtoNBA.spreadFourthQuarter += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
        this.team2GameStatsDtoNBA.totalOverall += e.pointsScoredOverall + e.pointsAllowedOverall;
        this.team2GameStatsDtoNBA.totalOverallFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
        this.team2GameStatsDtoNBA.totalOverallSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
        this.team2GameStatsDtoNBA.totalOverallFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
        this.team2GameStatsDtoNBA.totalOverallSecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
        this.team2GameStatsDtoNBA.totalOverallThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
        this.team2GameStatsDtoNBA.totalOverallFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
        this.team2GameStatsDtoNBA.pointsScoredOverallGame += e.pointsScoredOverall
        this.team2GameStatsDtoNBA.pointsScoredOverallSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
        this.team2GameStatsDtoNBA.pointsScoredOverallFirstQuarter += e.pointsScoredFirstQuarter
        this.team2GameStatsDtoNBA.pointsScoredOverallSecondQuarter += e.pointsScoredSecondQuarter
        this.team2GameStatsDtoNBA.pointsScoredOverallThirdQuarter += e.pointsScoredThirdQuarter
        this.team2GameStatsDtoNBA.pointsScoredOverallFourthQuarter += e.pointsScoredFourthQuarter
        this.team2GameStatsDtoNBA.pointsAllowedOverallGame += e.pointsAllowedOverall
        this.team2GameStatsDtoNBA.pointsAllowedOverallFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
        this.team2GameStatsDtoNBA.pointsAllowedOverallSecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
        this.team2GameStatsDtoNBA.pointsAllowedOverallFirstQuarter += e.pointsAllowedFirstQuarter
        this.team2GameStatsDtoNBA.pointsAllowedOverallSecondQuarter += e.pointsAllowedSecondQuarter
        this.team2GameStatsDtoNBA.pointsAllowedOverallThirdQuarter += e.pointsAllowedThirdQuarter
        this.team2GameStatsDtoNBA.pointsAllowedOverallFourthQuarter += e.pointsAllowedFourthQuarter
        if (e.teamAgainstId == team1[0].teamId) {
          e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team2GameStatsDtoNBA.quarterOneWonVsOpponent += 1 : this.team2GameStatsDtoNBA.quarterOneLostVsOpponent += 1;
          e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team2GameStatsDtoNBA.quarterTwoWonVsOpponent += 1 : this.team2GameStatsDtoNBA.quarterTwoLostVsOpponent += 1;
          e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team2GameStatsDtoNBA.quarterThreeWonVsOpponent += 1 : this.team2GameStatsDtoNBA.quarterThreeLostVsOpponent += 1;
          e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team2GameStatsDtoNBA.quarterFourWonVsOpponent += 1 : this.team2GameStatsDtoNBA.quarterFourLostVsOpponent += 1;
          (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team2GameStatsDtoNBA.halfOneWonVsOpponent += 1 : this.team2GameStatsDtoNBA.halfOneLostVsOpponent += 1;
          (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team2GameStatsDtoNBA.halfTwoWonVsOpponent += 1 : this.team2GameStatsDtoNBA.halfTwoLostVsOpponent += 1;
          this.team2GameStatsDtoNBA.spreadVsOpponent += (e.pointsAllowedOverall - e.pointsScoredOverall);
          this.team2GameStatsDtoNBA.spreadFirstHalfVsOpponent += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
          this.team2GameStatsDtoNBA.spreadSecondHalfVsOpponent += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
          this.team2GameStatsDtoNBA.spreadFirstQuarterVsOpponent += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
          this.team2GameStatsDtoNBA.spreadSecondQuarterVsOpponet += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
          this.team2GameStatsDtoNBA.spreadThirdQuarterVsOpponent += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
          this.team2GameStatsDtoNBA.spreadFourthQuarterVsOpponent += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
          this.team2GameStatsDtoNBA.totalVsTeam += e.pointsScoredOverall + e.pointsAllowedOverall;
          this.team2GameStatsDtoNBA.totalVsTeamFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
          this.team2GameStatsDtoNBA.totalVsTeamSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
          this.team2GameStatsDtoNBA.totalVsTeamFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
          this.team2GameStatsDtoNBA.totalVsTeamSecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
          this.team2GameStatsDtoNBA.totalVsTeamThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
          this.team2GameStatsDtoNBA.totalVsTeamFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
          this.team2GameStatsDtoNBA.pointsScoredVsTeamGame += e.pointsScoredOverall
          this.team2GameStatsDtoNBA.pointsScoredVsTeamFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter
          this.team2GameStatsDtoNBA.pointsScoredVsTeamSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
          this.team2GameStatsDtoNBA.pointsScoredVsTeamFirstQuarter += e.pointsScoredFirstQuarter
          this.team2GameStatsDtoNBA.pointsScoredVsTeamSecondQuarter += e.pointsScoredSecondQuarter
          this.team2GameStatsDtoNBA.pointsScoredVsTeamThirdQuarter += e.pointsScoredThirdQuarter
          this.team2GameStatsDtoNBA.pointsScoredVsTeamFourthQuarter += e.pointsScoredFourthQuarter
          this.team2GameStatsDtoNBA.pointsAllowedVsTeamGame += e.pointsAllowedOverall
          this.team2GameStatsDtoNBA.pointsAllowedVsTeamFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
          this.team2GameStatsDtoNBA.pointsAllowedVsTeamSecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
          this.team2GameStatsDtoNBA.pointsAllowedVsTeamFirstQuarter += e.pointsAllowedFirstQuarter
          this.team2GameStatsDtoNBA.pointsAllowedVsTeamSecondQuarter += e.pointsAllowedSecondQuarter
          this.team2GameStatsDtoNBA.pointsAllowedVsTeamThirdQuarter += e.pointsAllowedThirdQuarter
          this.team2GameStatsDtoNBA.pointsAllowedVsTeamFourthQuarter += e.pointsAllowedFourthQuarter
        }
        if (e.homeOrAway == "Home") {
          e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team2GameStatsDtoNBA.quarterOneWonHome += 1 : this.team2GameStatsDtoNBA.quarterOneLostHome += 1;
          e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team2GameStatsDtoNBA.quarterTwoWonHome += 1 : this.team2GameStatsDtoNBA.quarterTwoLostHome += 1;
          e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team2GameStatsDtoNBA.quarterThreeWonHome += 1 : this.team2GameStatsDtoNBA.quarterThreeLostHome += 1;
          e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team2GameStatsDtoNBA.quarterFourWonHome += 1 : this.team2GameStatsDtoNBA.quarterFourLostHome += 1;
          (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team2GameStatsDtoNBA.halfOneWonHome += 1 : this.team2GameStatsDtoNBA.halfOneLostHome += 1;
          (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team2GameStatsDtoNBA.halfTwoWonHome += 1 : this.team2GameStatsDtoNBA.halfTwoLostHome += 1;
          this.team2GameStatsDtoNBA.spreadHome += (e.pointsAllowedOverall - e.pointsScoredOverall);
          this.team2GameStatsDtoNBA.spreadHomeFirstHalf += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
          this.team2GameStatsDtoNBA.spreadHomeSecondHalf += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
          this.team2GameStatsDtoNBA.spreadHomeFirstQuarter += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
          this.team2GameStatsDtoNBA.spreadHomeSecondQuarter += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
          this.team2GameStatsDtoNBA.spreadHomeThirdQuarter += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
          this.team2GameStatsDtoNBA.spreadHomeFourthQuarter += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
          this.team2GameStatsDtoNBA.totalHome += e.pointsScoredOverall + e.pointsAllowedOverall;
          this.team2GameStatsDtoNBA.totalHomeFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
          this.team2GameStatsDtoNBA.totalHomeSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
          this.team2GameStatsDtoNBA.totalHomeFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
          this.team2GameStatsDtoNBA.totalHomeSecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
          this.team2GameStatsDtoNBA.totalHomeThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
          this.team2GameStatsDtoNBA.totalHomeFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
          this.team2GameStatsDtoNBA.pointsScoredHomeGame += e.pointsScoredOverall
          this.team2GameStatsDtoNBA.pointsScoredHomeFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter
          this.team2GameStatsDtoNBA.pointsScoredHomeSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
          this.team2GameStatsDtoNBA.pointsScoredHomeFirstQuarter += e.pointsScoredFirstQuarter
          this.team2GameStatsDtoNBA.pointsScoredHomeSecondQuarter += e.pointsScoredSecondQuarter
          this.team2GameStatsDtoNBA.pointsScoredHomeThirdQuarter += e.pointsScoredThirdQuarter
          this.team2GameStatsDtoNBA.pointsScoredHomeFourthQuarter += e.pointsScoredFourthQuarter
          this.team2GameStatsDtoNBA.pointsAllowedHomeGame += e.pointsAllowedOverall
          this.team2GameStatsDtoNBA.pointsAllowedHomeFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
          this.team2GameStatsDtoNBA.pointsAllowedHomeSecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
          this.team2GameStatsDtoNBA.pointsAllowedHomeFirstQuarter += e.pointsAllowedFirstQuarter
          this.team2GameStatsDtoNBA.pointsAllowedHomeSecondQuarter += e.pointsAllowedSecondQuarter
          this.team2GameStatsDtoNBA.pointsAllowedHomeThirdQuarter += e.pointsAllowedThirdQuarter
          this.team2GameStatsDtoNBA.pointsAllowedHomeFourthQuarter += e.pointsAllowedFourthQuarter

        }
        else if (e.homeOrAway == "Away") {
          e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team2GameStatsDtoNBA.quarterOneWonAway += 1 : this.team2GameStatsDtoNBA.quarterOneLostAway += 1;
          e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team2GameStatsDtoNBA.quarterTwoWonAway += 1 : this.team2GameStatsDtoNBA.quarterTwoLostAway += 1;
          e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team2GameStatsDtoNBA.quarterThreeWonAway += 1 : this.team2GameStatsDtoNBA.quarterThreeLostAway += 1;
          e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team2GameStatsDtoNBA.quarterFourWonAway += 1 : this.team2GameStatsDtoNBA.quarterFourLostAway += 1;
          (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team2GameStatsDtoNBA.halfOneWonAway += 1 : this.team2GameStatsDtoNBA.halfOneLostAway += 1;
          (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team2GameStatsDtoNBA.halfTwoWonAway += 1 : this.team2GameStatsDtoNBA.halfTwoLostAway += 1;
          this.team2GameStatsDtoNBA.spreadAway += (e.pointsAllowedOverall - e.pointsScoredOverall);
          this.team2GameStatsDtoNBA.spreadAwayFirstHalf += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
          this.team2GameStatsDtoNBA.spreadAwaySecondHalf += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
          this.team2GameStatsDtoNBA.spreadAwayFirstQuarter += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
          this.team2GameStatsDtoNBA.spreadAwaySecondQuarter += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
          this.team2GameStatsDtoNBA.spreadAwayThirdQuarter += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
          this.team2GameStatsDtoNBA.spreadAwayFourthQuarter += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
          this.team2GameStatsDtoNBA.totalAway += e.pointsScoredOverall + e.pointsAllowedOverall;
          this.team2GameStatsDtoNBA.totalAwayFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
          this.team2GameStatsDtoNBA.totalAwaySecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
          this.team2GameStatsDtoNBA.totalAwayFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
          this.team2GameStatsDtoNBA.totalAwaySecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
          this.team2GameStatsDtoNBA.totalAwayThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
          this.team2GameStatsDtoNBA.totalAwayFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
          this.team2GameStatsDtoNBA.pointsScoredAwayGame += e.pointsScoredOverall
          this.team2GameStatsDtoNBA.pointsScoredAwayFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter
          this.team2GameStatsDtoNBA.pointsScoredAwaySecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
          this.team2GameStatsDtoNBA.pointsScoredAwayFirstQuarter += e.pointsScoredFirstQuarter
          this.team2GameStatsDtoNBA.pointsScoredAwaySecondQuarter += e.pointsScoredSecondQuarter
          this.team2GameStatsDtoNBA.pointsScoredAwayThirdQuarter += e.pointsScoredThirdQuarter
          this.team2GameStatsDtoNBA.pointsScoredAwayFourthQuarter += e.pointsScoredFourthQuarter
          this.team2GameStatsDtoNBA.pointsAllowedAwayGame += e.pointsAllowedOverall
          this.team2GameStatsDtoNBA.pointsAllowedAwayFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
          this.team2GameStatsDtoNBA.pointsAllowedAwaySecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
          this.team2GameStatsDtoNBA.pointsAllowedAwayFirstQuarter += e.pointsAllowedFirstQuarter
          this.team2GameStatsDtoNBA.pointsAllowedAwaySecondQuarter += e.pointsAllowedSecondQuarter
          this.team2GameStatsDtoNBA.pointsAllowedAwayThirdQuarter += e.pointsAllowedThirdQuarter
          this.team2GameStatsDtoNBA.pointsAllowedAwayFourthQuarter += e.pointsAllowedFourthQuarter
        }
      })

    }

    else if (this.selectedSport == "MLB") {
      var team1New: DbMlbTeamGameStats[] = team1
      var team2New: DbMlbTeamGameStats[] = team2
      this.team1GameStatsDtoMLB = {
        gamesWon: 0,
        gamesLost: 0,
        gamesWonVsOpponent: 0,
        gamesLostVsOpponent: 0,
        gamesWonHome: 0,
        gamesLostHome: 0,
        gamesWonAway: 0,
        gamesLostAway: 0,
        inningOneWon: 0,
        inningOneLost: 0,
        inningTwoWon: 0,
        inningTwoLost: 0,
        inningThreeWon: 0,
        inningThreeLost: 0,
        inningFourWon: 0,
        inningFourLost: 0,
        inningFiveWon: 0,
        inningFiveLost: 0,
        inningSixWon: 0,
        inningSixLost: 0,
        inningSevenWon: 0,
        inningSevenLost: 0,
        inningEightWon: 0,
        inningEightLost: 0,
        inningNineWon: 0,
        inningNineLost: 0,
        inningOneWonVsOpponent: 0,
        inningOneLostVsOpponent: 0,
        inningTwoWonVsOpponent: 0,
        inningTwoLostVsOpponent: 0,
        inningThreeWonVsOpponent: 0,
        inningThreeLostVsOpponent: 0,
        inningFourWonVsOpponent: 0,
        inningFourLostVsOpponent: 0,
        inningFiveWonVsOpponent: 0,
        inningFiveLostVsOpponent: 0,
        inningSixWonVsOpponent: 0,
        inningSixLostVsOpponent: 0,
        inningSevenWonVsOpponent: 0,
        inningSevenLostVsOpponent: 0,
        inningEightWonVsOpponent: 0,
        inningEightLostVsOpponent: 0,
        inningNineWonVsOpponent: 0,
        inningNineLostVsOpponent: 0,
        inningOneWonHome: 0,
        inningOneLostHome: 0,
        inningTwoWonHome: 0,
        inningTwoLostHome: 0,
        inningThreeWonHome: 0,
        inningThreeLostHome: 0,
        inningFourWonHome: 0,
        inningFourLostHome: 0,
        inningFiveWonHome: 0,
        inningFiveLostHome: 0,
        inningSixWonHome: 0,
        inningSixLostHome: 0,
        inningSevenWonHome: 0,
        inningSevenLostHome: 0,
        inningEightWonHome: 0,
        inningEightLostHome: 0,
        inningNineWonHome: 0,
        inningNineLostHome: 0,
        inningOneWonAway: 0,
        inningOneLostAway: 0,
        inningTwoWonAway: 0,
        inningTwoLostAway: 0,
        inningThreeWonAway: 0,
        inningThreeLostAway: 0,
        inningFourWonAway: 0,
        inningFourLostAway: 0,
        inningFiveWonAway: 0,
        inningFiveLostAway: 0,
        inningSixWonAway: 0,
        inningSixLostAway: 0,
        inningSevenWonAway: 0,
        inningSevenLostAway: 0,
        inningEightWonAway: 0,
        inningEightLostAway: 0,
        inningNineWonAway: 0,
        inningNineLostAway: 0,
        spreadGame: 0,
        spreadFirstInning: 0,
        spreadSecondInning: 0,
        spreadThirdInning: 0,
        spreadFourthInning: 0,
        spreadFifthInning: 0,
        spreadSixthInning: 0,
        spreadSeventhInning: 0,
        spreadEighthInning: 0,
        spreadNinthInning: 0,
        spreadVsOpponent: 0,
        spreadFirstInningVsOpponent: 0,
        spreadSecondInningVsOpponent: 0,
        spreadThirdInningVsOpponent: 0,
        spreadFourthInningVsOpponent: 0,
        spreadFifthInningVsOpponent: 0,
        spreadSixthInningVsOpponent: 0,
        spreadSeventhInningVsOpponent: 0,
        spreadEighthInningVsOpponent: 0,
        spreadNinthInningVsOpponent: 0,
        spreadHome: 0,
        spreadFirstInningHome: 0,
        spreadSecondInningHome: 0,
        spreadThirdInningHome: 0,
        spreadFourthInningHome: 0,
        spreadFifthInningHome: 0,
        spreadSixthInningHome: 0,
        spreadSeventhInningHome: 0,
        spreadEighthInningHome: 0,
        spreadNinthInningHome: 0,
        spreadAway: 0,
        spreadFirstInningAway: 0,
        spreadSecondInningAway: 0,
        spreadThirdInningAway: 0,
        spreadFourthInningAway: 0,
        spreadFifthInningAway: 0,
        spreadSixthInningAway: 0,
        spreadSeventhInningAway: 0,
        spreadEighthInningAway: 0,
        spreadNinthInningAway: 0,
        totalOverall: 0,
        totalFirstInning: 0,
        totalSecondInning: 0,
        totalThirdInning: 0,
        totalFourthInning: 0,
        totalFifthInning: 0,
        totalSixthInning: 0,
        totalSeventhInning: 0,
        totalEighthInning: 0,
        totalNinthInning: 0,
        totalVsTeam: 0,
        totalFirstInningVsOpponent: 0,
        totalSecondInningVsOpponent: 0,
        totalThirdInningVsOpponent: 0,
        totalFourthInningVsOpponent: 0,
        totalFifthInningVsOpponent: 0,
        totalSixthInningVsOpponent: 0,
        totalSeventhInningVsOpponent: 0,
        totalEighthInningVsOpponent: 0,
        totalNinthInningVsOpponent: 0,
        totalHome: 0,
        totalFirstInningHome: 0,
        totalSecondInningHome: 0,
        totalThirdInningHome: 0,
        totalFourthInningHome: 0,
        totalFifthInningHome: 0,
        totalSixthInningHome: 0,
        totalSeventhInningHome: 0,
        totalEighthInningHome: 0,
        totalNinthInningHome: 0,
        totalAway: 0,
        totalFirstInningAway: 0,
        totalSecondInningAway: 0,
        totalThirdInningAway: 0,
        totalFourthInningAway: 0,
        totalFifthInningAway: 0,
        totalSixthInningAway: 0,
        totalSeventhInningAway: 0,
        totalEighthInningAway: 0,
        totalNinthInningAway: 0,
        pointsScoredOverallGame: 0,
        pointsScoredOverallFirstInning: 0,
        pointsScoredOverallSecondInning: 0,
        pointsScoredOverallThirdInning: 0,
        pointsScoredOverallFourthInning: 0,
        pointsScoredOverallFifthInning: 0,
        pointsScoredOverallSixthInning: 0,
        pointsScoredOverallSeventhInning: 0,
        pointsScoredOverallEighthInning: 0,
        pointsScoredOverallNinthInning: 0,
        pointsScoredVsTeamGame: 0,
        pointsScoredFirstInningVsOpponent: 0,
        pointsScoredSecondInningVsOpponent: 0,
        pointsScoredThirdInningVsOpponent: 0,
        pointsScoredFourthInningVsOpponent: 0,
        pointsScoredFifthInningVsOpponent: 0,
        pointsScoredSixthInningVsOpponent: 0,
        pointsScoredSeventhInningVsOpponent: 0,
        pointsScoredEighthInningVsOpponent: 0,
        pointsScoredNinthInningVsOpponent: 0,
        pointsScoredHomeGame: 0,
        pointsScoredFirstInningHome: 0,
        pointsScoredSecondInningHome: 0,
        pointsScoredThirdInningHome: 0,
        pointsScoredFourthInningHome: 0,
        pointsScoredFifthInningHome: 0,
        pointsScoredSixthInningHome: 0,
        pointsScoredSeventhInningHome: 0,
        pointsScoredEighthInningHome: 0,
        pointsScoredNinthInningHome: 0,
        pointsScoredAwayGame: 0,
        pointsScoredFirstInningAway: 0,
        pointsScoredSecondInningAway: 0,
        pointsScoredThirdInningAway: 0,
        pointsScoredFourthInningAway: 0,
        pointsScoredFifthInningAway: 0,
        pointsScoredSixthInningAway: 0,
        pointsScoredSeventhInningAway: 0,
        pointsScoredEighthInningAway: 0,
        pointsScoredNinthInningAway: 0,
        pointsAllowedOverallGame: 0,
        pointsAllowedOverallFirstInning: 0,
        pointsAllowedOverallSecondInning: 0,
        pointsAllowedOverallThirdInning: 0,
        pointsAllowedOverallFourthInning: 0,
        pointsAllowedOverallFifthInning: 0,
        pointsAllowedOverallSixthInning: 0,
        pointsAllowedOverallSeventhInning: 0,
        pointsAllowedOverallEighthInning: 0,
        pointsAllowedOverallNinthInning: 0,
        pointsAllowedVsTeamGame: 0,
        pointsAllowedFirstInningVsOpponent: 0,
        pointsAllowedSecondInningVsOpponent: 0,
        pointsAllowedThirdInningVsOpponent: 0,
        pointsAllowedFourthInningVsOpponent: 0,
        pointsAllowedFifthInningVsOpponent: 0,
        pointsAllowedSixthInningVsOpponent: 0,
        pointsAllowedSeventhInningVsOpponent: 0,
        pointsAllowedEighthInningVsOpponent: 0,
        pointsAllowedNinthInningVsOpponent: 0,
        pointsAllowedHomeGame: 0,
        pointsAllowedFirstInningHome: 0,
        pointsAllowedSecondInningHome: 0,
        pointsAllowedThirdInningHome: 0,
        pointsAllowedFourthInningHome: 0,
        pointsAllowedFifthInningHome: 0,
        pointsAllowedSixthInningHome: 0,
        pointsAllowedSeventhInningHome: 0,
        pointsAllowedEighthInningHome: 0,
        pointsAllowedNinthInningHome: 0,
        pointsAllowedAwayGame: 0,
        pointsAllowedFirstInningAway: 0,
        pointsAllowedSecondInningAway: 0,
        pointsAllowedThirdInningAway: 0,
        pointsAllowedFourthInningAway: 0,
        pointsAllowedFifthInningAway: 0,
        pointsAllowedSixthInningAway: 0,
        pointsAllowedSeventhInningAway: 0,
        pointsAllowedEighthInningAway: 0,
        pointsAllowedNinthInningAway: 0
      }

      this.team2GameStatsDtoMLB = {
        gamesWon: 0,
        gamesLost: 0,
        gamesWonVsOpponent: 0,
        gamesLostVsOpponent: 0,
        gamesWonHome: 0,
        gamesLostHome: 0,
        gamesWonAway: 0,
        gamesLostAway: 0,
        inningOneWon: 0,
        inningOneLost: 0,
        inningTwoWon: 0,
        inningTwoLost: 0,
        inningThreeWon: 0,
        inningThreeLost: 0,
        inningFourWon: 0,
        inningFourLost: 0,
        inningFiveWon: 0,
        inningFiveLost: 0,
        inningSixWon: 0,
        inningSixLost: 0,
        inningSevenWon: 0,
        inningSevenLost: 0,
        inningEightWon: 0,
        inningEightLost: 0,
        inningNineWon: 0,
        inningNineLost: 0,
        inningOneWonVsOpponent: 0,
        inningOneLostVsOpponent: 0,
        inningTwoWonVsOpponent: 0,
        inningTwoLostVsOpponent: 0,
        inningThreeWonVsOpponent: 0,
        inningThreeLostVsOpponent: 0,
        inningFourWonVsOpponent: 0,
        inningFourLostVsOpponent: 0,
        inningFiveWonVsOpponent: 0,
        inningFiveLostVsOpponent: 0,
        inningSixWonVsOpponent: 0,
        inningSixLostVsOpponent: 0,
        inningSevenWonVsOpponent: 0,
        inningSevenLostVsOpponent: 0,
        inningEightWonVsOpponent: 0,
        inningEightLostVsOpponent: 0,
        inningNineWonVsOpponent: 0,
        inningNineLostVsOpponent: 0,
        inningOneWonHome: 0,
        inningOneLostHome: 0,
        inningTwoWonHome: 0,
        inningTwoLostHome: 0,
        inningThreeWonHome: 0,
        inningThreeLostHome: 0,
        inningFourWonHome: 0,
        inningFourLostHome: 0,
        inningFiveWonHome: 0,
        inningFiveLostHome: 0,
        inningSixWonHome: 0,
        inningSixLostHome: 0,
        inningSevenWonHome: 0,
        inningSevenLostHome: 0,
        inningEightWonHome: 0,
        inningEightLostHome: 0,
        inningNineWonHome: 0,
        inningNineLostHome: 0,
        inningOneWonAway: 0,
        inningOneLostAway: 0,
        inningTwoWonAway: 0,
        inningTwoLostAway: 0,
        inningThreeWonAway: 0,
        inningThreeLostAway: 0,
        inningFourWonAway: 0,
        inningFourLostAway: 0,
        inningFiveWonAway: 0,
        inningFiveLostAway: 0,
        inningSixWonAway: 0,
        inningSixLostAway: 0,
        inningSevenWonAway: 0,
        inningSevenLostAway: 0,
        inningEightWonAway: 0,
        inningEightLostAway: 0,
        inningNineWonAway: 0,
        inningNineLostAway: 0,
        spreadGame: 0,
        spreadFirstInning: 0,
        spreadSecondInning: 0,
        spreadThirdInning: 0,
        spreadFourthInning: 0,
        spreadFifthInning: 0,
        spreadSixthInning: 0,
        spreadSeventhInning: 0,
        spreadEighthInning: 0,
        spreadNinthInning: 0,
        spreadVsOpponent: 0,
        spreadFirstInningVsOpponent: 0,
        spreadSecondInningVsOpponent: 0,
        spreadThirdInningVsOpponent: 0,
        spreadFourthInningVsOpponent: 0,
        spreadFifthInningVsOpponent: 0,
        spreadSixthInningVsOpponent: 0,
        spreadSeventhInningVsOpponent: 0,
        spreadEighthInningVsOpponent: 0,
        spreadNinthInningVsOpponent: 0,
        spreadHome: 0,
        spreadFirstInningHome: 0,
        spreadSecondInningHome: 0,
        spreadThirdInningHome: 0,
        spreadFourthInningHome: 0,
        spreadFifthInningHome: 0,
        spreadSixthInningHome: 0,
        spreadSeventhInningHome: 0,
        spreadEighthInningHome: 0,
        spreadNinthInningHome: 0,
        spreadAway: 0,
        spreadFirstInningAway: 0,
        spreadSecondInningAway: 0,
        spreadThirdInningAway: 0,
        spreadFourthInningAway: 0,
        spreadFifthInningAway: 0,
        spreadSixthInningAway: 0,
        spreadSeventhInningAway: 0,
        spreadEighthInningAway: 0,
        spreadNinthInningAway: 0,
        totalOverall: 0,
        totalFirstInning: 0,
        totalSecondInning: 0,
        totalThirdInning: 0,
        totalFourthInning: 0,
        totalFifthInning: 0,
        totalSixthInning: 0,
        totalSeventhInning: 0,
        totalEighthInning: 0,
        totalNinthInning: 0,
        totalVsTeam: 0,
        totalFirstInningVsOpponent: 0,
        totalSecondInningVsOpponent: 0,
        totalThirdInningVsOpponent: 0,
        totalFourthInningVsOpponent: 0,
        totalFifthInningVsOpponent: 0,
        totalSixthInningVsOpponent: 0,
        totalSeventhInningVsOpponent: 0,
        totalEighthInningVsOpponent: 0,
        totalNinthInningVsOpponent: 0,
        totalHome: 0,
        totalFirstInningHome: 0,
        totalSecondInningHome: 0,
        totalThirdInningHome: 0,
        totalFourthInningHome: 0,
        totalFifthInningHome: 0,
        totalSixthInningHome: 0,
        totalSeventhInningHome: 0,
        totalEighthInningHome: 0,
        totalNinthInningHome: 0,
        totalAway: 0,
        totalFirstInningAway: 0,
        totalSecondInningAway: 0,
        totalThirdInningAway: 0,
        totalFourthInningAway: 0,
        totalFifthInningAway: 0,
        totalSixthInningAway: 0,
        totalSeventhInningAway: 0,
        totalEighthInningAway: 0,
        totalNinthInningAway: 0,
        pointsScoredOverallGame: 0,
        pointsScoredOverallFirstInning: 0,
        pointsScoredOverallSecondInning: 0,
        pointsScoredOverallThirdInning: 0,
        pointsScoredOverallFourthInning: 0,
        pointsScoredOverallFifthInning: 0,
        pointsScoredOverallSixthInning: 0,
        pointsScoredOverallSeventhInning: 0,
        pointsScoredOverallEighthInning: 0,
        pointsScoredOverallNinthInning: 0,
        pointsScoredVsTeamGame: 0,
        pointsScoredFirstInningVsOpponent: 0,
        pointsScoredSecondInningVsOpponent: 0,
        pointsScoredThirdInningVsOpponent: 0,
        pointsScoredFourthInningVsOpponent: 0,
        pointsScoredFifthInningVsOpponent: 0,
        pointsScoredSixthInningVsOpponent: 0,
        pointsScoredSeventhInningVsOpponent: 0,
        pointsScoredEighthInningVsOpponent: 0,
        pointsScoredNinthInningVsOpponent: 0,
        pointsScoredHomeGame: 0,
        pointsScoredFirstInningHome: 0,
        pointsScoredSecondInningHome: 0,
        pointsScoredThirdInningHome: 0,
        pointsScoredFourthInningHome: 0,
        pointsScoredFifthInningHome: 0,
        pointsScoredSixthInningHome: 0,
        pointsScoredSeventhInningHome: 0,
        pointsScoredEighthInningHome: 0,
        pointsScoredNinthInningHome: 0,
        pointsScoredAwayGame: 0,
        pointsScoredFirstInningAway: 0,
        pointsScoredSecondInningAway: 0,
        pointsScoredThirdInningAway: 0,
        pointsScoredFourthInningAway: 0,
        pointsScoredFifthInningAway: 0,
        pointsScoredSixthInningAway: 0,
        pointsScoredSeventhInningAway: 0,
        pointsScoredEighthInningAway: 0,
        pointsScoredNinthInningAway: 0,
        pointsAllowedOverallGame: 0,
        pointsAllowedOverallFirstInning: 0,
        pointsAllowedOverallSecondInning: 0,
        pointsAllowedOverallThirdInning: 0,
        pointsAllowedOverallFourthInning: 0,
        pointsAllowedOverallFifthInning: 0,
        pointsAllowedOverallSixthInning: 0,
        pointsAllowedOverallSeventhInning: 0,
        pointsAllowedOverallEighthInning: 0,
        pointsAllowedOverallNinthInning: 0,
        pointsAllowedVsTeamGame: 0,
        pointsAllowedFirstInningVsOpponent: 0,
        pointsAllowedSecondInningVsOpponent: 0,
        pointsAllowedThirdInningVsOpponent: 0,
        pointsAllowedFourthInningVsOpponent: 0,
        pointsAllowedFifthInningVsOpponent: 0,
        pointsAllowedSixthInningVsOpponent: 0,
        pointsAllowedSeventhInningVsOpponent: 0,
        pointsAllowedEighthInningVsOpponent: 0,
        pointsAllowedNinthInningVsOpponent: 0,
        pointsAllowedHomeGame: 0,
        pointsAllowedFirstInningHome: 0,
        pointsAllowedSecondInningHome: 0,
        pointsAllowedThirdInningHome: 0,
        pointsAllowedFourthInningHome: 0,
        pointsAllowedFifthInningHome: 0,
        pointsAllowedSixthInningHome: 0,
        pointsAllowedSeventhInningHome: 0,
        pointsAllowedEighthInningHome: 0,
        pointsAllowedNinthInningHome: 0,
        pointsAllowedAwayGame: 0,
        pointsAllowedFirstInningAway: 0,
        pointsAllowedSecondInningAway: 0,
        pointsAllowedThirdInningAway: 0,
        pointsAllowedFourthInningAway: 0,
        pointsAllowedFifthInningAway: 0,
        pointsAllowedSixthInningAway: 0,
        pointsAllowedSeventhInningAway: 0,
        pointsAllowedEighthInningAway: 0,
        pointsAllowedNinthInningAway: 0
      }
      team1New.forEach(e => {
        //overall stats - inning spread total points scored and allowed
        e.result == "W" ? this.team1GameStatsDtoMLB.gamesWon += 1 : this.team1GameStatsDtoMLB.gamesLost += 1;

        //result by inning
        e.pointsScoredFirstInning > e.pointsAllowedFirstInning ? this.team1GameStatsDtoMLB.inningOneWon += 1 : this.team1GameStatsDtoMLB.inningOneLost += 1;
        e.pointsScoredSecondInning > e.pointsAllowedSecondInning ? this.team1GameStatsDtoMLB.inningTwoWon += 1 : this.team1GameStatsDtoMLB.inningTwoLost += 1;
        e.pointsScoredThirdInning > e.pointsAllowedThirdInning ? this.team1GameStatsDtoMLB.inningThreeWon += 1 : this.team1GameStatsDtoMLB.inningThreeLost += 1;
        e.pointsScoredFourthInning > e.pointsAllowedFourthInning ? this.team1GameStatsDtoMLB.inningFourWon += 1 : this.team1GameStatsDtoMLB.inningFourLost += 1;
        e.pointsScoredFifthInning > e.pointsAllowedFifthInning ? this.team1GameStatsDtoMLB.inningFiveWon += 1 : this.team1GameStatsDtoMLB.inningFiveLost += 1;
        e.pointsScoredSixthInning > e.pointsAllowedSixthInning ? this.team1GameStatsDtoMLB.inningSixWon += 1 : this.team1GameStatsDtoMLB.inningSixLost += 1;
        e.pointsScoredSeventhInning > e.pointsAllowedSeventhInning ? this.team1GameStatsDtoMLB.inningSevenWon += 1 : this.team1GameStatsDtoMLB.inningSevenLost += 1;
        e.pointsScoredEigthInning > e.pointsAllowedEigthInning ? this.team1GameStatsDtoMLB.inningEightWon += 1 : this.team1GameStatsDtoMLB.inningEightLost += 1;
        e.pointsScoredNinthInning > e.pointsAllowedNinthInning ? this.team1GameStatsDtoMLB.inningNineWon += 1 : this.team1GameStatsDtoMLB.inningNineLost += 1;

        //spread 
        this.team1GameStatsDtoMLB.spreadGame += (e.pointsAllowedOverall - e.pointsScoredOverall)
        this.team1GameStatsDtoMLB.spreadFirstInning += (e.pointsAllowedFirstInning - e.pointsScoredFirstInning)
        this.team1GameStatsDtoMLB.spreadSecondInning += (e.pointsAllowedSecondInning - e.pointsScoredSecondInning)
        this.team1GameStatsDtoMLB.spreadThirdInning += (e.pointsAllowedThirdInning - e.pointsScoredThirdInning)
        this.team1GameStatsDtoMLB.spreadFourthInning += (e.pointsAllowedFourthInning - e.pointsScoredFourthInning)
        this.team1GameStatsDtoMLB.spreadFifthInning += (e.pointsAllowedFifthInning - e.pointsScoredFifthInning)
        this.team1GameStatsDtoMLB.spreadSixthInning += (e.pointsAllowedSixthInning - e.pointsScoredSixthInning)
        this.team1GameStatsDtoMLB.spreadSeventhInning += (e.pointsAllowedSeventhInning - e.pointsScoredSeventhInning)
        this.team1GameStatsDtoMLB.spreadEighthInning += (e.pointsAllowedEigthInning - e.pointsScoredEigthInning)
        this.team1GameStatsDtoMLB.spreadNinthInning += (e.pointsAllowedNinthInning - e.pointsScoredNinthInning)

        //total
        this.team1GameStatsDtoMLB.totalOverall += (e.pointsScoredOverall + e.pointsAllowedOverall)
        this.team1GameStatsDtoMLB.totalFirstInning += e.pointsScoredFirstInning + e.pointsAllowedFirstInning
        this.team1GameStatsDtoMLB.totalSecondInning += e.pointsScoredSecondInning + e.pointsAllowedSecondInning
        this.team1GameStatsDtoMLB.totalThirdInning += e.pointsScoredThirdInning + e.pointsAllowedThirdInning
        this.team1GameStatsDtoMLB.totalFourthInning += e.pointsScoredFourthInning + e.pointsAllowedFourthInning
        this.team1GameStatsDtoMLB.totalFifthInning += e.pointsScoredFifthInning + e.pointsAllowedFifthInning
        this.team1GameStatsDtoMLB.totalSixthInning += e.pointsScoredSixthInning + e.pointsAllowedSixthInning
        this.team1GameStatsDtoMLB.totalSeventhInning += e.pointsScoredSeventhInning + e.pointsAllowedSeventhInning
        this.team1GameStatsDtoMLB.totalEighthInning += e.pointsScoredEigthInning + e.pointsAllowedEigthInning
        this.team1GameStatsDtoMLB.totalNinthInning += e.pointsScoredNinthInning + e.pointsAllowedNinthInning

        //points scored
        this.team1GameStatsDtoMLB.pointsScoredOverallGame += e.pointsScoredOverall
        this.team1GameStatsDtoMLB.pointsScoredOverallFirstInning += e.pointsScoredFirstInning
        this.team1GameStatsDtoMLB.pointsScoredOverallSecondInning += e.pointsScoredSecondInning
        this.team1GameStatsDtoMLB.pointsScoredOverallThirdInning += e.pointsScoredThirdInning
        this.team1GameStatsDtoMLB.pointsScoredOverallFourthInning += e.pointsScoredFourthInning
        this.team1GameStatsDtoMLB.pointsScoredOverallFifthInning += e.pointsScoredFifthInning
        this.team1GameStatsDtoMLB.pointsScoredOverallSixthInning += e.pointsScoredSixthInning
        this.team1GameStatsDtoMLB.pointsScoredOverallSeventhInning += e.pointsScoredSeventhInning
        this.team1GameStatsDtoMLB.pointsScoredOverallEighthInning += e.pointsScoredEigthInning
        this.team1GameStatsDtoMLB.pointsScoredOverallNinthInning += e.pointsScoredNinthInning

        //points allowed
        this.team1GameStatsDtoMLB.pointsAllowedOverallGame += e.pointsAllowedOverall
        this.team1GameStatsDtoMLB.pointsAllowedOverallFirstInning += e.pointsAllowedFirstInning
        this.team1GameStatsDtoMLB.pointsAllowedOverallSecondInning += e.pointsAllowedSecondInning
        this.team1GameStatsDtoMLB.pointsAllowedOverallThirdInning += e.pointsAllowedThirdInning
        this.team1GameStatsDtoMLB.pointsAllowedOverallFourthInning += e.pointsAllowedFourthInning
        this.team1GameStatsDtoMLB.pointsAllowedOverallFifthInning += e.pointsAllowedFifthInning
        this.team1GameStatsDtoMLB.pointsAllowedOverallSixthInning += e.pointsAllowedSixthInning
        this.team1GameStatsDtoMLB.pointsAllowedOverallSeventhInning += e.pointsAllowedSeventhInning
        this.team1GameStatsDtoMLB.pointsAllowedOverallEighthInning += e.pointsAllowedEigthInning
        this.team1GameStatsDtoMLB.pointsAllowedOverallNinthInning += e.pointsAllowedNinthInning

        if (e.homeOrAway == "Home") {
          e.result == "W" ? this.team1GameStatsDtoMLB.gamesWonHome += 1 : this.team1GameStatsDtoMLB.gamesLostHome += 1;

          //result by inning
          e.pointsScoredFirstInning > e.pointsAllowedFirstInning ? this.team1GameStatsDtoMLB.inningOneWonHome += 1 : this.team1GameStatsDtoMLB.inningOneLostHome += 1;
          e.pointsScoredSecondInning > e.pointsAllowedSecondInning ? this.team1GameStatsDtoMLB.inningTwoWonHome += 1 : this.team1GameStatsDtoMLB.inningTwoLostHome += 1;
          e.pointsScoredThirdInning > e.pointsAllowedThirdInning ? this.team1GameStatsDtoMLB.inningThreeWonHome += 1 : this.team1GameStatsDtoMLB.inningThreeLostHome += 1;
          e.pointsScoredFourthInning > e.pointsAllowedFourthInning ? this.team1GameStatsDtoMLB.inningFourWonHome += 1 : this.team1GameStatsDtoMLB.inningFourLostHome += 1;
          e.pointsScoredFifthInning > e.pointsAllowedFifthInning ? this.team1GameStatsDtoMLB.inningFiveWonHome += 1 : this.team1GameStatsDtoMLB.inningFiveLostHome += 1;
          e.pointsScoredSixthInning > e.pointsAllowedSixthInning ? this.team1GameStatsDtoMLB.inningSixWonHome += 1 : this.team1GameStatsDtoMLB.inningSixLostHome += 1;
          e.pointsScoredSeventhInning > e.pointsAllowedSeventhInning ? this.team1GameStatsDtoMLB.inningSevenWonHome += 1 : this.team1GameStatsDtoMLB.inningSevenLostHome += 1;
          e.pointsScoredEigthInning > e.pointsAllowedEigthInning ? this.team1GameStatsDtoMLB.inningEightWonHome += 1 : this.team1GameStatsDtoMLB.inningEightLostHome += 1;
          e.pointsScoredNinthInning > e.pointsAllowedNinthInning ? this.team1GameStatsDtoMLB.inningNineWonHome += 1 : this.team1GameStatsDtoMLB.inningNineLostHome += 1;

          //spread 
          this.team1GameStatsDtoMLB.spreadHome += (e.pointsAllowedOverall - e.pointsScoredOverall)
          this.team1GameStatsDtoMLB.spreadFirstInningHome += (e.pointsAllowedFirstInning - e.pointsScoredFirstInning)
          this.team1GameStatsDtoMLB.spreadSecondInningHome += (e.pointsAllowedSecondInning - e.pointsScoredSecondInning)
          this.team1GameStatsDtoMLB.spreadThirdInningHome += (e.pointsAllowedThirdInning - e.pointsScoredThirdInning)
          this.team1GameStatsDtoMLB.spreadFourthInningHome += (e.pointsAllowedFourthInning - e.pointsScoredFourthInning)
          this.team1GameStatsDtoMLB.spreadFifthInningHome += (e.pointsAllowedFifthInning - e.pointsScoredFifthInning)
          this.team1GameStatsDtoMLB.spreadSixthInningHome += (e.pointsAllowedSixthInning - e.pointsScoredSixthInning)
          this.team1GameStatsDtoMLB.spreadSeventhInningHome += (e.pointsAllowedSeventhInning - e.pointsScoredSeventhInning)
          this.team1GameStatsDtoMLB.spreadEighthInningHome += (e.pointsAllowedEigthInning - e.pointsScoredEigthInning)
          this.team1GameStatsDtoMLB.spreadNinthInningHome += (e.pointsAllowedNinthInning - e.pointsScoredNinthInning)

          //total
          this.team1GameStatsDtoMLB.totalHome += (e.pointsScoredOverall + e.pointsAllowedOverall)
          this.team1GameStatsDtoMLB.totalFirstInningHome += e.pointsScoredFirstInning + e.pointsAllowedFirstInning
          this.team1GameStatsDtoMLB.totalSecondInningHome += e.pointsScoredSecondInning + e.pointsAllowedSecondInning
          this.team1GameStatsDtoMLB.totalThirdInningHome += e.pointsScoredThirdInning + e.pointsAllowedThirdInning
          this.team1GameStatsDtoMLB.totalFourthInningHome += e.pointsScoredFourthInning + e.pointsAllowedFourthInning
          this.team1GameStatsDtoMLB.totalFifthInningHome += e.pointsScoredFifthInning + e.pointsAllowedFifthInning
          this.team1GameStatsDtoMLB.totalSixthInningHome += e.pointsScoredSixthInning + e.pointsAllowedSixthInning
          this.team1GameStatsDtoMLB.totalSeventhInningHome += e.pointsScoredSeventhInning + e.pointsAllowedSeventhInning
          this.team1GameStatsDtoMLB.totalEighthInningHome += e.pointsScoredEigthInning + e.pointsAllowedEigthInning
          this.team1GameStatsDtoMLB.totalNinthInningHome += e.pointsScoredNinthInning + e.pointsAllowedNinthInning

          //points scored
          this.team1GameStatsDtoMLB.pointsScoredHomeGame += e.pointsScoredOverall
          this.team1GameStatsDtoMLB.pointsScoredFirstInningHome += e.pointsScoredFirstInning
          this.team1GameStatsDtoMLB.pointsScoredSecondInningHome += e.pointsScoredSecondInning
          this.team1GameStatsDtoMLB.pointsScoredThirdInningHome += e.pointsScoredThirdInning
          this.team1GameStatsDtoMLB.pointsScoredFourthInningHome += e.pointsScoredFourthInning
          this.team1GameStatsDtoMLB.pointsScoredFifthInningHome += e.pointsScoredFifthInning
          this.team1GameStatsDtoMLB.pointsScoredSixthInningHome += e.pointsScoredSixthInning
          this.team1GameStatsDtoMLB.pointsScoredSeventhInningHome += e.pointsScoredSeventhInning
          this.team1GameStatsDtoMLB.pointsScoredEighthInningHome += e.pointsScoredEigthInning
          this.team1GameStatsDtoMLB.pointsScoredNinthInningHome += e.pointsScoredNinthInning

          //points allowed
          this.team1GameStatsDtoMLB.pointsAllowedHomeGame += e.pointsAllowedOverall
          this.team1GameStatsDtoMLB.pointsAllowedFirstInningHome += e.pointsAllowedFirstInning
          this.team1GameStatsDtoMLB.pointsAllowedSecondInningHome += e.pointsAllowedSecondInning
          this.team1GameStatsDtoMLB.pointsAllowedThirdInningHome += e.pointsAllowedThirdInning
          this.team1GameStatsDtoMLB.pointsAllowedFourthInningHome += e.pointsAllowedFourthInning
          this.team1GameStatsDtoMLB.pointsAllowedFifthInningHome += e.pointsAllowedFifthInning
          this.team1GameStatsDtoMLB.pointsAllowedSixthInningHome += e.pointsAllowedSixthInning
          this.team1GameStatsDtoMLB.pointsAllowedSeventhInningHome += e.pointsAllowedSeventhInning
          this.team1GameStatsDtoMLB.pointsAllowedEighthInningHome += e.pointsAllowedEigthInning
          this.team1GameStatsDtoMLB.pointsAllowedNinthInningHome += e.pointsAllowedNinthInning

        }
        else if (e.homeOrAway == "Away") {
          e.result == "W" ? this.team1GameStatsDtoMLB.gamesWonAway += 1 : this.team1GameStatsDtoMLB.gamesLostAway += 1;

          //result by inning
          e.pointsScoredFirstInning > e.pointsAllowedFirstInning ? this.team1GameStatsDtoMLB.inningOneWonAway += 1 : this.team1GameStatsDtoMLB.inningOneLostAway += 1;
          e.pointsScoredSecondInning > e.pointsAllowedSecondInning ? this.team1GameStatsDtoMLB.inningTwoWonAway += 1 : this.team1GameStatsDtoMLB.inningTwoLostAway += 1;
          e.pointsScoredThirdInning > e.pointsAllowedThirdInning ? this.team1GameStatsDtoMLB.inningThreeWonAway += 1 : this.team1GameStatsDtoMLB.inningThreeLostAway += 1;
          e.pointsScoredFourthInning > e.pointsAllowedFourthInning ? this.team1GameStatsDtoMLB.inningFourWonAway += 1 : this.team1GameStatsDtoMLB.inningFourLostAway += 1;
          e.pointsScoredFifthInning > e.pointsAllowedFifthInning ? this.team1GameStatsDtoMLB.inningFiveWonAway += 1 : this.team1GameStatsDtoMLB.inningFiveLostAway += 1;
          e.pointsScoredSixthInning > e.pointsAllowedSixthInning ? this.team1GameStatsDtoMLB.inningSixWonAway += 1 : this.team1GameStatsDtoMLB.inningSixLostAway += 1;
          e.pointsScoredSeventhInning > e.pointsAllowedSeventhInning ? this.team1GameStatsDtoMLB.inningSevenWonAway += 1 : this.team1GameStatsDtoMLB.inningSevenLostAway += 1;
          e.pointsScoredEigthInning > e.pointsAllowedEigthInning ? this.team1GameStatsDtoMLB.inningEightWonAway += 1 : this.team1GameStatsDtoMLB.inningEightLostAway += 1;
          e.pointsScoredNinthInning > e.pointsAllowedNinthInning ? this.team1GameStatsDtoMLB.inningNineWonAway += 1 : this.team1GameStatsDtoMLB.inningNineLostAway += 1;

          //spread 
          this.team1GameStatsDtoMLB.spreadAway += (e.pointsAllowedOverall - e.pointsScoredOverall)
          this.team1GameStatsDtoMLB.spreadFirstInningAway += (e.pointsAllowedFirstInning - e.pointsScoredFirstInning)
          this.team1GameStatsDtoMLB.spreadSecondInningAway += (e.pointsAllowedSecondInning - e.pointsScoredSecondInning)
          this.team1GameStatsDtoMLB.spreadThirdInningAway += (e.pointsAllowedThirdInning - e.pointsScoredThirdInning)
          this.team1GameStatsDtoMLB.spreadFourthInningAway += (e.pointsAllowedFourthInning - e.pointsScoredFourthInning)
          this.team1GameStatsDtoMLB.spreadFifthInningAway += (e.pointsAllowedFifthInning - e.pointsScoredFifthInning)
          this.team1GameStatsDtoMLB.spreadSixthInningAway += (e.pointsAllowedSixthInning - e.pointsScoredSixthInning)
          this.team1GameStatsDtoMLB.spreadSeventhInningAway += (e.pointsAllowedSeventhInning - e.pointsScoredSeventhInning)
          this.team1GameStatsDtoMLB.spreadEighthInningAway += (e.pointsAllowedEigthInning - e.pointsScoredEigthInning)
          this.team1GameStatsDtoMLB.spreadNinthInningAway += (e.pointsAllowedNinthInning - e.pointsScoredNinthInning)

          //total
          this.team1GameStatsDtoMLB.totalAway += (e.pointsScoredOverall + e.pointsAllowedOverall)
          this.team1GameStatsDtoMLB.totalFirstInningAway += e.pointsScoredFirstInning + e.pointsAllowedFirstInning
          this.team1GameStatsDtoMLB.totalSecondInningAway += e.pointsScoredSecondInning + e.pointsAllowedSecondInning
          this.team1GameStatsDtoMLB.totalThirdInningAway += e.pointsScoredThirdInning + e.pointsAllowedThirdInning
          this.team1GameStatsDtoMLB.totalFourthInningAway += e.pointsScoredFourthInning + e.pointsAllowedFourthInning
          this.team1GameStatsDtoMLB.totalFifthInningAway += e.pointsScoredFifthInning + e.pointsAllowedFifthInning
          this.team1GameStatsDtoMLB.totalSixthInningAway += e.pointsScoredSixthInning + e.pointsAllowedSixthInning
          this.team1GameStatsDtoMLB.totalSeventhInningAway += e.pointsScoredSeventhInning + e.pointsAllowedSeventhInning
          this.team1GameStatsDtoMLB.totalEighthInningAway += e.pointsScoredEigthInning + e.pointsAllowedEigthInning
          this.team1GameStatsDtoMLB.totalNinthInningAway += e.pointsScoredNinthInning + e.pointsAllowedNinthInning

          //points scored
          this.team1GameStatsDtoMLB.pointsScoredAwayGame += e.pointsScoredOverall
          this.team1GameStatsDtoMLB.pointsScoredFirstInningAway += e.pointsScoredFirstInning
          this.team1GameStatsDtoMLB.pointsScoredSecondInningAway += e.pointsScoredSecondInning
          this.team1GameStatsDtoMLB.pointsScoredThirdInningAway += e.pointsScoredThirdInning
          this.team1GameStatsDtoMLB.pointsScoredFourthInningAway += e.pointsScoredFourthInning
          this.team1GameStatsDtoMLB.pointsScoredFifthInningAway += e.pointsScoredFifthInning
          this.team1GameStatsDtoMLB.pointsScoredSixthInningAway += e.pointsScoredSixthInning
          this.team1GameStatsDtoMLB.pointsScoredSeventhInningAway += e.pointsScoredSeventhInning
          this.team1GameStatsDtoMLB.pointsScoredEighthInningAway += e.pointsScoredEigthInning
          this.team1GameStatsDtoMLB.pointsScoredNinthInningAway += e.pointsScoredNinthInning

          //points allowed
          this.team1GameStatsDtoMLB.pointsAllowedAwayGame += e.pointsAllowedOverall
          this.team1GameStatsDtoMLB.pointsAllowedFirstInningAway += e.pointsAllowedFirstInning
          this.team1GameStatsDtoMLB.pointsAllowedSecondInningAway += e.pointsAllowedSecondInning
          this.team1GameStatsDtoMLB.pointsAllowedThirdInningAway += e.pointsAllowedThirdInning
          this.team1GameStatsDtoMLB.pointsAllowedFourthInningAway += e.pointsAllowedFourthInning
          this.team1GameStatsDtoMLB.pointsAllowedFifthInningAway += e.pointsAllowedFifthInning
          this.team1GameStatsDtoMLB.pointsAllowedSixthInningAway += e.pointsAllowedSixthInning
          this.team1GameStatsDtoMLB.pointsAllowedSeventhInningAway += e.pointsAllowedSeventhInning
          this.team1GameStatsDtoMLB.pointsAllowedEighthInningAway += e.pointsAllowedEigthInning
          this.team1GameStatsDtoMLB.pointsAllowedNinthInningAway += e.pointsAllowedNinthInning
        }
        if (e.teamAgainstId == team2New[0].teamId) {
          e.result == "W" ? this.team1GameStatsDtoMLB.gamesWonVsOpponent += 1 : this.team1GameStatsDtoMLB.gamesLostVsOpponent += 1;

          //result by inning
          e.pointsScoredFirstInning > e.pointsAllowedFirstInning ? this.team1GameStatsDtoMLB.inningOneWonVsOpponent += 1 : this.team1GameStatsDtoMLB.inningOneLostVsOpponent += 1;
          e.pointsScoredSecondInning > e.pointsAllowedSecondInning ? this.team1GameStatsDtoMLB.inningTwoWonVsOpponent += 1 : this.team1GameStatsDtoMLB.inningTwoLostVsOpponent += 1;
          e.pointsScoredThirdInning > e.pointsAllowedThirdInning ? this.team1GameStatsDtoMLB.inningThreeWonVsOpponent += 1 : this.team1GameStatsDtoMLB.inningThreeLostVsOpponent += 1;
          e.pointsScoredFourthInning > e.pointsAllowedFourthInning ? this.team1GameStatsDtoMLB.inningFourWonVsOpponent += 1 : this.team1GameStatsDtoMLB.inningFourLostVsOpponent += 1;
          e.pointsScoredFifthInning > e.pointsAllowedFifthInning ? this.team1GameStatsDtoMLB.inningFiveWonVsOpponent += 1 : this.team1GameStatsDtoMLB.inningFiveLostVsOpponent += 1;
          e.pointsScoredSixthInning > e.pointsAllowedSixthInning ? this.team1GameStatsDtoMLB.inningSixWonVsOpponent += 1 : this.team1GameStatsDtoMLB.inningSixLostVsOpponent += 1;
          e.pointsScoredSeventhInning > e.pointsAllowedSeventhInning ? this.team1GameStatsDtoMLB.inningSevenWonVsOpponent += 1 : this.team1GameStatsDtoMLB.inningSevenLostVsOpponent += 1;
          e.pointsScoredEigthInning > e.pointsAllowedEigthInning ? this.team1GameStatsDtoMLB.inningEightWonVsOpponent += 1 : this.team1GameStatsDtoMLB.inningEightLostVsOpponent += 1;
          e.pointsScoredNinthInning > e.pointsAllowedNinthInning ? this.team1GameStatsDtoMLB.inningNineWonVsOpponent += 1 : this.team1GameStatsDtoMLB.inningNineLostVsOpponent += 1;

          //spread 
          this.team1GameStatsDtoMLB.spreadVsOpponent += (e.pointsAllowedOverall - e.pointsScoredOverall)
          this.team1GameStatsDtoMLB.spreadFirstInningVsOpponent += (e.pointsAllowedFirstInning - e.pointsScoredFirstInning)
          this.team1GameStatsDtoMLB.spreadSecondInningVsOpponent += (e.pointsAllowedSecondInning - e.pointsScoredSecondInning)
          this.team1GameStatsDtoMLB.spreadThirdInningVsOpponent += (e.pointsAllowedThirdInning - e.pointsScoredThirdInning)
          this.team1GameStatsDtoMLB.spreadFourthInningVsOpponent += (e.pointsAllowedFourthInning - e.pointsScoredFourthInning)
          this.team1GameStatsDtoMLB.spreadFifthInningVsOpponent += (e.pointsAllowedFifthInning - e.pointsScoredFifthInning)
          this.team1GameStatsDtoMLB.spreadSixthInningVsOpponent += (e.pointsAllowedSixthInning - e.pointsScoredSixthInning)
          this.team1GameStatsDtoMLB.spreadSeventhInningVsOpponent += (e.pointsAllowedSeventhInning - e.pointsScoredSeventhInning)
          this.team1GameStatsDtoMLB.spreadEighthInningVsOpponent += (e.pointsAllowedEigthInning - e.pointsScoredEigthInning)
          this.team1GameStatsDtoMLB.spreadNinthInningVsOpponent += (e.pointsAllowedNinthInning - e.pointsScoredNinthInning)

          //total
          this.team1GameStatsDtoMLB.totalVsTeam += (e.pointsScoredOverall + e.pointsAllowedOverall)
          this.team1GameStatsDtoMLB.totalFirstInningVsOpponent += e.pointsScoredFirstInning + e.pointsAllowedFirstInning
          this.team1GameStatsDtoMLB.totalSecondInningVsOpponent += e.pointsScoredSecondInning + e.pointsAllowedSecondInning
          this.team1GameStatsDtoMLB.totalThirdInningVsOpponent += e.pointsScoredThirdInning + e.pointsAllowedThirdInning
          this.team1GameStatsDtoMLB.totalFourthInningVsOpponent += e.pointsScoredFourthInning + e.pointsAllowedFourthInning
          this.team1GameStatsDtoMLB.totalFifthInningVsOpponent += e.pointsScoredFifthInning + e.pointsAllowedFifthInning
          this.team1GameStatsDtoMLB.totalSixthInningVsOpponent += e.pointsScoredSixthInning + e.pointsAllowedSixthInning
          this.team1GameStatsDtoMLB.totalSeventhInningVsOpponent += e.pointsScoredSeventhInning + e.pointsAllowedSeventhInning
          this.team1GameStatsDtoMLB.totalEighthInningVsOpponent += e.pointsScoredEigthInning + e.pointsAllowedEigthInning
          this.team1GameStatsDtoMLB.totalNinthInningVsOpponent += e.pointsScoredNinthInning + e.pointsAllowedNinthInning

          //points scored
          this.team1GameStatsDtoMLB.pointsScoredVsTeamGame += e.pointsScoredOverall
          this.team1GameStatsDtoMLB.pointsScoredFirstInningVsOpponent += e.pointsScoredFirstInning
          this.team1GameStatsDtoMLB.pointsScoredSecondInningVsOpponent += e.pointsScoredSecondInning
          this.team1GameStatsDtoMLB.pointsScoredThirdInningVsOpponent += e.pointsScoredThirdInning
          this.team1GameStatsDtoMLB.pointsScoredFourthInningVsOpponent += e.pointsScoredFourthInning
          this.team1GameStatsDtoMLB.pointsScoredFifthInningVsOpponent += e.pointsScoredFifthInning
          this.team1GameStatsDtoMLB.pointsScoredSixthInningVsOpponent += e.pointsScoredSixthInning
          this.team1GameStatsDtoMLB.pointsScoredSeventhInningVsOpponent += e.pointsScoredSeventhInning
          this.team1GameStatsDtoMLB.pointsScoredEighthInningVsOpponent += e.pointsScoredEigthInning
          this.team1GameStatsDtoMLB.pointsScoredNinthInningVsOpponent += e.pointsScoredNinthInning

          //points allowed
          this.team1GameStatsDtoMLB.pointsAllowedVsTeamGame += e.pointsAllowedOverall
          this.team1GameStatsDtoMLB.pointsAllowedFirstInningVsOpponent += e.pointsAllowedFirstInning
          this.team1GameStatsDtoMLB.pointsAllowedSecondInningVsOpponent += e.pointsAllowedSecondInning
          this.team1GameStatsDtoMLB.pointsAllowedThirdInningVsOpponent += e.pointsAllowedThirdInning
          this.team1GameStatsDtoMLB.pointsAllowedFourthInningVsOpponent += e.pointsAllowedFourthInning
          this.team1GameStatsDtoMLB.pointsAllowedFifthInningVsOpponent += e.pointsAllowedFifthInning
          this.team1GameStatsDtoMLB.pointsAllowedSixthInningVsOpponent += e.pointsAllowedSixthInning
          this.team1GameStatsDtoMLB.pointsAllowedSeventhInningVsOpponent += e.pointsAllowedSeventhInning
          this.team1GameStatsDtoMLB.pointsAllowedEighthInningVsOpponent += e.pointsAllowedEigthInning
          this.team1GameStatsDtoMLB.pointsAllowedNinthInningVsOpponent += e.pointsAllowedNinthInning
        }
        let totalFor = []
        let totalOverall = 0;
        totalFor = team1New.filter(e => { return (e.pointsAllowedOverall - e.pointsScoredOverall) < this.team1SelectedSpreadPoint })
        totalOverall = team1New.length
        this.homeSpreadOverallChance = (totalFor.length / totalOverall)

        totalFor = team1New.filter(e => { return (((e.pointsAllowedOverall - e.pointsScoredOverall) < this.team1SelectedSpreadPoint) && e.homeOrAway == "Home") })
        totalOverall = team1New.filter(e => e.homeOrAway == "Home").length
        this.homeSpreadHomeChance = (totalFor.length / totalOverall)

        totalFor = team1New.filter(e => {
          return (((e.pointsAllowedOverall - e.pointsScoredOverall) < this.team1SelectedSpreadPoint) && (e.teamAgainstId == team2New[0].teamId))
        })
        totalOverall = team1New.filter(e => e.teamAgainstId == team2New[0].teamId).length

        this.homeSpreadTeamChance = (totalFor.length / totalOverall) 
      })

      team2New.forEach(e => {
        //overall stats - inning spread total points scored and allowed
        e.result == "W" ? this.team2GameStatsDtoMLB.gamesWon += 1 : this.team2GameStatsDtoMLB.gamesLost += 1;

        //result by inning
        e.pointsScoredFirstInning > e.pointsAllowedFirstInning ? this.team2GameStatsDtoMLB.inningOneWon += 1 : this.team2GameStatsDtoMLB.inningOneLost += 1;
        e.pointsScoredSecondInning > e.pointsAllowedSecondInning ? this.team2GameStatsDtoMLB.inningTwoWon += 1 : this.team2GameStatsDtoMLB.inningTwoLost += 1;
        e.pointsScoredThirdInning > e.pointsAllowedThirdInning ? this.team2GameStatsDtoMLB.inningThreeWon += 1 : this.team2GameStatsDtoMLB.inningThreeLost += 1;
        e.pointsScoredFourthInning > e.pointsAllowedFourthInning ? this.team2GameStatsDtoMLB.inningFourWon += 1 : this.team2GameStatsDtoMLB.inningFourLost += 1;
        e.pointsScoredFifthInning > e.pointsAllowedFifthInning ? this.team2GameStatsDtoMLB.inningFiveWon += 1 : this.team2GameStatsDtoMLB.inningFiveLost += 1;
        e.pointsScoredSixthInning > e.pointsAllowedSixthInning ? this.team2GameStatsDtoMLB.inningSixWon += 1 : this.team2GameStatsDtoMLB.inningSixLost += 1;
        e.pointsScoredSeventhInning > e.pointsAllowedSeventhInning ? this.team2GameStatsDtoMLB.inningSevenWon += 1 : this.team2GameStatsDtoMLB.inningSevenLost += 1;
        e.pointsScoredEigthInning > e.pointsAllowedEigthInning ? this.team2GameStatsDtoMLB.inningEightWon += 1 : this.team2GameStatsDtoMLB.inningEightLost += 1;
        e.pointsScoredNinthInning > e.pointsAllowedNinthInning ? this.team2GameStatsDtoMLB.inningNineWon += 1 : this.team2GameStatsDtoMLB.inningNineLost += 1;

        //spread
        this.team2GameStatsDtoMLB.spreadGame += (e.pointsAllowedOverall - e.pointsScoredOverall)
        this.team2GameStatsDtoMLB.spreadFirstInning += (e.pointsAllowedFirstInning - e.pointsScoredFirstInning)
        this.team2GameStatsDtoMLB.spreadSecondInning += (e.pointsAllowedSecondInning - e.pointsScoredSecondInning)
        this.team2GameStatsDtoMLB.spreadThirdInning += (e.pointsAllowedThirdInning - e.pointsScoredThirdInning)
        this.team2GameStatsDtoMLB.spreadFourthInning += (e.pointsAllowedFourthInning - e.pointsScoredFourthInning)
        this.team2GameStatsDtoMLB.spreadFifthInning += (e.pointsAllowedFifthInning - e.pointsScoredFifthInning)
        this.team2GameStatsDtoMLB.spreadSixthInning += (e.pointsAllowedSixthInning - e.pointsScoredSixthInning)
        this.team2GameStatsDtoMLB.spreadSeventhInning += (e.pointsAllowedSeventhInning - e.pointsScoredSeventhInning)
        this.team2GameStatsDtoMLB.spreadEighthInning += (e.pointsAllowedEigthInning - e.pointsScoredEigthInning)
        this.team2GameStatsDtoMLB.spreadNinthInning += (e.pointsAllowedNinthInning - e.pointsScoredNinthInning)
        //tota2
        this.team2GameStatsDtoMLB.totalOverall += (e.pointsScoredOverall + e.pointsAllowedOverall)
        this.team2GameStatsDtoMLB.totalFirstInning += e.pointsScoredFirstInning + e.pointsAllowedFirstInning
        this.team2GameStatsDtoMLB.totalSecondInning += e.pointsScoredSecondInning + e.pointsAllowedSecondInning
        this.team2GameStatsDtoMLB.totalThirdInning += e.pointsScoredThirdInning + e.pointsAllowedThirdInning
        this.team2GameStatsDtoMLB.totalFourthInning += e.pointsScoredFourthInning + e.pointsAllowedFourthInning
        this.team2GameStatsDtoMLB.totalFifthInning += e.pointsScoredFifthInning + e.pointsAllowedFifthInning
        this.team2GameStatsDtoMLB.totalSixthInning += e.pointsScoredSixthInning + e.pointsAllowedSixthInning
        this.team2GameStatsDtoMLB.totalSeventhInning += e.pointsScoredSeventhInning + e.pointsAllowedSeventhInning
        this.team2GameStatsDtoMLB.totalEighthInning += e.pointsScoredEigthInning + e.pointsAllowedEigthInning
        this.team2GameStatsDtoMLB.totalNinthInning += e.pointsScoredNinthInning + e.pointsAllowedNinthInning
        //points 2cored
        this.team2GameStatsDtoMLB.pointsScoredOverallGame += e.pointsScoredOverall
        this.team2GameStatsDtoMLB.pointsScoredOverallFirstInning += e.pointsScoredFirstInning
        this.team2GameStatsDtoMLB.pointsScoredOverallSecondInning += e.pointsScoredSecondInning
        this.team2GameStatsDtoMLB.pointsScoredOverallThirdInning += e.pointsScoredThirdInning
        this.team2GameStatsDtoMLB.pointsScoredOverallFourthInning += e.pointsScoredFourthInning
        this.team2GameStatsDtoMLB.pointsScoredOverallFifthInning += e.pointsScoredFifthInning
        this.team2GameStatsDtoMLB.pointsScoredOverallSixthInning += e.pointsScoredSixthInning
        this.team2GameStatsDtoMLB.pointsScoredOverallSeventhInning += e.pointsScoredSeventhInning
        this.team2GameStatsDtoMLB.pointsScoredOverallEighthInning += e.pointsScoredEigthInning
        this.team2GameStatsDtoMLB.pointsScoredOverallNinthInning += e.pointsScoredNinthInning
        //points 2llowed
        this.team2GameStatsDtoMLB.pointsAllowedOverallGame += e.pointsAllowedOverall
        this.team2GameStatsDtoMLB.pointsAllowedOverallFirstInning += e.pointsAllowedFirstInning
        this.team2GameStatsDtoMLB.pointsAllowedOverallSecondInning += e.pointsAllowedSecondInning
        this.team2GameStatsDtoMLB.pointsAllowedOverallThirdInning += e.pointsAllowedThirdInning
        this.team2GameStatsDtoMLB.pointsAllowedOverallFourthInning += e.pointsAllowedFourthInning
        this.team2GameStatsDtoMLB.pointsAllowedOverallFifthInning += e.pointsAllowedFifthInning
        this.team2GameStatsDtoMLB.pointsAllowedOverallSixthInning += e.pointsAllowedSixthInning
        this.team2GameStatsDtoMLB.pointsAllowedOverallSeventhInning += e.pointsAllowedSeventhInning
        this.team2GameStatsDtoMLB.pointsAllowedOverallEighthInning += e.pointsAllowedEigthInning
        this.team2GameStatsDtoMLB.pointsAllowedOverallNinthInning += e.pointsAllowedNinthInning

        if (e.homeOrAway == "Home") {
          e.result == "W" ? this.team2GameStatsDtoMLB.gamesWonHome += 1 : this.team2GameStatsDtoMLB.gamesLostHome += 1;

          //result by inning
          e.pointsScoredFirstInning > e.pointsAllowedFirstInning ? this.team2GameStatsDtoMLB.inningOneWonHome += 1 : this.team2GameStatsDtoMLB.inningOneLostHome += 1;
          e.pointsScoredSecondInning > e.pointsAllowedSecondInning ? this.team2GameStatsDtoMLB.inningTwoWonHome += 1 : this.team2GameStatsDtoMLB.inningTwoLostHome += 1;
          e.pointsScoredThirdInning > e.pointsAllowedThirdInning ? this.team2GameStatsDtoMLB.inningThreeWonHome += 1 : this.team2GameStatsDtoMLB.inningThreeLostHome += 1;
          e.pointsScoredFourthInning > e.pointsAllowedFourthInning ? this.team2GameStatsDtoMLB.inningFourWonHome += 1 : this.team2GameStatsDtoMLB.inningFourLostHome += 1;
          e.pointsScoredFifthInning > e.pointsAllowedFifthInning ? this.team2GameStatsDtoMLB.inningFiveWonHome += 1 : this.team2GameStatsDtoMLB.inningFiveLostHome += 1;
          e.pointsScoredSixthInning > e.pointsAllowedSixthInning ? this.team2GameStatsDtoMLB.inningSixWonHome += 1 : this.team2GameStatsDtoMLB.inningSixLostHome += 1;
          e.pointsScoredSeventhInning > e.pointsAllowedSeventhInning ? this.team2GameStatsDtoMLB.inningSevenWonHome += 1 : this.team2GameStatsDtoMLB.inningSevenLostHome += 1;
          e.pointsScoredEigthInning > e.pointsAllowedEigthInning ? this.team2GameStatsDtoMLB.inningEightWonHome += 1 : this.team2GameStatsDtoMLB.inningEightLostHome += 1;
          e.pointsScoredNinthInning > e.pointsAllowedNinthInning ? this.team2GameStatsDtoMLB.inningNineWonHome += 1 : this.team2GameStatsDtoMLB.inningNineLostHome += 1;
          //spread
          this.team2GameStatsDtoMLB.spreadHome += (e.pointsAllowedOverall - e.pointsScoredOverall)
          this.team2GameStatsDtoMLB.spreadFirstInningHome += (e.pointsAllowedFirstInning - e.pointsScoredFirstInning)
          this.team2GameStatsDtoMLB.spreadSecondInningHome += (e.pointsAllowedSecondInning - e.pointsScoredSecondInning)
          this.team2GameStatsDtoMLB.spreadThirdInningHome += (e.pointsAllowedThirdInning - e.pointsScoredThirdInning)
          this.team2GameStatsDtoMLB.spreadFourthInningHome += (e.pointsAllowedFourthInning - e.pointsScoredFourthInning)
          this.team2GameStatsDtoMLB.spreadFifthInningHome += (e.pointsAllowedFifthInning - e.pointsScoredFifthInning)
          this.team2GameStatsDtoMLB.spreadSixthInningHome += (e.pointsAllowedSixthInning - e.pointsScoredSixthInning)
          this.team2GameStatsDtoMLB.spreadSeventhInningHome += (e.pointsAllowedSeventhInning - e.pointsScoredSeventhInning)
          this.team2GameStatsDtoMLB.spreadEighthInningHome += (e.pointsAllowedEigthInning - e.pointsScoredEigthInning)
          this.team2GameStatsDtoMLB.spreadNinthInningHome += (e.pointsAllowedNinthInning - e.pointsScoredNinthInning)
          //tota2
          this.team2GameStatsDtoMLB.totalHome += (e.pointsScoredOverall + e.pointsAllowedOverall)
          this.team2GameStatsDtoMLB.totalFirstInningHome += e.pointsScoredFirstInning + e.pointsAllowedFirstInning
          this.team2GameStatsDtoMLB.totalSecondInningHome += e.pointsScoredSecondInning + e.pointsAllowedSecondInning
          this.team2GameStatsDtoMLB.totalThirdInningHome += e.pointsScoredThirdInning + e.pointsAllowedThirdInning
          this.team2GameStatsDtoMLB.totalFourthInningHome += e.pointsScoredFourthInning + e.pointsAllowedFourthInning
          this.team2GameStatsDtoMLB.totalFifthInningHome += e.pointsScoredFifthInning + e.pointsAllowedFifthInning
          this.team2GameStatsDtoMLB.totalSixthInningHome += e.pointsScoredSixthInning + e.pointsAllowedSixthInning
          this.team2GameStatsDtoMLB.totalSeventhInningHome += e.pointsScoredSeventhInning + e.pointsAllowedSeventhInning
          this.team2GameStatsDtoMLB.totalEighthInningHome += e.pointsScoredEigthInning + e.pointsAllowedEigthInning
          this.team2GameStatsDtoMLB.totalNinthInningHome += e.pointsScoredNinthInning + e.pointsAllowedNinthInning
          //points 2cored
          this.team2GameStatsDtoMLB.pointsScoredHomeGame += e.pointsScoredOverall
          this.team2GameStatsDtoMLB.pointsScoredFirstInningHome += e.pointsScoredFirstInning
          this.team2GameStatsDtoMLB.pointsScoredSecondInningHome += e.pointsScoredSecondInning
          this.team2GameStatsDtoMLB.pointsScoredThirdInningHome += e.pointsScoredThirdInning
          this.team2GameStatsDtoMLB.pointsScoredFourthInningHome += e.pointsScoredFourthInning
          this.team2GameStatsDtoMLB.pointsScoredFifthInningHome += e.pointsScoredFifthInning
          this.team2GameStatsDtoMLB.pointsScoredSixthInningHome += e.pointsScoredSixthInning
          this.team2GameStatsDtoMLB.pointsScoredSeventhInningHome += e.pointsScoredSeventhInning
          this.team2GameStatsDtoMLB.pointsScoredEighthInningHome += e.pointsScoredEigthInning
          this.team2GameStatsDtoMLB.pointsScoredNinthInningHome += e.pointsScoredNinthInning
          //points 2llowed
          this.team2GameStatsDtoMLB.pointsAllowedHomeGame += e.pointsAllowedOverall
          this.team2GameStatsDtoMLB.pointsAllowedFirstInningHome += e.pointsAllowedFirstInning
          this.team2GameStatsDtoMLB.pointsAllowedSecondInningHome += e.pointsAllowedSecondInning
          this.team2GameStatsDtoMLB.pointsAllowedThirdInningHome += e.pointsAllowedThirdInning
          this.team2GameStatsDtoMLB.pointsAllowedFourthInningHome += e.pointsAllowedFourthInning
          this.team2GameStatsDtoMLB.pointsAllowedFifthInningHome += e.pointsAllowedFifthInning
          this.team2GameStatsDtoMLB.pointsAllowedSixthInningHome += e.pointsAllowedSixthInning
          this.team2GameStatsDtoMLB.pointsAllowedSeventhInningHome += e.pointsAllowedSeventhInning
          this.team2GameStatsDtoMLB.pointsAllowedEighthInningHome += e.pointsAllowedEigthInning
          this.team2GameStatsDtoMLB.pointsAllowedNinthInningHome += e.pointsAllowedNinthInning

        }
        else if (e.homeOrAway == "Away") {
          e.result == "W" ? this.team2GameStatsDtoMLB.gamesWonAway += 1 : this.team2GameStatsDtoMLB.gamesLostAway += 1;

          //result by inning
          e.pointsScoredFirstInning > e.pointsAllowedFirstInning ? this.team2GameStatsDtoMLB.inningOneWonAway += 1 : this.team2GameStatsDtoMLB.inningOneLostAway += 1;
          e.pointsScoredSecondInning > e.pointsAllowedSecondInning ? this.team2GameStatsDtoMLB.inningTwoWonAway += 1 : this.team2GameStatsDtoMLB.inningTwoLostAway += 1;
          e.pointsScoredThirdInning > e.pointsAllowedThirdInning ? this.team2GameStatsDtoMLB.inningThreeWonAway += 1 : this.team2GameStatsDtoMLB.inningThreeLostAway += 1;
          e.pointsScoredFourthInning > e.pointsAllowedFourthInning ? this.team2GameStatsDtoMLB.inningFourWonAway += 1 : this.team2GameStatsDtoMLB.inningFourLostAway += 1;
          e.pointsScoredFifthInning > e.pointsAllowedFifthInning ? this.team2GameStatsDtoMLB.inningFiveWonAway += 1 : this.team2GameStatsDtoMLB.inningFiveLostAway += 1;
          e.pointsScoredSixthInning > e.pointsAllowedSixthInning ? this.team2GameStatsDtoMLB.inningSixWonAway += 1 : this.team2GameStatsDtoMLB.inningSixLostAway += 1;
          e.pointsScoredSeventhInning > e.pointsAllowedSeventhInning ? this.team2GameStatsDtoMLB.inningSevenWonAway += 1 : this.team2GameStatsDtoMLB.inningSevenLostAway += 1;
          e.pointsScoredEigthInning > e.pointsAllowedEigthInning ? this.team2GameStatsDtoMLB.inningEightWonAway += 1 : this.team2GameStatsDtoMLB.inningEightLostAway += 1;
          e.pointsScoredNinthInning > e.pointsAllowedNinthInning ? this.team2GameStatsDtoMLB.inningNineWonAway += 1 : this.team2GameStatsDtoMLB.inningNineLostAway += 1;

          //spread 
          this.team2GameStatsDtoMLB.spreadAway += (e.pointsAllowedOverall - e.pointsScoredOverall)
          this.team2GameStatsDtoMLB.spreadFirstInningAway += (e.pointsAllowedFirstInning - e.pointsScoredFirstInning)
          this.team2GameStatsDtoMLB.spreadSecondInningAway += (e.pointsAllowedSecondInning - e.pointsScoredSecondInning)
          this.team2GameStatsDtoMLB.spreadThirdInningAway += (e.pointsAllowedThirdInning - e.pointsScoredThirdInning)
          this.team2GameStatsDtoMLB.spreadFourthInningAway += (e.pointsAllowedFourthInning - e.pointsScoredFourthInning)
          this.team2GameStatsDtoMLB.spreadFifthInningAway += (e.pointsAllowedFifthInning - e.pointsScoredFifthInning)
          this.team2GameStatsDtoMLB.spreadSixthInningAway += (e.pointsAllowedSixthInning - e.pointsScoredSixthInning)
          this.team2GameStatsDtoMLB.spreadSeventhInningAway += (e.pointsAllowedSeventhInning - e.pointsScoredSeventhInning)
          this.team2GameStatsDtoMLB.spreadEighthInningAway += (e.pointsAllowedEigthInning - e.pointsScoredEigthInning)
          this.team2GameStatsDtoMLB.spreadNinthInningAway += (e.pointsAllowedNinthInning - e.pointsScoredNinthInning)

          //tota2
          this.team2GameStatsDtoMLB.totalAway += (e.pointsScoredOverall + e.pointsAllowedOverall)
          this.team2GameStatsDtoMLB.totalFirstInningAway += e.pointsScoredFirstInning + e.pointsAllowedFirstInning
          this.team2GameStatsDtoMLB.totalSecondInningAway += e.pointsScoredSecondInning + e.pointsAllowedSecondInning
          this.team2GameStatsDtoMLB.totalThirdInningAway += e.pointsScoredThirdInning + e.pointsAllowedThirdInning
          this.team2GameStatsDtoMLB.totalFourthInningAway += e.pointsScoredFourthInning + e.pointsAllowedFourthInning
          this.team2GameStatsDtoMLB.totalFifthInningAway += e.pointsScoredFifthInning + e.pointsAllowedFifthInning
          this.team2GameStatsDtoMLB.totalSixthInningAway += e.pointsScoredSixthInning + e.pointsAllowedSixthInning
          this.team2GameStatsDtoMLB.totalSeventhInningAway += e.pointsScoredSeventhInning + e.pointsAllowedSeventhInning
          this.team2GameStatsDtoMLB.totalEighthInningAway += e.pointsScoredEigthInning + e.pointsAllowedEigthInning
          this.team2GameStatsDtoMLB.totalNinthInningAway += e.pointsScoredNinthInning + e.pointsAllowedNinthInning

          //points 2cored
          this.team2GameStatsDtoMLB.pointsScoredAwayGame += e.pointsScoredOverall
          this.team2GameStatsDtoMLB.pointsScoredFirstInningAway += e.pointsScoredFirstInning
          this.team2GameStatsDtoMLB.pointsScoredSecondInningAway += e.pointsScoredSecondInning
          this.team2GameStatsDtoMLB.pointsScoredThirdInningAway += e.pointsScoredThirdInning
          this.team2GameStatsDtoMLB.pointsScoredFourthInningAway += e.pointsScoredFourthInning
          this.team2GameStatsDtoMLB.pointsScoredFifthInningAway += e.pointsScoredFifthInning
          this.team2GameStatsDtoMLB.pointsScoredSixthInningAway += e.pointsScoredSixthInning
          this.team2GameStatsDtoMLB.pointsScoredSeventhInningAway += e.pointsScoredSeventhInning
          this.team2GameStatsDtoMLB.pointsScoredEighthInningAway += e.pointsScoredEigthInning
          this.team2GameStatsDtoMLB.pointsScoredNinthInningAway += e.pointsScoredNinthInning
          
          //points 2llowed
          this.team2GameStatsDtoMLB.pointsAllowedAwayGame += e.pointsAllowedOverall
          this.team2GameStatsDtoMLB.pointsAllowedFirstInningAway += e.pointsAllowedFirstInning
          this.team2GameStatsDtoMLB.pointsAllowedSecondInningAway += e.pointsAllowedSecondInning
          this.team2GameStatsDtoMLB.pointsAllowedThirdInningAway += e.pointsAllowedThirdInning
          this.team2GameStatsDtoMLB.pointsAllowedFourthInningAway += e.pointsAllowedFourthInning
          this.team2GameStatsDtoMLB.pointsAllowedFifthInningAway += e.pointsAllowedFifthInning
          this.team2GameStatsDtoMLB.pointsAllowedSixthInningAway += e.pointsAllowedSixthInning
          this.team2GameStatsDtoMLB.pointsAllowedSeventhInningAway += e.pointsAllowedSeventhInning
          this.team2GameStatsDtoMLB.pointsAllowedEighthInningAway += e.pointsAllowedEigthInning
          this.team2GameStatsDtoMLB.pointsAllowedNinthInningAway += e.pointsAllowedNinthInning
        }

        if (e.teamAgainstId == team1New[0].teamId) {
          e.result == "W" ? this.team2GameStatsDtoMLB.gamesWonVsOpponent += 1 : this.team2GameStatsDtoMLB.gamesLostVsOpponent += 1;

          //result by inning
          e.pointsScoredFirstInning > e.pointsAllowedFirstInning ? this.team2GameStatsDtoMLB.inningOneWonVsOpponent += 1 : this.team2GameStatsDtoMLB.inningOneLostVsOpponent += 1;
          e.pointsScoredSecondInning > e.pointsAllowedSecondInning ? this.team2GameStatsDtoMLB.inningTwoWonVsOpponent += 1 : this.team2GameStatsDtoMLB.inningTwoLostVsOpponent += 1;
          e.pointsScoredThirdInning > e.pointsAllowedThirdInning ? this.team2GameStatsDtoMLB.inningThreeWonVsOpponent += 1 : this.team2GameStatsDtoMLB.inningThreeLostVsOpponent += 1;
          e.pointsScoredFourthInning > e.pointsAllowedFourthInning ? this.team2GameStatsDtoMLB.inningFourWonVsOpponent += 1 : this.team2GameStatsDtoMLB.inningFourLostVsOpponent += 1;
          e.pointsScoredFifthInning > e.pointsAllowedFifthInning ? this.team2GameStatsDtoMLB.inningFiveWonVsOpponent += 1 : this.team2GameStatsDtoMLB.inningFiveLostVsOpponent += 1;
          e.pointsScoredSixthInning > e.pointsAllowedSixthInning ? this.team2GameStatsDtoMLB.inningSixWonVsOpponent += 1 : this.team2GameStatsDtoMLB.inningSixLostVsOpponent += 1;
          e.pointsScoredSeventhInning > e.pointsAllowedSeventhInning ? this.team2GameStatsDtoMLB.inningSevenWonVsOpponent += 1 : this.team2GameStatsDtoMLB.inningSevenLostVsOpponent += 1;
          e.pointsScoredEigthInning > e.pointsAllowedEigthInning ? this.team2GameStatsDtoMLB.inningEightWonVsOpponent += 1 : this.team2GameStatsDtoMLB.inningEightLostVsOpponent += 1;
          e.pointsScoredNinthInning > e.pointsAllowedNinthInning ? this.team2GameStatsDtoMLB.inningNineWonVsOpponent += 1 : this.team2GameStatsDtoMLB.inningNineLostVsOpponent += 1;

          //spread 
          this.team2GameStatsDtoMLB.spreadVsOpponent += (e.pointsAllowedOverall - e.pointsScoredOverall)
          this.team2GameStatsDtoMLB.spreadFirstInningVsOpponent += (e.pointsAllowedFirstInning - e.pointsScoredFirstInning)
          this.team2GameStatsDtoMLB.spreadSecondInningVsOpponent += (e.pointsAllowedSecondInning - e.pointsScoredSecondInning)
          this.team2GameStatsDtoMLB.spreadThirdInningVsOpponent += (e.pointsAllowedThirdInning - e.pointsScoredThirdInning)
          this.team2GameStatsDtoMLB.spreadFourthInningVsOpponent += (e.pointsAllowedFourthInning - e.pointsScoredFourthInning)
          this.team2GameStatsDtoMLB.spreadFifthInningVsOpponent += (e.pointsAllowedFifthInning - e.pointsScoredFifthInning)
          this.team2GameStatsDtoMLB.spreadSixthInningVsOpponent += (e.pointsAllowedSixthInning - e.pointsScoredSixthInning)
          this.team2GameStatsDtoMLB.spreadSeventhInningVsOpponent += (e.pointsAllowedSeventhInning - e.pointsScoredSeventhInning)
          this.team2GameStatsDtoMLB.spreadEighthInningVsOpponent += (e.pointsAllowedEigthInning - e.pointsScoredEigthInning)
          this.team2GameStatsDtoMLB.spreadNinthInningVsOpponent += (e.pointsAllowedNinthInning - e.pointsScoredNinthInning)

          //tota2
          this.team2GameStatsDtoMLB.totalVsTeam += (e.pointsScoredOverall + e.pointsAllowedOverall)
          this.team2GameStatsDtoMLB.totalFirstInningVsOpponent += e.pointsScoredFirstInning + e.pointsAllowedFirstInning
          this.team2GameStatsDtoMLB.totalSecondInningVsOpponent += e.pointsScoredSecondInning + e.pointsAllowedSecondInning
          this.team2GameStatsDtoMLB.totalThirdInningVsOpponent += e.pointsScoredThirdInning + e.pointsAllowedThirdInning
          this.team2GameStatsDtoMLB.totalFourthInningVsOpponent += e.pointsScoredFourthInning + e.pointsAllowedFourthInning
          this.team2GameStatsDtoMLB.totalFifthInningVsOpponent += e.pointsScoredFifthInning + e.pointsAllowedFifthInning
          this.team2GameStatsDtoMLB.totalSixthInningVsOpponent += e.pointsScoredSixthInning + e.pointsAllowedSixthInning
          this.team2GameStatsDtoMLB.totalSeventhInningVsOpponent += e.pointsScoredSeventhInning + e.pointsAllowedSeventhInning
          this.team2GameStatsDtoMLB.totalEighthInningVsOpponent += e.pointsScoredEigthInning + e.pointsAllowedEigthInning
          this.team2GameStatsDtoMLB.totalNinthInningVsOpponent += e.pointsScoredNinthInning + e.pointsAllowedNinthInning

          //points 2cored
          this.team2GameStatsDtoMLB.pointsScoredVsTeamGame += e.pointsScoredOverall
          this.team2GameStatsDtoMLB.pointsScoredFirstInningVsOpponent += e.pointsScoredFirstInning
          this.team2GameStatsDtoMLB.pointsScoredSecondInningVsOpponent += e.pointsScoredSecondInning
          this.team2GameStatsDtoMLB.pointsScoredThirdInningVsOpponent += e.pointsScoredThirdInning
          this.team2GameStatsDtoMLB.pointsScoredFourthInningVsOpponent += e.pointsScoredFourthInning
          this.team2GameStatsDtoMLB.pointsScoredFifthInningVsOpponent += e.pointsScoredFifthInning
          this.team2GameStatsDtoMLB.pointsScoredSixthInningVsOpponent += e.pointsScoredSixthInning
          this.team2GameStatsDtoMLB.pointsScoredSeventhInningVsOpponent += e.pointsScoredSeventhInning
          this.team2GameStatsDtoMLB.pointsScoredEighthInningVsOpponent += e.pointsScoredEigthInning
          this.team2GameStatsDtoMLB.pointsScoredNinthInningVsOpponent += e.pointsScoredNinthInning

          //points 2llowed
          this.team2GameStatsDtoMLB.pointsAllowedVsTeamGame += e.pointsAllowedOverall
          this.team2GameStatsDtoMLB.pointsAllowedFirstInningVsOpponent += e.pointsAllowedFirstInning
          this.team2GameStatsDtoMLB.pointsAllowedSecondInningVsOpponent += e.pointsAllowedSecondInning
          this.team2GameStatsDtoMLB.pointsAllowedThirdInningVsOpponent += e.pointsAllowedThirdInning
          this.team2GameStatsDtoMLB.pointsAllowedFourthInningVsOpponent += e.pointsAllowedFourthInning
          this.team2GameStatsDtoMLB.pointsAllowedFifthInningVsOpponent += e.pointsAllowedFifthInning
          this.team2GameStatsDtoMLB.pointsAllowedSixthInningVsOpponent += e.pointsAllowedSixthInning
          this.team2GameStatsDtoMLB.pointsAllowedSeventhInningVsOpponent += e.pointsAllowedSeventhInning
          this.team2GameStatsDtoMLB.pointsAllowedEighthInningVsOpponent += e.pointsAllowedEigthInning
          this.team2GameStatsDtoMLB.pointsAllowedNinthInningVsOpponent += e.pointsAllowedNinthInning
        }

      })
      let totalFor = []
      let totalOverall = 0;
      totalFor = team2New.filter(e => { return (e.pointsAllowedOverall - e.pointsScoredOverall) < this.team2SelectedSpreadPoint })
      totalOverall = team2New.length
      this.awaySpreadOverallChance = (totalFor.length / totalOverall) 

      totalFor = team2New.filter(e => { return (((e.pointsAllowedOverall - e.pointsScoredOverall) < this.team2SelectedSpreadPoint) && e.homeOrAway == "Away") })
      totalOverall = team2New.filter(e => e.homeOrAway == "Away").length
      this.awaySpreadAwayChance = (totalFor.length / totalOverall) 

      totalFor = team2New.filter(e => {
        return (((e.pointsAllowedOverall - e.pointsScoredOverall) < this.team2SelectedSpreadPoint) && (e.teamAgainstId == team1New[0].teamId))
      })
      totalOverall = team2New.filter(e => e.teamAgainstId == team1New[0].teamId).length

      this.awaySpreadTeamChance = (totalFor.length / totalOverall) 
    }

    else if (this.selectedSport == "NHL") {

    }

    else if (this.selectedSport == "NFL") {

    }

  }

  loadNewSpreadProp(team1: any[], team2: any[], prop: any, type: string) {
    if (type == 'away') {
      this.team2SelectedSpreadPoint = prop.point
      this.team2SelectedSpreadPrice = prop.price
    }
    else if(type == 'home') {
      this.team1SelectedSpreadPoint = prop.point
      this.team1SelectedSpreadPrice = prop.price
    }

    this.calculateSpreadPropChace(team1, team2, prop.point, type)
  }
  playerPropDataFinalNew: any[] = []
  async loadPlayerStatData(team1: number, team2: number){
    this.playerStatsFinal = await MlbController.mlbGetPlayerGameStatsByTeamAndSeason([team1, team2], 2024)
    //this.playerpropDataFinal is a 3 length array with 2 props for each player within it

    //for each prop type ex: batter hits
    for(let prop of this.playerPropDataFinal){
      let playerPropNew: any[] = []
      let propNew: any[] = []
      let playerAway: any = []
      let playerHome: any = []
      //gets the unique players in that prop
      let specifcPlayers = prop.map((e: { playerName: any; }) => e.playerName).filter((value: any, index: any, array: string | any[]) => array.indexOf(value) === index)
      //for each player in that prop
      for(let player of specifcPlayers){
        //need to check get to see what team that player is on
        let playerFiltered = this.playerStatsFinal.filter(f => f.playerName == player)
        if(playerFiltered[playerFiltered.length-1].teamName == this.team2GameStats[0].teamName){
          let playerSpecific = prop.filter((g: { playerName: any; }) => g.playerName == player)
          if(playerSpecific[0].description == "Over"){
            playerSpecific = playerSpecific.reverse()
          }
          playerAway.push(playerSpecific)
        }
        else{
          let playerSpecific = prop.filter((g: { playerName: any; }) => g.playerName == player)
          if(playerSpecific[0].description == "Over"){
            playerSpecific = playerSpecific.reverse()
          }
          playerHome.push(playerSpecific)
        }
        
      }
      playerAway.teamName = this.displayPropHtml2.name
      playerHome.teamName = this.displayPropHtml1.name
      playerPropNew.push(playerAway, playerHome)
      //propNew.push(playerPropNew)
      this.playerPropDataFinalNew.push(playerPropNew)
      

    }
    
  }

    getPlayerStats(player: any){
      try{
        var playerStats = this.playerStatsFinal.filter(e => e.playerName == player.playerName)
    
        let teamName = ''
        let teamAgainstName = ''
        let homeAway = 'away'
        if(playerStats[0].teamName == reusedFunctions.teamNamesToAbvr[player.homeTeam]){
          homeAway = 'home'
          teamName = reusedFunctions.teamNamesToAbvr[player.homeTeam]
          teamAgainstName = reusedFunctions.teamNamesToAbvr[player.awayTeam]
        }
        else{
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
    
    if(this.selectedSport == 'MLB'){
      if(player.marketKey == 'batter_hits'){
        overOverall = playerStats.filter(e => {
          if(e.batterHits > highOverall){
            highOverall = e.batterHits
          }
          if(e.batterHits < lowOverall){
            lowOverall = e.batterHits
          }
          return e.batterHits > player.point
        }).length
        overHomeAway = playerStats.filter(e => {
          if(e.batterHits > highHomeAway && (reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway)){
            highHomeAway = e.batterHits
          }
          if(e.batterHits < lowHomeAway && (reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway)){
            lowHomeAway = e.batterHits
          }
          return e.batterHits > player.point && reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway
        }).length
        overTeam = playerStats.filter(e => {
          if(e.batterHits > highTeam && e.teamAgainstName == teamAgainstName){
            highTeam = e.batterHits
          }
          if(e.batterHits < lowTeam && e.teamAgainstName == teamAgainstName){
            lowTeam = e.batterHits
          }
          return e.batterHits > player.point && e.teamAgainstName == teamAgainstName
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
        averageTeam = totalSum / totalTeam

      }
      else if(player.marketKey == 'batter_home_runs'){
        overOverall = playerStats.filter(e => {
          if(e.batterHomeRuns > highOverall){
            highOverall = e.batterHomeRuns
          }
          if(e.batterHomeRuns < lowOverall){
            lowOverall = e.batterHomeRuns
          }
          return e.batterHomeRuns > player.point
        }).length
        overHomeAway = playerStats.filter(e => {
          if(e.batterHomeRuns > highHomeAway && (reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway)){
            highHomeAway = e.batterHomeRuns
          }
          if(e.batterHomeRuns < lowHomeAway && (reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway)){
            lowHomeAway = e.batterHomeRuns
          }
          return e.batterHomeRuns > player.point && reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway
        }).length
        overTeam = playerStats.filter(e => {
          if(e.batterHomeRuns > highTeam && e.teamAgainstName == teamAgainstName){
            highTeam = e.batterHomeRuns
          }
          if(e.batterHomeRuns < lowTeam && e.teamAgainstName == teamAgainstName){
            lowTeam = e.batterHomeRuns
          }
          return e.batterHomeRuns > player.point && e.teamAgainstName == teamAgainstName
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
        averageTeam = totalSum / totalTeam
        
        
      }
      else if(player.marketKey == 'batter_total_bases'){
        overOverall = playerStats.filter(e => {
          if(e.batterTotalBases > highOverall){
            highOverall = e.batterTotalBases
          }
          if(e.batterTotalBases < lowOverall){
            lowOverall = e.batterTotalBases
          }
          return e.batterHits > player.point
        }).length
        overHomeAway = playerStats.filter(e => {
          if(e.batterTotalBases > highHomeAway && (reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway)){
            highHomeAway = e.batterTotalBases
          }
          if(e.batterTotalBases < lowHomeAway && (reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway)){
            lowHomeAway = e.batterTotalBases
          }
          return e.batterHits > player.point && reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway
        }).length
        overTeam = playerStats.filter(e => {
          if(e.batterTotalBases > highTeam && e.teamAgainstName == teamAgainstName){
            highTeam = e.batterTotalBases
          }
          if(e.batterTotalBases < lowTeam && e.teamAgainstName == teamAgainstName){
            lowTeam = e.batterTotalBases
          }
          return e.batterTotalBases > player.point && e.teamAgainstName == teamAgainstName
        }).length

        let totalSum = 0
        playerStats.forEach(e => {
          totalSum += e.batterTotalBases
        })
        averageOverall = totalSum / totalOverall
        totalSum = 0
        let homeAwayGames = playerStats.filter(e => {
          return reusedFunctions.getHomeAwayFromGameId(e.gameId, teamName) == homeAway
        })
        homeAwayGames.forEach(f => {
          totalSum += f.batterTotalBases
          totalHomeAway++
        })
        averageHomeAway = totalSum / totalHomeAway
        totalSum = 0
        let teamGames = playerStats.filter(e => {

          return e.teamAgainstName == teamAgainstName
        })
        teamGames.forEach(f => {
          totalSum += f.batterTotalBases
          totalTeam++
        })
        averageTeam = totalSum / totalTeam
      }
        
    }

    var returnObj = {
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
      highOverall:highOverall,
      highHomeAway: highHomeAway,
      highTeam: highTeam,
      lowOverall: lowOverall,
      lowHomeAway: lowHomeAway,
      lowTeam: lowTeam

    }
    return returnObj
    
      }catch(error: any){
        console.log(player.playerName)
        return {
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
          highOverall:0,
          highHomeAway: 0,
          highTeam: 0,
          lowOverall: 0,
          lowHomeAway: 0,
          lowTeam: 0
    
        }
      }
    
      
    
    

    
    
  }


  //when the prop is positive then we want to check each game and see if the points allowed minue the points scored is less than the prop
  //because for a positive spread that means everything less than that number wins
  //when the prop is negative then we want t
  public team2SelectedSpreadPoint: number = 0
  public team2SelectedSpreadPrice: number = 0
  public team1SelectedSpreadPoint: number = 0
  public team1SelectedSpreadPrice: number = 0
  public awaySpreadOverallChance: number = 0
  public awaySpreadAwayChance: number = 0
  public awaySpreadTeamChance: number = 0
  public homeSpreadOverallChance: number = 0
  public homeSpreadHomeChance: number = 0
  public homeSpreadTeamChance: number = 0
  calculateSpreadPropChace(teamStats: any[], teamAgainstStats: any[], prop: number, type: string) {

    let totalFor: any[] = [];
    let totalOverall: number = 0;
    if (type == 'away') {
      totalFor = teamStats.filter(e => {
        return ((e.pointsAllowedOverall - e.pointsScoredOverall) < prop);
      })
      totalOverall = teamStats.length
      this.awaySpreadOverallChance = (totalFor.length / totalOverall)


      totalFor = teamStats.filter(e => {
        return (((e.pointsAllowedOverall - e.pointsScoredOverall) < prop) && e.homeOrAway == "Away")
      })
      totalOverall = teamStats.filter(e => e.homeOrAway == "Away").length
      this.awaySpreadAwayChance = (totalFor.length / totalOverall) 

      totalFor = teamStats.filter(e => {
        return (((e.pointsAllowedOverall - e.pointsScoredOverall) < prop) && (e.teamAgainstId == teamAgainstStats[0].teamId))
      })
      totalOverall = teamStats.filter(e => e.teamAgainstId == teamAgainstStats[0].teamId).length
      this.awaySpreadTeamChance = (totalFor.length / totalOverall) 

    }
    else if (type == 'home') {

      totalFor = teamStats.filter(e => {
        return ((e.pointsAllowedOverall - e.pointsScoredOverall) < prop)
      })
      totalOverall = teamStats.length
      this.homeSpreadOverallChance = (totalFor.length / totalOverall)


      totalFor = teamStats.filter(e => {
        return (((e.pointsAllowedOverall - e.pointsScoredOverall) < prop) && e.homeOrAway == "Home")
      })
      totalOverall = teamStats.filter(e => e.homeOrAway == "Home").length
      this.homeSpreadHomeChance = (totalFor.length / totalOverall)

      totalFor = teamStats.filter(e => {
        return (((e.pointsAllowedOverall - e.pointsScoredOverall) < prop) && e.teamAgainstId == teamAgainstStats[0].teamId)
      })
      totalOverall = teamStats.filter(e => e.teamAgainstId == teamAgainstStats[0].teamId).length
      this.homeSpreadTeamChance = (totalFor.length / totalOverall) 


    }

  }

  getSpreadHighLow(homeAway: string, type: string, highLow: string): number {
    let finalSpread = 0
    if(homeAway == 'away'){
      if(highLow == 'high'){
        if(type == 'overall'){
          finalSpread = 1000
          this.team2GameStats.forEach(e => {
            if((e.pointsAllowedOverall - e.pointsScoredOverall) < finalSpread){
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall);
            }
          })
        }
        else if(type == 'away'){
          finalSpread = 1000
          this.team2GameStats.forEach(e => {
            if((e.pointsAllowedOverall - e.pointsScoredOverall) < finalSpread && e.homeOrAway == 'Away'){
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall);
            }
          })
        }
        else if(type == 'team'){
          finalSpread = 1000
          this.team2GameStats.forEach(e => {
            if((e.pointsAllowedOverall - e.pointsScoredOverall) < finalSpread && e.teamAgainstId == this.team1GameStats[0].teamId){
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall);
            }
          })
        }
      }
      else{
        if(type == 'overall'){
          finalSpread = -1000
          this.team2GameStats.forEach(e => {
            if((e.pointsAllowedOverall - e.pointsScoredOverall) > finalSpread){
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall)
            }
          })
        }
        else if(type == 'away'){
          finalSpread = -1000
          this.team2GameStats.forEach(e => {
            if((e.pointsAllowedOverall - e.pointsScoredOverall) > finalSpread && e.homeOrAway == 'Away'){
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall)
            }
          })
        }
        else if(type == 'team'){
          finalSpread = -1000
          this.team2GameStats.forEach(e => {
            if((e.pointsAllowedOverall - e.pointsScoredOverall) > finalSpread && e.teamAgainstId == this.team1GameStats[0].teamId){
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall)
            }
          })
        }
      }
      
    }
    else{
      if(highLow == 'high'){
        if(type == 'overall'){
          finalSpread = 1000
          this.team1GameStats.forEach(e => {
            if((e.pointsAllowedOverall - e.pointsScoredOverall) < finalSpread){
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall)
            }
          })
        }
        else if(type == 'home'){
          finalSpread = 1000
          this.team1GameStats.forEach(e => {
            if((e.pointsAllowedOverall - e.pointsScoredOverall) < finalSpread && e.homeOrAway == 'Home'){
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall)
            }
          })
        }
        else if(type == 'team'){
          finalSpread = 1000
          this.team1GameStats.forEach(e => {
            if((e.pointsAllowedOverall - e.pointsScoredOverall) < finalSpread && e.teamAgainstId == this.team2GameStats[0].teamId){
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall)
            }
          })
        }
      }
      else{
        if(type == 'overall'){
          finalSpread = -1000
          this.team1GameStats.forEach(e => {
            if((e.pointsAllowedOverall - e.pointsScoredOverall) > finalSpread){
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall)
            }
          })
        }
        else if(type == 'home'){
          finalSpread = -1000
          this.team1GameStats.forEach(e => {
            if((e.pointsAllowedOverall - e.pointsScoredOverall) > finalSpread && e.homeOrAway == 'Home'){
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall)
            }
          })
        }
        else if(type == 'team'){
          finalSpread = -1000
          this.team1GameStats.forEach(e => {
            if((e.pointsAllowedOverall - e.pointsScoredOverall) > finalSpread && e.teamAgainstId == this.team2GameStats[0].teamId){
              finalSpread = (e.pointsAllowedOverall - e.pointsScoredOverall)
            }
          })
        }
      }
      
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

  getTotalHighLow(homeAway: string, type: string, highLow: string) : number{
    let finalTotal = 0
    if(homeAway == 'away'){
      if(highLow == 'high'){
        if(type == 'overall'){
          finalTotal = 0
          this.team2GameStats.forEach(e => {
            if((e.pointsScoredOverall + e.pointsAllowedOverall) > finalTotal){
              finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
            }
          })
        }
        else if(type == 'away'){
          finalTotal = 0
          this.team2GameStats.forEach(e => {
            if((e.pointsScoredOverall + e.pointsAllowedOverall) > finalTotal && e.homeOrAway == 'Away'){
              finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
            }
          })
        }
        else if(type == 'team'){
          finalTotal = 0
          this.team2GameStats.forEach(e => {
            if((e.pointsScoredOverall + e.pointsAllowedOverall) > finalTotal && e.teamAgainstId == this.team1GameStats[0].teamId){
              finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
            }
          })
        }
      }
      else{
        if(type == 'overall'){
          finalTotal = 1000
          this.team2GameStats.forEach(e => {
            if((e.pointsScoredOverall + e.pointsAllowedOverall) < finalTotal){
              finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
            }
          })
        }
        else if(type == 'away'){
          finalTotal = 1000
          this.team2GameStats.forEach(e => {
            if((e.pointsScoredOverall + e.pointsAllowedOverall) < finalTotal && e.homeOrAway == 'Away'){
              finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
            }
          })
        }
        else if(type == 'team'){
          finalTotal = 1000
          this.team2GameStats.forEach(e => {
            if((e.pointsScoredOverall + e.pointsAllowedOverall) < finalTotal && e.teamAgainstId == this.team1GameStats[0].teamId){
              finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
            }
          })
        }
      }
      
    }
    else{
      if(highLow == 'high'){
        if(type == 'overall'){
          finalTotal = 0
          this.team1GameStats.forEach(e => {
            if((e.pointsScoredOverall + e.pointsAllowedOverall) > finalTotal){
              finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
            }
          })
        }
        else if(type == 'home'){
          finalTotal = 0
          this.team1GameStats.forEach(e => {
            if((e.pointsScoredOverall + e.pointsAllowedOverall) > finalTotal && e.homeOrAway == 'Home'){
              finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
            }
          })
        }
        else if(type == 'team'){
          finalTotal = 0
          this.team1GameStats.forEach(e => {
            if((e.pointsScoredOverall + e.pointsAllowedOverall) > finalTotal && e.teamAgainstId == this.team2GameStats[0].teamId){
              finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
            }
          })
        }
      }
      else{
        if(type == 'overall'){
          finalTotal = 1000
          this.team1GameStats.forEach(e => {
            if((e.pointsScoredOverall + e.pointsAllowedOverall) < finalTotal){
              finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
            }
          })
        }
        else if(type == 'home'){
          finalTotal = 1000
          this.team1GameStats.forEach(e => {
            if((e.pointsScoredOverall + e.pointsAllowedOverall) < finalTotal && e.homeOrAway == 'Home'){
              finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
            }
          })
        }
        else if(type == 'team'){
          finalTotal = 1000
          this.team1GameStats.forEach(e => {
            if((e.pointsScoredOverall + e.pointsAllowedOverall) < finalTotal && e.teamAgainstId == this.team2GameStats[0].teamId){
              finalTotal = (e.pointsScoredOverall + e.pointsAllowedOverall)
            }
          })
        }
      }
      
    }
    return finalTotal
  }

  calculateNewTotalChance(prop:number, homeAway:string){
    if(this.selectedSport == 'MLB'){
      if(homeAway == 'away'){
        if(this.overTrueUnderFalseAway == true){
          let totalFor = this.team2GameStats.filter(e => {return (e.pointsScoredOverall + e.pointsAllowedOverall) > prop})
          let totalOverall = this.team2GameStats.length
          this.totalAwayOverallChance = totalFor.length / totalOverall

          totalFor =  this.team2GameStats.filter(e => {return ((e.pointsScoredOverall + e.pointsAllowedOverall) > prop) && e.homeOrAway == 'Away'})
          totalOverall = this.team2GameStats.filter(e => {return e.homeOrAway == 'Away'}).length
          this.totalAwayAwayChance = totalFor.length / totalOverall

          totalFor =  this.team2GameStats.filter(e => {return ((e.pointsScoredOverall + e.pointsAllowedOverall) > prop) && e.teamAgainstId == this.team1GameStats[0].teamId})
          totalOverall = this.team2GameStats.filter(e => {return e.teamAgainstId == this.team1GameStats[0].teamId}).length
          this.totalAwayTeamChance = totalFor.length / totalOverall
          
          
        }
        else if(this.overTrueUnderFalseAway == false){
          let totalFor = this.team2GameStats.filter(e => {return (e.pointsScoredOverall + e.pointsAllowedOverall) < prop})
          let totalOverall = this.team2GameStats.length
          if(totalOverall == 0){
            this.totalAwayOverallChance = 0
          }
          else{this.totalAwayOverallChance = totalFor.length / totalOverall}

          totalFor =  this.team2GameStats.filter(e => {return ((e.pointsScoredOverall + e.pointsAllowedOverall) < prop) && e.homeOrAway == 'Away'})
          totalOverall = this.team2GameStats.filter(e => {return e.homeOrAway == 'Away'}).length
          if(totalOverall == 0){
            this.totalAwayAwayChance = 0
          }
          else{this.totalAwayAwayChance = totalFor.length / totalOverall}

          totalFor =  this.team2GameStats.filter(e => {return ((e.pointsScoredOverall + e.pointsAllowedOverall) < prop) && e.teamAgainstId == this.team1GameStats[0].teamId})
          totalOverall = this.team2GameStats.filter(e => {return e.teamAgainstId == this.team1GameStats[0].teamId}).length
          if(totalOverall == 0){
            this.totalAwayTeamChance = 0
          }
          else{this.totalAwayTeamChance = totalFor.length / totalOverall}
        }
        
      }
      else if(homeAway == 'home'){
        if(this.overTrueUnderFalseHome == true){
          let totalFor = this.team1GameStats.filter(e => {return (e.pointsScoredOverall + e.pointsAllowedOverall) > prop})
          let totalOverall = this.team1GameStats.length
          if(totalOverall == 0){
            this.totalHomeOverallChance = 0
          }
          else{this.totalHomeOverallChance = totalFor.length / totalOverall}

          totalFor =  this.team1GameStats.filter(e => {return ((e.pointsScoredOverall + e.pointsAllowedOverall) > prop) && e.homeOrAway == 'Away'})
          totalOverall = this.team1GameStats.filter(e => {return e.homeOrAway == 'Away'}).length
          if(totalOverall == 0){
            this.totalHomeHomeChance = 0
          }
          else{this.totalHomeHomeChance = totalFor.length / totalOverall}

          totalFor =  this.team1GameStats.filter(e => {return ((e.pointsScoredOverall + e.pointsAllowedOverall) > prop) && e.teamAgainstId == this.team2GameStats[0].teamId})
          totalOverall = this.team1GameStats.filter(e => {return e.teamAgainstId == this.team2GameStats[0].teamId}).length
          if(totalOverall == 0){
            this.totalHomeTeamChance = 0
          }
          else{this.totalHomeTeamChance = totalFor.length / totalOverall}
        }
        else if(this.overTrueUnderFalseHome == false){
          let totalFor = this.team1GameStats.filter(e => {return (e.pointsScoredOverall + e.pointsAllowedOverall) < prop})
          let totalOverall = this.team1GameStats.length
          if(totalOverall == 0){
            this.totalHomeOverallChance = 0
          }
          else{this.totalHomeOverallChance = totalFor.length / totalOverall}

          totalFor =  this.team1GameStats.filter(e => {return ((e.pointsScoredOverall + e.pointsAllowedOverall) < prop) && e.homeOrAway == 'Away'})
          totalOverall = this.team1GameStats.filter(e => {return e.homeOrAway == 'Away'}).length
          if(totalOverall == 0){
            this.totalHomeHomeChance = 0
          }
          else{this.totalHomeHomeChance = totalFor.length / totalOverall}
          

          totalFor =  this.team1GameStats.filter(e => {return ((e.pointsScoredOverall + e.pointsAllowedOverall) < prop) && e.teamAgainstId == this.team2GameStats[0].teamId})
          totalOverall = this.team1GameStats.filter(e => {return e.teamAgainstId == this.team2GameStats[0].teamId}).length
          if(totalOverall == 0){
            this.totalHomeTeamChance = 0
          }
          else{this.totalHomeTeamChance = totalFor.length / totalOverall}
        }
      }
    }
  }

  returnGameLog(homeAway:string,type:string): any[]{
    let finalArray = []
    if(homeAway == 'away'){
      if(type == 'overall'){
        finalArray = this.team2GameStatsReversed.slice(0,10)
      }
      else if(type == 'away'){
        finalArray = this.team2GameStatsReversed.filter(e => e.homeOrAway == 'Away').slice(0,10)
      }
      else if(type == 'team'){
        finalArray = this.team2GameStatsReversed.filter(e => e.teamAgainstId == this.team1GameStats[0].teamId).slice(0,10)
      }
    }
    else{
      if(type == 'overall'){
        finalArray = this.team1GameStatsReversed.slice(0,10)
      }
      else if(type == 'home'){
        finalArray = this.team1GameStatsReversed.filter(e => e.homeOrAway == 'Home').slice(0,10)
      }
      else if(type == 'team'){
        finalArray = this.team1GameStatsReversed.filter(e => e.teamAgainstId == this.team2GameStats[0].teamId).slice(0,10)
      }
    }
    return finalArray
  }

  moneyLineTableColumns: string[] = ["TeamAgainst", "Date", "Score"]
  

  onSpreadModal() {

  }
  onTotalModal() {

  }

  moneylineGameToggled() {
    this.moneylineGameClicked = true;
    this.moneylineHalfClicked = false;
    this.moneylineQuarterClicked = false;

  }
  moneylineHalfToggled() {
    this.moneylineGameClicked = false;
    this.moneylineHalfClicked = true;
    this.moneylineQuarterClicked = false;
  }
  moneylineQuarterToggled() {
    this.moneylineGameClicked = false;
    this.moneylineHalfClicked = false;
    this.moneylineQuarterClicked = true;
  }
  spreadGameToggled() {
    this.spreadGameClicked = true;
    this.spreadHalfClicked = false;
    this.spreadQuarterClicked = false;

  }
  spreadHalfToggled() {
    this.spreadGameClicked = false;
    this.spreadHalfClicked = true;
    this.spreadQuarterClicked = false;
  }
  spreadQuarterToggled() {
    this.spreadGameClicked = false;
    this.spreadHalfClicked = false;
    this.spreadQuarterClicked = true;
  }

  totalGameToggled() {
    this.totalGameClicked = true;
    this.totalHalfClicked = false;
    this.totalQuarterClicked = false;

  }
  totalHalfToggled() {
    this.totalGameClicked = false;
    this.totalHalfClicked = true;
    this.totalQuarterClicked = false;
  }
  totalQuarterToggled() {
    this.totalGameClicked = false;
    this.totalHalfClicked = false;
    this.totalQuarterClicked = true;
  }

  pointsScoredGameToggled() {
    this.pointsScoredGameClicked = true;
    this.pointsScoredHalfClicked = false;
    this.pointsScoredQuarterClicked = false;

  }

  pointsScoredHalfToggled() {
    this.pointsScoredGameClicked = false;
    this.pointsScoredHalfClicked = true;
    this.pointsScoredQuarterClicked = false;
  }

  pointsScoredQuarterToggled() {
    this.pointsScoredGameClicked = false;
    this.pointsScoredHalfClicked = false;
    this.pointsScoredQuarterClicked = true;
  }

  pointsAllowedGameToggled() {
    this.pointsAllowedGameClicked = true;
    this.pointsAllowedHalfClicked = false;
    this.pointsAllowedQuarterClicked = false;
  }
  pointsAllowedHalfToggled() {
    this.pointsAllowedGameClicked = false;
    this.pointsAllowedHalfClicked = true;
    this.pointsAllowedQuarterClicked = false;
  }
  pointsAllowedQuarterToggled() {
    this.pointsAllowedGameClicked = false;
    this.pointsAllowedHalfClicked = false;
    this.pointsAllowedQuarterClicked = true;
  }


  moneyline2GameToggled() {
    this.moneyline2GameClicked = true;
    this.moneyline2HalfClicked = false;
    this.moneyline2QuarterClicked = false;


  }
  moneyline2HalfToggled() {
    this.moneyline2GameClicked = false;
    this.moneyline2HalfClicked = true;
    this.moneyline2QuarterClicked = false;
  }
  moneyline2QuarterToggled() {
    this.moneyline2GameClicked = false;
    this.moneyline2HalfClicked = false;
    this.moneyline2QuarterClicked = true;
  }
  spread2GameToggled() {
    this.spread2GameClicked = true;
    this.spread2HalfClicked = false;
    this.spread2QuarterClicked = false;


  }
  spread2HalfToggled() {
    this.spread2GameClicked = false;
    this.spread2HalfClicked = true;
    this.spread2QuarterClicked = false;
  }
  spread2QuarterToggled() {
    this.spread2GameClicked = false;
    this.spread2HalfClicked = false;
    this.spread2QuarterClicked = true;
  }

  total2GameToggled() {
    this.total2GameClicked = true;
    this.total2HalfClicked = false;
    this.total2QuarterClicked = false;

  }
  total2HalfToggled() {
    this.total2GameClicked = false;
    this.total2HalfClicked = true;
    this.total2QuarterClicked = false;
  }
  total2QuarterToggled() {
    this.total2GameClicked = false;
    this.total2HalfClicked = false;
    this.total2QuarterClicked = true;
  }
  pointsScored2GameToggled() {
    this.pointsScored2GameClicked = true;
    this.pointsScored2HalfClicked = false;
    this.pointsScored2QuarterClicked = false;

  }

  pointsScored2HalfToggled() {
    this.pointsScored2GameClicked = false;
    this.pointsScored2HalfClicked = true;
    this.pointsScored2QuarterClicked = false;
  }

  pointsScored2QuarterToggled() {
    this.pointsScored2GameClicked = false;
    this.pointsScored2HalfClicked = false;
    this.pointsScored2QuarterClicked = true;
  }

  pointsAllowed2GameToggled() {
    this.pointsAllowed2GameClicked = true;
    this.pointsAllowed2HalfClicked = false;
    this.pointsAllowed2QuarterClicked = false;
  }
  pointsAllowed2HalfToggled() {
    this.pointsAllowed2GameClicked = false;
    this.pointsAllowed2HalfClicked = true;
    this.pointsAllowed2QuarterClicked = false;
  }
  pointsAllowed2QuarterToggled() {
    this.pointsAllowed2GameClicked = false;
    this.pointsAllowed2HalfClicked = false;
    this.pointsAllowed2QuarterClicked = true;
  }

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

  openChart(event: any){
    if(event == 0){
      this.chart.destroy()
    }
    if(event == 1){
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





  splitGameString(game: string): string[] {
    var bothGames: string[] = []
    var temp = ''
    var vsIndex = 0;
    vsIndex = game.indexOf("vs")
    bothGames.push(game.slice(0, vsIndex - 1))
    bothGames.push(game.slice(vsIndex + 3, game.length))
    return bothGames
  }



  async onPropTypeClicked(event: any) {
    if (event.tab.textLabel == "Player Props") {
      this.gamePropsClicked = false
      await this.loadPlayerProps()
    }
    else if (event.tab.textLabel == "Game Props") {
      this.playerPropsClicked = false
      this.gamePropsClicked = true

    }
  }






  //API calls



  async loadPlayerProps() {
    if (this.playerPropsClicked == true) {
      this.playerPropsClicked = false;
      return;
    }
    this.playerPropsClicked = true;

    try {
      console.time("load player props")

      var results = await draftKingsApiController.getPlayerProps(this.selectedSport, this.selectedGame);
      if (results.length == 0) {
        alert("Player Props have not been added by Draft Kings yet")
      }
      else {
        await PlayerPropController.addPlayerPropData(results);
        await PlayerPropController.loadPlayerPropData(this.selectedSport, this.selectedGame).then(item => this.playerPropDataFinal = item)
        this.addplayerPropToArray();
      }


      console.timeEnd("load player props")
    } catch (error: any) {
      alert(error.message)
    }



  }








  addplayerPropToArray() {

    // takes the stream from the database and converts it to the objects for display
    console.time("add player prop to array")
    var differentPropTypes: any[] = []
    this.playerPropDataFinal.forEach((e) => {
      if (!differentPropTypes.includes(e.marketKey)) {
        differentPropTypes.push(e.marketKey)
      }
    })
    this.playerPropObjectArray = [];
    for (let j = 0; j < differentPropTypes.length; j++) {
      this.playerPropsArray = [];
      for (var u = 0; u < this.playerPropDataFinal.length; u++) {

        if (this.playerPropDataFinal[u].marketKey == differentPropTypes[j]) {
          var playerName = this.playerPropDataFinal[u].playerName
          playerName = playerName.replaceAll(".", "")
          this.playerPropsArray.push({
            name: playerName,
            id: '',
            description: this.playerPropDataFinal[u].description,
            price: this.playerPropDataFinal[u].price.toString(),
            point: this.playerPropDataFinal[u].point.toString(),
            event: this.removeUnderscoreFromPlayerProp(this.playerPropDataFinal[u].marketKey),
            isDisabled: false,
            percentTotal: "",
            percentTeam: "",
            avgTotal: "",
            avgTeam: "",
            team1: this.playerPropDataFinal[u].homeTeam,
            team2: this.playerPropDataFinal[u].awayTeam,
            isOpened: false,
            teamAgainst: '',
            averageDifferential: "",
            gamesPlayed: "",
            gamesPlayedvsTeam: "",
            average2022: "",
            average2022vsTeam: ""
          });


        }

      }
      this.playerPropObjectArray[j] = this.playerPropsArray;
    }
    this.playerProps = new MatTableDataSource(this.playerPropObjectArray);

    console.timeEnd("add player prop to array")

  }

  removeUnderscoreFromPlayerProp(prop: string): string {
    prop = prop.replaceAll("_", " ");
    return prop;
  }






  //add a button that can find the highest prop percentages out of the selected prop


  //Find a player stat api and create an interface and array of objects that stores the data for each player connected to team that way it can be easily accessed when needed to reference the stats

  public playerAverageForSeason: any = 0;
  public playerAverageVsTeam: any = 0;
  public playerPercentForSeason: any = 0;
  public playerPercentVsTeam: any = 0;
  public teamAgainst: string = '';
  public gamesPlayed: any = 0
  public gamesPlayedVsTeam: any = 0
  public playerId: any = 0
  public average2022: any = 0
  public average2022vsTeam: any = 0;
  public differential: any = 0;
  tempPlayerStatData: any[] = [{}];
  async getPlayerStatsForSeason(element: any) {
    if (element.percentTotal === "") {
      await this.getPlayerStatsForSeasonCall(element);
    }


  }

  async getPlayerStatsForSeasonCall(element: any) {

    try {

      /* if (this.selectedSport == "NHL") {
        for (let i = 0; i < element.length; i++) {
          let player = await NhlPlayerInfoController.nhlLoadPlayerInfoFromName(element[i].name)
          let db2022 = await this.nhlPlayerGameStatRepo.find({ where: { season: "20222023", playerId: player[0].playerId } })
          let db2023 = await this.nhlPlayerGameStatRepo.find({ where: { season: "20232024", playerId: player[0].playerId } })
          if (db2022.length == 0) {
            var results = await this.nhlApiController.loadNhl2022PlayerStatData(player[0].playerId)
            if (results.length == 0) {
              await NhlPlayerGameStatsController.nhlAddPlayerINfo2022BlankData(player[0].playerId, player[0].playerName);
            }
            else {
              await NhlPlayerGameStatsController.nhlAddPlayerINfo2022Data(results);
            }



            await NhlPlayerGameStatsController.nhlLoadPlayerInfo2022FromId(player[0].playerId).then(item => this.nhlPlayerStatData2022Final = item)
          }
          else {
            await NhlPlayerGameStatsController.nhlLoadPlayerInfo2022FromId(player[0].playerId).then(item => this.nhlPlayerStatData2022Final = item)
          }

          if (db2023.length == 0 || db2023[0].createdAt?.getDate() != this.date.getDate()) {
            var results = await this.nhlApiController.loadNhl2023PlayerStatData(player[0].playerId)
            await NhlPlayerGameStatsController.nhlAddPlayerINfo2023Data(results);

            await NhlPlayerGameStatsController.nhlLoadPlayerInfo2023FromId(player[0].playerId).then(item => this.nhlPlayerStatData2023Final = item)

          }
          else {
            await NhlPlayerGameStatsController.nhlLoadPlayerInfo2023FromId(player[0].playerId).then(item => this.nhlPlayerStatData2023Final = item)

          }
          await this.computeStatForPlayer(element[i]);
        }
      } */
      if (this.selectedSport == "NBA") {
        var previousName = ''
        for (let i = 0; i < element.length; i++) {
          let playerName = element[i].name
          if (playerName == previousName) {
            await this.computeStatForPlayer(element[i])
            continue
          }
          let player = await NbaController.nbaLoadPlayerInfoFromName(element[i].name)
          if (player.length == 0) {
            alert(element[i].name + " is not in the player database")
          }
          await NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(player[0].playerId, 2023).then(item => this.nbaPlayerStatData2023Final = item)
          await this.computeStatForPlayer(element[i]);
          previousName = element[i].name
        }
      }
      this.displayProgressBar = false
    } catch (error: any) {
    }
  }



  async computeStatsForAllPlayersInProp(element: any) {
    this.displayProgressBar = true
    if (element[0].percentTeam == "") {
      await this.getPlayerStatsForSeasonCall(element)
    }



  }
  async computeStatForPlayer(element: any) {
    //add this function to get called when the original elements get added to the interface
    //don't make the call each time. Make the call once then add it to an array then once they click again check to see if it's already stored
    this.playerAverageForSeason = 0;
    this.playerPercentForSeason = 0;
    this.playerAverageVsTeam = 0;
    this.playerPercentVsTeam = 0;
    this.teamAgainst = '';
    this.differential = 0;
    this.gamesPlayedVsTeam = 0
    this.playerId = 0
    this.average2022 = 0
    this.average2022vsTeam = 0
    var numberOfGamesStarted = 0;
    var numberOfGamesStartedVsTeam = 0;
    var numberOfGamesStartedVsTeam2022 = 0


    if (this.selectedSport == "MLB") {

      var resultArray = Object.keys(this.tempPlayerStatData).map((personNamedIndex: any) => {
        let newStatData = this.tempPlayerStatData[personNamedIndex];
        return newStatData;
      })
      var numberOfGamesStarted = 0;
      var numberOfGamesStartedVsTeam = 0;
      if (resultArray[0].team == this.getTeamName(element.team1)) {
        this.teamAgainst = this.getTeamName(element.team2)
      } else { this.teamAgainst = this.getTeamName(element.team1) }
      var d = new Date();
      var year = d.getFullYear().toString();
      var month = (d.getMonth() + 1).toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      var day = d.getDate().toString();
      if (day.length == 1) {
        day = "0" + day;
      }
      var fullDate = year + month + day;
      //add a check to get the prop variable to searc for, H, HR, TB etc
      var propCde = '';
      switch (element.event) {
        case "batter hits":
          propCde = "H";
          break;
        case "batter home runs":
          propCde = "HR"
          break;
        case "batter total bases":
          propCde = "TB";
          break;
      }
      for (let i = 0; i < resultArray.length; i++) {
        if (resultArray[i].started == "True") {

          var gameDate = resultArray[i].gameID.slice(0, 8);
          if (gameDate == fullDate) {
            continue;
          }
          numberOfGamesStarted++;
          this.playerAverageForSeason += parseInt(resultArray[i].Hitting[propCde]);
          if (element.name == "Over") {
            if (parseInt(resultArray[i].Hitting[propCde]) > element.point) {
              this.playerPercentForSeason++;
            }
          }
          else if (element.name == "Under") {
            if (parseInt(resultArray[i].Hitting[propCde]) < element.point) {
              this.playerPercentForSeason++;
            }
          }

          if (resultArray[i].gameID.includes(this.teamAgainst)) {
            numberOfGamesStartedVsTeam++;
            this.playerAverageVsTeam += parseInt(resultArray[i].Hitting[propCde]);
            if (element.name == "Over") {
              if (parseInt(resultArray[i].Hitting[propCde]) > element.point) {
                this.playerPercentVsTeam++;
              }
            }
            else if (element.name == "Under") {
              if (parseInt(resultArray[i].Hitting[propCde]) < element.point) {
                this.playerPercentVsTeam++;
              }
            }
          }

        }
      }
      if (numberOfGamesStarted == 0) {
        this.playerAverageForSeason = 0;
        this.playerPercentForSeason = 0;
      }
      else {
        this.playerAverageForSeason = (this.playerAverageForSeason / numberOfGamesStarted).toFixed(3);
        this.playerPercentForSeason = (this.playerPercentForSeason / numberOfGamesStarted).toFixed(3);
      }
      if (numberOfGamesStartedVsTeam == 0) {
        this.playerAverageVsTeam = 0;
        this.playerPercentVsTeam = 0;
      }
      else {
        this.playerAverageVsTeam = (this.playerAverageVsTeam / numberOfGamesStartedVsTeam).toFixed(3);
        this.playerPercentVsTeam = (this.playerPercentVsTeam / numberOfGamesStartedVsTeam).toFixed(3);
      }
    }
    if (this.selectedSport == "NHL") {
      var teamName = this.nhlPlayerStatData2023Final[0].teamName
      if (teamName.includes(".")) {
        teamName = teamName.replaceAll(".", "")
      }
      this.teamAgainst = teamName == element.team1 ? element.team2 : element.team1


      var d = new Date();
      var year = d.getFullYear().toString();
      var month = (d.getMonth() + 1).toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      var day = d.getDate().toString();
      if (day.length == 1) {
        day = "0" + day;
      }
      var fullDate = year + month + day;
      //add a check to get the prop variable to searc for, H, HR, TB etc
      var propCde = '';
      switch (element.event) {
        case "player assists":
          propCde = "assists";
          break;
        case "player points":
          propCde = "points"
          break;
        case "player shots on goal":
          propCde = "shots";
          break;
      }
      numberOfGamesStarted = this.nhlPlayerStatData2023Final.length;
      this.nhlPlayerStatData2023Final.forEach((e: any) => {
        this.playerAverageForSeason += e[propCde]
        if (element.description == "Over") {
          if (parseInt(e[propCde]) > element.point) {
            this.playerPercentForSeason++;
          }
        }
        else if (element.description == "Under") {
          if (parseInt(e[propCde]) < element.point) {
            this.playerPercentForSeason++;
          }
        }
        if (e.teamAgainst == this.teamAgainst) {
          numberOfGamesStartedVsTeam++;
          this.playerAverageVsTeam += e[propCde];
          if (element.name == "Over") {
            if (e[propCde] > element.point) {
              this.playerPercentVsTeam++;
            }
          }
          else if (element.name == "Under") {
            if (e[propCde] < element.point) {
              this.playerPercentVsTeam++;
            }
          }
        }
      })

      this.nhlPlayerStatData2022Final.forEach((e: any) => {
        this.average2022 += e[propCde]
        if (e.teamAgainst == this.teamAgainst) {
          numberOfGamesStartedVsTeam2022++;
          this.average2022vsTeam += e[propCde];
        }
      })

      if (numberOfGamesStarted == 0) {
        this.playerAverageForSeason = 0;
        this.playerPercentForSeason = 0;
      }
      else {
        this.playerAverageForSeason = (this.playerAverageForSeason / numberOfGamesStarted).toFixed(3);
        this.playerPercentForSeason = (this.playerPercentForSeason / numberOfGamesStarted).toFixed(3);
      }
      if (numberOfGamesStartedVsTeam == 0) {
        this.playerAverageVsTeam = -1;
        this.playerPercentVsTeam = -1;
      }
      else {
        this.playerAverageVsTeam = (this.playerAverageVsTeam / numberOfGamesStartedVsTeam).toFixed(3);
        this.playerPercentVsTeam = (this.playerPercentVsTeam / numberOfGamesStartedVsTeam).toFixed(3);
      }
      if (element.description == "Over") {
        this.differential = this.playerAverageForSeason / element.point
      }
      else if (element.description == "Under") {
        if (this.playerAverageForSeason == 0) {
          this.differential = 0;
        }
        else { this.differential = element.point / this.playerAverageForSeason }

      }
      this.gamesPlayedVsTeam = numberOfGamesStartedVsTeam
      if (this.average2022 > 0 && this.nhlPlayerStatData2022Final.length > 0) {
        this.average2022 = (this.average2022 / this.nhlPlayerStatData2022Final.length).toFixed(3)

      } else { this.average2022 = -1 }
      if (this.average2022vsTeam > 0 && this.nhlPlayerStatData2022Final.length > 0) {
        this.average2022vsTeam = (this.average2022vsTeam / numberOfGamesStartedVsTeam2022).toFixed(3)

      } else { this.average2022vsTeam = -1 }


    }
    if (this.selectedSport == "NBA") {
      let tempTeamName1 = element.team1
      let tempTeamName2 = element.team2
      if (tempTeamName1.includes(" ")) {
        tempTeamName1 = tempTeamName1.replaceAll(" ", "_")
      }
      if (tempTeamName2.includes(" ")) {
        tempTeamName2 = tempTeamName2.replaceAll(" ", "_")
      }
      //let teamId1 = this.arrayOfNBATeams[tempTeamName1]
      //let teamId2 = this.arrayOfNBATeams[tempTeamName2]
      //let playerId = await NbaController.nbaLoadPlayerInfoFromName(element.name)
      this.teamAgainst = reusedFunctions.arrayOfNBATeams[reusedFunctions.addUnderScoreToName(element.team1)] == this.nbaPlayerStatData2023Final[0].teamId ? element.team2 : element.team1


      var d = new Date();
      var year = d.getFullYear().toString();
      var month = (d.getMonth() + 1).toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      var day = d.getDate().toString();
      if (day.length == 1) {
        day = "0" + day;
      }
      var fullDate = year + month + day;
      //add a check to get the prop variable to searc for, H, HR, TB etc
      let propCde: any;
      switch (element.event) {
        case "player assists":
          propCde = "assists";
          break;
        case "player double double":
          propCde = "doubleDouble"
          break;
        case "player points":
          propCde = "points";
          break;
        case "player rebounds":
          propCde = "totReb";
          break;
        case "player threes":
          propCde = "tpm";
          break;
      }
      numberOfGamesStarted = this.nbaPlayerStatData2023Final.length;
      this.nbaPlayerStatData2023Final.forEach((e: any) => {
        this.playerAverageForSeason += e[propCde]
        if (element.description == "Over") {
          if (parseInt(e[propCde]) > element.point) {
            this.playerPercentForSeason++;
          }
        }
        else if (element.description == "Under") {
          if (parseInt(e[propCde]) < element.point) {
            this.playerPercentForSeason++;
          }
        }
        if (e.teamAgainst == this.teamAgainst) {
          numberOfGamesStartedVsTeam++;
          this.playerAverageVsTeam += e[propCde];
          if (element.name == "Over") {
            if (e[propCde] > element.point) {
              this.playerPercentVsTeam++;
            }
          }
          else if (element.name == "Under") {
            if (e[propCde] < element.point) {
              this.playerPercentVsTeam++;
            }
          }
        }
      })

      this.nbaPlayerStatData2022Final.forEach((e: any) => {
        this.average2022 += e[propCde]
        if (e.teamAgainst == this.teamAgainst) {
          numberOfGamesStartedVsTeam2022++;
          this.average2022vsTeam += e[propCde];
        }
      })

      if (numberOfGamesStarted == 0) {
        this.playerAverageForSeason = 0;
        this.playerPercentForSeason = 0;
      }
      else {
        this.playerAverageForSeason = (this.playerAverageForSeason / numberOfGamesStarted).toFixed(3);
        this.playerPercentForSeason = (this.playerPercentForSeason / numberOfGamesStarted).toFixed(3);
      }
      if (numberOfGamesStartedVsTeam == 0) {
        this.playerAverageVsTeam = -1;
        this.playerPercentVsTeam = -1;
      }
      else {
        this.playerAverageVsTeam = (this.playerAverageVsTeam / numberOfGamesStartedVsTeam).toFixed(3);
        this.playerPercentVsTeam = (this.playerPercentVsTeam / numberOfGamesStartedVsTeam).toFixed(3);
      }
      if (element.description == "Over") {
        this.differential = this.playerAverageForSeason / element.point
      }
      else if (element.description == "Under") {
        if (this.playerAverageForSeason == 0) {
          this.differential = 0;
        }
        else { this.differential = element.point / this.playerAverageForSeason }

      }
      this.playerId = this.nbaPlayerStatData2023Final[0].playerId
      this.gamesPlayed = this.nbaPlayerStatData2023Final.length
      this.gamesPlayedVsTeam = numberOfGamesStartedVsTeam
      if (this.average2022 > 0 && this.nbaPlayerStatData2022Final.length > 0) {
        this.average2022 = (this.average2022 / this.nbaPlayerStatData2022Final.length).toFixed(3)

      } else { this.average2022 = -1 }
      if (this.average2022vsTeam > 0 && this.nbaPlayerStatData2022Final.length > 0) {
        this.average2022vsTeam = (this.average2022vsTeam / numberOfGamesStartedVsTeam2022).toFixed(3)

      } else { this.average2022vsTeam = -1 }
    }
    this.updatePlayerPropArray(element);
  }

  updatePlayerPropArray(element: any) {
    element.avgTotal = this.playerAverageForSeason;
    element.percentTotal = this.playerPercentForSeason;
    element.percentTeam = this.playerPercentVsTeam;
    element.avgTeam = this.playerAverageVsTeam;
    element.teamAgainst = this.teamAgainst;
    element.averageDifferential = this.differential.toFixed(3);
    element.gamesPlayed = this.gamesPlayed;
    element.gamesPlayedVsTeam = this.gamesPlayedVsTeam;
    element.average2022 = this.average2022
    element.average2022vsTeam = this.average2022vsTeam
    element.id = this.playerId
  }

  playerNameSpanishConvert(list: DbMlbPlayerInfo[]): DbMlbPlayerInfo[] {
    var newList = list;
    for (let i = 0; i < newList.length; i++) {
      var name = newList[i].playerName;
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
      newList[i].playerName = name
    }
    return newList
  }

  async getMlbPlayerIds() {
    const url = 'https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBPlayerList';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'b66301c5cdmsh89a2ce517c0ca87p1fe140jsne708007ee552',
        'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
      }
    };
    const response = await fetch(url, options);
    const result = await response.json();
    let temp = result.body
    temp.forEach((e: { playerID: any; longName: any; team: any; teamID: any; }) => this.playerInfoTemp.push({
      playerId: e.playerID,
      playerName: e.longName,
      teamName: e.team,
      teamId: e.teamID
    }))
    this.playerInfoTemp = this.playerNameSpanishConvert(this.playerInfoTemp);

  }

  getMlbPlayerIdFromName(name: string): any {
    var player = this.mlbPlayerId.filter(x => x.Name == name);
    return player[0].Id;
  }
  getTeamName(team: string): string {
    team = this.insertUnderscore(team);
    return reusedFunctions.arrayOfMLBTeams[team];
  }
  insertUnderscore(team: string): string {
    team = team.replaceAll(' ', '_');
    if (team.includes(".")) {
      team = team.replaceAll('.', '');
    }
    return team;
  }

  getDate(): string {
    var d = new Date();
    var year = d.getFullYear().toString();
    var month = (d.getMonth() + 1).toString();
    if (month.length == 1) {
      month = "0" + month;
    }
    var day = d.getDate().toString();
    if (day.length == 1) {
      day = "0" + day;
    }
    var fullDate = day + "/" + month + "/" + year;
    return fullDate
  }
  getMonthAndDay(): string {
    var d = new Date();
    var year = d.getFullYear().toString();
    var month = (d.getMonth() + 1).toString();
    if (month.length == 1) {
      month = "0" + month;
    }
    var day = d.getDate().toString();
    if (day.length == 1) {
      day = "0" + day;
    }
    var fullDate = month + "/" + day;
    return fullDate
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

