import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';
import { Chart } from 'chart.js';
import { DbGameBookData } from '../../../shared/dbTasks/DbGameBookData';
import annotationPlugin from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-prop-trend',
  templateUrl: './prop-trend.component.html',
  styleUrls: ['./prop-trend.component.scss']
})
export class PropTrendComponent implements OnChanges {

  @Input()
  trendData: any[] = []
  @Input() exit: boolean = true;
  @Output() length = new EventEmitter<any[]>();
  @Output() exitSend = new EventEmitter<boolean>();
  value = 80;


  propTrendChart: any;
  
  exitModal() {
    this.propTrendChart.destroy()
    this.exit = false;
    this.exitSend.emit(this.exit);
  }

  createChart(propHistory: DbGameBookData[], marketKey: string) {
    var historyOfProp: number[] = []




    var dataPoint: string[] = []
    var index = 1
    if (marketKey == 'h2h') {
      propHistory.forEach((e) => {
        historyOfProp.push(e.price)
        if (e.createdAt) {
          dataPoint.push("f")
        }

      })
    }
    /* else if (this.selectedPropHistoryName == 'spreads' || this.selectedPropHistoryName == 'totals') {
      this.propHistory.forEach((e) => {
        historyOfProp.push(e.point)
        if (e.createdAt) {
          dataPoint.push("h")
          //dataPoint.push(e.createdAt.toString())
        }

      })
    } */
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

    if (marketKey== 'h2h') {
      min = min - 10
      max = max + 10
    }
    else if (marketKey == 'spreads') {
      min = min - 1
      max = max + 1
    }
    this.propTrendChart = new Chart('propCanvas', {

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



  ngOnChanges(changes: SimpleChanges): void {
   this.createChart(this.trendData[0], this.trendData[1]);
  }

  ngOnInit(){
    Chart.register(annotationPlugin);
  }
}
