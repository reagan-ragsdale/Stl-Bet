import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { nbaApiController } from '../ApiCalls/nbaApiCalls';
import { nhlApiController } from '../ApiCalls/nhlApiCalls';
import { draftKingsApiController } from '../ApiCalls/draftKingsApiCalls';
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
import { DbPlayerInfo } from '../../shared/dbTasks/DbPlayerInfo';
import { PlayerPropController } from 'src/shared/Controllers/PlayerPropController';
import { DbPlayerPropData } from 'src/shared/dbTasks/DbPlayerPropData';
import { reusedFunctions } from '../Services/reusedFunctions';
import { DBMlbPlayerGameStatTotals } from '../../shared/dbTasks/DbMlbPlayerGameStatTotals';
import { NflController } from 'src/shared/Controllers/NflController';
import { NhlController } from 'src/shared/Controllers/NhlController';


interface statSearch {
  stat: string;
  dataName: string;
  number: number;
  overUnder: boolean;
  id: number
}


@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.scss'],
  providers: [nhlApiController, draftKingsApiController],
})
export class PlayerStatsComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private nhlApiController: nhlApiController,
    //private draftKingsApiController: draftKingsApiController
  ) { }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    location.reload()
  }
  myControl = new FormControl('');
  //public displayedColumns: any[] = ["Game", "Date", "Points", "Assists", "Rebounds", "Blocks", "Threes"]
  //

  public playerName: string = ''
  public playerId: any = 0
  public selectedSport: any = ''
  public selectedStatSearchNumber: number = 0
  public filteredSearch: DbPlayerInfo[] = []
  public searchName: string = ''

  public chart: any;


  public chart2: any;
  public chart3: any

  displayedColumns: string[] = []
  displayedColumnsValues: any[] = []
  public displayedColumnsMlb: string[] = ["Game", "Date", "HR", "H", "TB", "RBI"]

  public displayedColumnsValuesMlb: any[] = [
    {
      name: 'Game',
      value: 'teamAgainstName'
    },
    {
      name: 'Date',
      value: 'gameDate'
    },
    {
      name: 'HR',
      value: 'batterHomeRuns'
    },
    {
      name: 'H',
      value: 'batterHits'
    },
    {
      name: 'TB',
      value: 'batterTotalBases'
    },
    {
      name: 'RBI',
      value: 'batterRbis'
    }
  ]
  public displayedColumnsNfl: string[] = ["Game", "Date", "Pass TD", 'Pass Completions', 'Rush TD', 'Rush Yds', 'Carries', "Rec TD", 'Rec Yds', 'Receptions', 'Ints Thrown']

  public displayedColumnsNhl: string[] = ["Game", "Date", "Points", 'Goals', 'Assists', 'Shots', 'Blocks']

  public displayedColumnsValuesNhl: any[] = [
    {
      name: 'Game',
      value: 'teamAgainstName'
    },
    {
      name: 'Date',
      value: 'gameDate'
    },
    {
      name: 'Points',
      value: 'points'
    },
    {
      name: 'Goals',
      value: 'goals'
    },
    {
      name: 'Assists',
      value: 'assists'
    },
    {
      name: 'Shots',
      value: 'shots'
    },
    {
      name: 'Blocks',
      value: 'blocks'
    }
  ]

  public displayedColumnsValuesNfl: any[] = [
    {
      name: 'Game',
      value: 'teamAgainstName'
    },
    {
      name: 'Date',
      value: 'gameDate'
    },
    {
      name: 'Pass TD',
      value: 'qbPassingTouchdowns'
    },
    {
      name: 'Pass Completions',
      value: 'qbCompletions'
    },
    {
      name: 'Rush TD',
      value: 'rushingTouchdowns'
    },
    {
      name: 'Rush Yds',
      value: 'rushingYards'
    },
    {
      name: 'Carries',
      value: 'rushingAttempts'
    },
    {
      name: 'Rec TD',
      value: 'receivingTouchdowns'
    },
    {
      name: 'Rec Yds',
      value: 'receivingYards'
    },
    {
      name: 'Receptions',
      value: 'receptions'
    },
    {
      name: 'Ints Thrown',
      value: 'qbInterceptions'
    }
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

  playerTotalStatColumns: string[] = []
  playerTotalDataSet: any[] = []
  public playerTotalStatColumnsMlb: string[] = ['Home Runs', 'Hits', 'Total Bases', 'RBIS', 'Runs']

  public playerTotalDataSetMlb: any[] = [

    {
      name: 'Home Runs',
      data: 'batterHomeRuns'
    },
    {
      name: 'Hits',
      data: 'batterHits'
    },
    {
      name: 'Total Bases',
      data: 'batterTotalBases'
    },
    {
      name: 'RBIS',
      data: 'batterRbis'
    },
    {
      name: 'Runs',
      data: 'batterRunsScored'
    }


  ]

  public playerTotalStatColumnsNfl: string[] = ['Pass TD', 'Pass Completions', 'Rush TD', 'Rush Yds', 'Carries', 'Rec TD', 'Rec Yds', 'Receptions', 'Ints Thrown']

  public playerTotalStatColumnsNhl: string[] = ['Points', 'Goals', 'Assists', 'Shots', 'Blocks']

  public playerTotalDataSetNfl: any[] = [

    {
      name: 'Pass TD',
      data: 'qbPassingTouchdowns'
    },
    {
      name: 'Pass Completions',
      data: 'qbCompletions'
    },
    {
      name: 'Rush TD',
      data: 'rushingTouchdowns'
    },
    {
      name: 'Rush Yds',
      data: 'rushingYards'
    },
    {
      name: 'Carries',
      data: 'rushingAttempts'
    },
    {
      name: 'Rec TD',
      data: 'receivingTouchdowns'
    },
    {
      name: 'Rec Yds',
      data: 'receivingYards'
    },
    {
      name: 'Receptions',
      data: 'receptions'
    },
    {
      name: 'Ints Thrown',
      data: 'qbInterceptions'
    }


  ]
  public playerTotalDataSetNhl: any[] = [

    {
      name: 'Points',
      data: 'points'
    },
    {
      name: 'Goals',
      data: 'goals'
    },
    {
      name: 'Assists',
      data: 'assists'
    },
    {
      name: 'Shots',
      data: 'shots'
    },
    {
      name: 'Blocks',
      data: 'blocks'
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

  public selectedSeasonPlayerStats: any[] = []

  //nba
  public distinctSeasons: number[] = []
  public playerSeasons: number[] = []
  public playerSeason: number = 2024
  public teamInfo: DbNbaTeamLogos[] = []

  @ViewChild(MatTable)
  table!: MatTable<any>;




  //all

  public playerInfo: DbPlayerInfo[] = []
  public selectedPlayer: DbPlayerInfo[] = []
  public playerStats: any[] = []
  public playerSeasonStats: any[] = []

  public playerProps: DbPlayerPropData[] = []
  public playerTotalStats: any[] = []


  async initialize() {
    this.route.paramMap.subscribe(async (params: { get: (arg0: string) => any; }) => {
      this.selectedSport = params.get('sport') == null ? 'all' : params.get('sport')
      this.playerId = params.get('id') == null ? 0 : params.get('id')
      this.router.navigate([`/playerStats/${this.selectedSport}/${this.playerId}`])
      await this.loadData()
    })
  }

  async loadData() {


    this.selectedSport = this.route.snapshot.paramMap.get('sport')
    this.playerId = this.route.snapshot.paramMap.get('id')
    await this.getPlayerInfo()
    this.createChart()






  }



  playerPropArray: any[] = []
  async getPlayerInfo() {
    //what to fetch for this screen
    //all stats for the player
    //player averages
    //player props

    if (this.selectedSport == 'MLB') {
      this.fullDataset = [
        {
          label: "Hits",
          data: [],
          backgroundColor: 'blue',
          showLine: true,
          dataName: 'batterHits'

        },
        {
          label: "Home Runs",
          data: [],
          backgroundColor: 'green',
          showLine: false,
          dataName: 'batterHomeRuns'
        },
        {
          label: "Total Bases",
          data: [],
          backgroundColor: 'red',
          showLine: false,
          dataName: 'batterTotalBases'

        },
        {
          label: "RBIS",
          data: [],
          backgroundColor: 'yellow',
          showLine: false,
          dataName: 'batterRbis'

        }
      ]
      this.displayedColumns = this.displayedColumnsMlb
      this.displayedColumnsValues = this.displayedColumnsValuesMlb
      this.playerTotalStatColumns = this.playerTotalStatColumnsMlb
      this.playerTotalDataSet = this.playerTotalDataSetMlb
    }
    else if (this.selectedSport == 'NFL') {
      this.fullDataset = [
        {
          label: "Pass TD",
          data: [],
          backgroundColor: 'blue',
          showLine: true,
          dataName: 'qbPassingTouchdowns'

        },
        {
          label: "Pass Yds",
          data: [],
          backgroundColor: 'yellow',
          showLine: false,
          dataName: 'qbPassingYards'

        },
        {
          label: "Completions",
          data: [],
          backgroundColor: 'blue',
          showLine: false,
          dataName: 'qbCompletions'

        },
        {
          label: "Rush TD",
          data: [],
          backgroundColor: 'green',
          showLine: false,
          dataName: 'rushingTouchdowns'
        },
        {
          label: "Rush Yds",
          data: [],
          backgroundColor: 'green',
          showLine: false,
          dataName: 'rushingYards'
        },
        {
          label: "Carries",
          data: [],
          backgroundColor: 'green',
          showLine: false,
          dataName: 'rushingAttempts'
        },
        {
          label: "Rec TD",
          data: [],
          backgroundColor: 'red',
          showLine: false,
          dataName: 'receivingTouchdowns'

        },
        {
          label: "Rec Yds",
          data: [],
          backgroundColor: 'red',
          showLine: false,
          dataName: 'receivingYards'

        },
        {
          label: "Receptions",
          data: [],
          backgroundColor: 'red',
          showLine: false,
          dataName: 'receptions'

        }
      ]
      this.displayedColumns = this.displayedColumnsNfl
      this.displayedColumnsValues = this.displayedColumnsValuesNfl
      this.playerTotalStatColumns = this.playerTotalStatColumnsNfl
      this.playerTotalDataSet = this.playerTotalDataSetNfl
    }
    else if (this.selectedSport == 'NHL') {
      let callArray = await Promise.all([NhlController.nhlGetAllPlayerStatsByPlayerIdAndSeason(this.playerId, 2024), NhlController.NhlGetPlayerGameStatAveragesByPlayerId(this.playerId)])
      this.playerStats = callArray[0]
      this.playerTotalStats = callArray[1]
      for (let i = 0; i < this.playerStats.length; i++) {
        this.playerStats[i].gameDate = reusedFunctions.convertGameDateToMonthDay(this.playerStats[i].gameDate)
      }
      this.distinctSeasons = this.playerStats.map(e => e.season).filter((value, index, array) => array.indexOf(value) === index)

      this.distinctSeasons.sort(function (a, b) {
        return a - b;
      });
      this.selectedSeasonPlayerStats = this.playerStats.filter(e => e.season == this.distinctSeasons[this.distinctSeasons.length - 1])



      this.fullDataset = [
        {
          label: "Points",
          data: [],
          backgroundColor: 'blue',
          showLine: true,
          dataName: 'points'

        },
        {
          label: "Goals",
          data: [],
          backgroundColor: 'yellow',
          showLine: false,
          dataName: 'goals'

        },
        {
          label: "Assists",
          data: [],
          backgroundColor: 'blue',
          showLine: false,
          dataName: 'assists'

        },
        {
          label: "Shots",
          data: [],
          backgroundColor: 'green',
          showLine: false,
          dataName: 'shots'
        },
        {
          label: "Blocks",
          data: [],
          backgroundColor: 'green',
          showLine: false,
          dataName: 'blocks'
        }
      ]
      this.displayedColumns = this.displayedColumnsNhl
      this.displayedColumnsValues = this.displayedColumnsValuesNhl
      this.playerTotalStatColumns = this.playerTotalStatColumnsNhl
      this.playerTotalDataSet = this.playerTotalDataSetNhl


    }

    this.playerInfo = await PlayerInfoController.loadActivePlayerInfoBySport(this.selectedSport)
    this.selectedPlayer = this.playerInfo.filter(e => e.playerId == this.playerId)
    this.playerName = this.selectedPlayer[0].playerName

    this.playerSeasons = []

    this.playerProps = []
    this.playerProps = await PlayerPropController.loadCurrentPlayerPropData(this.selectedSport, this.playerStats[0].playerName)
    console.log(this.playerProps)
    let numberOfBookIds = this.playerProps.map(x => x.bookId).filter((value, index, array) => array.indexOf(value) === index)
    if (numberOfBookIds.length > 1) {
      //add if there is more than one game that day
    }
    else {
      let numberOfProps = this.playerProps.map(x => x.marketKey).filter((value, index, array) => array.indexOf(value) === index)
      for (let prop of numberOfProps) {
        let filteredProp = this.playerProps.filter(e => e.marketKey == prop)
        this.playerPropArray.push(filteredProp)
      }
    }
    console.log(this.playerPropArray)
  }



  loadNewPlayer(id: number, sport: string) {
    this.destroyGraphs()
    this.router.navigate([`/playerStats/${sport}/${id}`])
    this.formArray = []
  }



  totalNumberHighlighted: number = 0;
  isSearched: boolean = false;
  searchNumberSubmit() {
    this.isSearched = true;
    //for now we're going to make this just over and single stats
    this.totalNumberHighlighted = 0;
    // later we can add over or under and combined stats
    if (this.formArray.length > 0) {
      for (let i = 0; i < this.selectedSeasonPlayerStats.length; i++) {
        for (let j = 0; j < this.formArray.length; j++) {

          if (this.formArray[j].overUnder) {
            if (this.selectedSeasonPlayerStats[i][this.formArray[j].dataName] > this.formArray[j].number) {
              this.selectedSeasonPlayerStats[i].isHighlighted = true
            }
            else {
              this.selectedSeasonPlayerStats[i].isHighlighted = false
              break
            }
          }
          else {
            if (this.selectedSeasonPlayerStats[i][this.formArray[j].dataName] < this.formArray[j].number) {
              this.selectedSeasonPlayerStats[i].isHighlighted = true
            }
            else {
              this.selectedSeasonPlayerStats[i].isHighlighted = false
              break
            }
          }

        }
      }
      for (let game of this.selectedSeasonPlayerStats) {
        if (game.isHighlighted) {
          this.totalNumberHighlighted++;
        }
      }
    }




  }

  clearSearch() {
    this.selectedSeasonPlayerStats.forEach((e) => {
      e.isHighlighted = false
    })
  }

  filterSearch() {
    this.filteredSearch = this.playerInfo.filter((e) => e.playerName.toLowerCase().includes(this.searchName.toLowerCase()))


  }



  addStatForm() {
    if (this.formArray.length < this.fullDataset.length) {
      this.formArray.push({
        stat: "",
        dataName: '',
        number: 0.5,
        overUnder: false,
        id: this.formArray.length
      })
    }

  }
  updateForm(form: statSearch, stat: any) {
    let changedForm = this.formArray.filter((e) => e.id == form.id)[0]
    changedForm.stat = stat.label
    changedForm.dataName = stat.dataName
  }

  deleteformArray(form: statSearch) {
    this.formArray = this.formArray.filter((e) => e != form)
    this.searchNumberSubmit()
    if (this.formArray.length == 0) {
      this.isSearched = false;
    }
  }


  updateSeasonsDisplayed(season: number) {
    this.playerSeason = season

    this.selectedSeasonPlayerStats = JSON.parse(JSON.stringify(this.playerStats.filter(e => e.season == this.playerSeason)))
    this.selectedSeasonPlayerStats.reverse()
    this.selectedSeasonPlayerStats = this.playerStats.filter(e => e.season == this.playerSeason)

    this.selectedSeasonPlayerStats.forEach((e) => e.isHighlighted = false)
    this.table.renderRows()
    this.reDrawLineGraph()
  }


  createChart() {
    var arrayOFpoints: any[] = []
    var dataPoint: string[] = []
    if (this.selectedSport == 'NBA') {
      var points: number[] = []
      var assists: number[] = []
      var rebounds: number[] = []
      var blocks: number[] = []
      var threes: number[] = []
      var doubleDoubles: number[] = []


      var index = 1
      this.selectedSeasonPlayerStats.forEach((e) => {
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
    else if (this.selectedSport == 'MLB') {
      var hits: number[] = []
      var homeRuns: number[] = []
      var totalBases: number[] = []
      var rbis: number[] = []

      var index = 1
      this.selectedSeasonPlayerStats.forEach((e) => {
        hits.push(e.batterHits)
        homeRuns.push(e.batterHomeRuns)
        totalBases.push(e.batterTotalBases)
        rbis.push(e.batterRbis)

        dataPoint.push(index.toString())
        index++
      })

      arrayOFpoints = [hits, homeRuns, totalBases, rbis]

    }
    else if (this.selectedSport == 'NFL') {
      var passTd: number[] = []
      var passYds: number[] = []
      var rushingTd: number[] = []
      var recTd: number[] = []
      var rushYds: number[] = []
      var recYds: number[] = []
      var carries: number[] = []
      var completions: number[] = []
      var receptions: number[] = []

      var index = 1
      this.selectedSeasonPlayerStats.forEach((e) => {
        rushingTd.push(e.rushingTouchdowns)
        recTd.push(e.receivingTouchdowns)
        rushYds.push(e.rushingYards)
        recYds.push(e.receivingYards)
        passTd.push(e.qbPassingTouchdowns)
        carries.push(e.rushingAttempts)
        completions.push(e.qbCompletions)
        receptions.push(e.receptions)
        passYds.push(e.qbPassingYards)


        dataPoint.push(index.toString())
        index++
      })

      arrayOFpoints = [passTd, passYds, completions, rushingTd, rushYds, carries, recTd, recYds, receptions]
    }
    else if (this.selectedSport == 'NHL') {
      var points: number[] = []
      var goals: number[] = []
      var assists: number[] = []
      var shots: number[] = []
      var blocks: number[] = []

      var index = 1
      this.selectedSeasonPlayerStats.forEach((e) => {
        points.push(e.points)
        goals.push(e.goals)
        assists.push(e.assists)
        shots.push(e.shots)
        blocks.push(e.blocks)


        dataPoint.push(index.toString())
        index++
      })

      arrayOFpoints = [points, goals, assists, shots, blocks]
    }

    console.log('things below')
    console.log(arrayOFpoints)
    console.log(this.fullDataset)
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
      //backgroundColor: 'blue',
      showLine: true,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true, // This makes the area under the line filled with color
      tension: 0.4, // Smooth curve
      pointBackgroundColor: 'rgb(75, 192, 192)', // Point color
      pointBorderColor: '#fff', // Point border color
      pointBorderWidth: 3, // Point border width
      pointRadius: 5, // Point size
    }]
    if (!this.isCombineStats) {
      fullDisplayDataSet = [{data: filteredDataSet,showLine: true,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true, // This makes the area under the line filled with color
        tension: 0.4, // Smooth curve
        pointBackgroundColor: 'rgb(75, 192, 192)', // Point color
        pointBorderColor: '#fff', // Point border color
        pointBorderWidth: 3, // Point border width
        pointRadius: 5, // Point size}]
      //filteredDataSet
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
    max = (max + (max / 4))
    if (max.toString().includes(".")) {
      var maxNew = max.toString().split(".")
      max = parseInt(maxNew[0]) + 1
    }
    var annotationObj = {
      type: 'line',
      borderColor: 'rgb(75, 192, 192)',
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
          borderColor: 'rgb(75, 192, 192)',
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

  /*   borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true, // This makes the area under the line filled with color
          tension: 0.4, // Smooth curve
          pointBackgroundColor: 'rgb(75, 192, 192)', // Point color
          pointBorderColor: '#fff', // Point border color
          pointBorderWidth: 3, // Point border width
          pointRadius: 5, // Point size}], */




    this.chart = new Chart("lineChart", {

      type: 'line',

      data: {// values on X-Axis
        labels: dataPoint,
        datasets: fullDisplayDataSet
      },
      options: {
        elements: {
          point: {
            radius: 3,
            borderWidth: 3,
            borderColor: '#fff',
            backgroundColor: 'rgb(75, 192, 192)'

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
            max: max,
            grid: {
              display: false // Hides grid lines on the y-axis
            }
          },
          x: {
            grid: {
              display: false // Hides grid lines on the y-axis
            }
          }
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

  destroyGraphs() {
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
