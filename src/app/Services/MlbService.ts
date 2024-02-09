import { DbNbaPlayerStatAverages } from "../../shared/dbTasks/DbNbaPlayerStatAverages"
import { DbNbaGameStats } from "../../shared/dbTasks/DbNbaGameStats"
import { DbNbaTeamGameStats } from "../../shared/dbTasks/DbNbaTeamGameStats"
import { DbNbaTeamStatAverages } from "../../shared/dbTasks/DbNbaTeamStatAverages"
import { PlayerInfoMlb } from "src/shared/dbTasks/DbMlbPlayerInfo"
import { DBPlayerGameStatsMlb } from "src/shared/dbTasks/DbMlbPlayerGameStats"




export class MlbService {

    static mlbConvertPlayerInfoFromApiToDb(playerInfo: any[]): PlayerInfoMlb[] {
        var playerList: PlayerInfoMlb[] = []
        console.log("here in service")

        playerInfo.forEach((player: { longName: string, playerID: string, team: string, teamID: string }) => {
            console.log(player)
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
                playerId: player.playerID == '' ? 0 : parseInt(player.playerID),
                playerName: player.longName,
                teamName: player.team,
                teamId: player.teamID == '' ? 0 : parseInt(player.teamID)
            })

        })
        return playerList
    }


    static mlbConvertPlayerGameStatsFromApiToDb(playerStatData: any[]): DBPlayerGameStatsMlb[] {
        var playerStatsFinal: DBPlayerGameStatsMlb[] = []

        //get player info to get player name and team id

        playerStatData.forEach(game => 
            playerStatsFinal.push({
                playerId: game.playerID,
                playerName: game.playerName,
                teamName: game.team,
                teamId: game.teamId,
                teamAgainstName: this.getTeamAgainst(game.gameID, game.team),
                teamAgainstId: "asdf",
                gameId: game.gameID,
                gameDate: this.getGameDate(game.gameID),
                season: this.getSeason(game.gameID),
                playerPosition: game.startingPosition,
                playerStarted: game.started ? "Y" : "N",
                batterHomeRuns: game.Hitting.HR,
                batterHits: game.Hitting.H,
                batterTotalBases: game.Hitting.TB,
                batterRbis: game.Hitting.RBI,
                batterRunsScored: game.Hitting.R,
                batterHitsRunsRbis: game.Hitting.H + game.Hitting.R + game.Hitting.RBI,
                batterDoubles: game.Hitting['2B'],
                batterTriples: game.Hitting['3B'],
                batterWalks: game.Hitting.BB + game.Hitting.IBB,
                batterStrikeouts: game.Hitting.SO,
                batterStolenBases: game.BaseRunning.SB,
                pitcherStrikes: game.Pitching.Strikes,
                pitcherPitches: game.Pitching.Pitches,

            })
            )

        return playerStatsFinal
    }

    static getTeamAgainst(gameId: string, teamName: string): string {
        var teamAgainst = ""

        let splitString = gameId.split("_")
        teamAgainst = splitString[1].replace(teamName, "")
        teamAgainst = teamAgainst.replace("@", "")

        return teamAgainst

    }

    static getGameDate(gameId: string): string {
        let gameDate = ""
        

        let splitString = gameId.split("_")

        gameDate = splitString[0]
        gameDate = gameDate.slice(3)
        let month = gameDate.slice(0, 2)
        let day = gameDate.slice(2)

        return month + "/" + day
    }

    static getSeason(gameId: string): number{
        let seasonFinal: any = ""
        seasonFinal = parseInt(gameId.slice(0,4))
        return seasonFinal
    }





}