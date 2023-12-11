import { Component, OnInit } from '@angular/core';
import { SportsTitleToName } from '../sports-titel-to-name';
import { SelectedSportsData } from '../selected-sports-data';
import { GameId } from '../game-id';
import { PropData } from '../prop-data';
import { PlayerProp } from '../player-prop';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MlbPlayerid } from '../mlb-playerid';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { PropArray } from '../prop-array';
import { GamePropArray } from '../game-prop-array';
import { DateArray } from '../date-array';
import { SportPropArray } from '../sport-prop-array';
import { remult } from 'remult';
import { PlayerInfoMlb } from 'src/shared/dbTasks/PlayerInfoMlb';
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
import { Chart } from 'chart.js/auto';
import { ArrayOfDates } from '../array-of-dates';


import { Route, Router } from '@angular/router';
import { DbNbaTeamLogos } from 'src/shared/dbTasks/DbNbaTeamLogos';

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
  providers: [nbaApiController, nhlApiController, draftKingsApiController],
})



export class PropScreenComponent implements OnInit {

  mlbPlayerrInfoRepo = remult.repo(PlayerInfoMlb)
  SportsBookRepo = remult.repo(DbGameBookData)
  playerPropRepo = remult.repo(DbPlayerPropData)
  nhlPlayerInfoRepo = remult.repo(DbNhlPlayerInfo)
  nhlPlayerGameStatRepo = remult.repo(DbNhlPlayerGameStats)
  nbaPlayerInfoRepo = remult.repo(NbaPlayerInfoDb)


  expandedElement: PlayerProp[] | null | undefined;


  public playerPropsClicked = false;
  public gamePropsClicked = true;
  arrayOfMLBTeams: SportsTitleToName = { Minnesota_Twins: "MIN", Detroit_Tigers: "DET", Cincinnati_Reds: "CIN", Chicago_Cubs: "CHC", Milwaukee_Brewers: "MIL", Philadelphia_Phillies: "PHI", Oakland_Athletics: "OAK", Los_Angeles_Angels: "LAA", Pittsburgh_Pirates: "PIT", Cleveland_Guardians: "CLE", Tampa_Bay_Rays: "TB", Boston_Red_Socks: "BOS", Seattle_Mariners: "SEA", Miami_Marlins: "MIA", Los_Angeles_Dodgers: "LAD", New_York_Yankees: "NYY", Washington_Nationals: "WAS", New_York_Mets: "NYM", San_Francisco_Giants: "SF", Kansas_City_Royals: "KC", Chicago_White_Sox: "CHW", Atlanta_Braves: "ATL", St_Louis_Cardinals: "STL", Arizona_Diamondbacks: "ARI", Baltimore_Orioles: "BAL", Colorado_Rockies: "COL", Houston_Astros: "HOU", San_Diego_Padres: "SD", Texas_Rangers: "TEX", Toronto_Blue_Jays: "TOR" };
  arrayOfNBATeams: SportsNameToId = { Atlanta_Hawks: 1, Boston_Celtics: 2, Brooklyn_Nets: 4, Charlotte_Hornets: 5, Chicago_Bulls: 6, Cleveland_Cavaliers: 7, Dallas_Mavericks: 8, Denver_Nuggets: 9, Detroit_Pistons: 10, Golden_State_Warriors: 11, Houston_Rockets: 14, Indiana_Pacers: 15, Los_Angeles_Clippers: 16, Los_Angeles_Lakers: 17, Memphis_Grizzlies: 19, Miami_Heat: 20, Milwaukee_Bucks: 21, Minnesota_Timberwolves: 22, New_Orleans_Pelicans: 23, New_York_Knicks: 24, Oklahoma_City_Thunder: 25, Orlando_Magic: 26, Philadelphia_76ers: 27, Phoenix_Suns: 28, Portland_Trail_Blazers: 29, Sacramento_Kings: 30, San_Antonio_Spurs: 31, Toronto_Raptors: 38, Utah_Jazz: 40, Washington_Wizards: 41 }
  arrayOfDates: ArrayOfDates = { 1: 31, 2: 29, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31 }
  home_team: string = '';
  away_team: string = '';

  public itemsInCheckout: number = 0;
  public checkoutArray: any[] = [];
  public playerPropButtonDisabled: boolean = false;

  public nbaCount: number = 0
  public sportsNew: any[] = [];
  public gameString: string = ''
  public selectedSport: string = '';
  public selectedDate: string = '';
  public selectedGame: string = '';
  public selectedGameid: string = '';
  public exit: boolean = true;



  date = new Date();

  //API strings
  pre_initial_prop = "https://api.the-odds-api.com/v4/sports/";
  post_initial_prop = "/odds/?apiKey=5ab6923d5aa0ae822b05168709bb910c&regions=us&markets=h2h,spreads,totals&bookmakers=draftkings&oddsFormat=american";

  pre_get_games = "https://api.the-odds-api.com/v4/sports/";
  post_get_games = "/scores?apiKey=5ab6923d5aa0ae822b05168709bb910c";

  displayedColumns: string[] = ['name', 'description', 'point', 'price', 'detailedStats'];

  



  constructor(
    private http: HttpClient,
    private nbaApiController: nbaApiController,
    private nhlApiController: nhlApiController,
    private draftKingsApiController: draftKingsApiController,
    private router: Router,
  ) {

  }
  public notes: any = [];







  sports: any[] = [];
  playerProps: any;

  

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

  public displayPropHtml1: PropData =
    {
      name: '',
      h2h: '',
      spreadPoint: '',
      spreadPrice: '',
      totalPoint: '',
      totalPrice: '',
      primaryColor: '',
      alternateColor: ''
    };
  public displayPropHtml2: PropData =
    {
      name: '',
      h2h: '',
      spreadPoint: '',
      spreadPrice: '',
      totalPoint: '',
      totalPrice: '',
      primaryColor: '',
      alternateColor: ''
    };


  listOfSupportedSports: string[] = ["NBA"];
  sportsToTitle: SportsTitleToName = {
    NBA: "basketball_nba",
    NFL: "americanfootball_nfl",
    MLB: "baseball_mlb",
    NHL: "icehockey_nhl"
  }
  postDateSelectedSportGames = {};
  selectedSportsDates: string[] = [];
  selectedSportGames: any;
  selectedSportsData: any;

  playerInfoTemp: PlayerInfoMlb[] = []
  playerInfoFinal: PlayerInfoMlb[] = []
  gamePropData: ISportsBook[] = []
  sportsBookData: DbGameBookData[] = []
  sportsBookDataFinal: DbGameBookData[] = []
  playerPropData: DbPlayerPropData[] = []
  playerPropDataFinal: DbPlayerPropData[] = []
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




  public trimSports(sports: any) {
    //need to figure out a way to order the sports but for now just show the main ones
    sports.forEach((sport: { title: string; }) => {
      this.listOfSupportedSports.forEach(s => {
        if (sport.title == s) {
          this.sportsNew.push(sport);
        }
      })
    });
    this.selectedSport = this.sportsNew[0].title;
  }

  setSelectedDate(date: string) {
    this.selectedDate = date;
  }
  setSelectedSport(sport: string) {
    this.selectedSport = sport;
  }
  setSelectedGame(game: string) {
    const temp = this.games.filter(x => x.game === game);
    this.selectedGame = temp[0].id;
  }




  async onSportClick(sport: any) {
    this.selectedDate = ''
    this.setSelectedSport(sport.tab.textLabel);
    //await this.checkSportPlayerInfoDb();
    if (this.selectedSport != "NBA") {
      await this.checkPlayerInfoDb();

    }
    await this.checkSportsBookDb();

    this.updateDates();




  }
  onDateClick(date: any) {
    this.setSelectedDate(date.tab.textLabel);
    this.updateGames();
  }
  async onGameClick(game: any) {
    this.gameString = game.tab.textLabel
    this.setSelectedGame(game.tab.textLabel);
    if (this.selectedSport == "NBA") {
      await this.checkPlayerInfoDb();
    }
    this.playerPropsClicked = false;
    this.displayProp();
  }

  async checkSportBookDb() {
    if (this.selectedSport === "MLB") {
      var dbEmpty
      //try{
      //change below find methods to call the controller instead
      //dbEmpty = await MlbController.getMlbBookLength()
      /* if (dbEmpty.length == 0 || dbEmpty[0].createdAt?.getDate() != this.date.getDate()){
        await this.getMlbPlayerIds();
         
        await MlbController.updatePlayerINfo(this.playerInfoTemp);
        
      
        await MlbController.loadPlayers().then(item => this.playerInfoFinal = item)
       }
       else{
        await MlbController.loadPlayers().then(item => this.playerInfoFinal = item)
       }
    }catch (error: any){
      alert(error.message)
    } */
    }
  }

  async checkSportPlayerInfoDb() {
    if (this.selectedSport === "MLB") {
      var dbEmpty
      try {
        dbEmpty = await this.mlbPlayerrInfoRepo.find({ where: { playerId: { "!=": 0 } } })
        if (dbEmpty.length == 0 || dbEmpty[0].createdAt?.getDate() != this.date.getDate()) {
          await this.getMlbPlayerIds();

          await MlbController.updatePlayerINfo(this.playerInfoTemp);


          await MlbController.loadPlayers().then(item => this.playerInfoFinal = item)
        }
        else {
          await MlbController.loadPlayers().then(item => this.playerInfoFinal = item)
        }
      } catch (error: any) {
        alert(error.message)
      }
    }
    /* if (this.selectedSport === "NHL") {
      var dbEmpty
      try{
        dbEmpty = await this.mlbPlayerrInfoRepo.find({where: { playerId:{ "!=":0} }})
        if (dbEmpty.length == 0 || dbEmpty[0].createdAt?.getDate() != this.date.getDate()){
          await this.getMlbPlayerIds();
           
          await MlbController.updatePlayerINfo(this.playerInfoTemp);
          
        
          await MlbController.loadPlayers().then(item => this.playerInfoFinal = item)
         }
         else{
          await MlbController.loadPlayers().then(item => this.playerInfoFinal = item)
         }
      }catch (error: any){
        alert(error.message)
      }
    } */
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
  convertDate(fullDate: string) {
    var tempDate = fullDate?.split("T");
    var time = tempDate[1].slice(0, 2)
    var subtractDay = false
    if(parseInt(time) - 6 <= 0){
      subtractDay = true
    }

    var indexOfFirstDash = tempDate[0].indexOf("-");
    var tempDate2 = tempDate[0].slice(indexOfFirstDash + 1, tempDate[0].length + 1);
    var finalDate = tempDate2.replace("-", "/");
    if(subtractDay){
      var newDate = finalDate.split("/")
      newDate[1] = (parseInt(newDate[1]) - 1).toString()
      if(parseInt(newDate[1]) < 10 && parseInt(newDate[1]) > 0){
        newDate[1] = '0' + newDate[1] 
      }
      if(parseInt(newDate[1]) == 0){
        if(parseInt(newDate[0]) == 1){
          newDate[0] == '12'
          newDate[1] == '31'
        }
        if(parseInt(newDate[0]) != 1){
          newDate[0] = (parseInt(newDate[0]) - 1).toString()
          newDate[1] = this.arrayOfDates[parseInt(newDate[0])].toString()
        }

      }
      finalDate = newDate[0] + "/" + newDate[1]

    }
    
    return finalDate;
  }


  updateDates() {
    this.dates = [];
    this.sportsBookDataFinal.forEach((x) => {
      if (!this.dates.includes(this.convertDate(x.commenceTime))) {
        this.dates.push(this.convertDate(x.commenceTime));
      }
    });
    this.setSelectedDate(this.dates[0])
    this.updateGames();
  }
  updateGames() {
    this.games = [];
    this.sportsBookDataFinal.forEach((x) => {
      if (this.selectedDate == this.convertDate(x.commenceTime)) {
        let check = this.games.filter((e) => e.id == x.bookId)
        if (check.length == 0) {
          this.games.push({ game: `${x.homeTeam} vs ${x.awayTeam}`, id: x.bookId });
        }

      }
    });
  }

  async displayProp() {
    console.time("Display Prop")
    const tempProp = this.sportsBookDataFinal.filter((x) => x.bookId == this.selectedGame);
    var name1 = '';
    var h2h = '';
    var spreadPoint = '';
    var spreadPrice = '';
    var totalPoint = '';
    var totalPrice = ''
    var teamInfo = []
    var logo = ''

    var team1 = tempProp.filter((e) => e.teamName == e.homeTeam)
    var team2 = tempProp.filter((e) => e.teamName == e.awayTeam)

    

    name1 = team1[0].teamName;
    h2h = team1.filter((e) => e.marketKey == "h2h")[0].price.toString();
    spreadPoint = team1.filter((e) => e.marketKey == "spreads")[0].point.toString();
    spreadPrice = team1.filter((e) => e.marketKey == "spreads")[0].price.toString();
    totalPoint = tempProp.filter((e) => e.marketKey == "totals" && e.teamName == "Over")[0].point.toString();
    totalPrice = tempProp.filter((e) => e.marketKey == "totals" && e.teamName == "Over")[0].price.toString();
    teamInfo = await NbaController.nbaGetLogoFromTeamName(team1[0].teamName)
    this.displayPropHtml1 = ({ name: name1, h2h: h2h, spreadPoint: spreadPoint, spreadPrice: spreadPrice, totalPoint: totalPoint, totalPrice: totalPrice, primaryColor: teamInfo[0].primaryColor, alternateColor: teamInfo[0].alternateColor });

    name1 = team2[0].teamName;
    h2h = team2.filter((e) => e.marketKey == "h2h")[0].price.toString();
    spreadPoint = team2.filter((e) => e.marketKey == "spreads")[0].point.toString();
    spreadPrice = team2.filter((e) => e.marketKey == "spreads")[0].price.toString();
    totalPoint = tempProp.filter((e) => e.marketKey == "totals" && e.teamName == "Under")[0].point.toString();
    totalPrice = tempProp.filter((e) => e.marketKey == "totals" && e.teamName == "Under")[0].price.toString();
    teamInfo = await NbaController.nbaGetLogoFromTeamName(team2[0].teamName)
    
    this.displayPropHtml2 = ({ name: name1, h2h: h2h, spreadPoint: spreadPoint, spreadPrice: spreadPrice, totalPoint: totalPoint, totalPrice: totalPrice, primaryColor: teamInfo[0].primaryColor, alternateColor: teamInfo[0].alternateColor });
    console.timeEnd("Display Prop")
  }


  async checkSportsBookDb() {
    var dbEmpty
    try {
      console.time("Check sports book db")
      dbEmpty = await this.SportsBookRepo.find({ where: { sportTitle: this.selectedSport } })
      if (dbEmpty.length == 0 || dbEmpty[0].createdAt?.getDate() != this.date.getDate()) {
        var results = await this.draftKingsApiController.getDatesAndGames(this.selectedSport);
        await SportsBookController.addBookData(results);
        await SportsBookController.loadSportBook(this.selectedSport).then(item => this.sportsBookDataFinal = item)
      }
      else {
        await SportsBookController.loadSportBook(this.selectedSport).then(item => this.sportsBookDataFinal = item)
      }
      console.timeEnd("Check sports book db")
    } catch (error: any) {
      alert(error.message)
    }


  }

  async checkPlayerInfoDb() {
    console.time("Check player info db")
    var dbEmpty = []
    if (this.selectedSport == "NHL") {
      try {
        dbEmpty = await this.nhlPlayerInfoRepo.find({ where: { playerId: { "!=": 0 } } })
        if (dbEmpty.length == 0 || dbEmpty[0].createdAt?.getDate() != this.date.getDate()) {
          var results = await this.nhlApiController.getplayerInfo();
          await NhlPlayerInfoController.nhlAddPlayerINfoData(results);
        }
      } catch (error: any) {
        alert(error.message)
      }
    }

    if (this.selectedSport == "NBA") {
      try {
        
        var gameArray = this.splitGameString(this.gameString)
        let teamId = this.arrayOfNBATeams[this.addUnderScoreToName(gameArray[0])]
        let dbEmpty = await NbaController.nbaLoadPlayerInfoFromTeamId(teamId)
        if (dbEmpty.length == 0) {
          var returnCall = await this.nbaApiController.getNbaPlayerDataFromApi(this.gameString);
          await NbaController.nbaAddPlayerInfoData(returnCall);
        }
        else if (dbEmpty.length > 0) {
          if (this.convertDate(dbEmpty[0].createdAt?.toString()!) != this.getMonthAndDay()) {
            var returnCall = await this.nbaApiController.getNbaPlayerDataFromApi(this.gameString);
            await NbaController.nbaAddPlayerInfoData(returnCall);
          }
        }
        
      } catch (error: any) {
        alert(error.message)
      }
      dbEmpty = []
      console.timeEnd("Check player info db")

    }
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
  addUnderScoreToName(game: string): string {
    game = game.replaceAll(" ", "_")
    return game;
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



  //add checkplayerstat db for prevous and current season, if there is 0 data in 2022 then try the api call, if no data from api call for 2022 season then load one row for 2022 that has all defaults
  // then check 2023 season, if there is 0 data for the 2023 season or the insert date is not the current date then try the









  //API calls



  async loadPlayerProps() {
    if (this.playerPropsClicked == true) {
      this.playerPropsClicked = false;
      return;
    }
    this.playerPropsClicked = true;

    try {
      console.time("load player props")
      
        var results = await this.draftKingsApiController.getPlayerProps(this.selectedSport, this.selectedGame);
        if(results.length == 0){
          alert("Player Props have not been added by Draft Kings yet")
        }
        else{
          await PlayerPropController.addPlayerPropData(results);
          await PlayerPropController.loadPlayerPropData(this.selectedSport, this.selectedGame).then(item => this.playerPropDataFinal = item)
          this.addplayerPropToArray();
        }
        
     
      console.timeEnd("load player props")
    } catch (error: any) {
      alert(error.message)
    }



  }








  //add this back when game props get fleshed out more
  /* async loadGameProps() {
    if (this.gamePropsClicked == true) {
      this.gamePropsClicked = false;
      return;
    }
    this.gamePropsClicked = true;
    var urlNew = '';
    if (this.selectedSport === "MLB") {
      //replace batterhomeruns with stringcontaining all mlb player props
      urlNew = this.pre_initial_player_prop + this.convertSport(this.selectedSport) + this.middle_initial_player_prop + this.selectedGame + this.middle_next_player_prop + "batter_home_runs,batter_hits,batter_total_bases" + this.post_initial_player_prop;
    }

    const promise = await fetch(urlNew);
    const processedResponse = await promise.json();
    this.playerProps = processedResponse;
    console.log(this.playerProps)
    this.addplayerPropToArray();
  } */

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
  public displayProgressBar = true;
  async getPlayerStatsForSeasonCall(element: any) {

    try {
      if (this.selectedSport == "NHL") {
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
      }
      if (this.selectedSport == "NBA") {
        console.time("get player stats for season call")
        var previousName = ''
        for (let i = 0; i < element.length; i++) {
          let playerName = element[i].name
          if(playerName == previousName){
            await this.computeStatForPlayer(element[i])
            continue
          }
          let player = await NbaController.nbaLoadPlayerInfoFromName(element[i].name)
          if(player.length == 0){
            alert(element[i].name)
          }
          let db2022 = await NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(player[0].playerId, 2022)
          let db2023 = await NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(player[0].playerId, 2023)
          if (db2022.length == 0) {
            let results = await this.nbaApiController.loadNba2022PlayerStatData(player[0].playerId)
            if (results.length == 0) {
              await NbaController.nbaAddPlayerStat2022BlankData(player[0].playerId, player[0].playerName);
            }
            else {
              await NbaController.nbaAddPlayerGameStats2022(results);
            }
            await NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(player[0].playerId, 2022).then(item => this.nbaPlayerStatData2022Final = item)
          }
          else {
            await NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(player[0].playerId, 2022).then(item => this.nbaPlayerStatData2022Final = item)
          }
          
          if (db2023.length == 0) {
            let results = await this.nbaApiController.loadNba2023PlayerStatData(player[0].playerId)
            await NbaController.nbaAddPlayerGameStats2023(results);

            await NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(player[0].playerId, 2023).then(item => this.nbaPlayerStatData2023Final = item)

          }
          else if (db2023.length != 0) {
            if (this.convertDate(db2023[db2023.length - 1].createdAt?.toString()!) != this.getMonthAndDay()) {
              let results = await this.nbaApiController.loadNba2023PlayerStatData(player[0].playerId)
              await NbaController.nbaAddPlayerGameStats2023(results);

              await NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(player[0].playerId, 2023).then(item => this.nbaPlayerStatData2023Final = item)
            }
            else {
              await NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(player[0].playerId, 2023).then(item => this.nbaPlayerStatData2023Final = item)
              //here
            }
          }

          await this.computeStatForPlayer(element[i]);
          previousName = element[i].name
        }
        console.timeEnd("get player stats for season call")
      }
      this.displayProgressBar = false
    } catch (error: any) {
    }
  }



  async computeStatsForAllPlayersInProp(element: any) {
    console.time("compute stats for all players in prop")
      if (element[0].percentTeam == "") {
      await this.getPlayerStatsForSeasonCall(element)
    } 
    console.timeEnd("compute stats for all players in prop")



  }
  async computeStatForPlayer(element: any) {
    console.time("compute stat for player")
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
      this.teamAgainst = this.arrayOfNBATeams[this.addUnderScoreToName(element.team1)] == this.nbaPlayerStatData2023Final[0].teamId ? element.team2 : element.team1


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
    console.timeEnd("compute stat for player")
    this.updatePlayerPropArray(element);
  }

  updatePlayerPropArray(element: any) {
    console.time("update player prop array")
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
    console.timeEnd("update player prop array")
  }

  playerNameSpanishConvert(list: PlayerInfoMlb[]): PlayerInfoMlb[] {
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
    return this.arrayOfMLBTeams[team];
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




  async ngOnInit() {
    this.trimSports(await this.draftKingsApiController.getSports());
  }

  detailedStatsClicked(element: any) {
    this.router.navigate(["/playerStats/" + this.selectedSport + "/" + element.id])
  }

}

