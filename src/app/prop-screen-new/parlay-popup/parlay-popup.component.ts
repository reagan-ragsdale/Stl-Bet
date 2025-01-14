import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import cookieSession from 'cookie-session';

@Component({
  selector: 'app-parlay-popup',
  templateUrl: './parlay-popup.component.html',
  styleUrls: ['./parlay-popup.component.scss']
})
export class ParlayPopupComponent implements OnChanges{

  
  @Input()
  listOfProps: any[] = []
  @Input() exit: boolean = true;
  @Output() length = new EventEmitter<any[]>();
  @Output() exitSend = new EventEmitter<boolean>();
  value = 80;

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

  display() {
  }
  panelOpenState: boolean = false;
  overallProbability: number = 0
  overallChance = 1
  noGamesPlayedTogether = true
  sameGameChance = 1
  isSameGameTeam = false
  noGamesVsTeam = true
  teamSameGameChance = 1


  remove(prop: any){
    prop.isDisabled = false;
    this.listOfProps = this.listOfProps.filter(item => item != prop);
    this.length.emit(this.listOfProps)
  }
  isTeamTruePlayerFalse(prop: any): boolean{
    if(Object.hasOwn(prop, 'gameBookData')) return true
    
    return false
    
  }
  getMarketKey(marketKey: string): string{
    return this.listOfTeamProps[marketKey]
  }
  getSpecificBookDataFromProp(prop: any, key:string){
    if(Object.hasOwn(prop, 'gameBookData')){
      return prop.gameBookData[key]
    }
    else{
      return prop.playerBookData[key]
    }
  }

  calculateChance(){
    this.overallChance = 1
    this.sameGameChance = 1
    this.teamSameGameChance = 1
    if(this.listOfProps.length == 1){
      this.overallChance = this.listOfProps[0].overallChance
    }
    else if(this.listOfProps.length > 1){
      let separateTeams = false
      let listOfTeams: string[] = []
      let listOfPropsDistinctGameIds: any[] = []
      for(let i = 0; i < this.listOfProps.length; i++){
        this.overallChance *= this.listOfProps[i].overallChance
        let listOfGameIds = this.isTeamTruePlayerFalse(this.listOfProps[i]) ? this.listOfProps[i].teamStats.map((e: { gameId: string; }) => e.gameId) : this.listOfProps[i].playerStats.map((e: { gameId: string; }) => e.gameId)
        listOfPropsDistinctGameIds.push(listOfGameIds)
        if(!listOfTeams.includes(this.listOfProps[i].teamName)){
          listOfTeams.push(this.listOfProps[i].teamName)
        }
      }
      if(listOfTeams.length > 1){
        separateTeams = true
      }
      let commonGameIds = listOfPropsDistinctGameIds.reduce((p,c) => p.filter((e: any) => c.includes(e)));
      if(commonGameIds.length > 0){
        this.noGamesPlayedTogether = false
        let sameGameWins = 0
        for(let i = 0; i < commonGameIds.length; i++){
          let arrayOfResults: string[] = []
          for(let j = 0; j < this.listOfProps.length; j++){
            arrayOfResults.push(this.listOfProps[j].fullGameLog.filter((e: { gameId: any; }) => e.gameId == commonGameIds[i])[0].result)
          }
          if(!arrayOfResults.includes('L')){
            sameGameWins++
          }
        }
        this.sameGameChance = sameGameWins / commonGameIds.length
      }
      
      
      if(!separateTeams){
        this.isSameGameTeam = true
        let arrayOfHasPlayedOtherTeam = []
        for(let i = 0; i < this.listOfProps.length; i++){
          if(this.listOfProps[i].last10Team[1] == 0){
            arrayOfHasPlayedOtherTeam.push(false)
          }
          else{
            arrayOfHasPlayedOtherTeam.push(true)
          }
        }
        if(!arrayOfHasPlayedOtherTeam.includes(false)){
          let arrayOfGamesPlayedVsOtherTeam = []
          for(let i = 0; i < this.listOfProps.length; i++){
            arrayOfGamesPlayedVsOtherTeam.push(this.listOfProps[i].fullGameLog.filter((e: { teamAgainstName: any; }) => e.teamAgainstName == this.listOfProps[i].teamAgainstName).map((e: { gameId: any; }) => e.gameId))
          }
          console.log('games played against other team')
          let sameGameTeamWins = 0
          let commonTeamGameIds = arrayOfGamesPlayedVsOtherTeam.reduce((p,c) => p.filter((e: any) => c.includes(e)));
          if(commonTeamGameIds.length > 0){
            this.noGamesVsTeam = false;
            for(let j = 0; j < commonTeamGameIds.length; j++){
              let arrayOfTeamAgainstResult: string[] = []
              for(let k = 0; k < this.listOfProps.length; k++){
                arrayOfTeamAgainstResult.push(this.listOfProps[j].fullGameLog.filter((e: { gameId: any; }) => e.gameId == commonTeamGameIds[j])[0].result)
              }
              if(!arrayOfTeamAgainstResult.includes('L')){
                sameGameTeamWins++
              }
            }
            this.teamSameGameChance = sameGameTeamWins / commonTeamGameIds.length
          }
          
        }
      }
    }
  }

  ngOnChanges(){
    this.calculateChance();
  }
}
