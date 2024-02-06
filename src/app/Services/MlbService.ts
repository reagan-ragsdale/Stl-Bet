import { DbNbaPlayerStatAverages } from "../../shared/dbTasks/DbNbaPlayerStatAverages"
import { DbNbaGameStats } from "../../shared/dbTasks/DbNbaGameStats"
import { DbNbaTeamGameStats } from "../../shared/dbTasks/DbNbaTeamGameStats"
import { DbNbaTeamStatAverages } from "../../shared/dbTasks/DbNbaTeamStatAverages"
import { PlayerInfoMlb } from "src/shared/dbTasks/DbMlbPlayerInfo"




export class MlbService {

    static mlbConvertPlayerInfoFromApiToDb(playerInfo: any[]): PlayerInfoMlb[] {
        var playerList: PlayerInfoMlb[] = []

        playerInfo.forEach((player: { longName: string, playerID: number, team: string, teamID: number }) => {
            if (player.longName.includes("á")) {
                player.longName.replaceAll("á", "a")
            }
            if (player.longName.includes("Á")) {
                player.longName.replaceAll("Á", "A")
            }
            if (player.longName.includes("é")) {
                player.longName.replaceAll("é", "e")
            }
            if (player.longName.includes("É")) {
                player.longName.replaceAll("É", "E")
            }
            if (player.longName.includes("í")) {
                player.longName.replaceAll("í", "i")
            }
            if (player.longName.includes("Í")) {
                player.longName.replaceAll("Í", "I")
            }
            if (player.longName.includes("ñ")) {
                player.longName.replaceAll("ñ", "n")
            }
            if (player.longName.includes("Ñ")) {
                player.longName.replaceAll("Ñ", "N")
            }
            if (player.longName.includes("ó")) {
                player.longName.replaceAll("ó", "o")
            }
            if (player.longName.includes("Ó")) {
                player.longName.replaceAll("Ó", "O")
            }
            if (player.longName.includes("ú")) {
                player.longName.replaceAll("ú", "u")
            }
            if (player.longName.includes("Ú")) {
                player.longName.replaceAll("Ú", "U")
            }
            if (player.longName.includes("ü")) {
                player.longName.replaceAll("ü", "u")
            }
            if (player.longName.includes("Ü")) {
                player.longName.replaceAll("Ü", "U")
            }

            playerList.push({
                playerId: player.playerID,
                playerName: player.longName,
                teamName: player.team,
                teamId: player.teamID
            })

        })
        return playerList
    }


    convertTeamStatDataToPlayerStatAverageData(statData: DbNbaTeamGameStats[]): DbNbaTeamStatAverages {
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
            pointsScored: dataAverage.pointsScored / statData.length,
            pointsAllowed: dataAverage.pointsAllowed / statData.length
        }
        return FinalAverageData
    }





}