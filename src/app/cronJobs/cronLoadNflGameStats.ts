import { PlayerInfoController } from "../../shared/Controllers/PlayerInfoController";
import { ErrorEmailController } from "../../shared/Controllers/ErrorEmailController";
import { NflController } from "../../shared/Controllers/NflController";
import { nflApiController } from "../ApiCalls/nflApiCalls";
import { NflService } from "../Services/NflService";


export const cronLoadNflGameStats = async () => {
    let count = 0
    console.log('Running cron nfl')
     let players = await nflApiController.loadAllPLayerInfo()
     count++
    await PlayerInfoController.playerInfoAddPlayers(players)
    try{
        let currentGameIds = await NflController.nflGetDistinctGameIds(2024);
        let incomingGameIds = await nflApiController.loadAllNflGameIds(2024)
        count++

        //find the ones that don't intersect
        let newGameIds = incomingGameIds.filter(game => !currentGameIds.includes(game))
        //console.log(newGameIds)

        for(let game of newGameIds){
            try{
                let gameStats = await nflApiController.getGameSummary(game)
                count++
                await NflController.addTeamGameStats(gameStats[0])
                await NflController.addPlayerGameStats(gameStats[1])
            }
            catch(error:any){
                console.log(error.message)
            }
            

        } 


    }catch(error:any){
        ErrorEmailController.sendEmailError("cron player and team stats: " + error.message)
        
    } 
     try{
        let players = await NflController.nflGetAllPlayerGameStatsBySeason(2024);
        let distinctPlayers = players.map(e => e.playerId).filter((value, index,array) => array.indexOf(value) === index)
        for(let player of distinctPlayers){
            let playerStats = players.filter(e => e.playerId == player)
            let playerStatTotals = NflService.convertPlayerStatsToTotals(playerStats)
            await NflController.nflSetPlayerStatTotals(playerStatTotals)
        }
        let teams = await NflController.nflGetAllTeamGameStatsBySeason(2024);
        let distinctTeams = teams.map(e => e.teamId).filter((value,index,array) => array.indexOf(value) === index);
        for(let team of distinctTeams){
            let teamStats = teams.filter(e => e.teamId == team);
            let teamStatTotals = NflService.convertTeamStatsToTotals(teamStats)
            await NflController.nflSetTeamStatTotals(teamStatTotals)
        }
    }catch(error:any){
        ErrorEmailController.sendEmailError("cron player and team stat totals: " + error.message) 
    } 

    if(count < 100){
        try{
            let currentGameIds = await NflController.nflGetDistinctGameIds(2023);
            let incomingGameIds = await nflApiController.loadAllNflGameIds(2023)
            
    
            //find the ones that don't intersect
            let newGameIds = incomingGameIds.filter(game => !currentGameIds.includes(game))
            //console.log(newGameIds)
    
            for(let game of newGameIds){
                try{
                    let gameStats = await nflApiController.getGameSummary(game)
                    
                    await NflController.addTeamGameStats(gameStats[0])
                    await NflController.addPlayerGameStats(gameStats[1])
                }
                catch(error:any){
                    console.log(error.message)
                }
                
    
            } 
    
    
        }catch(error:any){
            ErrorEmailController.sendEmailError("cron player and team stats: 2023" + error.message)
            
        }
    }
    
}