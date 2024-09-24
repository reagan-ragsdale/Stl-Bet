import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NbaController } from 'src/shared/Controllers/NbaController';
import { NbaPlayerInfoDb } from 'src/shared/dbTasks/NbaPlayerInfoDb';
import { DbNbaGameStats } from 'src/shared/dbTasks/DbNbaGameStats';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { filter } from 'compression';

import { DbNhlPlayerGameStats } from '../../shared/dbTasks/DbNhlPlayerGameStats';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { DbNbaTeamLogos } from '../../shared/dbTasks/DbNbaTeamLogos';
import { MlbController } from '../../shared/Controllers/MlbController';
import { PlayerInfoController } from '../../shared/Controllers/PlayerInfoController';
import { DbPlayerInfo } from 'src/shared/dbTasks/DbPlayerInfo';
import { PlayerPropController } from 'src/shared/Controllers/PlayerPropController';
import { DbPlayerPropData } from 'src/shared/dbTasks/DbPlayerPropData';
import { reusedFunctions } from '../Services/reusedFunctions';
import { DBMlbPlayerGameStatTotals } from 'src/shared/dbTasks/DbMlbPlayerGameStatTotals';
import { DbTeamInfo } from '../../shared/dbTasks/DBTeamInfo';
import { TeamInfoController } from '../../shared/Controllers/TeamInfoController';
import { DbMlbTeamGameStatAverages } from '../../shared/dbTasks/DbMlbTeamGameStatAverages';
import { SportsBookController } from 'src/shared/Controllers/SportsBookController';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';
import { NflController } from 'src/shared/Controllers/NflController';



interface statSearch {
  stat: string;
  dataName: string;
  overUnder: boolean;
  number: number;
  id: number
}



@Component({
  selector: 'app-team-stats',
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.scss']
})
export class TeamStatsComponent {
  

  constructor(
    private router: Router,
    private route: ActivatedRoute
    //private draftKingsApiController: draftKingsApiController
  ) { }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    location.reload()
  }
  myControl = new FormControl('');
  //public displayedColumns: any[] = ["Game", "Date", "Points", "Assists", "Rebounds", "Blocks", "Threes"]
  //

  public teamName: string = ''
  public teamId: any = 0
  public selectedSport: any = ''
  public selectedStatSearchNumber: number = 0
  public filteredSearch: DbTeamInfo[] = []
  public searchName: string = ''
  playerAverage: number = 0
  playerStd: number = 0

  public chart: any;


  public chart2: any;
  public chart3: any

  public displayedColumns: string[] = ["Game", "Date", "HR", "H", "RBI"]

public displayedColumnsValues: any[] = [
  {name: 'Game',
    value: 'teamAgainstName'
  }, 
  {name: 'Date',
    value: 'gameDate'},
  {name: 'HR',
    value: 'totalHomeRunsScored'},
  {name: 'H',
    value: 'totalHitsScored'},
  {name: 'RBI',
    value: 'totalRbisScored'}
]

  public fullDataset: any[] = [
    {
      label: "Points",
      data: [],
      backgroundColor: 'blue',
      showLine: true,
      dataName: 'points'

    },
    {
      label: "Assists",
      data: [],
      backgroundColor: 'green',
      showLine: false,
      dataName: 'assists'
    },
    {
      label: "Rebounds",
      data: [],
      backgroundColor: 'red',
      showLine: false,
      dataName: 'totReb'

    },
    {
      label: "Blocks",
      data: [],
      backgroundColor: 'yellow',
      showLine: false,
      dataName: 'blocks'

    },
    {
      label: "Threes",
      data: [],
      backgroundColor: 'purple',
      showLine: false,
      dataName: 'tpm'

    },
    {
      label: "Double Doubles",
      data: [],
      backgroundColor: 'orange',
      showLine: false,
      dataName: 'doubleDoubles'

    }
  ]

  public teamTotalStatColumns: string[] = ['Home Runs', 'Hits', 'Points', 'Rbis']

  public teamTotalDataSet: any[] = [
    
    {
      name: 'Home Runs',
      data: 'totalHomeRunsScored'
    },
    {
      name: 'Hits',
      data: 'totalHitsScored'
    },
    {
      name: 'Points',
      data: 'pointsScoredOverall'
    },
    {
      name: 'Rbis',
      data: 'totalRbisScored'
    },
    {
      name: 'Runs',
      data: 'totalRunsScored'
    }


  ]

  formArray: statSearch[] = [

  ]



  //line graph checkbox variables
  allComplete: boolean = false;

  showLinePoints: boolean = true
  showLineAssists: boolean = false
  showLineRebounds: boolean = false
  showLineDoubleDoubles: boolean = false
  showLineThrees: boolean = false
  showLineBlocks: boolean = false

  isCombineStats: boolean = false

  public seasonArray: any[] = []
  public seasonArrayTable: any[] = []

  //nba
  public nbaPlayerInfo: NbaPlayerInfoDb[] = []
  public nbaPlayerStatsInfo2022: DbNbaGameStats[] = []
  public nbaPlayerStatsInfo2023: DbNbaGameStats[] = []
  public nbaAllPlayerInfo: NbaPlayerInfoDb[] = []
  public nbaPlayerStatsInfo2023TableTemp: any[] = []
  public nbaPlayerStatsInfo2023Table: any[] = []
  public nbaPlayerStatsInfo2022TableTemp: any[] = []
  public nbaPlayerStatsInfo2022Table: any[] = []
  public teamSeasons: number[] = []
  public teamSeason: number = 2024

  @ViewChild(MatTable)
  table!: MatTable<any>;

  //nhl
  public nhlPlayerStatsInfo2022: DbNhlPlayerGameStats[] = []
  public nhlPlayerStatsInfo2023: DbNhlPlayerGameStats[] = []


  //all
  public isNull: boolean = false
  public allSportTeamList: any[] = []

  public teamInfo: DbTeamInfo[] = []
  public selectedTeam: any = []
  public teamStats: any[] = []
  public teamSeasonStats: any[] = []

  public teamProps: DbPlayerPropData[] = []
  public teamTotalStats: any[] = []


  async initialize(){
    this.route.paramMap.subscribe(async (params: { get: (arg0: string) => any; }) => {
      this.selectedSport = params.get('team') == null ? 'all' : params.get('team')
      this.teamId = params.get('id') == null ? 0 : params.get('id')
      this.router.navigate([`/teamStats/${this.selectedSport}/${this.teamId}`])
      await this.loadData()
    })
  }
  

  async loadData() {
    
    if (this.route.snapshot.paramMap.get('team') != 'all') {
      this.selectedSport = this.route.snapshot.paramMap.get('team')
      this.teamId = this.route.snapshot.paramMap.get('id')
      await this.getTeamInfo()
      //await this.getAllPlayerInfo()
      //this.calculateMeanAndStd()
      this.createChart()
      //this.createChart2()
      //this.createNormalDistChart()
    }
    else if (this.route.snapshot.paramMap.get('team') == 'all') {
    
      this.isNull = true
      await this.getAllSportTeams()
    }





  }

  async getAllSportTeams(){
    
    let teams = await TeamInfoController.getAllTeamInfo('MLB')
    this.allSportTeamList = teams
    this.searchName = ""
    this.filteredSearch = this.allSportTeamList
  }
  teamPropArray: any[] = []
  async getTeamInfo() {

    if(this.selectedSport == 'MLB'){
      this.fullDataset = [
        {
          label: "Hits",
          data: [],
          backgroundColor: 'blue',
          showLine: true,
          dataName: 'totalHitsScored'
    
        },
        {
          label: "Home Runs",
          data: [],
          backgroundColor: 'green',
          showLine: false,
          dataName: 'totalHomeRunsScored'
        },
        {
          label: "Total Points",
          data: [],
          backgroundColor: 'red',
          showLine: false,
          dataName: 'totalPointsScored'
    
        },
        {
          label: "Rbis",
          data: [],
          backgroundColor: 'yellow',
          showLine: false,
          dataName: 'totalRbisScored'
    
        }
      ]
      this.allSportTeamList = await TeamInfoController.getAllTeamInfo('MLB')
    this.teamInfo = await TeamInfoController.getTeamInfo(this.selectedSport, this.teamId)
    }
    else if(this.selectedSport == 'NFL'){
      this.fullDataset = [
        {
          label: "Points",
          data: [],
          backgroundColor: 'blue',
          showLine: true,
          dataName: 'totalPointsScored'
    
        },
        {
          label: "Rush Yds",
          data: [],
          backgroundColor: 'green',
          showLine: false,
          dataName: 'totalRushingYards'
        },
        {
          label: "Pass Yds",
          data: [],
          backgroundColor: 'red',
          showLine: false,
          dataName: 'totalPassingYards'
    
        }
      ]
      this.allSportTeamList = await TeamInfoController.getAllTeamInfo('NFL')
    this.teamInfo = await TeamInfoController.getTeamInfo(this.selectedSport, this.teamId)
    }

    

    this.teamSeasons = []
    if (this.selectedSport == "NBA") {
     




    }
    else if (this.selectedSport == "NHL") {
    }
    else if(this.selectedSport == "MLB"){
      
      this.teamStats = await MlbController.mlbGetAllTeamGameStatsByTeamId(this.teamInfo[0].teamId)
      console.log(this.teamStats)
      
      let allSeasons = this.teamStats.map(e => e.season).filter((value, index, array) => array.indexOf(value) === index)
      allSeasons.forEach(e => this.teamSeasonStats.push(this.teamStats.filter(i => i.season == e))) 
      
      allSeasons.sort(function(a, b) {
        return a - b;
      });
      allSeasons.forEach(e => this.teamSeasons.push(e))
      this.seasonArray = this.teamStats.filter(e => e.season == allSeasons[allSeasons.length - 1])

      this.nbaPlayerStatsInfo2023TableTemp = JSON.parse(JSON.stringify((this.seasonArray)))
      this.nbaPlayerStatsInfo2023TableTemp.reverse()
      this.nbaPlayerStatsInfo2023Table = this.nbaPlayerStatsInfo2023TableTemp 
      this.nbaPlayerStatsInfo2023Table.forEach((e) => e.isHighlighted = false)
      this.seasonArrayTable = this.nbaPlayerStatsInfo2023Table

      console.log(this.teamSeasons)
      this.teamTotalStats = await MlbController.mlbGetSpecificTeamStatAverage(this.teamId)
      
    }
    else if(this.selectedSport == 'NFL'){
      this.teamStats = await NflController.nflGetAllTeamGameStatsById(this.teamInfo[0].teamId)
      console.log(this.teamStats)
      
      let allSeasons = this.teamStats.map(e => e.season).filter((value, index, array) => array.indexOf(value) === index)
      allSeasons.forEach(e => this.teamSeasonStats.push(this.teamStats.filter(i => i.season == e))) 
      
      allSeasons.sort(function(a, b) {
        return a - b;
      });
      allSeasons.forEach(e => this.teamSeasons.push(e))
      this.seasonArray = this.teamStats.filter(e => e.season == allSeasons[allSeasons.length - 1])

      this.nbaPlayerStatsInfo2023TableTemp = JSON.parse(JSON.stringify((this.seasonArray)))
      this.nbaPlayerStatsInfo2023TableTemp.reverse()
      this.nbaPlayerStatsInfo2023Table = this.nbaPlayerStatsInfo2023TableTemp 
      this.nbaPlayerStatsInfo2023Table.forEach((e) => e.isHighlighted = false)
      this.seasonArrayTable = this.nbaPlayerStatsInfo2023Table

      console.log(this.teamSeasons)
      this.teamTotalStats = await NflController.nflGetTeamStatTotals(this.teamId, 2024)
    }

    this.teamProps = []
    /* this.teamProps = await SportsBookController.
    console.log(this.teamProps)
    let numberOfBookIds = this.teamProps.map(x => x.bookId).filter((value, index, array) => array.indexOf(value) === index)
    if(numberOfBookIds.length > 1){
      //add if there is more than one game that day
    }
    else{
      let numberOfProps = this.teamProps.map(x => x.marketKey).filter((value, index, array) => array.indexOf(value) === index)
      for(let prop of numberOfProps){
        let filteredProp = this.teamProps.filter(e => e.marketKey == prop)
        this.teamPropArray.push(filteredProp)
      }
    } */

    //this.teamProps = await PlayerPropController.loadCurrentPlayerPropData(this.selectedSport, this.teamStats[0].playerName)
    
    /* let numberOfBookIds = this.teamProps.map(x => x.bookId).filter((value, index, array) => array.indexOf(value) === index)
    if(numberOfBookIds.length > 1){
      //add if there is more than one game that day
    }
    else{
      

    } */
  }

  /* async getAllPlayerInfo() {
    if (this.selectedSport == "NBA") {
      this.nbaAllPlayerInfo = await NbaController.nbaLoadAllPlayerInfo()
      this.filteredSearch = this.nbaAllPlayerInfo.filter((e) => e.playerName == this.searchName)

    }
    this.playerInfo = await PlayerInfoController.loadActivePlayerInfoBySport(this.selectedSport)
    
  } */

  loadNewPlayer(id: number, sport: string) {
    if(this.selectedSport != 'all'){
      this.destroyGraphs()
    }
    this.isNull = false
    this.router.navigate([`/teamStats/${sport}/${id}`])
    this.formArray = []  
  }

  loadFindHomeAwayFromGameId(gameId: string, teamName: string): string{
    //console.log(gameId)
    //console.log(teamName)
    return reusedFunctions.getHomeAwayFromGameId(gameId, teamName)
  }

  calculateMeanAndStd() {
    this.playerAverage = (this.seasonArray.map(t => t.points).reduce((acc, value) => acc + value, 0)) / this.seasonArray.length
    let summedData: number = 0
    this.seasonArray.forEach(e => summedData += (e.points - this.playerAverage) ** 2)
    summedData = summedData / this.seasonArray.length
    summedData = Math.sqrt(summedData)
    this.playerStd = summedData
  }
  totalNumberHighlighted: number = 0;
  isSearched: boolean = false;
  searchNumberSubmit() {

    this.isSearched = true;
    //for now we're going to make this just over and single stats
    this.totalNumberHighlighted = 0;
    // later we can add over or under and combined stats
    if(this.formArray.length > 0){
      for (let i = 0; i < this.seasonArrayTable.length; i++) {
        for (let j = 0; j < this.formArray.length; j++) {
  
          if(this.formArray[j].overUnder){
            if (this.seasonArrayTable[i][this.formArray[j].dataName] > this.formArray[j].number) {
              this.seasonArrayTable[i].isHighlighted = true
            }
            else {
              this.seasonArrayTable[i].isHighlighted = false
              break
            }
          }
          else{
            if (this.seasonArrayTable[i][this.formArray[j].dataName] < this.formArray[j].number) {
              this.seasonArrayTable[i].isHighlighted = true
            }
            else {
              this.seasonArrayTable[i].isHighlighted = false
              break
            }
          }
          
        }
      }
      for(let game of this.seasonArrayTable){
        if(game.isHighlighted){
          this.totalNumberHighlighted++;
        }
      }
    }
    
   
  }

  clearSearch() {
    this.seasonArrayTable.forEach((e) => {
      e.isHighlighted = false
    })
  }

  filterSearch() {
    if(this.isNull){
      if(this.searchName != ""){
        this.filteredSearch = this.allSportTeamList.filter((e) => e.teamNameFull.toLowerCase().includes(this.searchName.toLowerCase()))
        console.log(this.filteredSearch)
      }
      
    }
    else{
      this.filteredSearch = this.allSportTeamList.filter((e) => e.teamNameFull.toLowerCase().includes(this.searchName.toLowerCase()))
    }
    
  }

  setSearchEmpty() {
    this.searchName = this.teamName
  }

  addStatForm() {
    this.formArray.push({
      stat: "",
      dataName: '',
      overUnder: false,
      number: 0.5,
      id: this.formArray.length
    })
  }
  updateForm(form: statSearch, stat: any) {
    let changedForm = this.formArray.filter((e) => e.id == form.id)[0]
    changedForm.stat = stat.label
    changedForm.dataName = stat.dataName
  }

  deleteformArray(form: statSearch) {
    this.formArray = this.formArray.filter((e) => e != form)
    this.searchNumberSubmit()
    if(this.formArray.length ==0){
      this.isSearched = false;
    }
  }

  getTotalCost(stat: string) {
    var num = this.seasonArrayTable.map(t => t[stat]).reduce((acc, value) => acc + value, 0);
    return (num / this.seasonArrayTable.length).toFixed(2)
  }
  updateSeasonsDisplayed(season: number) {
    this.teamSeason = season

    this.seasonArrayTable = JSON.parse(JSON.stringify(this.teamStats.filter(e => e.season == this.teamSeason)))
    this.seasonArrayTable.reverse()
    this.seasonArray = this.teamStats.filter(e => e.season == this.teamSeason)

    this.seasonArrayTable.forEach((e) => e.isHighlighted = false)
    this.table.renderRows()
    this.reDrawLineGraph()
  }


  createChart() {
    var arrayOFpoints: any[] = []
    var dataPoint: string[] = []
    if(this.selectedSport == 'NBA'){
      var points: number[] = []
      var assists: number[] = []
      var rebounds: number[] = []
      var blocks: number[] = []
      var threes: number[] = []
      var doubleDoubles: number[] = []
  
      
      var index = 1
      this.seasonArray.forEach((e) => {
        points.push(e.points)
        assists.push(e.assists)
        rebounds.push(e.totReb)
        blocks.push(e.blocks)
        threes.push(e.tpm)
        doubleDoubles.push(e.doubleDouble)
  
        dataPoint.push(index.toString())
        index++
      })
      arrayOFpoints = [points, assists, rebounds, blocks, threes, doubleDoubles]
    }
    else if(this.selectedSport == 'MLB'){
      var hits: number[] = []
      var homeRuns: number[] = []
      var points: number[] = []
      var rbis: number[] = []
  
      var index = 1
      this.seasonArray.forEach((e) => {
        hits.push(e.totalHitsScored)
        homeRuns.push(e.totalHomeRunsScored)
        points.push(e.totalPointsScored)
        rbis.push(e.totalRbisScored)
  
        dataPoint.push(index.toString())
        index++
      })
      
      arrayOFpoints = [hits, homeRuns, points, rbis]
      
    }
    else if(this.selectedSport == 'NFL'){
      var points: number[] = []
      var rushYds: number[] = []
      var passYds: number[] = []
  
      var index = 1
      this.seasonArray.forEach((e) => {
        hits.push(e.totalHitsScored)
        homeRuns.push(e.totalHomeRunsScored)
        points.push(e.totalPointsScored)
        rbis.push(e.totalRbisScored)
  
        dataPoint.push(index.toString())
        index++
      })
      
      arrayOFpoints = [points, rushYds, passYds]
      
    }
    

    for (let i = 0; i < arrayOFpoints.length; i++) {
      this.fullDataset[i].data = arrayOFpoints[i]
    }

    var filteredDataSet: any[] = []
    this.fullDataset.forEach((e) => {
      if (e.showLine) {
        filteredDataSet.push(e)

      }
    })
    
    var finalDataSet: any[] = []
    var finalDataSetResult: any[] = []
    filteredDataSet.forEach((e) => {
      finalDataSet = finalDataSet.concat(e.data)
    })


    for (let i = 0; i < (finalDataSet.length / filteredDataSet.length); i++) {
      let sumIndex = 0
      let initial = true
      for (let j = 0; j < filteredDataSet.length; j++) {
        if (initial == true) {
          sumIndex += finalDataSet[i]
          initial = false
        }
        else {
          sumIndex += finalDataSet[i + (j * (finalDataSet.length / filteredDataSet.length))]
        }

      }
      finalDataSetResult.push(sumIndex)
    }


    var fullDisplayDataSet: any[] = []
    var stringOfPoints: string = ''
    var count = 0
    filteredDataSet.forEach((e) => {

      if (filteredDataSet.length == 1 || count == 0) {
        stringOfPoints += e.label
        count++
      }
      else { stringOfPoints += " + " + e.label }

    })

    fullDisplayDataSet = [{
      label: stringOfPoints,
      data: finalDataSetResult,
      backgroundColor: 'blue',
      showLine: true
    }]
    if (!this.isCombineStats) {
      fullDisplayDataSet = filteredDataSet
    }
    var annotationVal = 0
    finalDataSetResult.forEach(e => {
      annotationVal += e
    });
    annotationVal = annotationVal / finalDataSetResult.length
    var max: number = 0
    finalDataSetResult.forEach(e => {
      if (e > max) {
        max = e
      }
    })
    max = (max + 2)
    if (max.toString().includes(".")) {
      var maxNew = max.toString().split(".")
      max = parseInt(maxNew[0]) + 1
    }
    var annotationObj = {
      type: 'line',
      borderColor: 'black',
      borderDash: [6, 6],
      borderDashOffset: 0,
      borderWidth: 3,
      scaleID: 'y',
      label: {
        display: true,
        drawTime: 'beforeDatasetsDraw',
        callout: {
          display: true,
          borderColor: 'rgba(102, 102, 102, 0.5)',
          borderDash: [6, 6],
          borderWidth: 2,
          margin: 0
        },
        content: 'Average: ' + annotationVal.toFixed(2),

        position: 'center',
        xAdjust: 150,
        yAdjust: -100
      },
      value: annotationVal,
    }
    var annotation: any[] = []
    if (this.isCombineStats) {
      annotation.push(annotationObj)
    }
    else {
      filteredDataSet.forEach(e => {
        annotationVal = 0
        e.data.forEach((n: number) => annotationVal += n)
        annotationVal = annotationVal / e.data.length
        annotationObj = {
          type: 'line',
          borderColor: 'black',
          borderDash: [6, 6],
          borderDashOffset: 0,
          borderWidth: 3,
          scaleID: 'y',
          label: {
            display: true,
            drawTime: 'beforeDatasetsDraw',
            callout: {
              display: true,
              borderColor: 'rgba(102, 102, 102, 0.5)',
              borderDash: [6, 6],
              borderWidth: 2,
              margin: 0
            },
            content: 'Average: ' + annotationVal.toFixed(2),

            position: 'center',
            xAdjust: 150,
            yAdjust: -100
          },
          value: annotationVal,
        }
        annotation.push(annotationObj)
        annotationVal = 0
      })
    }





    this.chart = new Chart("lineChart", {

      type: 'line',

      data: {// values on X-Axis
        labels: dataPoint,
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
            min: 0,
            max: max
          }
        },
        maintainAspectRatio: false
      }

    });
  }

  createChart2() {
    var points: number[] = []
    var assists: number[] = []
    var rebounds: number[] = []
    var blocks: number[] = []
    var threes: number[] = []
    var doubleDoubles: number[] = []

    var dataPoint: number[] = []
    var pointsFinal: number[] = []
    var assistsFinal: number[] = []
    var reboundsFinal: number[] = []
    var blocksFinal: number[] = []
    var thressFinal: number[] = []
    var doubleDoublesFinal: number[] = []
    var combinedArrays: any[] = []

    var index = 1
    for (let i = 0; i < 100; i++) {
      dataPoint.push(i)
    }
    this.seasonArray.forEach((e) => {
      points.push(e.points)
      assists.push(e.assists)
      rebounds.push(e.totReb)
      blocks.push(e.blocks)
      threes.push(e.tpm)
      doubleDoubles.push(e.doubleDouble)

      //dataPoint.push(index)
      index++
    })


    var arrayOFunfiltered = [points, assists, rebounds, blocks, threes, doubleDoubles]
    for (let i = 0; i < 100; i++) {
      let num = points.filter((e) => e == i)
      pointsFinal.push(num.length)
      let num2 = assists.filter((e) => e == i)
      assistsFinal.push(num2.length)
      let num3 = rebounds.filter((e) => e == i)
      reboundsFinal.push(num3.length)
      let num4 = blocks.filter((e) => e == i)
      blocksFinal.push(num4.length)
      let num5 = threes.filter((e) => e == i)
      thressFinal.push(num5.length)
      let num6 = doubleDoubles.filter((e) => e == i)
      doubleDoublesFinal.push(num6.length)
    }
    var arrayOFpoints = [pointsFinal, assistsFinal, reboundsFinal, blocksFinal, thressFinal, doubleDoublesFinal]

    for (let i = 0; i < arrayOFpoints.length; i++) {
      this.fullDataset[i].data = arrayOFpoints[i]
      this.fullDataset[i].unfilteredData = arrayOFunfiltered[i]
    }

    var filteredDataSet: any[] = []
    this.fullDataset.forEach((e) => {
      if (e.showLine) {
        filteredDataSet.push(e)
        combinedArrays.push(e.unfilteredData)
      }
    })
    var combinedArrayFinal: any[] = []

    for (let i = 0; i < combinedArrays[0].length; i++) {
      let sum = 0
      for (let j = 0; j < combinedArrays.length; j++) {

        sum += combinedArrays[j][i]
      }
      combinedArrayFinal.push(sum)
    }
    var newFilteredData: any[] = []
    for (let i = 0; i < 100; i++) {
      let temp = combinedArrayFinal.filter((e) => e == i)
      newFilteredData.push(temp.length)
    }
    var stringOfPoints: string = ''
    var count = 0
    filteredDataSet.forEach((e) => {

      if (filteredDataSet.length == 1 || count == 0) {
        stringOfPoints += e.label
        count++
      }
      else { stringOfPoints += " + " + e.label }

    })
    if (this.isCombineStats) {
      filteredDataSet = [{
        label: stringOfPoints,
        data: newFilteredData,
        backgroundColor: 'blue',
        showLine: true
      }]
    }
    this.chart2 = new Chart("barChart", {
      type: 'bar',

      data: {// values on X-Axis
        labels: dataPoint,
        datasets: filteredDataSet
      },
      options: {
        datasets: {
          bar: {
            barPercentage: 1,
            barThickness: 'flex'
          }
        },
        scales: {
          y: {
            min: 0,
            max: 10
          }

        },
        plugins: {
          title: {
            display: true,
            text: 'Distrbution'
          },
        },

        maintainAspectRatio: false
      }

    });
  }

  createNormalDistChart() {
    var points: number[] = []
    var assists: number[] = []
    var rebounds: number[] = []
    var blocks: number[] = []
    var threes: number[] = []
    var doubleDoubles: number[] = []

    var dataPoint: number[] = []
    var pointsFinal: number[] = []
    var assistsFinal: number[] = []
    var reboundsFinal: number[] = []
    var blocksFinal: number[] = []
    var thressFinal: number[] = []
    var doubleDoublesFinal: number[] = []
    var combinedArrays: any[] = []

    var index = 1
    for (let i = 0; i < 100; i++) {
      dataPoint.push(i)
    }
    this.seasonArray.forEach((e) => {
      points.push(e.points)
      assists.push(e.assists)
      rebounds.push(e.totReb)
      blocks.push(e.blocks)
      threes.push(e.tpm)
      doubleDoubles.push(e.doubleDouble)

      //dataPoint.push(index)
      index++
    })


    var arrayOFunfiltered = [points, assists, rebounds, blocks, threes, doubleDoubles]
    for (let i = 0; i < 100; i++) {
      let num = points.filter((e) => e == i)
      pointsFinal.push(num.length)
      let num2 = assists.filter((e) => e == i)
      assistsFinal.push(num2.length)
      let num3 = rebounds.filter((e) => e == i)
      reboundsFinal.push(num3.length)
      let num4 = blocks.filter((e) => e == i)
      blocksFinal.push(num4.length)
      let num5 = threes.filter((e) => e == i)
      thressFinal.push(num5.length)
      let num6 = doubleDoubles.filter((e) => e == i)
      doubleDoublesFinal.push(num6.length)
    }
    var arrayOFpoints = [pointsFinal, assistsFinal, reboundsFinal, blocksFinal, thressFinal, doubleDoublesFinal]

    for (let i = 0; i < arrayOFpoints.length; i++) {
      this.fullDataset[i].data = arrayOFpoints[i]
      this.fullDataset[i].unfilteredData = arrayOFunfiltered[i]
    }

    var filteredDataSet: any[] = []
    this.fullDataset.forEach((e) => {
      if (e.showLine) {
        filteredDataSet.push(e)
        combinedArrays.push(e.unfilteredData)
      }
    })
    var combinedArrayFinal: any[] = []

    for (let i = 0; i < combinedArrays[0].length; i++) {
      let sum = 0
      for (let j = 0; j < combinedArrays.length; j++) {

        sum += combinedArrays[j][i]
      }
      combinedArrayFinal.push(sum)
    }
    combinedArrayFinal = [5, 5, 5, 5, 8, 8, 8, 8, 12, 12, 12, 12, 12, 12, 12, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 56, 56, 56, 56, 56, 56, 56, 62, 62, 62, 62, 65, 65]

    var newFilteredData: any[] = []
    for (let i = 0; i < 100; i++) {
      let temp = combinedArrayFinal.filter((e) => e == i)
      newFilteredData.push(temp.length)
    }
    var stringOfPoints: string = ''
    var count = 0
    filteredDataSet.forEach((e) => {

      if (filteredDataSet.length == 1 || count == 0) {
        stringOfPoints += e.label
        count++
      }
      else { stringOfPoints += " + " + e.label }

    })
    if (this.isCombineStats) {
      filteredDataSet = [{
        label: stringOfPoints,
        data: newFilteredData,
        backgroundColor: 'blue',
        showLine: true
      }]
    }
    this.chart3 = new Chart("NormalDistChart", {

      type: 'line',

      data: {// values on X-Axis
        labels: dataPoint,
        datasets: filteredDataSet,

      },
      options: {
        elements: {
          line: {
            tension: .4
          },
          point: {
            radius: 5
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Normal Distribution'
          },



        },

        maintainAspectRatio: false
      }

    });
  }


  reDrawLineGraph() {
    this.chart.destroy()
    //this.chart2.destroy()
    //this.chart3.destroy()
    this.createChart()
    //this.createChart2()
    //this.createNormalDistChart()
  }

  destroyGraphs(){
    this.chart.destroy()
    //this.chart2.destroy()
    //this.chart3.destroy()
  }






  async ngOnInit() {
    Chart.register(annotationPlugin);
    await this.initialize()
    //await this.loadData()
    
  }


}
