

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
import { PlayerInfoController } from "../shared/Controllers/PlayerInfoController"
import { DbMlbTeamGameStats } from "src/shared/dbTasks/DbMlbTeamGameStats"




const arrayOfDates: ArrayOfDates = { 1: 31, 2: 29, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31 }

export const mlbCronFile = async () => {
    await loadMlbData()




    // this is going to run daily in the morning. I think it should call whichever games are slated for today in the sportsbookdb and for each of those teams,
    //pull the stats for each player and update it into the db

    // call the draft kings game and player props for the selected sport for that day and put it in the database
    // call the nba player info and load all the current player info into the database
    // the draft kings calls might not have the player props yet so just loop through each player for each team and call the stats and load into database


    //try and load player stats the same time you load the team stats
    //how to get list of game ids from the day


    const allPlayerInfo = await mlbApiController.getAllMlbPlayers()
    await PlayerInfoController.playerInfoAddPlayers(allPlayerInfo)

    //test
    let gameDate = reusedFunctions.getPreviousDateYMD()

    const datesArray = [
        '20240401', '20240402', '20240403', '20240404', '20240405', '20240406', '20240407', '20240408', '20240409', '20240410',
        '20240411', '20240412', '20240413', '20240414', '20240415', '20240416', '20240417', '20240418', '20240419', '20240420',
        '20240421', '20240422', '20240423', '20240424', '20240425', '20240426', '20240427', '20240428', '20240429', '20240430',
        '20240501', '20240502', '20240503', '20240504', '20240505', '20240506', '20240507', '20240508', '20240509', '20240510',
        '20240511', '20240512', '20240513', '20240514', '20240515', '20240516', '20240517', '20240518', '20240519', '20240520',
        '20240521', '20240522', '20240523', '20240524', '20240525', '20240526', '20240527', '20240528', '20240529'
    ];

    try {
        for (let date of datesArray) {
            let listOfGamesToday = await mlbApiController.getMlbGamesScheduleByDate(date)
            for (let game of listOfGamesToday) {
                let gameInfo = await mlbApiController.getGameResults(game.gameID)
                let teamsGameStats = await MlbService.mlbConvertTeamGameStatsFromApiToDb(gameInfo)
                if (typeof (teamsGameStats) != 'number') {
                    await MlbController.mlbSetTeamGameStats(teamsGameStats[0])
                    await MlbController.mlbSetTeamGameStats(teamsGameStats[1])
                    for (let player of teamsGameStats[2]) {
                        await MlbController.mlbSetPlayerGameStats(player)
                    }

                }
            }

        }
    } catch (error: any) {
        console.log("Game stats: " + error.message)
    }




    //retreive all the players and get their season stats
    let listOfActivePlayers = await PlayerInfoController.loadPlayerInfoBySport("MLB");
    //console.log(listOfActivePlayers)
    /* let playerStatCount = 0
    for (let player of listOfActivePlayers) {
        //get 2022 stats - - if there is data in the database already then we don't call the api bc there are no new 2023 games to check for
            if(playerStatCount < 10000){
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
 
            
        
 
    }  */
    ///

    //next I want to get the team stats
    // call get team schedule and for each game in there call the get box score for that game 
    //this is assuming the mlb ids are always 1-30
    /* let count = 0;
    for (let i = 1; i < 31; i++) {
        //get the schedule for the current team id
        var gameStats: DbMlbTeamGameStats[] = []
        try {
            let dbTeamGameStats = await MlbController.mlbGetTeamGameStatsByTeamIdAndSeason(i, 2023)
            let listOfDistinctGames = dbTeamGameStats.map(game => game.gameId).filter((value, index, array) => array.indexOf(value) === index)
            let schedule = await mlbApiController.getTeamSchedule(i, 2023)
            count++
            for (let game of schedule) {
                if (!listOfDistinctGames.includes(game)) {
                    let teamStats2023 = await mlbApiController.getTeamGameStats2023(game)
                    count++
                    if (typeof (teamStats2023) != 'number') {
                        gameStats.push(teamStats2023[0])
                        gameStats.push(teamStats2023[1])
                    }
                }


            }
            await MlbController.mlbSetTeamGameStats(gameStats)



        } catch (error: any) {
            console.log(error.message)
        }


    } */



    //set the player game stat averages
    //let listOfActivePlayers = await PlayerInfoController.loadPlayerInfoBySport("MLB");
    for (let player of listOfActivePlayers) {
        try {
            let playerDbStats = await MlbController.mlbGetPlayerGameStatsByPlayerIdAndSeason(player.playerId, 2024)
            if (playerDbStats.length > 0) {
                let playerAverage = MlbService.setPlayerGameAverages(playerDbStats)
                await MlbController.mlbSetPlayerStatAverage(playerAverage)
                //let playerTotals = MlbService.setPlayerGameTotals(playerDbStats)
                //await MlbController.mlbSetPlayerStatTotals(playerTotals)
            }

        }
        catch (error: any) {
            console.log("Player stats: " + error.message)
        }

    }

    //set the team game stat averages
    for (let i = 1; i < 31; i++) {
        try {
            let teamDbStats = await MlbController.mlbGetTeamGameStatsByTeamIdAndSeason(i, 2024)
            let teamAverage = MlbService.setTeamGameAverages(teamDbStats)
            await MlbController.mlbSetTeamStatAverage(teamAverage)
        }
        catch (error: any) {
            console.log("Team stats: " + error.message)
        }

    }



}







var loadMlbData = async () => {
    console.log("Running mlb cron")
}


