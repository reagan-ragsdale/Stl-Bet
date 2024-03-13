

import { draftKingsApiController } from "./ApiCalls/draftKingsApiCalls"
import { SportsBookController } from "../shared/Controllers/SportsBookController"
import { MlbController } from "../shared/Controllers/MlbController"
import { MlbService } from "./Services/MlbService"
import { ArrayOfDates } from "./array-of-dates"
import { DbGameBookData } from "../shared/dbTasks/DbGameBookData"
import { SportsNameToId } from "./sports-name-to-id"
import { reusedFunctions } from "./Services/reusedFunctions"
import { mlbApiController } from "./ApiCalls/mlbApiCalls"
import { DBMlbPlayerGameStats } from "../shared/dbTasks/DbMlbPlayerGameStats"
import {PlayerInfoController} from "../shared/Controllers/PlayerInfoController"
import { DbMlbTeamGameStats } from "src/shared/dbTasks/DbMlbTeamGameStats"




const arrayOfDates: ArrayOfDates = { 1: 31, 2: 29, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31 }

export const mlbCronFile = async () => {
    await loadMlbData()




    // this is going to run daily in the morning. I think it should call whichever games are slated for today in the sportsbookdb and for each of those teams,
    //pull the stats for each player and update it into the db

    // call the draft kings game and player props for the selected sport for that day and put it in the database
    // call the nba player info and load all the current player info into the database
    // the draft kings calls might not have the player props yet so just loop through each player for each team and call the stats and load into database


    //nba loads

    //get and load draft kings game props




    //const gamesFromDraftKings = await draftKingsApiController.getDatesAndGames("MLB");

    //await SportsBookController.addBookData(gamesFromDraftKings);


    //console.log("Finished sports book load")

    // get and load all nba player info


    const allPlayerInfo = await mlbApiController.getAllMlbPlayers()
    await PlayerInfoController.playerInfoAddPlayers(allPlayerInfo)


    //retreive all the players and get their season stats
    let listOfActivePlayers = await PlayerInfoController.loadPlayerInfoBySport("MLB");
    //console.log(listOfActivePlayers)
    for (let player of listOfActivePlayers) {
        //get 2022 stats - - if there is data in the database already then we don't call the api bc there are no new 2023 games to check for
        
            let playerStats = await MlbController.mlbGetPlayerGameStatsByPlayerIdAndSeason(player.playerId, 2023)
            if (playerStats.length == 0) {
                console.log("Before api call")
                try{
                    let player2023Stats = await mlbApiController.getPlayerGameStats(player.playerId, 2023)
                    if (typeof (player2023Stats) != 'number') {
                        await MlbController.mlbSetPlayerGameStats(player2023Stats)
                    }
                    else{
                        await MlbController.mlbSetBlankPlayerGameStats(player, 2023)
                    }
                }catch(error: any){
                    console.log(error.message)
                }
                

            }
        

    }


    //next I want to get the team stats
    // call get team schedule and for each game in there call the get box score for that game 
    //this is assuming the mlb ids are always 1-30
     for(let i = 1; i < 31; i++){
        //get the schedule for the current team id
        var gameStats: DbMlbTeamGameStats[] = []
        let dbTeamGameStats = await MlbController.mlbGetTeamGameStatsByTeamIdAndSeason(i, 2023)
        if(dbTeamGameStats.length == 0){
            let schedule = await mlbApiController.getTeamSchedule(i, 2023)
            for(let game of schedule){
                let teamStats2023 = await mlbApiController.getTeamGameStats(game, MlbService.mlbIdToTeam[i])
                gameStats.push(teamStats2023)
            }
            await MlbController.mlbSetTeamGameStats(gameStats)
        }
        
    }


    //set the player game stat averages
    for(let player of listOfActivePlayers){
        let playerDbStats = await MlbController.mlbGetPlayerGameStatsByPlayerIdAndSeason(player.playerId, 2023)
        let playerAverage = MlbService.setPlayerGameAverages(playerDbStats)
        await MlbController.mlbSetPlayerStatAverage(playerAverage)
    }

    //set the team game stat averages
    for(let i = 1; i < 31; i++){
        let teamDbStats = await MlbController.mlbGetTeamGameStatsByTeamIdAndSeason(i, 2023)
        let teamAverage = MlbService.setTeamGameAverages(teamDbStats)
        await MlbController.mlbSetTeamStatAverage(teamAverage)
    } 



}







var loadMlbData = async () => {
    console.log("Running mlb cron")
}


