import { AfterContentInit, AfterViewInit, Component, HostListener, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SportsBookController } from '../../shared/Controllers/SportsBookController';
import { TeamInfoController } from '../../shared/Controllers/TeamInfoController';
import { DbTeamInfo } from '../../shared/dbTasks/DBTeamInfo';
import { DbGameBookData } from '../../shared/dbTasks/DbGameBookData';
import { NhlService } from '../Services/NhlService';
import { NhlController } from '../../shared/Controllers/NhlController';
import { ThisReceiver } from '@angular/compiler';
import { reusedFunctions } from '../Services/reusedFunctions';
import { remult } from 'remult';
import { DBNflPlayerGameStats } from '../../shared/dbTasks/DbNflPlayerGameStats';
import { Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-prop-screen-new',
  templateUrl: './prop-screen-new.component.html',
  styleUrls: ['./prop-screen-new.component.scss']
})
export class PropScreenNewComponent implements OnInit, AfterViewInit, AfterContentInit, OnChanges {

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    location.reload()
  }


  listOfProps: any = [
    {
      type: 'Team Props',
      selected: true
    },
    {
      type: 'Player Props',
      selected: false
    },
    {
      type: 'Live Props',
      selected: false
    },{
      type: 'Best Bets',
      selected: false
    }
  ]

  selectedSport: string = ''
  selectedPropType: string = ''
  allSportTeamInfo: DbTeamInfo[] = []
  selectedSportGames: DbGameBookData[] = []
  selectedGame: string = ''
  selectedSportGamesFinal: any[] = []
  teamPropFinnal: any[] = []
  awayTeamStatsDisplay: any = []
  homeTeamStatsDisplay: any = []
  awayTeamInfo: DbTeamInfo[] = []
  homeTeamInfo: DbTeamInfo[] = []
  selectedProp: any = {}
  selectedDisplayProp: any = {}
  showSpinner: boolean = false;
  overUnderSlide: boolean = false;
  index: number = 0
  moneyLineTableColumns: string[] = ["TeamAgainst", "Date", "Result", "Score"]
  moneyLineTablePlayerColumns: string[] = ["TeamAgainst", "Date", "Score"]
  selectedBetIndexes: number[] = [0,0]
  playerPropData: any[] = []
  selectedDisplayArray: any[] = []
  arrayOfAllBets: any[] = []
  bestBets: any[] = []
  bestBetDisplay: any[] = []
  livePropData: any[] = []
  sliderValue: number = 90;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    //private dialog: MatDialog
  ) {

  }

  async initializeUrl() {
    if (this.route.snapshot.paramMap.get('sport') != null) {
      this.selectedSport = this.route.snapshot.paramMap.get('sport')!
    }
    if (this.route.snapshot.paramMap.get('game') != null) {
      this.route.paramMap.subscribe((params: { get: (arg0: string) => any; }) => {
        this.selectedGame = params.get("game")
        this.router.navigate([`/propsNew/${this.selectedSport}/${this.selectedGame}`])
      })
    }

  }
  async initializeData() {

    let initialData = await Promise.all([TeamInfoController.getAllTeamInfo(this.selectedSport), SportsBookController.loadAllBookDataBySportAndMaxBookSeq(this.selectedSport)])
    this.allSportTeamInfo = initialData[0]
    this.selectedSportGames = initialData[1]
    if (this.selectedGame == '') {
      let distinctGames = this.selectedSportGames.map(game => game.bookId).filter((value, index, array) => array.indexOf(value) === index)
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
      this.router.navigate([`/propsNew/${this.selectedSport}/${this.selectedGame}`])
    }
    else {
      let sportsGamesNew: any[] = JSON.parse(JSON.stringify(this.selectedSportGames))
      let distinctGames = sportsGamesNew.map(game => game.bookId).filter((value, index, array) => array.indexOf(value) === index)
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
      if(currentGame.length == 0){
        //throw error for the game not being available anymore
      }
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
    this.showSpinner = true;
    this.selectedGame = game;

    this.router.navigate([`/propsNew/${this.selectedSport}/${this.selectedGame}`])
    this.selectedSportGamesFinal.forEach(e => {
      e[0].selected = false;
      

    })
    let selectedGameClicked = this.selectedSportGamesFinal.filter(e => e[0][0].bookId == this.selectedGame)
    selectedGameClicked[0][0].selected = true
    this.awayTeamInfo = this.allSportTeamInfo.filter(f => f.teamNameAbvr == selectedGameClicked[0][0][0].awayTeam)
    this.homeTeamInfo = this.allSportTeamInfo.filter(f => f.teamNameAbvr == selectedGameClicked[0][0][0].homeTeam)
    
    

    await this.displayProp();
  }
  async displayProp() {
    this.overUnderSlide = false;
    this.index = 0;
    let gameProps: DbGameBookData[] = this.selectedSportGames.filter(e => e.bookId == this.selectedGame)
    let results = await reusedFunctions.getPropDataBySport(this.selectedSport, gameProps, this.allSportTeamInfo, [this.awayTeamInfo[0].teamNameAbvr, this.homeTeamInfo[0].teamNameAbvr], this.selectedGame)
    this.teamPropFinnal = results[0]
    let teamTotals = results[1]
    this.playerPropData = results[2]
    this.livePropData = results[3]
    console.log('live prop data below')
    console.log(this.livePropData)
    console.log(this.teamPropFinnal)
    this.selectedDisplayArray = this.teamPropFinnal
    this.awayTeamStatsDisplay = teamTotals.filter((e: { teamName: string; }) => e.teamName == this.awayTeamInfo[0].teamNameAbvr)[0]
    this.homeTeamStatsDisplay = teamTotals.filter((e: { teamName: string; }) => e.teamName == this.homeTeamInfo[0].teamNameAbvr)[0]
    this.selectedProp = this.teamPropFinnal[0][0]
    this.selectedDisplayProp = this.teamPropFinnal[0][0]
    this.selectedBetIndexes = [0,0]
    this.showSpinner = false;
    console.log(this.playerPropData)
    this.teamPropFinnal.sort((a,b) => this.findIndexOfKey(this.listOfTeamProps, a.propName) - this.findIndexOfKey(this.listOfTeamProps, b.propName))
    this.playerPropData.sort((a,b) => this.findIndexOfKey(this.listOfTeamProps, a.propName) - this.findIndexOfKey(this.listOfTeamProps, b.propName))
    this.onPropChange(this.listOfProps[0].type)
    
    await this.getBestBets()
  }

  findIndexOfKey(obj: { [key: string]: string }, key: string): number {
    const keys = Object.keys(obj);
    return keys.indexOf(key);
  }

  async getBestBets(){
    this.arrayOfAllBets = []
    for(let i = 0; i < this.teamPropFinnal.length; i++){
      for(let j = 0; j < this.teamPropFinnal[i].length; j++){
        if(this.teamPropFinnal[i][j].length > 1){
          for(let k = 0; k < this.teamPropFinnal[i][j].length; k++){
            if(this.teamPropFinnal[i][j][k].length > 1){
              for(let m = 0; m < this.teamPropFinnal[i][j][k].length; m++){
                this.arrayOfAllBets.push(this.teamPropFinnal[i][j][k][m])
              }
            }
            else{
              this.arrayOfAllBets.push(this.teamPropFinnal[i][j][k])
            }
            
          }

        }
        else{
          this.arrayOfAllBets.push(this.teamPropFinnal[i][j])
        }
      }
    }
    for(let i = 0; i < this.playerPropData.length; i++){
      for(let j = 0; j < this.playerPropData[i].length; j++){
        for(let k = 0; k < this.playerPropData[i][j].length; k++){
          this.arrayOfAllBets.push(this.playerPropData[i][j][k])
        }
      }
    }
    this.findBestBets()
    
  }
   findBestBets(){
    this.bestBets = []
    this.bestBetDisplay = []
    for(let i = 0; i < this.arrayOfAllBets.length; i++){
      if(this.arrayOfAllBets[i].overallChance > (this.sliderValue / 100) || this.arrayOfAllBets[i].overallWeighted > (this.sliderValue / 100)){
        this.bestBets.push(this.arrayOfAllBets[i])
      }
    }
    let teamBets: any[] = []
    let playerBets: any[] = []
    for(let i = 0; i < this.bestBets.length; i++){
      if(Object.hasOwn(this.bestBets[i], 'gameBookData')){
        teamBets.push(this.bestBets[i])
      }
      else{
        playerBets.push(this.bestBets[i])
      }
    }
    let distinctTeamBets = teamBets.map(e => e.gameBookData.marketKey).filter((v,i,a) => a.indexOf(v) === i)
    for(let i = 0; i < distinctTeamBets.length; i++){
      let filteredTeamBets = teamBets.filter(e => e.gameBookData.marketKey == distinctTeamBets[i])
      this.bestBetDisplay.push(filteredTeamBets)
      this.bestBetDisplay[this.bestBetDisplay.length - 1].propType = filteredTeamBets[0].propType
      this.bestBetDisplay[this.bestBetDisplay.length - 1].propName = filteredTeamBets[0].gameBookData.marketKey
    }
    let distinctPlayerBets = playerBets.map(e => e.playerBookData.marketKey).filter((v,i,a) => a.indexOf(v) === i)
    for(let i = 0; i < distinctPlayerBets.length; i++){
      let filteredPlayerBets = playerBets.filter(e => e.playerBookData.marketKey == distinctPlayerBets[i])
      this.bestBetDisplay.push(filteredPlayerBets)
      this.bestBetDisplay[this.bestBetDisplay.length - 1].propType = filteredPlayerBets[0].propType
      this.bestBetDisplay[this.bestBetDisplay.length - 1].propName = filteredPlayerBets[0].playerBookData.marketKey
    }
    console.log('best bets belwo')
    console.log(this.bestBetDisplay)
    if(this.selectedPropType == 'Best Bets'){
      this.selectedDisplayArray = this.bestBetDisplay
    }
    
    
  }

  

  public listOfTeamProps: { [key: string]: string } = 
  { "h2h": "Moneyline", 
    "spreads": "Spread", 
    "totals": "Game Total", 
    "h2h_1st_3_innings": "Moneyline first 3 innings", 
    "h2h_1st_5_innings": "Moneyline first 5 innings", 
    "h2h_1st_7_innings": "Moneyline first 7 innings", 
    "h2h_p1": "Moneyline First Period", 
    "h2h_p2": "Moneyline Second Period", 
    "h2h_p3": "Moneyline Third Period", 
    'h2h_h1': 'Moneyline First Half', 
    'h2h_h2': 'Moneyline Second Half',
    'h2h_q1': 'Moneyline First Quarter', 
    'h2h_q2': 'Moneyline Second Quarter',
    'h2h_q3': 'Moneyline Third Quarter',
    'h2h_q4': 'Moneyline Fourth Quarter',
    'spreads_h1': 'Spread First Half', 
    'spreads_h2': 'Spread Second Half',
    'spreads_q1': 'Spread First Quarter',
    'spreads_q2': 'Spread Second Quarter',
    'spreads_q3': 'Spread Third Quarter',
    'spreads_q4': 'Spread Fourth Quarter',
    'totals_h1': 'Total First Half',
    'totals_h2': 'Total Second Half',
    'totals_q1': 'Total First Quarter',
    'totals_q2': 'Total Second Quarter',
    'totals_q3': 'Total Third Quarter',
    'totals_q4': 'Total Fourth Quarter',
    'team_totals_h1': 'Team Total First Half',
    'team_totals_h2': 'Team Total Second Half',
    'team_totals_q1': 'Team Total First Quarter',
    'team_totals_q2': 'Team Total Second Quarter',
    'team_totals_q3': 'Team Total Third Quarter',
    'team_totals_q4': 'Team Total Fourth Quarter',
    'alternate_spreads': 'Alternate Spread',
    'alternate_totals': 'Alternate Total',
    "alternate_team_totals": 'Alternate Team Total', 
    'player_shots_on_goal': 'Shots',
    'player_points': 'Points', 
    'player_assists': 'Assists', 
    'player_shots_on_goal_alternate': 'Alternate Shots', 
    'player_pass_tds': 'Pass Tds',
    'player_pass_yds': 'Pass Yds',
    'player_reception_yds': 'Receiving Yds',
    'player_rush_yds': 'Rushing Yds',
    'player_pass_yds_alternate': 'Alternate Pass Yds',
    'player_reception_yds_alternate': "Alternate Receiving Yds",
    'player_rush_yds_alternate': 'Alternate Rushing Yds'
   }
  public listOfMoneylines: string[] = ["h2h", "h2h_1st_3_innings", "h2h_1st_5_innings", "h2h_1st_7_innings", 'h2h_p1', 'h2h_p2', 'h2h_p3']
  displayPropTitle(prop: any): string {
    
      return this.listOfTeamProps[prop.propName]
    
  }


  onPropClicked(prop:any, panel: number, bet: number){
    this.overUnderSlide = false;
    this.index = 0;
    this.selectedProp = prop
    this.selectedBetIndexes = [panel, bet]
    console.log(this.selectedProp)

    if(this.selectedProp.length >= 1){
      if(this.selectedProp[0].length > 1){
        if(this.selectedProp[0][0].length > 0){
          this.selectedDisplayProp = this.selectedProp[0][0][0]
        }
        else{
          this.selectedDisplayProp = this.selectedProp[0][0]
        }
        
      }
      else if(this.selectedProp[0].length == 1){
        this.selectedDisplayProp = this.selectedProp[0][0]
      }
      else{
        this.selectedDisplayProp = this.selectedProp[0]
      }
    }
    else{
      this.selectedDisplayProp = this.selectedProp;
    }
    console.log('selected prop below')
    console.log(this.selectedProp)
    console.log('selected display prop below')
    console.log(this.selectedDisplayProp)

  }
  onPropChange(propType: string) {
    this.overUnderSlide = false;
    this.index = 0;
    this.selectedBetIndexes = [0, 0]
    this.selectedPropType = propType
    for (let prop of this.listOfProps) {
      if (prop.type != this.selectedPropType) {
        prop.selected = false;
      }
      else {
        prop.selected = true;
      }

    }
    if(this.selectedPropType == 'Team Props'){
      this.selectedDisplayArray = this.teamPropFinnal
      if(this.selectedDisplayArray[0].length >= 1){
        this.onPropClicked(this.selectedDisplayArray[0][0],0,0)
      }
      else{
        this.onPropClicked(this.selectedDisplayArray[0],0,0)
      }
      
    }
    else if(this.selectedPropType == 'Player Props'){
      this.selectedDisplayArray = this.playerPropData
      this.onPropClicked(this.selectedDisplayArray[0][0],0,0)
    }
    else if(this.selectedPropType == 'Best Bets'){
      this.selectedDisplayArray = this.bestBetDisplay
      this.onPropClicked(this.selectedDisplayArray[0][0],0,0)
    }
    else if(this.selectedPropType == 'Live Props'){
      this.selectedDisplayArray = this.livePropData
      this.onPropClicked(this.selectedDisplayArray[0][0],0,0)
      
      this.createChart()
    }
    
  }
  livePanelIndex = 0
  onLivePropClicked(prop:any, panel: number, bet: number){
    this.onPropClicked(prop,panel,bet)
    this.livePanelIndex = panel
    this.updateChart()
    /* this.destroyChart()
    this.createChart() */
  }
  destroyChart(){
    this.barChart.destroy()
  }
  updateChart(){
    this.barChart.labels = this.selectedDisplayProp.labels
    this.barChart.datasets.label = this.selectedDisplayProp.propName
    this.barChart.datasets.data = this.selectedDisplayProp.barData
    this.barChart.update()
  }
  updateLivePropGraphType(type: number){
    console.log(type)
  }
  public barChart: any
  createChart(){
    let chartInstance = Chart.getChart("MyChart")
    if(chartInstance == undefined){
      this.barChart.destroy()
    }
    this.barChart = new Chart("MyChart", {
            type: 'bar', //this denotes tha type of chart
    
            data: {// values on X-Axis
    
              labels: this.selectedDisplayProp.labels,
              datasets: [
                {
                  label: this.selectedDisplayProp.propName,
                  data: this.selectedDisplayProp.barData,
                  backgroundColor: 'blue'
                }
              ]
            },
            options: {
              aspectRatio: 2.5,
              scales:{
                y:{
                  max:100
                }
              }
            }
    
          });
          console.log('after chart created')
  }

  

  updateOverUnder(){
    if(this.selectedProp[0].length > 1){
      this.selectedDisplayProp = this.selectedProp[this.index][this.overUnderSlide ? 1 : 0]
    }
    else if(this.selectedProp[0].propType == 'altTotal'){
      this.selectedDisplayProp = this.selectedProp[this.index]
    }
    else{
      this.selectedDisplayProp = this.selectedProp[this.overUnderSlide ? 1 : 0]
    }
    
  }

  updatePropIndex(direction: string){

    if(direction == 'Down'){
      if(this.index != 0){
        this.index -= 1;
      }
    }
    else{
      if(this.index != this.selectedProp.length-1){
        this.index += 1;
      }
    }
    if(this.selectedProp[this.index].length > 1){
      this.selectedDisplayProp = this.selectedProp[this.index][this.overUnderSlide ? 1 : 0]
      this.selectedProp.index = this.index
    }
    else if(this.selectedProp[this.index].length == 1){
      this.selectedDisplayProp = this.selectedProp[this.index][0]
      this.selectedProp.index = this.index
    }
    else{
      this.selectedDisplayProp = this.selectedProp[this.index]
      this.selectedProp.index = this.index
    }

    
    console.log(this.selectedProp)
    console.log(this.index)
    console.log(this.selectedDisplayProp)
    
  }

  getPropNameFromMarketKey(marketKey: string): string{
    console.log(marketKey)
    return this.listOfTeamProps[marketKey]
  }
  isTeamOrPlayerProps(){
    return (this.selectedPropType == 'Team Props' || this.selectedPropType == 'Player Props')
  }
  isTeamTruePlayerFalse(prop: any){
    if(prop.length > 1){
      if(Object.hasOwn(prop[0], 'gameBookData')){
        return true
      }
      else{
        return false
      }
    }
    else{
      if(Object.hasOwn(prop, 'gameBookData')){
        return true
      }
      else{
        return false
      }
    }
  }
  isPropTotal(prop:any){
    if(prop.propType == 'total' || prop.propType == 'altTotal') return true
    else return false
  }
  ngAfterViewInit(){
    this.selectedBetIndexes = [0,0]
  }
  ngAfterContentInit(){
  }
  ngOnChanges(){
    console.log('here ngOnChanges')
  }

  async ngOnInit() {
    this.showSpinner = true;
    Chart.register(annotationPlugin);
    this.selectedPropType = this.listOfProps[0].type
    await this.initializeUrl()
    await this.initializeData()
  }
}
