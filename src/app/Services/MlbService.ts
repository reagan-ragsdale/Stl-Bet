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
            var playerName = player.longName
            if (playerName.includes("á")) {
                playerName = playerName.replaceAll("á", "a")
            }
            if (playerName.includes("Á")) {
                playerName = playerName.replaceAll("Á", "A")
            }
            if (playerName.includes("é")) {
                playerName = playerName.replaceAll("é", "e")
            }
            if (playerName.includes("É")) {
                playerName = playerName.replaceAll("É", "E")
            }
            if (playerName.includes("í")) {
                playerName = playerName.replaceAll("í", "i")
            }
            if (playerName.includes("Í")) {
                playerName = playerName.replaceAll("Í", "I")
            }
            if (playerName.includes("ñ")) {
                playerName = playerName.replaceAll("ñ", "n")
            }
            if (playerName.includes("Ñ")) {
                playerName = playerName.replaceAll("Ñ", "N")
            }
            if (playerName.includes("ó")) {
                playerName = playerName.replaceAll("ó", "o")
            }
            if (playerName.includes("Ó")) {
                playerName = playerName.replaceAll("Ó", "O")
            }
            if (playerName.includes("ú")) {
                playerName = playerName.replaceAll("ú", "u")
            }
            if (playerName.includes("Ú")) {
                playerName = playerName.replaceAll("Ú", "U")
            }
            if (playerName.includes("ü")) {
                playerName = playerName.replaceAll("ü", "u")
            }
            if (playerName.includes("Ü")) {
                playerName = playerName.replaceAll("Ü", "U")
            }

            playerList.push({
                playerId: player.playerID == '' ? 0 : parseInt(player.playerID),
                playerName: playerName,
                teamName: player.team == '' ? "None" : player.team,
                teamId: player.teamID == '' ? 0 : parseInt(player.teamID)
            })

        })
        console.log(playerList)
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