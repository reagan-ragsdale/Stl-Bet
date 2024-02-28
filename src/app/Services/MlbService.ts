import { DbNbaPlayerStatAverages } from "../../shared/dbTasks/DbNbaPlayerStatAverages"
import { DbNbaGameStats } from "../../shared/dbTasks/DbNbaGameStats"
import { DbNbaTeamGameStats } from "../../shared/dbTasks/DbNbaTeamGameStats"
import { DbNbaTeamStatAverages } from "../../shared/dbTasks/DbNbaTeamStatAverages"
import { DbMlbPlayerInfo } from "../../shared/dbTasks/DbMlbPlayerInfo"
import { DBMlbPlayerGameStats } from "../../shared/dbTasks/DbMlbPlayerGameStats"
import { MlbController } from "../../shared/Controllers/MlbController"
import { reusedFunctions } from "./reusedFunctions"




export class MlbService {

     static mlbTeamIds: {[key:string]: number} = {"ARI": 1, "ATL": 2, "BAL": 3, "BOS": 4, "CHC": 5, "CHW": 6, "CIN": 7, "CLE": 8, "COL": 9, "DET": 10, "HOU": 11, "KC": 12, "LAA": 13, "LAD": 14, "MIA": 15, "MIL": 16, "MIN": 17, "NYM": 18, "NYY": 19, "OAK": 20, "PHI": 21, "PIT": 22, "SD": 23, "SF": 24, "SEA": 25, "STL": 26, "TB": 27, "TEX": 28, "TOR": 29, "WAS": 30}

    static mlbConvertPlayerInfoFromApiToDb(playerInfo: any[]): DbMlbPlayerInfo[] {
        var playerList: DbMlbPlayerInfo[] = []

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

        return playerList
    }


    static async mlbConvertPlayerGameStatsFromApiToDb(playerStatData: any[]): Promise<DBMlbPlayerGameStats[]> {
        var playerStatsFinal: DBMlbPlayerGameStats[] = []

        let i = 0
        let newPlayerStatData: any[] = []

        playerStatData.forEach(game => {
            newPlayerStatData[i] = game
            i++
        })
        console.log("Below is new player stat data")
        console.log(newPlayerStatData)

        //get player info to get player name and team id
        let playerDb = await MlbController.mlbGetPlayerGameStatsByPlayerIdAndSeason(playerStatData[0].playerID, this.getSeason(playerStatData[0].gameID))
        let uniqueGameId = playerDb.map(e => {return e.gameId}) 

        //change below to for loop and call the player info db to get the player name
        for(let i = 0; i < playerStatData.length; i++){
            if(uniqueGameId.includes(playerStatData[i].gameID)){
                continue
            }
            let player = await MlbController.mlbGetPlayerInfoByPlayerId(playerStatData[i].playerID)
            var playerName = player[0].playerName
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

            playerStatsFinal.push({
                playerId: playerStatData[i].playerID,
                playerName: playerName,
                teamName: playerStatData[i].team,
                teamId: MlbService.mlbTeamIds[playerStatData[i].team],
                teamAgainstName: this.getTeamAgainst(playerStatData[i].gameID, playerStatData[i].team),
                teamAgainstId: reusedFunctions.arrayOfMLBTeams[this.getTeamAgainst(playerStatData[i].gameID, playerStatData[i].team)],
                gameId: playerStatData[i].gameID,
                gameDate: this.getGameDate(playerStatData[i].gameID),
                season: this.getSeason(playerStatData[i].gameID),
                playerPosition: playerStatData[i].startingPosition,
                playerStarted: playerStatData[i].started ? "Y" : "N",
                batterHomeRuns: playerStatData[i].Hitting.HR,
                batterHits: playerStatData[i].Hitting.H,
                batterTotalBases: playerStatData[i].Hitting.TB,
                batterRbis: playerStatData[i].Hitting.RBI,
                batterRunsScored: playerStatData[i].Hitting.R,
                batterHitsRunsRbis: playerStatData[i].Hitting.H + playerStatData[i].Hitting.R + playerStatData[i].Hitting.RBI,
                batterDoubles: playerStatData[i].Hitting['2B'],
                batterTriples: playerStatData[i].Hitting['3B'],
                batterWalks: playerStatData[i].Hitting.BB + playerStatData[i].Hitting.IBB,
                batterStrikeouts: playerStatData[i].Hitting.SO,
                batterStolenBases: playerStatData[i].BaseRunning.SB,
                pitcherStrikes: playerStatData[i].Pitching.Strikes,
                pitcherPitches: playerStatData[i].Pitching.Pitches,

            })
        }
        


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

    static getSeason(gameId: string): number {
        let seasonFinal: any = ""
        seasonFinal = parseInt(gameId.slice(0, 4))
        return seasonFinal
    }





}