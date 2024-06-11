import { DbNbaPlayerStatAverages } from "../../shared/dbTasks/DbNbaPlayerStatAverages"
import { DbNbaGameStats } from "../../shared/dbTasks/DbNbaGameStats"
import { DbNbaTeamGameStats } from "../../shared/dbTasks/DbNbaTeamGameStats"
import { DbNbaTeamStatAverages } from "../../shared/dbTasks/DbNbaTeamStatAverages"
import { DbMlbPlayerInfo } from "../../shared/dbTasks/DbMlbPlayerInfo"
import { DBMlbPlayerGameStats } from "../../shared/dbTasks/DbMlbPlayerGameStats"
import { MlbController } from "../../shared/Controllers/MlbController"
import { reusedFunctions } from "./reusedFunctions"
import { DbPlayerInfo } from "../../shared/dbTasks/DbPlayerInfo"
import { DbMlbTeamGameStats } from "../../shared/dbTasks/DbMlbTeamGameStats"
import { DBMlbPlayerGameStatAverages } from "../../shared/dbTasks/DbMlbPlayerGameStatAverages"
import { DbMlbTeamGameStatAverages } from "../../shared/dbTasks/DbMlbTeamGameStatAverages"
import { DBMlbPlayerGameStatTotals } from "../../shared/dbTasks/DbMlbPlayerGameStatTotals"




export class MlbService {

    static mlbTeamIds: { [key: string]: number } = { "ARI": 1, "ATL": 2, "BAL": 3, "BOS": 4, "CHC": 5, "CHW": 6, "CIN": 7, "CLE": 8, "COL": 9, "DET": 10, "HOU": 11, "KC": 12, "LAA": 13, "LAD": 14, "MIA": 15, "MIL": 16, "MIN": 17, "NYM": 18, "NYY": 19, "OAK": 20, "PHI": 21, "PIT": 22, "SD": 23, "SF": 24, "SEA": 25, "STL": 26, "TB": 27, "TEX": 28, "TOR": 29, "WAS": 30 }
    static mlbIdToTeam: { [key: number]: string } = { 1: "ARI", 2: "ATL", 3: "BAL", 4: "BOS", 5: "CHC", 6: "CHW", 7: "CIN", 8: "CLE", 9: "COL", 10: "DET", 11: "HOU", 12: "KC", 13: "LAA", 14: "LAD", 15: "MIA", 16: "MIL", 17: "MIN", 18: "NYM", 19: "NYY", 20: "OAK", 21: "PHI", 22: "PIT", 23: "SD", 24: "SF", 25: "SEA", 26: "STL", 27: "TB", 28: "TEX", 29: "TOR", 30: "WAS" }
    static mlbTeamNameToAbvr: {[key: string]: string} = { "Arizona Diamondbacks": "ARI", "Atlanta Braves": "ATL", "Baltimore Orioles": "BAL", "Boston Red Sox": "BOS", "Chicago Cubs": "CHC", "Chicago White Sox": "CHW", "Cincinnati Reds": "CIN", "Cleveland Guardians": "CLE", "Colorado Rockies": "COL", "Detroit Tigers": "DET", "Houston Astros": "HOU", "Kansas City Royals": "KC", "Los Angeles Angels": "LAA", "Los Angeles Dodgers": "LAD", "Miami Marlins": "MIA", "Milwaukee Brewers": "MIL", "Minnesota Twins": "MIN", "New York Mets": "NYM", "New York Yankees": "NYY", "Oakland Athletics": "OAK", "Philadelphia Phillies": "PHI", "Pittsburgh Pirates": "PIT", "San Diego Padres": "SD", "San Francisco Giants": "SF", "Seattle Mariners": "SEA", "St. Louis Cardinals": "STL", "Tampa Bay Rays": "TB", "Texas Rangers": "TEX", "Toronto Blue Jays": "TOR", "Washington Nationals": "WAS" }
    static mlbConvertPlayerInfoFromApiToDb(playerInfo: any[]): DbPlayerInfo[] {
        var playerList: DbPlayerInfo[] = []

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
                teamId: player.teamID == '' ? 0 : parseInt(player.teamID),
                sport: "MLB"
            })

        })

        return playerList
    }


    static async mlbConvertPlayerGameStatsFromApiToDb(playerStatData: any[]): Promise<DBMlbPlayerGameStats[] | number> {
        console.log("here in service")
        var playerStatsFinal: DBMlbPlayerGameStats[] = []
        try {


            let index = 0
            let newPlayerStatData: any[] = []
            for (let i in playerStatData) {
                newPlayerStatData[index] = playerStatData[i]
                index++
            }
            if (newPlayerStatData.length == 0) {
                return 0
            }


            //get player info to get player name and team id
            let playerDb = await MlbController.mlbGetPlayerGameStatsByPlayerIdAndSeason(newPlayerStatData[0].playerID, this.getSeason(newPlayerStatData[0].gameID))
            let uniqueGameId = playerDb.map(e => { return e.gameId })

            let player = await MlbController.mlbGetPlayerInfoByPlayerId(newPlayerStatData[0].playerID)
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



            for (let i = 0; i < newPlayerStatData.length; i++) {
                if (uniqueGameId.includes(newPlayerStatData[i].gameID)) {
                    continue
                }


                playerStatsFinal.push({
                    playerId: newPlayerStatData[i].playerID,
                    playerName: playerName,
                    teamName: newPlayerStatData[i].team,
                    teamId: MlbService.mlbTeamIds[newPlayerStatData[i].team],
                    teamAgainstName: this.getTeamAgainst(newPlayerStatData[i].gameID, newPlayerStatData[i].team),
                    teamAgainstId: MlbService.mlbTeamIds[this.getTeamAgainst(newPlayerStatData[i].gameID, newPlayerStatData[i].team)],
                    gameId: newPlayerStatData[i].gameID,
                    gameDate: this.getGameDate(newPlayerStatData[i].gameID),
                    season: this.getSeason(newPlayerStatData[i].gameID),
                    playerPosition: newPlayerStatData[i].startingPosition,
                    playerStarted: newPlayerStatData[i].started ? "Y" : "N",
                    batterAtBats: newPlayerStatData[i].Hitting.AB,
                    batterHomeRuns: newPlayerStatData[i].Hitting.HR,
                    batterHits: newPlayerStatData[i].Hitting.H,
                    batterTotalBases: newPlayerStatData[i].Hitting.TB,
                    batterRbis: newPlayerStatData[i].Hitting.RBI,
                    batterRunsScored: newPlayerStatData[i].Hitting.R,
                    batterHitsRunsRbis: Number(newPlayerStatData[i].Hitting.H) + Number(newPlayerStatData[i].Hitting.R) + Number(newPlayerStatData[i].Hitting.RBI),
                    batterDoubles: newPlayerStatData[i].Hitting['2B'],
                    batterTriples: newPlayerStatData[i].Hitting['3B'],
                    batterWalks: Number(newPlayerStatData[i].Hitting.BB) + Number(newPlayerStatData[i].Hitting.IBB),
                    batterStrikeouts: newPlayerStatData[i].Hitting.SO,
                    batterStolenBases: newPlayerStatData[i].BaseRunning.SB,
                    pitcherStrikes: newPlayerStatData[i].Pitching.Strikes,
                    pitcherPitches: newPlayerStatData[i].Pitching.Pitches,

                })
            }




        } catch (error: any) {
            console.log(error.message)
            return 0
        }
        return playerStatsFinal
    }


    static mlbConvertTeamScheduleFromApiToDb(teamSchedule: any) {
        var schedule: any[] = []
        teamSchedule.forEach((e: { gameID: any }) => schedule.push(e.gameID))
        return schedule
    }

    static async mlbConvertTeamGameStatsFromApiToDb(gameStats: any): Promise<any[] | number> {
        if (gameStats.gameStatus != "Completed") {
            return 0
        }
        let gameHistory = await MlbController.mlbGetTeamGameStatsByTeamIdAndSeason(this.mlbTeamIds[gameStats.away], 2024)
        let listOfGameIds = gameHistory.map(g => g.gameId)
        if(listOfGameIds.includes(gameStats.gameID)){
            return 0;
        }
        let homeRunsAway = 0
        let homeRunsHome = 0
        let playerStats = gameStats.playerStats

        let index = 0
        let newTeamStatData: any[] = []
        for (let i in playerStats) {
            newTeamStatData[index] = playerStats[i]
            index++
        }
        for (let player of newTeamStatData) {
            if (player.team == gameStats.away) {
                homeRunsAway += Number(player.Hitting.HR)
            }
            else {
                homeRunsHome += Number(player.Hitting.HR)
            }
        }

        var teamStatAway: DbMlbTeamGameStats = {
            teamName: gameStats.away,
            teamId: this.mlbTeamIds[gameStats.away],
            teamAgainstName: gameStats.home,
            teamAgainstId: this.mlbTeamIds[gameStats.home],
            homeOrAway: "Away",
            season: this.getSeason(gameStats.gameID),
            gameId: gameStats.gameID,
            gameDate: this.getGameDate(gameStats.gameID),
            result: gameStats.awayResult,
            pointsScoredOverall: gameStats.lineScore.away.R,
            pointsScoredFirstInning: gameStats.lineScore.away.scoresByInning[1],
            pointsScoredSecondInning: gameStats.lineScore.away.scoresByInning[2],
            pointsScoredThirdInning: gameStats.lineScore.away.scoresByInning[3],
            pointsScoredFourthInning: gameStats.lineScore.away.scoresByInning[4],
            pointsScoredFifthInning: gameStats.lineScore.away.scoresByInning[5],
            pointsScoredSixthInning: typeof(gameStats.lineScore.away.scoresByInning[6]) == 'number' ? gameStats.lineScore.away.scoresByInning[6]: 0,
            pointsScoredSeventhInning: typeof(gameStats.lineScore.away.scoresByInning[7]) == 'number' ? gameStats.lineScore.away.scoresByInning[7] : 0,
            pointsScoredEigthInning: typeof(gameStats.lineScore.away.scoresByInning[8]) == 'number' ? gameStats.lineScore.away.scoresByInning[8] : 0,
            pointsScoredNinthInning: (gameStats.lineScore.away.scoresByInning[9] == "x" ? 0 : gameStats.lineScore.away.scoresByInning[9]),
            pointsAllowedOverall: gameStats.lineScore.home.R,
            pointsAllowedFirstInning: typeof(gameStats.lineScore.home.scoresByInning[1]) == 'number' ? gameStats.lineScore.home.scoresByInning[1] : 0,
            pointsAllowedSecondInning: typeof(gameStats.lineScore.home.scoresByInning[2]) == 'number' ? gameStats.lineScore.home.scoresByInning[2] : 0,
            pointsAllowedThirdInning: typeof(gameStats.lineScore.home.scoresByInning[3]) == 'number' ? gameStats.lineScore.home.scoresByInning[3] : 0,
            pointsAllowedFourthInning: typeof(gameStats.lineScore.home.scoresByInning[4]) == 'number' ? gameStats.lineScore.home.scoresByInning[4] : 0,
            pointsAllowedFifthInning: typeof(gameStats.lineScore.home.scoresByInning[5]) == 'number' ? gameStats.lineScore.home.scoresByInning[5] : 0,
            pointsAllowedSixthInning: typeof(gameStats.lineScore.home.scoresByInning[6]) == 'number' ? gameStats.lineScore.home.scoresByInning[6] : 0,
            pointsAllowedSeventhInning: typeof(gameStats.lineScore.home.scoresByInning[7]) == 'number' ? gameStats.lineScore.home.scoresByInning[7] : 0,
            pointsAllowedEigthInning: typeof(gameStats.lineScore.home.scoresByInning[8]) == 'number' ? gameStats.lineScore.home.scoresByInning[8] : 0,
            pointsAllowedNinthInning: (gameStats.lineScore.home.scoresByInning[9] == "x" ? 0 : gameStats.lineScore.home.scoresByInning[9]),
            totalHomeRunsScored: homeRunsAway,
            totalHitsScored: gameStats.teamStats.away.Hitting.H,
            totalFirstBaseScored: 0,
            totalSecondBaseScored: gameStats.teamStats.away.Hitting['2B'],
            totalThirdBaseScored: gameStats.teamStats.away.Hitting['3B'],
            totalRbisScored: gameStats.teamStats.away.Hitting.RBI,
            totalHomeRunsAllowed: homeRunsHome,
            totalHitsAllowed: gameStats.teamStats.home.Hitting.H,
            totalFirstBaseAllowed: 0,
            totalSecondBaseAllowed: gameStats.teamStats.home.Hitting['2B'],
            totalThirdBaseAllowed: gameStats.teamStats.home.Hitting['3B'],
            totalRbisAllowed: gameStats.teamStats.home.Hitting.RBI
        }

        var teamStatHome: DbMlbTeamGameStats = {
            teamName: gameStats.home,
            teamId: this.mlbTeamIds[gameStats.home],
            teamAgainstName: gameStats.away,
            teamAgainstId: this.mlbTeamIds[gameStats.away],
            homeOrAway: "Home",
            season: this.getSeason(gameStats.gameID),
            gameId: gameStats.gameID,
            gameDate: this.getGameDate(gameStats.gameID),
            result: gameStats.homeResult,
            pointsScoredOverall: gameStats.lineScore.home.R,
            pointsScoredFirstInning: gameStats.lineScore.home.scoresByInning[1],
            pointsScoredSecondInning: gameStats.lineScore.home.scoresByInning[2],
            pointsScoredThirdInning: gameStats.lineScore.home.scoresByInning[3],
            pointsScoredFourthInning: gameStats.lineScore.home.scoresByInning[4],
            pointsScoredFifthInning: gameStats.lineScore.home.scoresByInning[5],
            pointsScoredSixthInning: typeof(gameStats.lineScore.home.scoresByInning[6]) == 'number' ? gameStats.lineScore.home.scoresByInning[6]: 0,
            pointsScoredSeventhInning: typeof(gameStats.lineScore.home.scoresByInning[7]) == 'number' ? gameStats.lineScore.home.scoresByInning[7] : 0,
            pointsScoredEigthInning: typeof(gameStats.lineScore.home.scoresByInning[8]) == 'number' ? gameStats.lineScore.home.scoresByInning[8] : 0,
            pointsScoredNinthInning: (gameStats.lineScore.home.scoresByInning[9] = "x" ? 0 : gameStats.lineScore.home.scoresByInning[9]),
            pointsAllowedOverall: gameStats.lineScore.away.R,
            pointsAllowedFirstInning: typeof(gameStats.lineScore.away.scoresByInning[1]) == 'number' ? gameStats.lineScore.away.scoresByInning[1] : 0,
            pointsAllowedSecondInning: typeof(gameStats.lineScore.away.scoresByInning[2]) == 'number' ? gameStats.lineScore.away.scoresByInning[2] : 0,
            pointsAllowedThirdInning: typeof(gameStats.lineScore.away.scoresByInning[3]) == 'number' ? gameStats.lineScore.away.scoresByInning[3] : 0,
            pointsAllowedFourthInning: typeof(gameStats.lineScore.away.scoresByInning[4]) == 'number' ? gameStats.lineScore.away.scoresByInning[4] : 0,
            pointsAllowedFifthInning: typeof(gameStats.lineScore.away.scoresByInning[5]) == 'number' ? gameStats.lineScore.away.scoresByInning[5] : 0,
            pointsAllowedSixthInning: typeof(gameStats.lineScore.away.scoresByInning[6]) == 'number' ? gameStats.lineScore.away.scoresByInning[6] : 0,
            pointsAllowedSeventhInning: typeof(gameStats.lineScore.away.scoresByInning[7]) == 'number' ? gameStats.lineScore.away.scoresByInning[7] : 0,
            pointsAllowedEigthInning: typeof(gameStats.lineScore.away.scoresByInning[8]) == 'number' ? gameStats.lineScore.away.scoresByInning[8] : 0,
            pointsAllowedNinthInning: (gameStats.lineScore.away.scoresByInning[9] == "x" ? 0 : gameStats.lineScore.away.scoresByInning[9]),
            totalHomeRunsScored: homeRunsHome,
            totalHitsScored: gameStats.teamStats.home.Hitting.H,
            totalFirstBaseScored: 0,
            totalSecondBaseScored: gameStats.teamStats.home.Hitting['2B'],
            totalThirdBaseScored: gameStats.teamStats.home.Hitting['3B'],
            totalRbisScored: gameStats.teamStats.home.Hitting.RBI,
            totalHomeRunsAllowed: homeRunsAway,
            totalHitsAllowed: gameStats.teamStats.away.Hitting.H,
            totalFirstBaseAllowed: 0,
            totalSecondBaseAllowed: gameStats.teamStats.away.Hitting['2B'],
            totalThirdBaseAllowed: gameStats.teamStats.away.Hitting['3B'],
            totalRbisAllowed: gameStats.teamStats.away.Hitting.RBI
        }

        var listOfPlayerGameStats: DBMlbPlayerGameStats[] = []
        for (let player of newTeamStatData) {
            let playerInfo = await MlbController.mlbGetPlayerInfoByPlayerId(player.playerID)
            if(playerInfo.length == 0){
                continue
            }
            var playerName = playerInfo[0].playerName
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
            console.log(player.Hitting.HR)

            listOfPlayerGameStats.push({
                playerId: player.playerID,
                playerName: playerName,
                teamName: player.team,
                teamId: MlbService.mlbTeamIds[player.team],
                teamAgainstName: this.getTeamAgainst(player.gameID, player.team),
                teamAgainstId: MlbService.mlbTeamIds[this.getTeamAgainst(player.gameID, player.team)],
                gameId: player.gameID,
                gameDate: this.getGameDate(player.gameID),
                season: this.getSeason(player.gameID),
                playerPosition: player.startingPosition,
                playerStarted: player.started ? "Y" : "N",
                batterAtBats: player.Hitting.AB,
                batterHomeRuns: player.Hitting.HR ? player.Hitting.HR : 0,
                batterHits: player.Hitting.H,
                batterTotalBases: player.Hitting.TB,
                batterRbis: player.Hitting.RBI,
                batterRunsScored: player.Hitting.R,
                batterHitsRunsRbis: (Number(player.Hitting.H) + Number(player.Hitting.R) + Number(player.Hitting.RBI)) ? Number(player.Hitting.H) + Number(player.Hitting.R) + Number(player.Hitting.RBI) : 0,
                batterDoubles: player.Hitting['2B'],
                batterTriples: player.Hitting['3B'],
                batterWalks: 0,
                //Number(player.Hitting.BB) + Number(player.Hitting.IBB),
                batterStrikeouts: player.Hitting.SO,
                batterStolenBases: player.BaseRunning.SB,
                pitcherStrikes: player.Pitching.Strikes,
                pitcherPitches: player.Pitching.Pitches,

            })


        }
        var finalArray: any[] = []
        finalArray.push(teamStatAway)
        finalArray.push(teamStatHome)
        finalArray.push(listOfPlayerGameStats)

        return finalArray
    }


    static setPlayerGameAverages(playerDbStats: DBMlbPlayerGameStats[]): DBMlbPlayerGameStatAverages {
        var playerAverageFinal: DBMlbPlayerGameStatAverages = {
            playerId: 0
            , playerName: ''
            , season: 0
            , batterHomeRuns: 0
            , batterHits: 0
            , batterAtBats: 0
            , batterTotalBases: 0
            , batterRbis: 0
            , batterRunsScored: 0
            , batterHitsRunsRbis: 0
            , batterSingles: 0
            , batterDoubles: 0
            , batterTriples: 0
            , batterWalks: 0
            , batterStrikeouts: 0
            , batterStolenBases: 0
            , pitcherStrikes: 0
            , pitcherPitches: 0
            , totalGames: 0
        }

        for (let game of playerDbStats) {
            playerAverageFinal.playerId = game.playerId,
                playerAverageFinal.playerName = game.playerName,
                playerAverageFinal.season = game.season,
                playerAverageFinal.batterHomeRuns += typeof(game.batterHomeRuns) == 'number' ? game.batterHomeRuns : 0,
                playerAverageFinal.batterHits += game.batterHits,
                playerAverageFinal.batterAtBats += game.batterAtBats,
                playerAverageFinal.batterTotalBases += game.batterTotalBases,
                playerAverageFinal.batterRbis += game.batterRbis,
                playerAverageFinal.batterRunsScored += game.batterRunsScored,
                playerAverageFinal.batterHitsRunsRbis += game.batterHitsRunsRbis,
                playerAverageFinal.batterDoubles += game.batterDoubles,
                playerAverageFinal.batterTriples += game.batterTriples,
                playerAverageFinal.batterWalks += game.batterWalks,
                playerAverageFinal.batterStrikeouts += game.batterStrikeouts,
                playerAverageFinal.batterStolenBases += game.batterStolenBases,
                playerAverageFinal.pitcherStrikes += game.pitcherStrikes,
                playerAverageFinal.pitcherPitches += game.pitcherPitches,
                playerAverageFinal.totalGames += 1

        }

        playerAverageFinal.batterHomeRuns = parseFloat((playerAverageFinal.batterHomeRuns / playerDbStats.length).toPrecision(5))
        playerAverageFinal.batterHits = playerAverageFinal.batterHits / playerDbStats.length
        playerAverageFinal.batterAtBats = playerAverageFinal.batterAtBats / playerDbStats.length
        playerAverageFinal.batterTotalBases = playerAverageFinal.batterTotalBases / playerDbStats.length
        playerAverageFinal.batterRbis = playerAverageFinal.batterRbis / playerDbStats.length
        playerAverageFinal.batterRunsScored = playerAverageFinal.batterRunsScored / playerDbStats.length
        playerAverageFinal.batterHitsRunsRbis = playerAverageFinal.batterHitsRunsRbis / playerDbStats.length
        playerAverageFinal.batterDoubles = playerAverageFinal.batterDoubles / playerDbStats.length
        playerAverageFinal.batterTriples = playerAverageFinal.batterTriples / playerDbStats.length
        playerAverageFinal.batterWalks = playerAverageFinal.batterWalks / playerDbStats.length
        playerAverageFinal.batterStrikeouts = playerAverageFinal.batterStrikeouts / playerDbStats.length
        playerAverageFinal.batterStolenBases = playerAverageFinal.batterStolenBases / playerDbStats.length
        playerAverageFinal.pitcherStrikes = playerAverageFinal.pitcherStrikes / playerDbStats.length
        playerAverageFinal.pitcherPitches = playerAverageFinal.pitcherPitches / playerDbStats.length


        return playerAverageFinal
    }



    static setPlayerGameTotals(playerStats: DBMlbPlayerGameStats[]): DBMlbPlayerGameStatTotals{
        var playerTotalFinal: DBMlbPlayerGameStatAverages = {
            playerId: 0
            , playerName: ''
            , season: 0
            , batterHomeRuns: 0
            , batterHits: 0
            , batterAtBats: 0
            , batterTotalBases: 0
            , batterRbis: 0
            , batterRunsScored: 0
            , batterHitsRunsRbis: 0
            , batterSingles: 0
            , batterDoubles: 0
            , batterTriples: 0
            , batterWalks: 0
            , batterStrikeouts: 0
            , batterStolenBases: 0
            , pitcherStrikes: 0
            , pitcherPitches: 0
            , totalGames: 0
        }

        for (let game of playerStats) {
                playerTotalFinal.playerId = game.playerId,
                playerTotalFinal.playerName = game.playerName,
                playerTotalFinal.season = game.season,
                playerTotalFinal.batterHomeRuns += game.batterHomeRuns,
                playerTotalFinal.batterHits += game.batterHits,
                playerTotalFinal.batterAtBats += game.batterAtBats,
                playerTotalFinal.batterTotalBases += game.batterTotalBases,
                playerTotalFinal.batterRbis += game.batterRbis,
                playerTotalFinal.batterRunsScored += game.batterRunsScored,
                playerTotalFinal.batterHitsRunsRbis += game.batterHitsRunsRbis,
                playerTotalFinal.batterDoubles += game.batterDoubles,
                playerTotalFinal.batterTriples += game.batterTriples,
                playerTotalFinal.batterWalks += game.batterWalks,
                playerTotalFinal.batterStrikeouts += game.batterStrikeouts,
                playerTotalFinal.batterStolenBases += game.batterStolenBases,
                playerTotalFinal.pitcherStrikes += game.pitcherStrikes,
                playerTotalFinal.pitcherPitches += game.pitcherPitches,
                playerTotalFinal.totalGames += 1

        }

        return playerTotalFinal
    }


    static setTeamGameAverages(teamDbStats: DbMlbTeamGameStats[]): DbMlbTeamGameStatAverages {
        var teamStatsFinal: DbMlbTeamGameStatAverages = {
            teamName: ''
            , teamId: 0
            , season: 0
            , wins: 0
            , losses: 0
            , pointsScoredOverall: 0
            , pointsScoredFirstInning: 0
            , pointsScoredSecondInning: 0
            , pointsScoredThirdInning: 0
            , pointsScoredFourthInning: 0
            , pointsScoredFifthInning: 0
            , pointsScoredSixthInning: 0
            , pointsScoredSeventhInning: 0
            , pointsScoredEigthInning: 0
            , pointsScoredNinthInning: 0
            , pointsAllowedOverall: 0
            , pointsAllowedFirstInning: 0
            , pointsAllowedSecondInning: 0
            , pointsAllowedThirdInning: 0
            , pointsAllowedFourthInning: 0
            , pointsAllowedFifthInning: 0
            , pointsAllowedSixthInning: 0
            , pointsAllowedSeventhInning: 0
            , pointsAllowedEigthInning: 0
            , pointsAllowedNinthInning: 0
            , totalHomeRunsScored: 0
            , totalHitsScored: 0
            , totalFirstBaseScored: 0
            , totalSecondBaseScored: 0
            , totalThirdBaseScored: 0
            , totalRbisScored: 0
            , totalHomeRunsAllowed: 0
            , totalHitsAllowed: 0
            , totalFirstBaseAllowed: 0
            , totalSecondBaseAllowed: 0
            , totalThirdBaseAllowed: 0
            , totalRbisAllowed: 0
        }

        for (let game of teamDbStats) {
            teamStatsFinal.teamName = game.teamName,
                teamStatsFinal.teamId = game.teamId,
                teamStatsFinal.season = game.season,
                teamStatsFinal.wins += game.result == "W" ? 1 : 0,
                teamStatsFinal.losses += game.result == "L" ? 1 : 0,
                teamStatsFinal.pointsScoredOverall += game.pointsScoredOverall,
                teamStatsFinal.pointsScoredFirstInning += game.pointsScoredFirstInning,
                teamStatsFinal.pointsScoredSecondInning += game.pointsScoredSecondInning,
                teamStatsFinal.pointsScoredThirdInning += game.pointsScoredThirdInning,
                teamStatsFinal.pointsScoredFourthInning += game.pointsScoredFourthInning,
                teamStatsFinal.pointsScoredFifthInning += game.pointsScoredFifthInning,
                teamStatsFinal.pointsScoredSixthInning += game.pointsScoredSixthInning,
                teamStatsFinal.pointsScoredSeventhInning += game.pointsScoredSeventhInning,
                teamStatsFinal.pointsScoredEigthInning += game.pointsScoredEigthInning,
                teamStatsFinal.pointsScoredNinthInning += game.pointsScoredNinthInning,
                teamStatsFinal.pointsAllowedOverall += game.pointsAllowedOverall,
                teamStatsFinal.pointsAllowedFirstInning += game.pointsAllowedFirstInning,
                teamStatsFinal.pointsAllowedSecondInning += game.pointsAllowedSecondInning,
                teamStatsFinal.pointsAllowedThirdInning += game.pointsAllowedThirdInning,
                teamStatsFinal.pointsAllowedFourthInning += game.pointsAllowedFourthInning,
                teamStatsFinal.pointsAllowedFifthInning += game.pointsAllowedFifthInning,
                teamStatsFinal.pointsAllowedSixthInning += game.pointsAllowedSixthInning,
                teamStatsFinal.pointsAllowedSeventhInning += game.pointsAllowedSeventhInning,
                teamStatsFinal.pointsAllowedEigthInning += game.pointsAllowedEigthInning,
                teamStatsFinal.pointsAllowedNinthInning += game.pointsAllowedNinthInning,
                teamStatsFinal.totalHomeRunsScored += game.totalHomeRunsScored,
                teamStatsFinal.totalHitsScored += game.totalHitsScored,
                teamStatsFinal.totalFirstBaseScored += game.totalFirstBaseScored,
                teamStatsFinal.totalSecondBaseScored += game.totalSecondBaseScored,
                teamStatsFinal.totalThirdBaseScored += game.totalThirdBaseScored,
                teamStatsFinal.totalRbisScored += game.totalRbisScored,
                teamStatsFinal.totalHomeRunsAllowed += game.totalHomeRunsAllowed,
                teamStatsFinal.totalHitsAllowed += game.totalHitsAllowed,
                teamStatsFinal.totalFirstBaseAllowed += game.totalFirstBaseAllowed,
                teamStatsFinal.totalSecondBaseAllowed += game.totalSecondBaseAllowed,
                teamStatsFinal.totalThirdBaseAllowed += game.totalThirdBaseAllowed,
                teamStatsFinal.totalRbisAllowed += game.totalRbisAllowed
        }

        teamStatsFinal.wins += teamStatsFinal.wins / teamDbStats.length,
            teamStatsFinal.losses += teamStatsFinal.losses / teamDbStats.length,
            teamStatsFinal.pointsScoredOverall += teamStatsFinal.pointsScoredOverall / teamDbStats.length,
            teamStatsFinal.pointsScoredFirstInning += teamStatsFinal.pointsScoredFirstInning / teamDbStats.length,
            teamStatsFinal.pointsScoredSecondInning += teamStatsFinal.pointsScoredSecondInning / teamDbStats.length,
            teamStatsFinal.pointsScoredThirdInning += teamStatsFinal.pointsScoredThirdInning / teamDbStats.length,
            teamStatsFinal.pointsScoredFourthInning += teamStatsFinal.pointsScoredFourthInning / teamDbStats.length,
            teamStatsFinal.pointsScoredFifthInning += teamStatsFinal.pointsScoredFifthInning / teamDbStats.length,
            teamStatsFinal.pointsScoredSixthInning += teamStatsFinal.pointsScoredSixthInning / teamDbStats.length,
            teamStatsFinal.pointsScoredSeventhInning += teamStatsFinal.pointsScoredSeventhInning / teamDbStats.length,
            teamStatsFinal.pointsScoredEigthInning += teamStatsFinal.pointsScoredEigthInning / teamDbStats.length,
            teamStatsFinal.pointsScoredNinthInning += teamStatsFinal.pointsScoredNinthInning / teamDbStats.length,
            teamStatsFinal.pointsAllowedOverall += teamStatsFinal.pointsAllowedOverall / teamDbStats.length,
            teamStatsFinal.pointsAllowedFirstInning += teamStatsFinal.pointsAllowedFirstInning / teamDbStats.length,
            teamStatsFinal.pointsAllowedSecondInning += teamStatsFinal.pointsAllowedSecondInning / teamDbStats.length,
            teamStatsFinal.pointsAllowedThirdInning += teamStatsFinal.pointsAllowedThirdInning / teamDbStats.length,
            teamStatsFinal.pointsAllowedFourthInning += teamStatsFinal.pointsAllowedFourthInning / teamDbStats.length,
            teamStatsFinal.pointsAllowedFifthInning += teamStatsFinal.pointsAllowedFifthInning / teamDbStats.length,
            teamStatsFinal.pointsAllowedSixthInning += teamStatsFinal.pointsAllowedSixthInning / teamDbStats.length,
            teamStatsFinal.pointsAllowedSeventhInning += teamStatsFinal.pointsAllowedSeventhInning / teamDbStats.length,
            teamStatsFinal.pointsAllowedEigthInning += teamStatsFinal.pointsAllowedEigthInning / teamDbStats.length,
            teamStatsFinal.pointsAllowedNinthInning += teamStatsFinal.pointsAllowedNinthInning / teamDbStats.length,
            teamStatsFinal.totalHomeRunsScored += teamStatsFinal.totalHomeRunsScored / teamDbStats.length,
            teamStatsFinal.totalHitsScored += teamStatsFinal.totalHitsScored / teamDbStats.length,
            teamStatsFinal.totalFirstBaseScored += teamStatsFinal.totalFirstBaseScored / teamDbStats.length,
            teamStatsFinal.totalSecondBaseScored += teamStatsFinal.totalSecondBaseScored / teamDbStats.length,
            teamStatsFinal.totalThirdBaseScored += teamStatsFinal.totalThirdBaseScored / teamDbStats.length,
            teamStatsFinal.totalRbisScored += teamStatsFinal.totalRbisScored / teamDbStats.length,
            teamStatsFinal.totalHomeRunsAllowed += teamStatsFinal.totalHomeRunsAllowed / teamDbStats.length,
            teamStatsFinal.totalHitsAllowed += teamStatsFinal.totalHitsAllowed / teamDbStats.length,
            teamStatsFinal.totalFirstBaseAllowed += teamStatsFinal.totalFirstBaseAllowed / teamDbStats.length,
            teamStatsFinal.totalSecondBaseAllowed += teamStatsFinal.totalSecondBaseAllowed / teamDbStats.length,
            teamStatsFinal.totalThirdBaseAllowed += teamStatsFinal.totalThirdBaseAllowed / teamDbStats.length,
            teamStatsFinal.totalRbisAllowed += teamStatsFinal.totalRbisAllowed / teamDbStats.length



        return teamStatsFinal
    }

    static async mlbConvertTeamGameStatsFromApiToDb2023(gameStats: any): Promise<any[] | number> {
        if (gameStats.gameStatus != "Completed") {
            return 0
        }
        let dbResultAway = await MlbController.mlbGetTeamGameStatsByTeamIdAndSeason(this.mlbTeamIds[gameStats.away],2024)
        
        let resultLength = dbResultAway.filter(e =>{
            e.gameId == gameStats.gameID
        })

        if(resultLength.length > 0){
            return 0
        }
        
        let homeRunsAway = 0
        let homeRunsHome = 0
        let playerStats = gameStats.playerStats

        let index = 0
        let newTeamStatData: any[] = []
        for (let i in playerStats) {
            newTeamStatData[index] = playerStats[i]
            index++
        }
        for (let player of newTeamStatData) {
            if (player.team == gameStats.away) {
                homeRunsAway += Number(player.Hitting.HR)
            }
            else {
                homeRunsHome += Number(player.Hitting.HR)
            }
        }

        var teamStatAway: DbMlbTeamGameStats = {
            teamName: gameStats.away,
            teamId: this.mlbTeamIds[gameStats.away],
            teamAgainstName: gameStats.home,
            teamAgainstId: this.mlbTeamIds[gameStats.home],
            homeOrAway: "Away",
            season: this.getSeason(gameStats.gameID),
            gameId: gameStats.gameID,
            gameDate: this.getGameDate(gameStats.gameID),
            result: gameStats.awayResult,
            pointsScoredOverall: gameStats.lineScore.away.R,
            pointsScoredFirstInning: gameStats.lineScore.away.scoresByInning[1],
            pointsScoredSecondInning: gameStats.lineScore.away.scoresByInning[2],
            pointsScoredThirdInning: gameStats.lineScore.away.scoresByInning[3],
            pointsScoredFourthInning: gameStats.lineScore.away.scoresByInning[4],
            pointsScoredFifthInning: gameStats.lineScore.away.scoresByInning[5],
            pointsScoredSixthInning: gameStats.lineScore.away.scoresByInning[6],
            pointsScoredSeventhInning: gameStats.lineScore.away.scoresByInning[7],
            pointsScoredEigthInning: gameStats.lineScore.away.scoresByInning[8],
            pointsScoredNinthInning: (gameStats.lineScore.away.scoresByInning[9] == "x" ? 0 : gameStats.lineScore.away.scoresByInning[9]),
            pointsAllowedOverall: gameStats.lineScore.home.R,
            pointsAllowedFirstInning: gameStats.lineScore.home.scoresByInning[1],
            pointsAllowedSecondInning: gameStats.lineScore.home.scoresByInning[2],
            pointsAllowedThirdInning: gameStats.lineScore.home.scoresByInning[3],
            pointsAllowedFourthInning: gameStats.lineScore.home.scoresByInning[4],
            pointsAllowedFifthInning: gameStats.lineScore.home.scoresByInning[5],
            pointsAllowedSixthInning: gameStats.lineScore.home.scoresByInning[6],
            pointsAllowedSeventhInning: gameStats.lineScore.home.scoresByInning[7],
            pointsAllowedEigthInning: gameStats.lineScore.home.scoresByInning[8],
            pointsAllowedNinthInning: (gameStats.lineScore.home.scoresByInning[9] == "x" ? 0 : gameStats.lineScore.home.scoresByInning[9]),
            totalHomeRunsScored: homeRunsAway,
            totalHitsScored: gameStats.teamStats.away.Hitting.H,
            totalFirstBaseScored: 0,
            totalSecondBaseScored: gameStats.teamStats.away.Hitting['2B'],
            totalThirdBaseScored: gameStats.teamStats.away.Hitting['3B'],
            totalRbisScored: gameStats.teamStats.away.Hitting.RBI,
            totalHomeRunsAllowed: homeRunsHome,
            totalHitsAllowed: gameStats.teamStats.home.Hitting.H,
            totalFirstBaseAllowed: 0,
            totalSecondBaseAllowed: gameStats.teamStats.home.Hitting['2B'],
            totalThirdBaseAllowed: gameStats.teamStats.home.Hitting['3B'],
            totalRbisAllowed: gameStats.teamStats.home.Hitting.RBI
        }

        var teamStatHome: DbMlbTeamGameStats = {
            teamName: gameStats.home,
            teamId: this.mlbTeamIds[gameStats.home],
            teamAgainstName: gameStats.away,
            teamAgainstId: this.mlbTeamIds[gameStats.away],
            homeOrAway: "Home",
            season: this.getSeason(gameStats.gameID),
            gameId: gameStats.gameID,
            gameDate: this.getGameDate(gameStats.gameID),
            result: gameStats.homeResult,
            pointsScoredOverall: gameStats.lineScore.home.R,
            pointsScoredFirstInning: gameStats.lineScore.home.scoresByInning[1],
            pointsScoredSecondInning: gameStats.lineScore.home.scoresByInning[2],
            pointsScoredThirdInning: gameStats.lineScore.home.scoresByInning[3],
            pointsScoredFourthInning: gameStats.lineScore.home.scoresByInning[4],
            pointsScoredFifthInning: gameStats.lineScore.home.scoresByInning[5],
            pointsScoredSixthInning: gameStats.lineScore.home.scoresByInning[6],
            pointsScoredSeventhInning: gameStats.lineScore.home.scoresByInning[7],
            pointsScoredEigthInning: gameStats.lineScore.home.scoresByInning[8],
            pointsScoredNinthInning: (gameStats.lineScore.home.scoresByInning[9] = "x" ? 0 : gameStats.lineScore.home.scoresByInning[9]),
            pointsAllowedOverall: gameStats.lineScore.away.R,
            pointsAllowedFirstInning: gameStats.lineScore.away.scoresByInning[1],
            pointsAllowedSecondInning: gameStats.lineScore.away.scoresByInning[2],
            pointsAllowedThirdInning: gameStats.lineScore.away.scoresByInning[3],
            pointsAllowedFourthInning: gameStats.lineScore.away.scoresByInning[4],
            pointsAllowedFifthInning: gameStats.lineScore.away.scoresByInning[5],
            pointsAllowedSixthInning: gameStats.lineScore.away.scoresByInning[6],
            pointsAllowedSeventhInning: gameStats.lineScore.away.scoresByInning[7],
            pointsAllowedEigthInning: gameStats.lineScore.away.scoresByInning[8],
            pointsAllowedNinthInning: (gameStats.lineScore.away.scoresByInning[9] == "x" ? 0 : gameStats.lineScore.away.scoresByInning[9]),
            totalHomeRunsScored: homeRunsHome,
            totalHitsScored: gameStats.teamStats.home.Hitting.H,
            totalFirstBaseScored: 0,
            totalSecondBaseScored: gameStats.teamStats.home.Hitting['2B'],
            totalThirdBaseScored: gameStats.teamStats.home.Hitting['3B'],
            totalRbisScored: gameStats.teamStats.home.Hitting.RBI,
            totalHomeRunsAllowed: homeRunsAway,
            totalHitsAllowed: gameStats.teamStats.away.Hitting.H,
            totalFirstBaseAllowed: 0,
            totalSecondBaseAllowed: gameStats.teamStats.away.Hitting['2B'],
            totalThirdBaseAllowed: gameStats.teamStats.away.Hitting['3B'],
            totalRbisAllowed: gameStats.teamStats.away.Hitting.RBI
        }
        var finalArray: any[] = []
        finalArray.push(teamStatAway)
        finalArray.push(teamStatHome)

        return finalArray
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
        gameDate = gameDate.slice(4)
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