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
import { apiController } from '../ApiCalls/apiCalls';
import { NbaPlayerInfoDb } from 'src/shared/dbTasks/NbaPlayerInfoDb';
import { NbaController } from 'src/shared/Controllers/NbaController';
import { SportsNameToId } from '../sports-name-to-id';
import { DbNbaGameStats } from 'src/shared/dbTasks/DbNbaGameStats';

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
  providers: [apiController],
})



export class PropScreenComponent implements OnInit {

  mlbPlayerrInfoRepo = remult.repo(PlayerInfoMlb)
  SportsBookRepo = remult.repo(DbGameBookData)
  playerPropRepo = remult.repo(DbPlayerPropData)
  nhlPlayerInfoRepo = remult.repo(DbNhlPlayerInfo)
  nhlPlayerGameStatRepo = remult.repo(DbNhlPlayerGameStats)
  nbaPlayerInfoRepo = remult.repo(NbaPlayerInfoDb)


  expandedElement: PlayerProp[] | null | undefined;

  public selectedIndexSport: number = 0;
  public selectedIndexDate: number = 0;
  public selectedIndexGame: number = 0;
  public playerPropsClicked = false;
  public gamePropsClicked = false;
  arrayOfMLBTeams: SportsTitleToName = { Minnesota_Twins: "MIN", Detroit_Tigers: "DET", Cincinnati_Reds: "CIN", Chicago_Cubs: "CHC", Milwaukee_Brewers: "MIL", Philadelphia_Phillies: "PHI", Oakland_Athletics: "OAK", Los_Angeles_Angels: "LAA", Pittsburgh_Pirates: "PIT", Cleveland_Guardians: "CLE", Tampa_Bay_Rays: "TB", Boston_Red_Socks: "BOS", Seattle_Mariners: "SEA", Miami_Marlins: "MIA", Los_Angeles_Dodgers: "LAD", New_York_Yankees: "NYY", Washington_Nationals: "WAS", New_York_Mets: "NYM", San_Francisco_Giants: "SF", Kansas_City_Royals: "KC", Chicago_White_Sox: "CHW", Atlanta_Braves: "ATL", St_Louis_Cardinals: "STL", Arizona_Diamondbacks: "ARI", Baltimore_Orioles: "BAL", Colorado_Rockies: "COL", Houston_Astros: "HOU", San_Diego_Padres: "SD", Texas_Rangers: "TEX", Toronto_Blue_Jays: "TOR" };
  arrayOfNBATeams: SportsNameToId = { Atlanta_Hawks: 1, Boston_Celtics: 2, Brooklyn_Nets: 4, Charlotte_Hornets: 5, Chicago_Bulls: 6, Cleveland_Cavaliers: 7, Dallas_Mavericks: 8, Denver_Nugget: 9, Detroit_Pistons: 10, Golden_State_Warriors: 11, Houston_Rockets: 14, Indiana_Pacers: 15, LA_Clippers: 16, Los_Angeles_Lakers: 17, Memphis_Grizzlies: 19, Miami_Heat: 20, Milwaukee_Bucks: 21, Minnesota_Timberwolves: 22, New_Orleans_Pelicans: 23, New_York_Knicks: 24, Oklahoma_City_Thunder: 25, Orlando_Magic: 26, Philadelphia_76ers: 27, Phoenix_Suns: 28, Portland_Trail_Blazers: 29, Sacramento_Kings: 30, San_Antonio_Spurs: 31, Toronto_Raptors: 38, Utah_Jazz: 40, Washington_Wizards: 41 }
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

  pre_initial_player_prop = "https://api.the-odds-api.com/v4/sports/";
  middle_initial_player_prop = "/events/";
  middle_next_player_prop = "/odds/?apiKey=5ab6923d5aa0ae822b05168709bb910c&regions=us&markets=";
  post_initial_player_prop = "&bookmakers=draftkings&oddsFormat=american";

  date = new Date();

  //API strings
  pre_initial_prop = "https://api.the-odds-api.com/v4/sports/";
  post_initial_prop = "/odds/?apiKey=5ab6923d5aa0ae822b05168709bb910c&regions=us&markets=h2h,spreads,totals&bookmakers=draftkings&oddsFormat=american";

  pre_get_games = "https://api.the-odds-api.com/v4/sports/";
  post_get_games = "/scores?apiKey=5ab6923d5aa0ae822b05168709bb910c";

  getSportsApi: string = "https://api.the-odds-api.com/v4/sports/?apiKey=5ab6923d5aa0ae822b05168709bb910c";

  displayedColumns: string[] = ['name', 'description', 'point', 'price', 'detailedStats'];

  readonly APIUrl = "http://localhost:5086/api/MlbPlayerInfo/";



  constructor(
    private http: HttpClient,
    private apiController: apiController) {

  }
  public notes: any = [];







  sports: any[] = [];
  playerProps: any;

  sportPropArray: SportPropArray[] = [{
    sportName: '',
    dateArray: []
  }]

  datePrropArray: DateArray[] = [{
    date: '',
    gameProp: []
  }]

  gamePropArray: GamePropArray[] = [{
    gameId: '',
    gameProps: []
  }]

  propsArray: PropArray[] = [{
    propName: '',
    playerProps: []
  }]

  playerPropsArray: PlayerProp[] = [{
    name: '',
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
      totalPrice: ''
    };
  public displayPropHtml2: PropData =
    {
      name: '',
      h2h: '',
      spreadPoint: '',
      spreadPrice: '',
      totalPoint: '',
      totalPrice: ''
    };


  listOfSupportedSports: string[] = ["NBA", "NFL", "MLB", "NHL"];
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
    this.selectedIndexDate = 0
    this.selectedIndexGame = 0
    this.selectedDate = ''
    this.setSelectedSport(sport.tab.textLabel);
    await this.checkSportPlayerInfoDb();
    if (this.selectedSport != "NBA") {
      await this.checkPlayerInfoDb();

    }
    await this.checkSportsBookDb();




    //await this.getDatesAndGames();
    //await this.checkSportBookDb();
  }
  onDateClick(date: any) {
    console.log(date)
    this.selectedIndexGame = 0

    this.setSelectedDate(date.tab.textLabel);
    this.updateGames();
  }
  async onGameClick(game: any) {
    console.log(game)
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
    console.log(event)
  }
  addItemToCheckout(event: any) {
    console.log(event)
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
    console.log(event)
    var bestBets: any = this.addBestBets(event);
    bestBets.forEach((element: any) => {
      this.checkoutArray.push(element);
    });
    console.log()
  }

  addBestBets(event: any): any[] {
    var bets: any[] = [];
    for (var i = 0; i < event.length; i++) {
      if ((parseInt(event[i].percentTeam) >= .900) || (parseInt(event[i].percentTotal) >= .900)) {
        bets.push(event[i]);
      }
    }
    console.log(bets)
    return bets;
  }


  testFunc(event: any) {
    console.log(event)
  }

  convertSport(sport: any) {
    return this.sportsToTitle[sport];
  }
  convertDate(fullDate: string) {
    var tempDate = fullDate?.split("T");
    var indexOfFirstDash = tempDate[0].indexOf("-");
    var tempDate2 = tempDate[0].slice(indexOfFirstDash + 1, tempDate[0].length + 1);
    var finalDate = tempDate2.replace("-", "/");
    return finalDate;
  }


  updateDates() {
    this.dates = [];
    this.games = [];
    this.sportsBookDataFinal.forEach((x) => {
      if (!this.dates.includes(this.convertDate(x.commenceTime))) {
        this.dates.push(this.convertDate(x.commenceTime));
      }
    });
    console.log(this.dates[0])
    this.setSelectedDate(this.dates[0])

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

  displayProp() {


    const tempProp = this.sportsBookDataFinal.filter((x) => x.bookId == this.selectedGame);

    var name1 = '';
    var h2h = '';
    var spreadPoint = '';
    var spreadPrice = '';
    var totalPoint = '';
    var totalPrice = ''

    var team1 = tempProp.filter((e) => e.teamName == e.homeTeam)
    var team2 = tempProp.filter((e) => e.teamName == e.awayTeam)

    name1 = team1[0].teamName;
    h2h = team1.filter((e) => e.marketKey == "h2h")[0].price.toString();
    spreadPoint = team1.filter((e) => e.marketKey == "spreads")[0].point.toString();
    spreadPrice = team1.filter((e) => e.marketKey == "spreads")[0].price.toString();
    totalPoint = tempProp.filter((e) => e.marketKey == "totals" && e.teamName == "Over")[0].point.toString();
    totalPrice = tempProp.filter((e) => e.marketKey == "totals" && e.teamName == "Over")[0].price.toString();
    this.displayPropHtml1 = ({ name: name1, h2h: h2h, spreadPoint: spreadPoint, spreadPrice: spreadPrice, totalPoint: totalPoint, totalPrice: totalPrice });
    name1 = team2[0].teamName;
    h2h = team2.filter((e) => e.marketKey == "h2h")[0].price.toString();
    spreadPoint = team2.filter((e) => e.marketKey == "spreads")[0].point.toString();
    spreadPrice = team2.filter((e) => e.marketKey == "spreads")[0].price.toString();
    totalPoint = tempProp.filter((e) => e.marketKey == "totals" && e.teamName == "Under")[0].point.toString();
    totalPrice = tempProp.filter((e) => e.marketKey == "totals" && e.teamName == "Under")[0].price.toString();
    this.displayPropHtml2 = ({ name: name1, h2h: h2h, spreadPoint: spreadPoint, spreadPrice: spreadPrice, totalPoint: totalPoint, totalPrice: totalPrice });
    //console.log(this.displayPropHtml)
  }


  async checkSportsBookDb() {
    var dbEmpty
    console.log("Here in sports book db")
    try {
      dbEmpty = await this.SportsBookRepo.find({ where: { sportTitle: this.selectedSport } })
      if (dbEmpty.length == 0 || dbEmpty[0].createdAt?.getDate() != this.date.getDate()) {
        var results = await this.getDatesAndGames();

        await SportsBookController.addBookData(results);


        await SportsBookController.loadSportBook(this.selectedSport).then(item => this.sportsBookDataFinal = item)
        console.log(this.sportsBookDataFinal)
        this.updateDates();
      }
      else {
        await SportsBookController.loadSportBook(this.selectedSport).then(item => this.sportsBookDataFinal = item)
        this.updateDates();
        console.log(this.sportsBookDataFinal)
        console.log(this.sportsBookData)
      }
    } catch (error: any) {
      alert(error.message)
    }


  }

  async checkPlayerInfoDb() {
    var dbEmpty
    if (this.selectedSport == "NHL") {


      try {
        dbEmpty = await this.nhlPlayerInfoRepo.find({ where: { playerId: { "!=": 0 } } })
        if (dbEmpty.length == 0 || dbEmpty[0].createdAt?.getDate() != this.date.getDate()) {
          var results = await this.getplayerInfo();
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
        dbEmpty = await NbaController.nbaLoadPlayerInfoFromTeamId(teamId)
        console.log(dbEmpty[0].createdAt?.getDay)
        console.log(this.date.getDate())
        if (dbEmpty.length == 0 || dbEmpty[0].createdAt?.getDate != this.date.getDate) {
          var returnCall = await this.apiController.getNbaPlayerDataFromApi(this.gameString);

          await NbaController.nbaAddPlayerInfoData(returnCall);

        }
      } catch (error: any) {
        alert(error.message)
      }


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

  async getplayerInfo() {
    var url = ""
    if (this.selectedSport == "NHL") {
      url = "https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster";
    }
    const promise = await fetch(url);
    const processedResponse = await promise.json();
    this.playerInfo = processedResponse;
    this.nhlPlayerInfo = this.convertInfoDataToInterface();
    return this.nhlPlayerInfo;
  }
  convertInfoDataToInterface() {
    var temp: DbNhlPlayerInfo[] = []

    for (let i = 0; i < this.playerInfo.teams.length; i++) {
      for (let j = 0; j < this.playerInfo.teams[i].roster.roster.length; j++) {
        temp.push({
          playerId: this.playerInfo.teams[i].roster.roster[j].person.id,
          playerName: this.playerInfo.teams[i].roster.roster[j].person.fullName,
          teamName: this.playerInfo.teams[i].abbreviation,
          teamId: this.playerInfo.teams[i].id
        })
      }
    }

    return temp;
  }

  //add checkplayerstat db for prevous and current season, if there is 0 data in 2022 then try the api call, if no data from api call for 2022 season then load one row for 2022 that has all defaults
  // then check 2023 season, if there is 0 data for the 2023 season or the insert date is not the current date then try the
  async loadNhl2022PlayerStatData(id: number) {
    const url = `https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=gameLog&season=20222023`
    const promise = await fetch(url);
    const processedResponse = await promise.json();
    this.playerStatData = processedResponse;
    await this.convertNhlStatDataToInterface(id).then(items => this.nhlPlayerStatData = items);
    return this.nhlPlayerStatData;
  }
  async loadNhl2023PlayerStatData(id: number) {
    const url = `https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=gameLog&season=20232024`
    const promise = await fetch(url);
    const processedResponse = await promise.json();
    this.playerStatData = processedResponse;
    this.nhlPlayerStatData = await this.convertNhlStatDataToInterface(id)
    return this.nhlPlayerStatData;
  }

  async convertNhlStatDataToInterface(id: number) {
    var temp: DbNhlPlayerGameStats[] = []
    var player = await NhlPlayerInfoController.nhlLoadPlayerInfoFromId(id)
    for (let i = 0; i < this.playerStatData.stats[0].splits.length; i++) {
      temp.push({
        playerId: id,
        playerName: player[0].playerName,
        teamName: this.playerStatData.stats[0].splits[i].team.name,
        teamId: this.playerStatData.stats[0].splits[i].team.id,
        gameDate: this.playerStatData.stats[0].splits[i].date,
        playerStarted: this.playerStatData.stats[0].splits[i].stat.shifts > 0 ? "Y" : "N",
        assists: this.playerStatData.stats[0].splits[i].stat.assists,
        goals: this.playerStatData.stats[0].splits[i].stat.goals,
        pim: this.playerStatData.stats[0].splits[i].stat.pim,
        shots: this.playerStatData.stats[0].splits[i].stat.shots,
        shotPct: this.playerStatData.stats[0].splits[i].stat.shotPct,
        games: this.playerStatData.stats[0].splits[i].stat.games,
        hits: this.playerStatData.stats[0].splits[i].stat.hits,
        powerPlayGoals: this.playerStatData.stats[0].splits[i].stat.powerPlayGoals,
        powerPlayPoints: this.playerStatData.stats[0].splits[i].stat.powerPlayPoints,
        plusMinus: this.playerStatData.stats[0].splits[i].stat.plusMinus,
        points: this.playerStatData.stats[0].splits[i].stat.points,
        gameId: this.playerStatData.stats[0].splits[i].game.gamePk,
        teamAgainst: this.playerStatData.stats[0].splits[i].opponent.name,
        teamAgainstId: this.playerStatData.stats[0].splits[i].opponent.id,
        season: this.playerStatData.stats[0].splits[i].season,
        winLossTie: this.playerStatData.stats[0].splits[i].isWin == true ? "Win" : (this.playerStatData.stats[0].splits[i].isOT == false ? "Loss" : "Tie")

      })

    }
    return temp
  }

  async loadNba2022PlayerStatData(id: number) {
    const url = `https://api-nba-v1.p.rapidapi.com/players/statistics?id=${id}&season=2022`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'b66301c5cdmsh89a2ce517c0ca87p1fe140jsne708007ee552',
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
      }
    };
    const promise = await fetch(url, options);
    const processedResponse = await promise.json();
    this.playerStatData = processedResponse.response;
    await this.convertNbaStatDataToInterface(id).then(items => this.nbaPlayerStatData = items);
    return this.nbaPlayerStatData;
  }
  async loadNba2023PlayerStatData(id: number) {
    const url = `https://api-nba-v1.p.rapidapi.com/players/statistics?id=${id}&season=2023`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'b66301c5cdmsh89a2ce517c0ca87p1fe140jsne708007ee552',
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
      }
    };
    const promise = await fetch(url, options);
    const processedResponse = await promise.json();
    this.playerStatData = processedResponse.response;
    this.nbaPlayerStatData = await this.convertNbaStatDataToInterface(id)
    return this.nbaPlayerStatData;
  }

  async convertNbaStatDataToInterface(id: number) {
    var temp: DbNbaGameStats[] = []
    var player = await NbaController.nbaLoadPlayerInfoFromId(id)
    for (let i = 0; i < this.playerStatData.length; i++) {
      temp.push({
        playerId: this.playerStatData[i].player.id,
        playerName: this.playerStatData[i].player.firstname + " " + this.playerStatData[i].player.lastname,
        teamName: this.playerStatData[i].team.name,
        teamId: this.playerStatData[i].team.id,
        season: 2022,
        gameId: this.playerStatData[i].game.id,
        playerStarted: this.playerStatData[i].min != "00:00" ? "Y" : "N",
        assists: this.playerStatData[i].assists,
        points: this.playerStatData[i].points,
        fgm: this.playerStatData[i].fgm,
        fga: this.playerStatData[i].fga,
        fgp: this.playerStatData[i].fgp,
        ftm: this.playerStatData[i].ftm,
        fta: this.playerStatData[i].fta,
        ftp: this.playerStatData[i].ftp,
        tpm: this.playerStatData[i].tpm,
        tpa: this.playerStatData[i].tpa,
        tpp: this.playerStatData[i].tpp,
        offReb: this.playerStatData[i].offReb,
        defReb: this.playerStatData[i].defReb,
        totReb: this.playerStatData[i].totReb,
        pFouls: this.playerStatData[i].pFouls,
        steals: this.playerStatData[i].steals,
        turnover: this.playerStatData[i].turnover,
        blocks: this.playerStatData[i].blocks,
        doubleDouble: this.isDoubleDouble(this.playerStatData[i]) ? 1 : 0,
        tripleDouble: this.isTripleDouble(this.playerStatData[i]) ? 1 : 0
      })

    }
    return temp
  }


  isDoubleDouble(statData: any): boolean {
    let count = 0;
    if (statData.assists >= 10) {
      count++
    }
    if (statData.points >= 10) {
      count++
    }
    if (statData.blocks >= 10) {
      count++
    }
    if (statData.steals >= 10) {
      count++
    }
    if (statData.rebounds >= 10) {
      count++
    }
    if (count >= 2) {
      return true
    } else { return false }
  }

  isTripleDouble(statData: any): boolean {
    let count = 0;
    if (statData.assists >= 10) {
      count++
    }
    if (statData.points >= 10) {
      count++
    }
    if (statData.blocks >= 10) {
      count++
    }
    if (statData.steals >= 10) {
      count++
    }
    if (statData.rebounds >= 10) {
      count++
    }
    if (count >= 3) {
      return true
    } else { return false }
  }




  //API calls

  public async getSports() {
    const promise = await fetch(this.getSportsApi);
    const processedResponse = await promise.json();
    this.selectedSportGames = processedResponse;
    console.log(processedResponse)
    return processedResponse;
  }
  //: Promise<DbNHLGameBookData[]>
  public async getDatesAndGames() {
    //this.checkSportsBookDb();
    const sportNew = this.convertSport(this.selectedSport);
    //const apiCall = this.pre_get_games + sportNew + this.post_get_games;
    const apiCall = this.pre_initial_prop + sportNew + this.post_initial_prop;
    const promise = await fetch(apiCall);
    const processedResponse = await promise.json();
    this.selectedSportsData = processedResponse;
    this.sportsBookData = this.convertSportsDataToInterface()
    //console.log("below is data")
    console.log(this.selectedSportsData)
    //this.updateDatesAndGames();
    return this.sportsBookData;
  }

  convertSportsDataToInterface(): DbGameBookData[] {
    var tempData: DbGameBookData[] = [];
    for (let i = 0; i < this.selectedSportsData.length; i++) {
      for (let j = 0; j < this.selectedSportsData[i].bookmakers.length; j++) {
        for (let k = 0; k < this.selectedSportsData[i].bookmakers[j].markets.length; k++) {
          for (let m = 0; m < this.selectedSportsData[i].bookmakers[j].markets[k].outcomes.length; m++) {
            tempData.push({
              bookId: this.selectedSportsData[i].id,
              sportKey: this.selectedSportsData[i].sport_key,
              sportTitle: this.selectedSportsData[i].sport_title,
              homeTeam: this.selectedSportsData[i].home_team,
              awayTeam: this.selectedSportsData[i].away_team,
              commenceTime: this.selectedSportsData[i].commence_time,
              bookMaker: this.selectedSportsData[i].bookmakers[j].title,
              marketKey: this.selectedSportsData[i].bookmakers[j].markets[k].key,
              teamName: this.selectedSportsData[i].bookmakers[j].markets[k].outcomes[m].name,
              price: this.selectedSportsData[i].bookmakers[j].markets[k].outcomes[m].price,
              point: this.selectedSportsData[i].bookmakers[j].markets[k].outcomes[m].point != null ? this.selectedSportsData[i].bookmakers[j].markets[k].outcomes[m].point : 0
            });
          }
        }
      }
    }
    console.log(tempData)
    return tempData;
  }

  async loadPlayerProps() {
    if (this.playerPropsClicked == true) {
      this.playerPropsClicked = false;
      return;
    }
    this.playerPropsClicked = true;

    try {
      var dbEmpty = await this.playerPropRepo.find({ where: { bookId: this.selectedGame } })
      if (dbEmpty.length == 0 || dbEmpty[0].createdAt?.getDate() != this.date.getDate()) {
        var results = await this.getPlayerProps();

        await PlayerPropController.addPlayerPropData(results);


        await PlayerPropController.loadPlayerPropData(this.selectedSport).then(item => this.playerPropDataFinal = item)
        console.log(this.sportsBookDataFinal)
        this.addplayerPropToArray();
      }
      else {
        await PlayerPropController.loadPlayerPropData(this.selectedSport).then(item => this.playerPropDataFinal = item)
        this.addplayerPropToArray();
        console.log(this.sportsBookDataFinal)
        console.log(this.sportsBookData)
      }
    } catch (error: any) {
      alert(error.message)
    }



  }


  async getPlayerProps() {
    var urlNew = '';
    var playerProps = '';
    if (this.selectedSport === "MLB") {
      playerProps = "batter_home_runs,batter_hits,batter_total_bases"

    }
    if (this.selectedSport === "NHL") {
      playerProps = "player_points,player_assists,player_shots_on_goal"

    }
    if (this.selectedSport == "NBA") {
      playerProps = "player_points,player_rebounds,player_assists,player_threes,player_double_double,player_blocks"
    }
    urlNew = this.pre_initial_player_prop + this.convertSport(this.selectedSport) + this.middle_initial_player_prop + this.selectedGame + this.middle_next_player_prop + playerProps + this.post_initial_player_prop;

    const promise = await fetch(urlNew);
    const processedResponse = await promise.json();
    this.playerProps = processedResponse;
    this.playerPropData = this.convertPropDataToInterface()
    console.log(this.playerProps)
    return this.playerPropData
  }

  convertPropDataToInterface() {
    var tempData: DbPlayerPropData[] = [];
    for (let j = 0; j < this.playerProps.bookmakers.length; j++) {
      for (let k = 0; k < this.playerProps.bookmakers[j].markets.length; k++) {
        for (let m = 0; m < this.playerProps.bookmakers[j].markets[k].outcomes.length; m++) {
          tempData.push({
            bookId: this.playerProps.id,
            sportKey: this.playerProps.sport_key,
            sportTitle: this.playerProps.sport_title,
            homeTeam: this.playerProps.home_team,
            awayTeam: this.playerProps.away_team,
            commenceTime: this.playerProps.commence_time,
            bookMaker: this.playerProps.bookmakers[j].title,
            marketKey: this.playerProps.bookmakers[j].markets[k].key,
            description: this.playerProps.bookmakers[j].markets[k].outcomes[m].name,
            playerName: this.playerProps.bookmakers[j].markets[k].outcomes[m].description,
            price: this.playerProps.bookmakers[j].markets[k].outcomes[m].price,
            point: this.playerProps.bookmakers[j].markets[k].outcomes[m].point != null ? this.playerProps.bookmakers[j].markets[k].outcomes[m].point : 0
          });
        }
      }

    }
    console.log(tempData)
    return tempData;
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
    //console.log(this.playerProps)

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

          this.playerPropsArray.push({
            name: this.playerPropDataFinal[u].playerName,
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
    console.log(this.playerPropObjectArray)

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
          console.log(element[i])
          let player = await NhlPlayerInfoController.nhlLoadPlayerInfoFromName(element[i].name)
          let db2022 = await this.nhlPlayerGameStatRepo.find({ where: { season: "20222023", playerId: player[0].playerId } })
          let db2023 = await this.nhlPlayerGameStatRepo.find({ where: { season: "20232024", playerId: player[0].playerId } })
          if (db2022.length == 0) {
            var results = await this.loadNhl2022PlayerStatData(player[0].playerId)
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
            var results = await this.loadNhl2023PlayerStatData(player[0].playerId)
            await NhlPlayerGameStatsController.nhlAddPlayerINfo2023Data(results);

            await NhlPlayerGameStatsController.nhlLoadPlayerInfo2023FromId(player[0].playerId).then(item => this.nhlPlayerStatData2023Final = item)

          }
          else {
            await NhlPlayerGameStatsController.nhlLoadPlayerInfo2023FromId(player[0].playerId).then(item => this.nhlPlayerStatData2023Final = item)
            console.log(this.nhlPlayerStatData2023Final)

          }
          await this.computeStatForPlayer(element[i]);
        }
      }
      if (this.selectedSport == "NBA") {
        for (let i = 0; i < 1; i++) {
          let player = await NbaController.nbaLoadPlayerInfoFromName(element[i].name)
          let db2022 = await NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(player[0].playerId, 2022)
          let db2023 = await NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(player[0].playerId, 2023)
          if (db2022.length == 0) {
            let results = await this.loadNba2022PlayerStatData(player[0].playerId)
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

          if (db2023.length == 0 || db2023[0].createdAt?.getDate() != this.date.getDate()) {
            let results = await this.loadNba2023PlayerStatData(player[0].playerId)
            await NbaController.nbaAddPlayerGameStats2023(results);

            await NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(player[0].playerId, 2023).then(item => this.nbaPlayerStatData2023Final = item)

          }
          else {
            await NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(player[0].playerId, 2023).then(item => this.nbaPlayerStatData2023Final = item)
            console.log(this.nhlPlayerStatData2023Final)

          }
          await this.computeStatForPlayer(element[i]);
        }
        
      }
      this.displayProgressBar = false
    } catch (error: any) {
      console.log(error)
    }








  }



  async computeStatsForAllPlayersInProp(element: any) {
    if (element[0].percentTeam == "") {
      //element.forEach(async (e: any) => {
      await this.getPlayerStatsForSeasonCall(element)
      // })

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
    this.average2022 = 0
    this.average2022vsTeam = 0
    var numberOfGamesStarted = 0;
    var numberOfGamesStartedVsTeam = 0;
    var numberOfGamesStartedVsTeam2022 = 0


    if (this.selectedSport == "MLB") {

      console.log(this.tempPlayerStatData)

      var resultArray = Object.keys(this.tempPlayerStatData).map((personNamedIndex: any) => {
        let newStatData = this.tempPlayerStatData[personNamedIndex];
        return newStatData;
      })
      console.log(resultArray)

      var numberOfGamesStarted = 0;
      var numberOfGamesStartedVsTeam = 0;
      console.log(resultArray[0].team)
      console.log(this.getTeamName(element.team1))
      console.log(element.team1)
      console.log(this.getTeamName(element.team2))
      if (resultArray[0].team == this.getTeamName(element.team1)) {
        this.teamAgainst = this.getTeamName(element.team2)
      } else { this.teamAgainst = this.getTeamName(element.team1) }
      //this.updatePlayerGameStatInfoMlb(resultArray, this.teamAgainst);
      var d = new Date();
      var year = d.getFullYear().toString();
      var month = (d.getMonth() + 1).toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      var day = d.getDate().toString();
      console.log(day)
      if (day.length == 1) {
        day = "0" + day;
      }
      var fullDate = year + month + day;
      console.log(element)
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
      console.log(propCde)
      for (let i = 0; i < resultArray.length; i++) {
        if (resultArray[i].started == "True") {

          var gameDate = resultArray[i].gameID.slice(0, 8);
          if (gameDate == fullDate) {
            console.log(resultArray[i].gameID)
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
            console.log(resultArray[i])
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
      console.log(numberOfGamesStartedVsTeam)
      console.log(this.teamAgainst)
      console.log(this.playerAverageVsTeam)
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
        //console.log(this.playerHittingAverageVsTeam)
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
      console.log(day)
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
          console.log(parseInt(e[propCde]) > element.point)
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


      console.log(numberOfGamesStartedVsTeam)
      console.log(this.teamAgainst)
      console.log(this.playerAverageVsTeam)
      if (numberOfGamesStarted == 0) {
        this.playerAverageForSeason = 0;
        this.playerPercentForSeason = 0;
      }
      else {
        this.playerAverageForSeason = (this.playerAverageForSeason / numberOfGamesStarted).toFixed(3);
        console.log(this.playerPercentForSeason)
        console.log(numberOfGamesStarted)
        this.playerPercentForSeason = (this.playerPercentForSeason / numberOfGamesStarted).toFixed(3);
      }
      if (numberOfGamesStartedVsTeam == 0) {
        this.playerAverageVsTeam = -1;
        this.playerPercentVsTeam = -1;
      }
      else {
        this.playerAverageVsTeam = (this.playerAverageVsTeam / numberOfGamesStartedVsTeam).toFixed(3);
        //console.log(this.playerHittingAverageVsTeam)
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
      console.log(element)
      if (tempTeamName1.includes(" ")) {
        tempTeamName1 = tempTeamName1.replaceAll(" ", "_")
      } 
      if (tempTeamName2.includes(" ")) {
        tempTeamName2 = tempTeamName2.replaceAll(" ", "_")
      } 
      let teamId1 = this.arrayOfNBATeams[tempTeamName1]
      let teamId2 = this.arrayOfNBATeams[tempTeamName2]
      let playerId = await NbaController.nbaLoadPlayerInfoFromName(element.name)
      this.teamAgainst = this.arrayOfNBATeams[this.addUnderScoreToName(element.team1)] == teamId1 ? element.team2 : element.team1


      var d = new Date();
      var year = d.getFullYear().toString();
      var month = (d.getMonth() + 1).toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      var day = d.getDate().toString();
      console.log(day)
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
          console.log(parseInt(e[propCde]) > element.point)
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


      console.log(numberOfGamesStartedVsTeam)
      console.log(this.teamAgainst)
      console.log(this.playerAverageVsTeam)
      if (numberOfGamesStarted == 0) {
        this.playerAverageForSeason = 0;
        this.playerPercentForSeason = 0;
      }
      else {
        this.playerAverageForSeason = (this.playerAverageForSeason / numberOfGamesStarted).toFixed(3);
        console.log(this.playerPercentForSeason)
        console.log(numberOfGamesStarted)
        this.playerPercentForSeason = (this.playerPercentForSeason / numberOfGamesStarted).toFixed(3);
      }
      if (numberOfGamesStartedVsTeam == 0) {
        this.playerAverageVsTeam = -1;
        this.playerPercentVsTeam = -1;
      }
      else {
        this.playerAverageVsTeam = (this.playerAverageVsTeam / numberOfGamesStartedVsTeam).toFixed(3);
        //console.log(this.playerHittingAverageVsTeam)
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



    /*  this.mlbPlayerId.push({
       Name: name,
       Id: result.body[i].playerID,
       teamName: result.body[i].team,
       teamId: result.body[i].teamID
     })
   }
   var date = new Date();
   //this.mlbPlayerId.pop();
   this.notes.forEach((element: { playerName: any; playerId: any; teamName: any; teamId: any; }) => {
     this.mlbPlayerId.push({
       Name: element.playerName,
       Id: element.playerId,
       teamName: element.teamName,
       teamId: element.teamId
     })
   }) */
    //console.log(this.mlbPlayerId)
    //this.updatePlayerInfoMlb();
  }

  getMlbPlayerIdFromName(name: string): any {
    console.log(name)
    console.log(this.mlbPlayerId)
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
      console.log("Here")
      team = team.replaceAll('.', '');
    }
    console.log(team)
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
    //console.log(day)
    if (day.length == 1) {
      day = "0" + day;
    }
    var fullDate = day + "/" + month + "/" + year;
    return fullDate
  }

  getPlayersInfoMlb() {
    this.http.get(this.APIUrl + 'GetPlayerInfo').pipe(
      catchError(error => {
        console.log(error.message);
        return of(null);
      }))
      .subscribe(
        data => {
          this.notes = data;

        }
      );
    console.log(this.notes)

  }

  updatePlayerInfoMlb() {
    this.http.delete(this.APIUrl + 'DeletePlayerInfo').pipe(
      catchError(error => {
        console.log(error.message);
        return of(null);
      }))
      .subscribe(
        data => {
          console.log("deleted players")

        }
      );


    var errorMessage: string;
    this.mlbPlayerId.forEach(player => {
      if (player.Id == '' || player.Name == '' || player.teamId == '' || player.teamName == '') {
        return;
      }
      var date = new Date();

      var postString: any = {
        playerId: player.Id,
        playerName: player.Name,
        teamName: player.teamName,
        teamId: player.teamId,
        insertTms: "12/12/34"
      };

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      const headers = new HttpHeaders()
        .append(
          'Content-Type',
          'application/json'
        );

      const params = new HttpParams()
        .append('playerId', player.Id)
        .append('playerName', player.Name)
        .append('teamName', player.teamName)
        .append('teamId', player.teamId)
        .append('insertTms', this.getDate());

      const body = JSON.stringify(postString);

      this.http.post<MlbPlayerid>(this.APIUrl + 'AddPlayerInfo', body, {
        headers: headers,
        params: params,
      }).subscribe((res) => console.log(res))
    });

  }


  updatePlayerGameStatInfoMlb(playerGamesArray: any[], teamAgainst: string) {

    //add if query for the current player id length != the current length coming from the array then delete and re update other wise return

    this.http.delete(this.APIUrl + 'DeletePlayerGameStatInfo?id=' + playerGamesArray[0].playerID).pipe(
      catchError(error => {
        console.log(error.message);
        return of(null);
      }))
      .subscribe(
        data => {
          console.log("deleted players game stat info")

        }
      );

    playerGamesArray.forEach((element) => {
      var playerElement = this.mlbPlayerId.find((e) => e.Id == element.playerID);
      var teamAgainstElement = this.mlbPlayerId.find((e) => teamAgainst == e.teamName);

      var errorMessage: string;

      var date = new Date();




      var postString: any = {
        playerId: element.playerID,
        playerName: playerElement?.Name,
        teamName: playerElement?.teamName,
        teamId: playerElement?.teamId,
        playerPosition: element.allPositionsPlayed,
        playerStarted: element.started == true ? 'Y' : 'N',
        batterHomeRuns: element.Hitting.HR,
        batterHits: element.Hitting.H,
        batterTotalBases: element.Hitting.TB,
        batterRbis: element.Hitting.RBI,
        batterRunsScored: element.Hitting.R,
        batterHitsRunsRbis: (element.Hitting.H + element.Hitting.R + element.Hitting.RBI),
        batterSingles: '0',
        batterDoubles: element.Hitting['2B'],
        batterTriples: element.Hitting['3B'],
        batterWalks: (element.Hitting.BB + element.Hitting.IBB),
        batterStrikeouts: element.Hitting.SO,
        batterStolenBases: element.BaseRunning.SB,
        pitcherStrikeouts: '0',
        pitcherRecordAWin: '0',
        pitcherHitsAllowed: '0',
        pitcherWalks: '0',
        pitcherEarnedRuns: '0',
        pitcherOuts: '0',
        gameId: element.gameID,
        teamAgainst: teamAgainstElement?.teamName,
        teamAgainstId: teamAgainstElement?.teamId,
        insertTms: this.getDate()
      };

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      const headers = new HttpHeaders()
        .append(
          'Content-Type',
          'application/json'
        );

      const params = new HttpParams()
        .append('playerId', element.playerID)
        .append('playerName', playerElement!.Name)
        .append('teamName', playerElement!.teamName)
        .append('teamId', playerElement!.teamId)
        .append('player_position', element.allPositionsPlayed)
        .append('player_started', element.started == true ? 'Y' : 'N')
        .append('batter_home_runs', element.Hitting.HR)
        .append('batter_hits', element.Hitting.H)
        .append('batter_total_bases', element.Hitting.TB)
        .append('batter_rbis', element.Hitting.RBI)
        .append('batter_runs_scored', element.Hitting.R)
        .append('batter_hits_runs_rbis', (element.Hitting.H + element.Hitting.R + element.Hitting.RBI))
        .append('batter_singles', '0')
        .append('batter_doubles', element.Hitting['2B'])
        .append('batter_triples', element.Hitting['3B'])
        .append('batter_walks', (element.Hitting.BB + element.Hitting.IBB))
        .append('batter_strikeouts', element.Hitting.SO)
        .append('batter_stolen_bases', element.BaseRunning.SB)
        .append('pitcher_strikeouts', '0')
        .append('pitcher_record_a_win', '0')
        .append('pitcher_hits_allowed', '0')
        .append('pitcher_walks', '0')
        .append('pitcher_earned_runs', '0')
        .append('pitcher_outs', '0')
        .append('gameId', element.gameID)
        .append('teamAgainst', teamAgainstElement!.teamName)
        .append('teamAgainstId', teamAgainstElement!.teamId)
        .append('insertTms', this.getDate());

      const body = JSON.stringify(postString);

      this.http.post(this.APIUrl + 'AddPlayerGameStatInfofMLB', body, {
        headers: headers,
        params: params,
      }).subscribe((res) => console.log(res))
    });

  }


  async ngOnInit() {
    /* this.sportPropArray = [];
    this.datePrropArray = [];
    this.gamePropArray = [];
    this.propsArray = [];
    this.playerPropsArray = []; */

    this.trimSports(await this.getSports());
    //await this.getDatesAndGames();

    //this.getPlayersInfoMlb();

    console.log("here")
    console.log(this.notes)

  }

}


//for each prop accordian tab. store the data in an array that way it doesn't get reloaded each time. Can even store each thing at each level ex: each player -> each accordian prop -> each game -> each date -> each sport