import { NhlController } from "../../shared/Controllers/NhlController"
import { BestBetController } from "../../shared/Controllers/BestBetController"
import { NflController } from "../../shared/Controllers/NflController"
import { MlbController } from "../../shared/Controllers/MlbController"
import { NbaController } from "../../shared/Controllers/NbaController"


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
          else return 0
    }
}