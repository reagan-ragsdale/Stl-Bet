import { DbNbaPlayerStatAverages } from "../../shared/dbTasks/DbNbaPlayerStatAverages"
import { DbNbaGameStats } from "../../shared/dbTasks/DbNbaGameStats"
import { DbNbaTeamGameStats } from "../../shared/dbTasks/DbNbaTeamGameStats"
import { DbNbaTeamStatAverages } from "../../shared/dbTasks/DbNbaTeamStatAverages"




export class MlbService{

    convertPlayerStatDataToPlayerStatAverageData(statData: DbNbaGameStats[]) : DbNbaPlayerStatAverages {
        var dataAverage: DbNbaPlayerStatAverages = {
            playerId: 0,
            playerName: "",
            teamName: "",
            teamId: 0,
            season: 0,
            assists: 0,
            points: 0,
            fgp: 0,
            ftp: 0,
            tpp: 0,
            offReb: 0,
            defReb: 0,
            totReb: 0,
            pFouls: 0,
            steals: 0,
            turnover: 0,
            blocks: 0,
            doubleDouble: 0,
            tripleDouble: 0
        }
        statData.forEach(game => {
        
            dataAverage.playerId = game.playerId,
            dataAverage.playerName = game.playerName,
            dataAverage.teamName = game.teamName,
            dataAverage.teamId = game.teamId,
            dataAverage.season = game.season,
            dataAverage.assists += game.assists,
            dataAverage.points += game.points,
            dataAverage.fgp += game.fgp,
            dataAverage.ftp += game.ftp,
            dataAverage.tpp += game.tpp,
            dataAverage.offReb += game.offReb, 
            dataAverage.defReb += game.defReb,
            dataAverage.totReb += game.totReb,
            dataAverage.pFouls += game.pFouls,
            dataAverage.steals += game.steals,
            dataAverage.turnover += game.turnover,
            dataAverage.blocks += game.blocks,
            dataAverage.doubleDouble += game.doubleDouble,
            dataAverage.tripleDouble += game.tripleDouble
        })
        var FinalAverageData: DbNbaPlayerStatAverages = {
            playerId: dataAverage.playerId,
            playerName: dataAverage.playerName,
            teamName: dataAverage.teamName,
            teamId: dataAverage.teamId,
            season: dataAverage.season,
            assists: dataAverage.assists/statData.length,
            points: dataAverage.points/statData.length,
            fgp: dataAverage.fgp/statData.length,
            ftp: dataAverage.ftp/statData.length,
            tpp: dataAverage.tpp/statData.length,
            offReb: dataAverage.offReb/statData.length, 
            defReb: dataAverage.defReb/statData.length,
            totReb: dataAverage.totReb/statData.length,
            pFouls: dataAverage.pFouls/statData.length,
            steals: dataAverage.steals/statData.length,
            turnover: dataAverage.turnover/statData.length,
            blocks: dataAverage.blocks/statData.length,
            doubleDouble: dataAverage.doubleDouble/statData.length,
            tripleDouble: dataAverage.tripleDouble/statData.length
        }
        return FinalAverageData
    }


    convertTeamStatDataToPlayerStatAverageData(statData: DbNbaTeamGameStats[]) : DbNbaTeamStatAverages {
        var dataAverage: DbNbaTeamStatAverages = {
            teamName: "",
            teamId: 0,
            season: 0,
            wins: 0,
            losses: 0,
            pointsScored: 0,
            pointsAllowed: 0,
            
        }
        statData.forEach(game => {
            dataAverage.teamName = game.teamName,
            dataAverage.teamId = game.teamId,
            dataAverage.season = game.season,
            dataAverage.wins += game.result == "Win" ? 1 : 0,
            dataAverage.losses += game.result == "Loss" ? 1 : 0,
            dataAverage.pointsScored += game.pointsScoredOverall,
            dataAverage.pointsAllowed += game.pointsAllowedOverall
        })
        var FinalAverageData: DbNbaTeamStatAverages = {
            teamName: dataAverage.teamName,
            teamId: dataAverage.teamId,
            season: dataAverage.season,
            wins: dataAverage.wins,
            losses: dataAverage.losses,
            pointsScored: dataAverage.pointsScored/statData.length,
            pointsAllowed: dataAverage.pointsAllowed/statData.length
        }
        return FinalAverageData
    }





}