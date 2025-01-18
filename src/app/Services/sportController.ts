import { NhlController } from "../../shared/Controllers/NhlController"
import { BestBetController } from "../../shared/Controllers/BestBetController"
import { NflController } from "../../shared/Controllers/NflController"
import { MlbController } from "../../shared/Controllers/MlbController"
import { NbaController } from "../../shared/Controllers/NbaController"
import { PlayerInfoController } from "../../shared/Controllers/PlayerInfoController"
import { DbPlayerPropData } from "../../shared/dbTasks/DbPlayerPropData"
import { NhlService } from "./NhlService"
import { DbGameBookData } from "../../shared/dbTasks/DbGameBookData"
import { DbTeamInfo } from "../../shared/dbTasks/DBTeamInfo"
import { NflService } from "./NflService"
import { TeamInfoController } from "src/shared/Controllers/TeamInfoController"
import { DbPlayerInfo } from "src/shared/dbTasks/DbPlayerInfo"


export class sportController {
    static async getDashboardData(sport: string){
        if(sport == 'NFL'){
            return await Promise.all([NflController.nflGetPlayerStatTotals('touchdowns', 2024), NflController.nflGetTeamStatTotals("wins", 2024), BestBetController.getBestBets('NFL')])
        }
        else if(sport == 'NHL'){
            return await Promise.all([NhlController.NhlGetPlayerGameStatTotals('points', 2024), NhlController.NhlGetTeamGameStatTotals("wins", 2024), BestBetController.getBestBets('NHL')])
        }
        else if(sport == 'NBA'){
            return await Promise.all([NbaController.nbaGetPlayerStatAverageTop5("points"),NbaController.nbaGetTeamStatAverageTop5("wins"), BestBetController.getBestBets('NBA')])
        }
        else if(sport == 'MLB'){
            return await Promise.all([MlbController.mlbGetPlayerStatTotals('homeRuns', 2024), MlbController.mlbGetTeamStatAverageTop5("wins", 2024), BestBetController.getBestBets('MLB')])
        }
        else return 0
    }

    static async getDashboardPlayerData(sport: string, stat: string){
        if (sport == "NBA") {
            return await NbaController.nbaGetPlayerStatAverageTop5(stat)
          }
          else if (sport == "MLB") {
            return await MlbController.mlbGetPlayerStatTotals(stat, 2024)
          }
          else if (sport == "NFL") {
            return await NflController.nflGetPlayerStatTotals(stat, 2024)
          }
          else if (sport == 'NHL') {
            return await NhlController.NhlGetPlayerGameStatTotals(stat, 2024)
          }
          else return []
    }
    
    static async getPlayerStatScreenInfo(sport: string, playerId: number, ){
      if(sport == 'NHL'){
        return await Promise.all([NhlController.nhlGetAllPlayerStatsByPlayerIdAndSeason(playerId, 2024), NhlController.NhlGetPlayerGameStatAveragesByPlayerId(playerId)])
      }
      else if(sport == 'NFL'){
        return await Promise.all([NflController.nflGetPlayerGameStatsByPlayerId(playerId), NflController.nflGetPlayerStatTotalsByPlayerIdAndSeason(playerId,2024)])
      }
      else if(sport == 'MLB'){
        return []
      }
      else if(sport == 'NBA'){
        return []
      }
      else return []
    }

    static async getTeamStatScreenInfo(sport: string, teamId: number){
      if(sport == 'NHL'){
        return await Promise.all([NhlController.nhlGetAllTeamStatsByTeamIdAndSeason(teamId, 2024), NhlController.NhlGetTeamGameStatTotalsByTeamIdAndSeason(teamId,2024)])
      }
      else if(sport == 'NFL'){
        return await Promise.all([NflController.nflGetAllTeamGameStatsById(teamId), NflController.nflGetSpecificTeamStatTotals(teamId,2024)])
      }
      else if(sport == 'MLB'){
        return []
      }
      else if(sport == 'NBA'){
        return []
      }
      else return []
    }

    static async getSinglePlayerProps(playerProps: DbPlayerPropData[], sport: string, playerId: number, playerInfo: DbPlayerInfo, playerStats: any[]){
      let allTeamInfo = await TeamInfoController.getAllTeamInfo(sport)
      if(sport == 'NHL'){
        return await NhlService.getSinglePlayerPropDataNew(playerProps, allTeamInfo, playerId, playerInfo, playerStats)
      }
      else if(sport == 'NFL'){
        return await NhlService.getSinglePlayerPropDataNew(playerProps, allTeamInfo, playerId, playerInfo, playerStats)
      }
      else if(sport == 'NBA'){
        return []
      }
      else if(sport == 'MLB'){
        return []
      }
      return []
    }

    static async getPropDataBySport(sport: string, gameProps: DbGameBookData[], allTeamInfo: DbTeamInfo[], teamNames: string[], selectedGame: string): Promise<any[]>{
      if(sport == 'NHL'){
        return await Promise.all([NhlService.getTeamPropDataNew(gameProps, allTeamInfo),NhlController.NhlGetTeamsGameStatTotals(teamNames, 2024),NhlService.getPlayerPropDataNew(selectedGame, allTeamInfo), NhlService.getLiveBets(teamNames)])
      }
      else if(sport == 'NFL'){
        return await Promise.all([NflService.getTeamPropDataNew(gameProps, allTeamInfo),NflController.nflGetTeamsGameStatTotals(teamNames, 2024),NflService.getPlayerPropDataNew(selectedGame, allTeamInfo), NflService.getLiveBets(teamNames)])
      }
      return []
    }
}