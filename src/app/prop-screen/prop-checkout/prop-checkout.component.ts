import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';
import { PlayerProp } from 'src/app/player-prop';

@Component({
  selector: 'app-prop-checkout',
  templateUrl: './prop-checkout.component.html',
  styleUrls: ['./prop-checkout.component.scss']
})
export class PropCheckoutComponent implements OnChanges {

  @Input()
  listOfProps: any[] = []
  @Input() exit: boolean = true;
  @Output() length = new EventEmitter<any[]>();
  @Output() exitSend = new EventEmitter<boolean>();
  value = 80;

  display() {
  }



  remove(p: any) {
    p.isDisabled = false;
    delete p.stats;
    this.listOfProps = this.listOfProps.filter(item => item != p);
    this.length.emit(this.listOfProps)
  }
  exitModal() {

    this.exit = false;
    this.exitSend.emit(this.exit);
  }

  ngInit() {
    this.display()
  }

  overallProbability: number = 0
  calculateOverallProbability() {
    if (this.listOfProps.length == 1) {
      this.overallProbability = this.listOfProps[0].propVariables.propPrice
    }
    else if (this.listOfProps.length > 1) {
      //(100 / (150 + 100)) * 100
      let finalProb: number = 1;
      for (let prop of this.listOfProps) {
        if (prop.propVariables.propPrice > 0) {
          finalProb = finalProb * (100 / (prop.propVariables.propPrice + 100))
        }
        else if (prop.propVariables.propPrice < 0) {
          //(300/(300+100)) * 100
          finalProb = finalProb * ((prop.propVariables.propPrice * -1) / ((prop.propVariables.propPrice * -1) + 100))
        }

      }
      //positive odds
      if (finalProb < .5) {
        //(100 / (10 / 100)) - 100
        this.overallProbability = ((100 / ((finalProb * 100) / 100)) - 100)
      }
      //negative odds
      else {
        //(60 / (1 - (60/100))) * -1
        this.overallProbability = ((finalProb * 100) / (1 - ((finalProb * 100) / 100))) * -1
      }


    }
  }
  overallChance: number = 0
  sameGameChance: number = 0
  teamSameGameChance: number = 0

  isSameGameTeam: boolean = false;
  displayPropChance() {
    console.log(this.listOfProps)
    //an array is going to come in. It could have different team and player stat arrays
    //how to know how to calculate the same game chance of all the props happening
    // loop through each item in the array and check to see if there are both teams stats or players from both teams
    // if both teams are present then you have to only search for the games where both teams have played each other
    //if only one team is present and a player then you search through the players games and see if it matches
    //ex: player and team prop
    // loop through each game in the player stat and see if it meets the prop, 
    //then find the matching game id in the team stat and see if the game prop is correct,
    //if there is more than one player then reference that game in the players game stats and check

    //find the number of teams in the parlay array
    if (this.listOfProps.length > 1) {
      let teams: string[] = []
      for (let prop of this.listOfProps) {
        if (!teams.includes(prop.propVariables.teamName)) {
          teams.push(prop.propVariables.teamName)
        }
      }

      //if only one team
      if (teams.length == 1) {
        //need to find if there is a player prop, if there is only one prop then just that overall win chance
        // if one player and one team, then loop through player stats and then grab the game within that loop
        // if multiple player then loop through the player with the least amount of games and grab the other players and team
        let players = this.listOfProps.filter(e => e.propVariables.playerOrTeam == 'Player')
        let distinctPlayers = []
        if(players.length > 0){
          distinctPlayers = players.map(e => e.propVariables.playerName).filter((value,index,array) => array.indexOf(value) === index)
        }
        console.log(distinctPlayers)
        
        let numberOfTeamProps = this.listOfProps.filter(e => e.propVariables.playerOrTeam == 'Team')
        let statArray: any[] = []
        //if there are no players then just take the first team stats
        this.isSameGameTeam = true;
        if (players.length == 0) {
          statArray = this.listOfProps[0].stats
          //begin looping through the stat array and for each game loop through all the props in the listOFProps array to check those
          let totalWins: number = 0;
          let totalTeamWins: number = 0;
          let teamTotals: number = 0;
          for (let game of statArray) {
            if(game.teamAgainstName == this.listOfProps[0].propVariables.teamAgainstName){
              console.log("here in team totals += 1")
              teamTotals += 1;
            }
            let didParlayHappen: boolean[] = [];
            let didSameTeamParlayHappen: boolean[] = [];
            for (let prop of this.listOfProps) {
              
              if (prop.propVariables.marketKey == 'h2h') {
                didParlayHappen.push(game.result == 'W' ? true : false);
                if(game.teamAgainstName == prop.propVariables.teamAgainstName){
                  didSameTeamParlayHappen.push(game.result == 'W' ? true : false)
                  console.log("here in h2h")
                }
              }
              else if (prop.propVariables.marketKey == 'h2h_1st_3_innings') {
                didParlayHappen.push(((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning)) ? true : false);
                if(game.teamAgainstName == prop.propVariables.teamAgainstName){
                  didSameTeamParlayHappen.push(((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning)) ? true : false)
                }
              }
              else if (prop.propVariables.marketKey == 'h2h_1st_5_innings') {
                didParlayHappen.push(((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning + game.pointsScoredFifthInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning + game.pointsAllowedFifthInning)) ? true : false);
                if(game.teamAgainstName == prop.propVariables.teamAgainstName){
                  didSameTeamParlayHappen.push(((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning + game.pointsScoredFifthInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning + game.pointsAllowedFifthInning)) ? true : false)
                }
              }
              else if (prop.propVariables.marketKey == 'h2h_1st_7_innings') {
                didParlayHappen.push(((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning + game.pointsScoredFifthInning + game.pointsScoredSixthInning + game.pointsScoredSeventhInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning + game.pointsAllowedFifthInning + game.pointsAllowedSixthInning + game.pointsAllowedSeventhInning)) ? true : false);
                if(game.teamAgainstName == prop.propVariables.teamAgainstName){
                  didSameTeamParlayHappen.push(((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning + game.pointsScoredFifthInning + game.pointsScoredSixthInning + game.pointsScoredSeventhInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning + game.pointsAllowedFifthInning + game.pointsAllowedSixthInning + game.pointsAllowedSeventhInning)) ? true : false)
                  console.log("here in h2h7")
                }
              }
              else if (prop.propVariables.marketKey == 'spreads') {
                didParlayHappen.push(((game.pointsAllowedOverall - game.pointsScoredOverall) < prop.propVariables.propPoint) ? true : false);
                if(game.teamAgainstName == prop.propVariables.teamAgainstName){
                  didSameTeamParlayHappen.push(((game.pointsAllowedOverall - game.pointsScoredOverall) < prop.propVariables.propPoint) ? true : false)
                }
              }
              else if (prop.propVariables.marketKey == 'totals') {
                didParlayHappen.push(((game.pointsScoredOverall + game.pointsAllowedOverall) > prop.propVariables.propPoint) ? true : false);
                if(game.teamAgainstName == prop.propVariables.teamAgainstName){
                  didSameTeamParlayHappen.push(((game.pointsScoredOverall + game.pointsAllowedOverall) > prop.propVariables.propPoint) ? true : false)
                }
              }
              else if (prop.propVariables.marketKey == 'team_totals Over') {
                didParlayHappen.push((game.pointsScoredOverall > prop.propVariables.propPoint) ? true : false);
                if(game.teamAgainstName == prop.propVariables.teamAgainstName){
                  didSameTeamParlayHappen.push((game.pointsScoredOverall > prop.propVariables.propPoint) ? true : false)
                }
              }

            }
            console.log(didSameTeamParlayHappen)
            if (!didParlayHappen.includes(false)) {
              totalWins += 1;
            }
            if(didSameTeamParlayHappen.length > 0){
              if(!didSameTeamParlayHappen.includes(false)){
                totalTeamWins += 1;
              }
            }
            
          }
          this.sameGameChance = (totalWins / statArray.length)
          this.teamSameGameChance = (totalTeamWins / teamTotals)
        }

        else if (distinctPlayers.length == 1) {
          console.log("here")
          //need to get all the players game and the same games for that team
          statArray = players[0].stats
          if(numberOfTeamProps.length == 0){
            //just loop through that player
            let totalWins: number = 0;
            let totalTeamWins: number = 0;
            let teamTotals: number = 0;
            for(let game of statArray){
              if(game.teamAgainstName == this.listOfProps[0].propVariables.teamAgainstName){
                teamTotals += 1;
              }
              let didParlayHappen: boolean[] = [];
              let didSameTeamParlayHappen: boolean[] = [];
              for(let prop of this.listOfProps){
                if(prop.propVariables.marketKey == 'batter_total_bases'){
                  if(prop.propVariables.overUnder == false){
                    didParlayHappen.push((game.batterTotalBases < prop.propVariables.propPoint) ? true : false)
                  }
                  else{
                    didParlayHappen.push((game.batterTotalBases > prop.propVariables.propPoint) ? true : false)
                  }
                  if(prop.propVariables.teamAgainstName == game.teamAgainstName){
                    if(prop.propVariables.overUnder == false){
                      didSameTeamParlayHappen.push((game.batterTotalBases < prop.propVariables.propPoint) ? true : false)
                    }
                    else{
                      didSameTeamParlayHappen.push((game.batterTotalBases > prop.propVariables.propPoint) ? true : false)
                    }
                  }

                }
                else if(prop.propVariables.marketKey == 'batter_home_runs'){
                  if(prop.propVariables.overUnder == false){
                    didParlayHappen.push((game.batterHomeRuns < prop.propVariables.propPoint) ? true : false)
                  }
                  else{
                    didParlayHappen.push((game.batterHomeRuns > prop.propVariables.propPoint) ? true : false)
                  }
                  if(prop.propVariables.teamAgainstName == game.teamAgainstName){
                    if(prop.propVariables.overUnder == false){
                      didParlayHappen.push((game.batterHomeRuns < prop.propVariables.propPoint) ? true : false)
                    }
                    else{
                      didParlayHappen.push((game.batterHomeRuns > prop.propVariables.propPoint) ? true : false)
                    }
                  }
                }
                else if(prop.propVariables.marketKey == 'batter_hits_runs_rbis'){
                  if(prop.propVariables.overUnder == false){
                    didParlayHappen.push((game.batterHitsRunsRbis < prop.propVariables.propPoint) ? true : false)
                  }
                  else{
                    didParlayHappen.push((game.batterHitsRunsRbis > prop.propVariables.propPoint) ? true : false)
                  }
                  if(prop.propVariables.teamAgainstName == game.teamAgainstName){
                    if(prop.propVariables.overUnder == false){
                      didParlayHappen.push((game.batterHitsRunsRbis < prop.propVariables.propPoint) ? true : false)
                    }
                    else{
                      didParlayHappen.push((game.batterHitsRunsRbis > prop.propVariables.propPoint) ? true : false)
                    }
                  }
                }
                else if(prop.propVariables.marketKey == 'batter_hits'){
                  if(prop.propVariables.overUnder == false){
                    didParlayHappen.push((game.batterHits < prop.propVariables.propPoint) ? true : false)
                  }
                  else{
                    didParlayHappen.push((game.batterHits > prop.propVariables.propPoint) ? true : false)
                  }
                  if(prop.propVariables.teamAgainstName == game.teamAgainstName){
                    if(prop.propVariables.overUnder == false){
                      didParlayHappen.push((game.batterHits < prop.propVariables.propPoint) ? true : false)
                    }
                    else{
                      didParlayHappen.push((game.batterHits > prop.propVariables.propPoint) ? true : false)
                    }
                  }
                }
                else if(prop.propVariables.marketKey == 'batter_runs_scored'){
                  if(prop.propVariables.overUnder == false){
                    didParlayHappen.push((game.batterRunsScored < prop.propVariables.propPoint) ? true : false)
                  }
                  else{
                    didParlayHappen.push((game.batterRunsScored > prop.propVariables.propPoint) ? true : false)
                  }
                  if(prop.propVariables.teamAgainstName == game.teamAgainstName){
                    if(prop.propVariables.overUnder == false){
                      didParlayHappen.push((game.batterRunsScored < prop.propVariables.propPoint) ? true : false)
                    }
                    else{
                      didParlayHappen.push((game.batterRunsScored > prop.propVariables.propPoint) ? true : false)
                    }
                  }
                }
                else if(prop.propVariables.marketKey == 'batter_rbis'){
                  if(prop.propVariables.overUnder == false){
                    didParlayHappen.push((game.batterRbis < prop.propVariables.propPoint) ? true : false)
                  }
                  else{
                    didParlayHappen.push((game.batterRbis > prop.propVariables.propPoint) ? true : false)
                  }
                  if(prop.propVariables.teamAgainstName == game.teamAgainstName){
                    if(prop.propVariables.overUnder == false){
                      didParlayHappen.push((game.batterRbis < prop.propVariables.propPoint) ? true : false)
                    }
                    else{
                      didParlayHappen.push((game.batterRbis > prop.propVariables.propPoint) ? true : false)
                    }
                  }
                }
              }
              
              if (!didParlayHappen.includes(false)) {
                totalWins += 1;
              }
              if(didSameTeamParlayHappen.length > 0){
                if(!didSameTeamParlayHappen.includes(false)){
                  totalTeamWins += 1;
                }
              }
            }
            this.sameGameChance = (totalWins / statArray.length)
            this.teamSameGameChance = (totalTeamWins / teamTotals)
          }
          else if(numberOfTeamProps.length > 0){

          }
        }
        else if (distinctPlayers.length > 1) {
          for (let player of players) {
            if (statArray.length == 0) {
              statArray = player.stats
            }
            else if (player.stats.length < statArray.length) {
              statArray = player.stats
            }
          }
          
          for(let game of statArray){
            let didParlayHappen: boolean[] = [];
            let didSameTeamParlayHappen: boolean[] = [];
            for(let prop of this.listOfProps){
              if(prop.propVariables.playerOrTeam == 'Player'){
                if(prop.propVariables.marketKey == 'batter_total_bases'){
                  

                }
                else if(prop.propVariables.marketKey == 'batter_home_runs'){

                }
                else if(prop.propVariables.marketKey == 'batter_hits_runs_rbis'){
                  
                }
                else if(prop.propVariables.marketKey == 'batter_hits'){
                  
                }
                else if(prop.propVariables.marketKey == 'batter_runs_scored'){
                  
                }
                else if(prop.propVariables.marketKey == 'batter_rbis'){
                  
                }
              }
              else if(prop.propVariables.playerOrTeam == 'Team'){
                if (prop.propVariables.marketKey == 'h2h') {
                  didParlayHappen.push(game.result == 'W' ? true : false);
                  if(game.teamAgainstName == prop.propVariables.teamAgainstName){
                    didSameTeamParlayHappen.push(game.result == 'W' ? true : false)
                    console.log("here in h2h")
                  }
                }
                else if (prop.propVariables.marketKey == 'h2h_1st_3_innings') {
                  didParlayHappen.push(((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning)) ? true : false);
                  if(game.teamAgainstName == prop.propVariables.teamAgainstName){
                    didSameTeamParlayHappen.push(((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning)) ? true : false)
                  }
                }
                else if (prop.propVariables.marketKey == 'h2h_1st_5_innings') {
                  didParlayHappen.push(((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning + game.pointsScoredFifthInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning + game.pointsAllowedFifthInning)) ? true : false);
                  if(game.teamAgainstName == prop.propVariables.teamAgainstName){
                    didSameTeamParlayHappen.push(((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning + game.pointsScoredFifthInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning + game.pointsAllowedFifthInning)) ? true : false)
                  }
                }
                else if (prop.propVariables.marketKey == 'h2h_1st_7_innings') {
                  didParlayHappen.push(((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning + game.pointsScoredFifthInning + game.pointsScoredSixthInning + game.pointsScoredSeventhInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning + game.pointsAllowedFifthInning + game.pointsAllowedSixthInning + game.pointsAllowedSeventhInning)) ? true : false);
                  if(game.teamAgainstName == prop.propVariables.teamAgainstName){
                    didSameTeamParlayHappen.push(((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning + game.pointsScoredFifthInning + game.pointsScoredSixthInning + game.pointsScoredSeventhInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning + game.pointsAllowedFifthInning + game.pointsAllowedSixthInning + game.pointsAllowedSeventhInning)) ? true : false)
                    console.log("here in h2h7")
                  }
                }
                else if (prop.propVariables.marketKey == 'spreads') {
                  didParlayHappen.push(((game.pointsAllowedOverall - game.pointsScoredOverall) < prop.propVariables.propPoint) ? true : false);
                  if(game.teamAgainstName == prop.propVariables.teamAgainstName){
                    didSameTeamParlayHappen.push(((game.pointsAllowedOverall - game.pointsScoredOverall) < prop.propVariables.propPoint) ? true : false)
                  }
                }
                else if (prop.propVariables.marketKey == 'totals') {
                  didParlayHappen.push(((game.pointsScoredOverall + game.pointsAllowedOverall) > prop.propVariables.propPoint) ? true : false);
                  if(game.teamAgainstName == prop.propVariables.teamAgainstName){
                    didSameTeamParlayHappen.push(((game.pointsScoredOverall + game.pointsAllowedOverall) > prop.propVariables.propPoint) ? true : false)
                  }
                }
                else if (prop.propVariables.marketKey == 'team_totals Over') {
                  didParlayHappen.push((game.pointsScoredOverall > prop.propVariables.propPoint) ? true : false);
                  if(game.teamAgainstName == prop.propVariables.teamAgainstName){
                    didSameTeamParlayHappen.push((game.pointsScoredOverall > prop.propVariables.propPoint) ? true : false)
                  }
                }
              }
            }
          }
        }

        //now we have a stat array of either team or player

      }
      //if more than one team
      else {
        this.isSameGameTeam = false;
        let statArray: any[] = []

        let players = this.listOfProps.filter(e => e.propVariables.playerOrTeam == 'Player')

        //just the two teams
        if (players.length == 0) {
          console.log(this.listOfProps)
          statArray = this.listOfProps[0].stats.filter((e: { teamAgainstName: any; }) => e.teamAgainstName == this.listOfProps[0].propVariables.teamAgainstName)
          console.log(statArray)
          let totalWins: number = 0;
          for (let game of statArray) {
            let didParlayHappen: boolean[] = [];
            for (let prop of this.listOfProps) {
              console.log(prop)
              //need to check which team the prop is from 
              if (prop.propVariables.teamName == game.teamName) {
                if (prop.propVariables.marketKey == 'h2h') {
                  didParlayHappen.push(game.result == 'W' ? true : false);
                }
                else if (prop.propVariables.marketKey == 'h2h_1st_3_innings') {
                  didParlayHappen.push(((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning)) ? true : false);
                }
                else if (prop.propVariables.marketKey == 'h2h_1st_5_innings') {
                  didParlayHappen.push(((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning + game.pointsScoredFifthInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning + game.pointsAllowedFifthInning)) ? true : false);
                }
                else if (prop.propVariables.marketKey == 'h2h_1st_7_innings') {
                  didParlayHappen.push(((game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning + game.pointsScoredFifthInning + game.pointsScoredSixthInning + game.pointsScoredSeventhInning) > (game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning + game.pointsAllowedFifthInning + game.pointsAllowedSixthInning + game.pointsAllowedSeventhInning)) ? true : false);
                }
                else if (prop.propVariables.marketKey == 'spreads') {
                  didParlayHappen.push(((game.pointsAllowedOverall - game.pointsScoredOverall) < prop.propVariables.propPoint) ? true : false);
                }
                else if (prop.propVariables.marketKey == 'totals') {
                  didParlayHappen.push(((game.pointsScoredOverall + game.pointsAllowedOverall) > prop.propVariables.propPoint) ? true : false);
                }
                else if (prop.propVariables.marketKey == 'team_totals Over') {
                  didParlayHappen.push((game.pointsScoredOverall > prop.propVariables.propPoint) ? true : false);
                }
              }
              else if (prop.propVariables.teamName == game.teamAgainstName) {
                if (prop.propVariables.marketKey == 'h2h') {
                  didParlayHappen.push(game.result == 'L' ? true : false);
                }
                else if (prop.propVariables.marketKey == 'h2h_1st_3_innings') {
                  didParlayHappen.push(((game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning) > (game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning)) ? true : false);
                }
                else if (prop.propVariables.marketKey == 'h2h_1st_5_innings') {
                  didParlayHappen.push(((game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning + game.pointsAllowedFifthInning) > (game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning + game.pointsScoredFifthInning)) ? true : false);
                }
                else if (prop.propVariables.marketKey == 'h2h_1st_7_innings') {
                  didParlayHappen.push(((game.pointsAllowedFirstInning + game.pointsAllowedSecondInning + game.pointsAllowedThirdInning + game.pointsAllowedFourthInning + game.pointsAllowedFifthInning + game.pointsAllowedSixthInning + game.pointsAllowedSeventhInning) > (game.pointsScoredFirstInning + game.pointsScoredSecondInning + game.pointsScoredThirdInning + game.pointsScoredFourthInning + game.pointsScoredFifthInning + game.pointsScoredSixthInning + game.pointsScoredSeventhInning)) ? true : false);
                }
                else if (prop.propVariables.marketKey == 'spreads') {
                  didParlayHappen.push(((game.pointsScoredOverall - game.pointsAllowedOverall) < prop.propVariables.propPoint) ? true : false);
                }
                else if (prop.propVariables.marketKey == 'totals') {
                  didParlayHappen.push(((game.pointsAllowedOverall + game.pointsScoredOverall) > prop.propVariables.propPoint) ? true : false);
                }
                else if (prop.propVariables.marketKey == 'team_totals Over') {
                  didParlayHappen.push((game.pointsAllowedOverall > prop.propVariables.propPoint) ? true : false);
                }
              }


            }
            if (!didParlayHappen.includes(false)) {
              totalWins += 1;
            }
          }
          this.sameGameChance = totalWins / statArray.length
        }
        else if (players.length == 1) {

        }
        else if (players.length > 1) {

        }
      }
    }
    else {
      if (this.listOfProps[0].propVariables.playerOrTeam == 'Player') {
        this.sameGameChance = (this.listOfProps[0].propVariables.overOverall / this.listOfProps[0].propVariables.totalOverall)
      }
      else {
        this.sameGameChance = (this.listOfProps[0].propVariables.totalWins / this.listOfProps[0].propVariables.totalGames)
        this.isSameGameTeam = false;
      }
    }




    let propOverall: number = 1;
    for (let prop of this.listOfProps) {
      propOverall = propOverall * (prop.propVariables.totalWins / prop.propVariables.totalGames)
    }
    this.overallChance = propOverall
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateOverallProbability()
    this.displayPropChance()
  }
}
