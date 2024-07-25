import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { PlayerProp } from 'src/app/player-prop';

@Component({
  selector: 'app-prop-checkout',
  templateUrl: './prop-checkout.component.html',
  styleUrls: ['./prop-checkout.component.scss']
})
export class PropCheckoutComponent implements OnChanges{
  
 @Input()
  listOfProps: any[] = []
@Input() exit: boolean= true;
@Output() length = new EventEmitter<any[]>();
@Output() exitSend = new EventEmitter<boolean>();
  value = 80;
  
  display(){
    console.log(this.listOfProps)
  }

  
  
  remove(p: any){
    p.isDisabled = false;
    delete p.stats;
    this.listOfProps = this.listOfProps.filter(item => item != p);
    this.length.emit(this.listOfProps)
  }
  exitModal(){
    
    this.exit = false;
    this.exitSend.emit(this.exit);
  }

  ngInit(){
    this.display()
  }

  overallProbability: number = 0
  calculateOverallProbability(){
    if(this.listOfProps.length == 1){
      this.overallProbability = this.listOfProps[0].propVariables.propPrice
    }
    else if(this.listOfProps.length > 1){
      //(100 / (150 + 100)) * 100
      let finalProb: number = 1;
      for(let prop of this.listOfProps){
        if(prop.propVariables.propPrice > 0){
          finalProb = finalProb * (100 / (prop.propVariables.propPrice + 100))
        }
        else if(prop.propVariables.propPrice < 0){
          //(300/(300+100)) * 100
          finalProb = finalProb * ((prop.propVariables.propPrice * -1) / ((prop.propVariables.propPrice * -1) + 100))
        }
        
      }
      //positive odds
      if(finalProb < .5){
      //(100 / (10 / 100)) - 100
      this.overallProbability = ((100 / ((finalProb * 100)/100)) -100)
      }
      //negative odds
      else{
        //(60 / (1 - (60/100))) * -1
        this.overallProbability = ((finalProb *100)/ (1 - ((finalProb * 100)/100))) * -1
      }
      
      
    }
  }
  overallChance: number = 0
  sameGameChance: number = 0
  displayPropChance(){
    let propOverall: number = 1;
    for(let prop of this.listOfProps){
      propOverall = propOverall * (prop.propVariables.totalWins / prop.propVariables.totalGames)
    }
    this.overallChance = propOverall
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateOverallProbability()
    this.displayPropChance()
  }
}
