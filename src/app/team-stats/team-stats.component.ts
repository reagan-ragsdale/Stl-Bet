import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { DbTeamInfo } from '../../shared/dbTasks/DBTeamInfo';
import { TeamInfoController } from '../../shared/Controllers/TeamInfoController';
import { DbGameBookData } from '../../shared/dbTasks/DbGameBookData';
import { sportController } from '../Services/sportController';
import { reusedFunctions } from '../Services/reusedFunctions';
import { SharedCaching } from '../Services/shared-caching';



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
    private route: ActivatedRoute,
    private sharedCache: SharedCaching
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


  displayedColumns: string[] = []
  displayedColumnsValues: any[] = []

  public displayedColumnsMlb: string[] = ["Game", "Date", "HR", "H", "RBI"]
  public displayedColumnsNfl: string[] = ["Game", "Date", "Points", "Rush Yds", "Pass Yds"]
  public displayedColumnsNba: string[] = ["Game", "Date", "Points"]
  public displayedColumnsNhl: string[] = ["Game", "Date", "Points"]

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
      value: 'totalHomeRunsScored'
    },
    {
      name: 'H',
      value: 'totalHitsScored'
    },
    {
      name: 'RBI',
      value: 'totalRbisScored'
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
      name: 'Points',
      value: 'pointsScoredOverall'
    },
    {
      name: 'Rush Yds',
      value: 'totalRushingYards'
    },
    {
      name: 'Pass Yds',
      value: 'totalPassingYards'
    }
  ]
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
      value: 'pointsScoredOverall'
    }
  ]
  public displayedColumnsValuesNba: any[] = [
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
      value: 'pointsScoredOverall'
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

  teamTotalStatColumns: string[] = []

  public teamTotalStatColumnsMlb: string[] = ['Home Runs', 'Hits', 'Points', 'Rbis']
  public teamTotalStatColumnsNfl: string[] = ['Pts Scored', 'Pts Allowed', '1st Qtr Pts Scored', '1st Qtr Pts Allowed', '2nd Qtr Pts Scored', '2nd Qtr Pts Allowed', '3rd Qtr Pts Scored', '3rd Qtr Pts Allowed', '4th Qtr Pts Scored', '4th Qtr Pts Allowed', 'Total Yds', 'Total Yds Allowed', 'Rush Yds', 'Rush Yds Allowed', 'Rush Attempts', 'Pass Yds', 'Pass Yds Allowed', 'Ints Thrown', 'Ints Caught']


  teamTotalDataSet: any[] = []

  public teamTotalDataSetMlb: any[] = [

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
  public teamTotalDataSetNfl: any[] = [

    {
      name: 'Pts Scored',
      data: 'pointsScoredOverall'
    },
    {
      name: 'Pts Allowed',
      data: 'pointsAllowedOverall'
    },
    {
      name: '1st Qtr Pts Scored',
      data: 'pointsScoredFirstQuarter'
    },
    {
      name: '1st Qtr Pts Allowed',
      data: 'pointsAllowedFirstQuarter'
    },
    {
      name: '2nd Qtr Pts Scored',
      data: 'pointsScoredSecondQuarter'
    },
    {
      name: '2nd Qtr Pts Allowed',
      data: 'pointsAllowedSecondQuarter'
    },
    {
      name: '3rd Qtr Pts Scored',
      data: 'pointsScoredThirdQuarter'
    },
    {
      name: '3rd Qtr Pts Allowed',
      data: 'pointsAllowedThirdQuarter'
    },
    {
      name: '4th Qtr Pts Scored',
      data: 'pointsScoredFourthQuarter'
    },
    {
      name: '4th Qtr Pts Allowed',
      data: 'pointsAllowedFourthQuarter'
    },
    {
      name: 'Total Yds',
      data: 'totalYards'
    },
    {
      name: 'Total Yds Allowed',
      data: 'totalYardsAllowed'
    },
    {
      name: 'Rush Yds',
      data: 'totalRushingYards'
    },
    {
      name: 'Rush Yds Allowed',
      data: 'totalRushingYardsAllowed'
    },
    {
      name: 'Rush Attempts',
      data: 'totalRushingAttempts'
    },
    {
      name: 'Pass Yds',
      data: 'totalPassingYards'
    },
    {
      name: 'Pass Yds Allowed',
      data: 'totalPassingYardsAllowed'
    },
    {
      name: 'Ints Thrown',
      data: 'interceptionsThrown'
    },
    {
      name: 'Ints Caught',
      data: 'interceptionsCaught'
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



  @ViewChild(MatTable)
  table!: MatTable<any>;
  public distinctSeasons: number[] = []
  public selectedSeasonTeamStats: any[] = []

  public teamInfo: DbTeamInfo | null = null
  public selectedTeam: DbTeamInfo | null = null
  public teamStats: any[] = []
  public teamSeasonStats: any[] = []

  public teamProps: DbGameBookData[] = []
  public teamTotalStats: any[] = []
  teamSeason: number = 0



  async initialize() {
    this.sharedCache.currentTeamInfo.subscribe( data => {
      if (data) {
        this.selectedTeam = data
      }
      else{
        this.route.paramMap.subscribe(async (params: { get: (arg0: string) => any; }) => {
          this.selectedSport = params.get('team')
          this.teamId = params.get('id')
          this.router.navigate([`/teamStats/${this.selectedSport}/${this.teamId}`])
          let teamInfoNew = await TeamInfoController.getTeamInfo(this.selectedSport, this.teamId)
          this.teamInfo = teamInfoNew[0]
          
        })
      }
    })
    await this.loadData()
    
  }


  async loadData() {
    await this.getTeamInfo()
    this.createChart()
  }


  teamPropArray: any[] = []
  async getTeamInfo() {
    let playerCall = await sportController.getTeamStatScreenInfo(this.selectedSport, this.teamId)
    this.teamStats = playerCall[0]
    this.teamTotalStats = playerCall[1]

    for (let i = 0; i < this.teamStats.length; i++) {
      this.teamStats[i].gameDate = reusedFunctions.convertGameDateToMonthDay(this.teamStats[i].gameDate)
    }
    this.distinctSeasons = this.teamStats.map(e => e.season).filter((value, index, array) => array.indexOf(value) === index)

    this.distinctSeasons.sort(function (a, b) {
      return a - b;
    });
    this.selectedSeasonTeamStats = this.teamStats.filter(e => e.season == this.distinctSeasons[this.distinctSeasons.length - 1])
    this.teamSeason = this.distinctSeasons[0]
    if (this.selectedSport == 'MLB') {
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
      this.displayedColumns = this.displayedColumnsMlb
      this.displayedColumnsValues = this.displayedColumnsValuesMlb
      this.teamTotalDataSet = this.teamTotalDataSetMlb
      this.teamTotalStatColumns = this.teamTotalStatColumnsMlb

    }
    else if (this.selectedSport == 'NFL') {
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
      this.displayedColumns = this.displayedColumnsNfl
      this.displayedColumnsValues = this.displayedColumnsValuesNfl
      this.teamTotalDataSet = this.teamTotalDataSetNfl
      this.teamTotalStatColumns = this.teamTotalStatColumnsNfl
    }
    else if (this.selectedSport == "NBA") {
      this.fullDataset = [
        {
          label: "Points",
          data: [],
          backgroundColor: 'blue',
          showLine: true,
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
          dataName: 'rebounds'
        },
        {
          label: "Threes",
          data: [],
          backgroundColor: 'red',
          showLine: false,
          dataName: 'threes'
        }
      ]
      this.displayedColumns = this.displayedColumnsNba
      this.displayedColumnsValues = this.displayedColumnsValuesNba
      //this.teamTotalDataSet = this.teamTotalDataSetNba
      //this.teamTotalStatColumns = this.teamTotalStatColumnsNba
    }
    else if (this.selectedSport == "NHL") {
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
      this.displayedColumns = this.displayedColumnsNhl
      this.displayedColumnsValues = this.displayedColumnsValuesNhl
      //this.teamTotalDataSet = this.teamTotalDataSetNhl
      //this.teamTotalStatColumns = this.teamTotalStatColumnsNhl
    }

    this.teamProps = []

  }








  totalNumberHighlighted: number = 0;
  isSearched: boolean = false;
  searchNumberSubmit() {

    this.isSearched = true;
    //for now we're going to make this just over and single stats
    this.totalNumberHighlighted = 0;
    // later we can add over or under and combined stats
    if (this.formArray.length > 0) {
      for (let i = 0; i < this.selectedSeasonTeamStats.length; i++) {
        for (let j = 0; j < this.formArray.length; j++) {

          if (this.formArray[j].overUnder) {
            if (this.selectedSeasonTeamStats[i][this.formArray[j].dataName] > this.formArray[j].number) {
              this.selectedSeasonTeamStats[i].isHighlighted = true
            }
            else {
              this.selectedSeasonTeamStats[i].isHighlighted = false
              break
            }
          }
          else {
            if (this.selectedSeasonTeamStats[i][this.formArray[j].dataName] < this.formArray[j].number) {
              this.selectedSeasonTeamStats[i].isHighlighted = true
            }
            else {
              this.selectedSeasonTeamStats[i].isHighlighted = false
              break
            }
          }

        }
      }
      for (let game of this.selectedSeasonTeamStats) {
        if (game.isHighlighted) {
          this.totalNumberHighlighted++;
        }
      }
    }


  }

  clearSearch() {
    this.selectedSeasonTeamStats.forEach((e) => {
      e.isHighlighted = false
    })
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
    if (this.formArray.length == 0) {
      this.isSearched = false;
    }
  }
  updateSeasonsDisplayed(season: number){
    this.teamSeason = season
    
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
      this.selectedSeasonTeamStats.forEach((e) => {
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
      var points: number[] = []
      var rbis: number[] = []

      var index = 1
      this.selectedSeasonTeamStats.forEach((e) => {
        hits.push(e.totalHitsScored)
        homeRuns.push(e.totalHomeRunsScored)
        points.push(e.totalPointsScored)
        rbis.push(e.totalRbisScored)

        dataPoint.push(index.toString())
        index++
      })

      arrayOFpoints = [hits, homeRuns, points, rbis]

    }
    else if (this.selectedSport == 'NFL') {
      var points: number[] = []
      var rushYds: number[] = []
      var passYds: number[] = []

      var index = 1
      this.selectedSeasonTeamStats.forEach((e) => {
        points.push(e.pointsScoredOverall)
        rushYds.push(e.totalRushingYards)
        passYds.push(e.totalPassingYards)

        dataPoint.push(index.toString())
        index++
      })

      arrayOFpoints = [points, rushYds, passYds]

    }
    else if (this.selectedSport == 'NHL') {
      var points: number[] = []

      var index = 1
      this.selectedSeasonTeamStats.forEach((e) => {
        points.push(e.pointsScoredOverall)

        dataPoint.push(index.toString())
        index++
      })

      arrayOFpoints = [points]

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
    max = (max + (max / 4))
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
