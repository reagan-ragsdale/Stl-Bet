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
import { filterHelper } from 'remult/src/filter/filter-interfaces';
import { Observable } from 'rxjs';
import { DbNhlPlayerInfo } from 'src/shared/dbTasks/DbNhlPlayerInfo';
import { DbNhlPlayerGameStats } from 'src/shared/dbTasks/DbNhlPlayerGameStats';
import { NhlPlayerGameStatsController } from 'src/shared/Controllers/NhlPlayerGameStatsController';
import { NhlPlayerInfoController } from 'src/shared/Controllers/NhlPlayerInfoController';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { DbNbaTeamLogos } from 'src/shared/dbTasks/DbNbaTeamLogos';
import { MlbController } from 'src/shared/Controllers/MlbController';


interface statSearch {
  stat: string;
  dataName: string;
  number: number;
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
  public displayedColumns = ["Game", "Date", "Points", "Assists", "Rebounds", "Blocks", "Threes"]
  //

  public playerName: string = ''
  public playerId: any = 0
  public selectedSport: any = ''
  public selectedStatSearchNumber: number = 0
  public filteredSearch: any[] = []
  public searchName: string = ''
  playerAverage: number = 0
  playerStd: number = 0

  public chart: any;


  public chart2: any;
  public chart3: any

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
  public playerSeasons: string[] = []
  public playerSeason: string = '2023'
  public teamInfo: DbNbaTeamLogos[] = []

  @ViewChild(MatTable)
  table!: MatTable<any>;

  //nhl
  public nhlPlayerInfo: DbNhlPlayerInfo[] = []
  public nhlPlayerStatsInfo2022: DbNhlPlayerGameStats[] = []
  public nhlPlayerStatsInfo2023: DbNhlPlayerGameStats[] = []
  public nhlAllPlayerInfo: DbNhlPlayerInfo[] = []


  //all
  public isNull: boolean = false
  public allSportPlayerList: any[] = []


  async loadData() {
    if (this.route.snapshot.paramMap.get('sport') != null && this.route.snapshot.paramMap.get('id') != null) {
      this.selectedSport = this.route.snapshot.paramMap.get('sport')
      this.playerId = this.route.snapshot.paramMap.get('id')
      await this.getPlayerInfo()
      await this.getAllPlayerInfo()
      this.calculateMeanAndStd()
    }
    else if (this.route.snapshot.paramMap.get('sport') == null && this.route.snapshot.paramMap.get('id') == null) {
      this.selectedSport = "all"
      this.playerId = 0
      this.isNull = true
      await this.getAllSportPlayers()
    }




  }

  async getAllSportPlayers(){
    this.allSportPlayerList.concat(await MlbController.mlbGetActivePlayerInfo())
    this.allSportPlayerList.concat(await NbaController.nbaLoadAllPlayerInfo())
    this.searchName = ""
  }

  async getPlayerInfo() {
    this.playerSeasons = []
    if (this.selectedSport == "NBA") {
      this.selectedStatSearchNumber = 0
      this.nbaPlayerInfo = await NbaController.nbaLoadPlayerInfoFromId(this.playerId)
      this.playerName = this.nbaPlayerInfo[0].playerName
      this.nbaPlayerStatsInfo2022 = await NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(this.playerId, 2022)
      this.nbaPlayerStatsInfo2023 = await NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(this.playerId, 2023)
      this.nbaPlayerStatsInfo2023TableTemp = structuredClone(this.nbaPlayerStatsInfo2023)
      this.nbaPlayerStatsInfo2023Table = this.nbaPlayerStatsInfo2023TableTemp.reverse()
      this.nbaPlayerStatsInfo2023Table.forEach((e) => e.isHighlighted = false)
      this.nbaPlayerStatsInfo2022TableTemp = structuredClone(this.nbaPlayerStatsInfo2022)
      this.nbaPlayerStatsInfo2022Table = this.nbaPlayerStatsInfo2022TableTemp.reverse()
      this.nbaPlayerStatsInfo2022Table.forEach((e) => e.isHighlighted = false)
      this.searchName = this.playerName
      this.playerSeasons.push("2023")
      if (this.nbaPlayerStatsInfo2022.length > 1) {
        this.playerSeasons.push("2022")
      }
      this.seasonArray = this.nbaPlayerStatsInfo2023
      this.seasonArrayTable = this.nbaPlayerStatsInfo2023Table
      this.teamInfo = await NbaController.nbaGetLogoFromTeamId(this.nbaPlayerInfo[0].teamId)





    }
    if (this.selectedSport == "NHL") {
      this.nhlPlayerInfo = await NhlPlayerInfoController.nhlLoadPlayerInfoFromId(this.playerId)
      this.playerName = this.nbaPlayerInfo[0].playerName
      this.nbaPlayerStatsInfo2022 = await NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(this.playerId, 2022)
      this.nbaPlayerStatsInfo2023 = await NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(this.playerId, 2023)
    }
  }

  async getAllPlayerInfo() {
    if (this.selectedSport == "NBA") {
      this.nbaAllPlayerInfo = await NbaController.nbaLoadAllPlayerInfo()
      this.filteredSearch = this.nbaAllPlayerInfo.filter((e) => e.playerName == this.searchName)

    }
  }

  async loadNewPlayer(id: number, name: string) {
    this.playerId = id
    await this.getPlayerInfo()
    this.reDrawLineGraph()
    this.formArray = []
  }

  calculateMeanAndStd() {
    this.playerAverage = (this.seasonArray.map(t => t.points).reduce((acc, value) => acc + value, 0)) / this.seasonArray.length
    let summedData: number = 0
    this.seasonArray.forEach(e => summedData += (e.points - this.playerAverage) ** 2)
    summedData = summedData / this.seasonArray.length
    summedData = Math.sqrt(summedData)
    this.playerStd = summedData
  }

  searchNumberSubmit() {
    //for now we're going to make this just over and single stats

    // later we can add over or under and combined stats
    for (let i = 0; i < this.seasonArrayTable.length; i++) {
      for (let j = 0; j < this.formArray.length; j++) {

        if (this.seasonArrayTable[i][this.formArray[j].dataName] > this.formArray[j].number) {
          this.seasonArrayTable[i].isHighlighted = true
        }
        else {
          this.seasonArrayTable[i].isHighlighted = false
          break
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
    this.filteredSearch = this.nbaAllPlayerInfo.filter((e) => e.playerName.toLowerCase().includes(this.searchName.toLowerCase()))
  }

  setSearchEmpty() {
    this.searchName = this.playerName
  }

  addStatForm() {
    this.formArray.push({
      stat: "",
      dataName: '',
      number: 0,
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
  }

  getTotalCost(stat: string) {
    var num = this.seasonArrayTable.map(t => t[stat]).reduce((acc, value) => acc + value, 0);
    return (num / this.seasonArrayTable.length).toFixed(2)
  }
  updateSeasonsDisplayed(season: string) {
    this.playerSeason = season
    if (this.playerSeason == "2023") {
      this.seasonArray = this.nbaPlayerStatsInfo2023
      this.seasonArrayTable = this.nbaPlayerStatsInfo2023Table
    }
    else if (this.playerSeason == "2022") {
      this.seasonArray = this.nbaPlayerStatsInfo2022
      this.seasonArrayTable = this.nbaPlayerStatsInfo2022Table
    }
    this.table.renderRows()
    this.reDrawLineGraph()
  }


  createChart() {
    var points: number[] = []
    var assists: number[] = []
    var rebounds: number[] = []
    var blocks: number[] = []
    var threes: number[] = []
    var doubleDoubles: number[] = []

    var dataPoint: string[] = []
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
    var arrayOFpoints = [points, assists, rebounds, blocks, threes, doubleDoubles]

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
    max = (max + (max / 2))
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
            radius: 5
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
    this.chart2.destroy()
    this.chart3.destroy()
    this.createChart()
    this.createChart2()
    this.createNormalDistChart()
  }






  async ngOnInit() {
    Chart.register(annotationPlugin);
    await this.loadData()
    this.createChart()
    this.createChart2()
    this.createNormalDistChart()
  }

}
