

import { draftKingsApiController } from "./ApiCalls/draftKingsApiCalls"
import { SportsBookController } from "../shared/Controllers/SportsBookController"
import { MlbController } from "../shared/Controllers/MlbController"
import { MlbService } from "./Services/MlbService"
import { ArrayOfDates } from "./array-of-dates"
import { DbGameBookData } from "../shared/dbTasks/DbGameBookData"
import { SportsNameToId } from "./sports-name-to-id"
import { reusedFunctions } from "./Services/reusedFunctions"
import { mlbApiController } from "./ApiCalls/mlbApiCalls"
import { DBMlbPlayerGameStats } from "src/shared/dbTasks/DbMlbPlayerGameStats"




const arrayOfDates: ArrayOfDates = { 1: 31, 2: 29, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31 }
const arrayOfNBATeams: SportsNameToId = { Atlanta_Hawks: 1, Boston_Celtics: 2, Brooklyn_Nets: 4, Charlotte_Hornets: 5, Chicago_Bulls: 6, Cleveland_Cavaliers: 7, Dallas_Mavericks: 8, Denver_Nuggets: 9, Detroit_Pistons: 10, Golden_State_Warriors: 11, Houston_Rockets: 14, Indiana_Pacers: 15, Los_Angeles_Clippers: 16, Los_Angeles_Lakers: 17, Memphis_Grizzlies: 19, Miami_Heat: 20, Milwaukee_Bucks: 21, Minnesota_Timberwolves: 22, New_Orleans_Pelicans: 23, New_York_Knicks: 24, Oklahoma_City_Thunder: 25, Orlando_Magic: 26, Philadelphia_76ers: 27, Phoenix_Suns: 28, Portland_Trail_Blazers: 29, Sacramento_Kings: 30, San_Antonio_Spurs: 31, Toronto_Raptors: 38, Utah_Jazz: 40, Washington_Wizards: 41 }
const arrayOfNbaTeamIds = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 38, 40, 41]

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

    //const allPlayerInfo = await mlbApiController.getAllMlbPlayers()
    //await MlbController.mlbSetPlayerInfo(allPlayerInfo)


    //retreive all the players and get their season stats
    let listOfActivePlayers = await MlbController.mlbGetAllPlayerInfo();
    //console.log(listOfActivePlayers)

    //for(let player of listOfActivePlayers){
        //get 2022 stats - - if there is data in the database already then we don't call the api bc there are no new 2023 games to check for
        let playerStats = await MlbController.mlbGetPlayerGameStatsByPlayerIdAndSeason(408234, 2023)
        if(playerStats.length == 0){
            console.log("Before api call")
            let player2023Stats = await mlbApiController.getPlayerGameStats(408234, 2023)
            if(typeof(player2023Stats) != 'number'){
                console.log("hererere")
                await MlbController.mlbSetPlayerGameStats(player2023Stats)
            }
            
        }
    //}

    /*
    var listOfGamesToday: DbGameBookData[] = await SportsBookController.loadSportBookByH2H("NBA")

    var listOfAllPlayersInGames: any[] = []
    for (const game of listOfGamesToday) {
        let result = await MlbController.nbaLoadPlayerInfoFromTeamId(arrayOfNBATeams[addUnderScoreToName(game.teamName)]);
        listOfAllPlayersInGames.push(result);

    }


    console.log("Line 69")
    var individualPlayers: NbaPlayerInfoDb[] = []
    for (const team of listOfAllPlayersInGames) {
        for (const players of team) {
            individualPlayers.push(players)
        }
    }
    console.log(individualPlayers.length)
    //call each players stats api and update in database
    for (const player of individualPlayers) {
        let result = await newNbaApiController.loadNba2023PlayerStatData(player.playerId)
        await MlbController.nbaAddPlayerGameStats2023(result)
        /*
        var db2022 = await NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(player.playerId, 2022)
        if (db2022.length < 1) {
            var data2022 = await newNbaApiController.loadNba2022PlayerStatData(player.playerId)
            if (data2022.length > 0) {
                await NbaController.nbaAddPlayerGameStats2022(data2022)
            }
            else if (data2022.length == 0) {
                await NbaController.nbaAddPlayerStat2022BlankData(player.playerId, player.playerName)

            }
        }
        
    }

    //load team stats
    for (const team of arrayOfNbaTeamIds) {
        let result = await newNbaApiController.loadTeamGameStats(team, 2023)
        await MlbController.nbaAddTeamGameStats(result)
    }


    //calculate player averages for the home screen that way it doesn't have to take up much time
    for (const player of allPlayerInfo) {
        let playerStats = await MlbController.nbaLoadPlayerStatsInfoFromIdAndSeason(player.playerId, 2023);
        var averagePlayerData = newNbaService.convertPlayerStatDataToPlayerStatAverageData(playerStats)

        if (averagePlayerData.playerId != 0) {
            await MlbController.nbaSetPlayerStatAverage(averagePlayerData)
        }
    }

    for (const team of arrayOfNbaTeamIds) {
        console.log("Here 1")
        let teamStats = await MlbController.nbaLoadTeamGameStatsByTeamIdAndSeason(team, 2023);
        console.log("Here 2")
        var averageTeamData = newNbaService.convertTeamStatDataToPlayerStatAverageData(teamStats)
        console.log("Here 3")
        await MlbController.nbaSetTeamStatAverage(averageTeamData)
        console.log("Here 4")
    }




    console.log("line 90")



*/


}







var loadMlbData = async () => {
    console.log("Running mlb cron")
}


