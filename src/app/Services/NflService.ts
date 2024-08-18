import { DBNflPlayerGameStats } from "src/shared/dbTasks/DbNflPlayerGameStats";
import { DBNflTeamGameStats } from "src/shared/dbTasks/DbNflTeamGameStats";
import { DbTeamInfo } from "src/shared/dbTasks/DBTeamInfo";


export class NflService {

    static async convertGameSummaryToDb(gameSummary: any): Promise<any[]> {
        console.log(gameSummary.gameID)
        let finalReturn: any[] = []

        let teamStats: DBNflTeamGameStats[] = []

        teamStats.push({
            teamName: gameSummary.teamStats.away.teamAbv,
            teamId: gameSummary.teamStats.away.teamID,
            teamAgainstName: gameSummary.teamStats.home.teamAbv,
            teamAgainstId: gameSummary.teamStats.home.teamID,
            gameId: gameSummary.gameID,
            gameDate: gameSummary.gameDate,
            season: gameSummary.gameDate.slice(0, 4),
            homeAway: 'Away',
            result: gameSummary.awayResult,
            pointsScoredOverall: gameSummary.lineScore.away.totalPts,
            pointsScoredFirstQuarter: gameSummary.lineScore.away.Q1,
            pointsScoredSecondQuarter: gameSummary.lineScore.away.Q2,
            pointsScoredThirdQuarter: gameSummary.lineScore.away.Q3,
            pointsScoredFourthQuarter: gameSummary.lineScore.away.Q4,
            totalYards: gameSummary.teamStats.away.totalYards,
            totalRushingYards: gameSummary.teamStats.away.rushingYards,
            totalPassingYards: gameSummary.teamStats.away.passingYards,
            totalRushingAttempts: gameSummary.teamStats.away.rushingAttempts,
            interceptionsThrown: gameSummary.teamStats.away.interceptionsThrown,
            interceptionsCaught: gameSummary.teamStats.away.defensiveInterceptions,
            fumblesLost: gameSummary.teamStats.away.fumblesLost,
            firstDowns: gameSummary.teamStats.away.firstDowns,
            sacksAgainst: Number(gameSummary.teamStats.away.sacksAndYardsLost.slice(0, gameSummary.teamStats.away.sacksAndYardsLost.indexOf('-'))),
            passCompletions: Number(gameSummary.teamStats.away.passCompletionsAndAttempts.slice(0, gameSummary.teamStats.away.sacksAndYardsLost.indexOf('-'))),
            passAttempts: Number(gameSummary.teamStats.away.passCompletionsAndAttempts.slice(gameSummary.teamStats.away.sacksAndYardsLost.indexOf('-') + 1)),
            pointsAllowedOverall: gameSummary.lineScore.home.totalPts,
            pointsAllowedFirstQuarter: gameSummary.lineScore.home.Q1,
            pointsAllowedSecondQuarter: gameSummary.lineScore.home.Q2,
            pointsAllowedThirdQuarter: gameSummary.lineScore.home.Q3,
            pointsAllowedFourthQuarter: gameSummary.lineScore.home.Q4,
            totalYardsAllowed: gameSummary.teamStats.home.totalYards,
            totalRushingYardsAllowed: gameSummary.teamStats.home.rushingYards,
            totalPassingYardsAllowed: gameSummary.teamStats.home.passingYards

        });
        console.log("pushed team one")
        teamStats.push({
            teamName: gameSummary.teamStats.home.teamAbv,
            teamId: gameSummary.teamStats.home.teamID,
            teamAgainstName: gameSummary.teamStats.away.teamAbv,
            teamAgainstId: gameSummary.teamStats.away.teamID,
            gameId: gameSummary.gameID,
            gameDate: gameSummary.gameDate,
            season: gameSummary.gameDate.slice(0, 4),
            homeAway: 'Home',
            result: gameSummary.homeResult,
            pointsScoredOverall: gameSummary.lineScore.home.totalPts,
            pointsScoredFirstQuarter: gameSummary.lineScore.home.Q1,
            pointsScoredSecondQuarter: gameSummary.lineScore.home.Q2,
            pointsScoredThirdQuarter: gameSummary.lineScore.home.Q3,
            pointsScoredFourthQuarter: gameSummary.lineScore.home.Q4,
            totalYards: gameSummary.teamStats.home.totalYards,
            totalRushingYards: gameSummary.teamStats.home.rushingYards,
            totalPassingYards: gameSummary.teamStats.home.passingYards,
            totalRushingAttempts: gameSummary.teamStats.home.rushingAttempts,
            interceptionsThrown: gameSummary.teamStats.home.interceptionsThrown,
            interceptionsCaught: gameSummary.teamStats.home.defensiveInterceptions,
            fumblesLost: gameSummary.teamStats.home.fumblesLost,
            firstDowns: gameSummary.teamStats.home.firstDowns,
            sacksAgainst: Number(gameSummary.teamStats.home.sacksAndYardsLost.slice(0, gameSummary.teamStats.home.sacksAndYardsLost.indexOf('-'))),
            passCompletions: Number(gameSummary.teamStats.home.passCompletionsAndAttempts.slice(0, gameSummary.teamStats.home.sacksAndYardsLost.indexOf('-'))),
            passAttempts: Number(gameSummary.teamStats.home.passCompletionsAndAttempts.slice(gameSummary.teamStats.home.sacksAndYardsLost.indexOf('-') + 1)),
            pointsAllowedOverall: gameSummary.lineScore.away.totalPts,
            pointsAllowedFirstQuarter: gameSummary.lineScore.away.Q1,
            pointsAllowedSecondQuarter: gameSummary.lineScore.away.Q2,
            pointsAllowedThirdQuarter: gameSummary.lineScore.away.Q3,
            pointsAllowedFourthQuarter: gameSummary.lineScore.away.Q4,
            totalYardsAllowed: gameSummary.teamStats.away.totalYards,
            totalRushingYardsAllowed: gameSummary.teamStats.away.rushingYards,
            totalPassingYardsAllowed: gameSummary.teamStats.away.passingYards

        })
        console.log("pushed team two")
        finalReturn.push(teamStats);
        

        let playerStats: DBNflPlayerGameStats[] = []
        let index = 0
        let newPlayerStatData: any[] = []
        for (let i in gameSummary.playerStats) {
            newPlayerStatData[index] = gameSummary.playerStats[i]
            index++
        }
        for (let player of newPlayerStatData) {
            playerStats.push({
                playerId: player.playerID,
                playerName: player.longName,
                teamName: player.teamAbv,
                teamId: player.teamID,
                teamAgainstName: gameSummary.away == player.teamAbv ? gameSummary.home : gameSummary.away,
                teamAgainstId: gameSummary.away == player.teamAbv ? gameSummary.teamIDHome : gameSummary.teamIDAway,
                gameId: gameSummary.gameID,
                gameDate: gameSummary.gameDate,
                season: gameSummary.gameDate.slice(0, 4),
                qbCompletions: Object.hasOwn(player, 'Passing') ? player.Passing.passCompletions : 0,
                qbPassingAttempts: Object.hasOwn(player, 'Passing') ? player.Passing.passAttempts : 0,
                qbPassingYards: Object.hasOwn(player, 'Passing') ? player.Passing.passYds : 0,
                qbYardsPerPassAttempt: Object.hasOwn(player, 'Passing') ? player.Passing.passAvg : 0,
                qbPassingTouchdowns: Object.hasOwn(player, 'Passing') ? player.Passing.passTD : 0,
                qbInterceptions: Object.hasOwn(player, 'Passing') ? player.Passing.int : 0,
                qbsacks: Object.hasOwn(player, 'Passing') ? Number(player.Passing.sacked.slice(0, player.Passing.sacked.indexOf('-'))) : 0,
                qBRating: Object.hasOwn(player, 'Passing') ? player.Passing.qbr : 0,
                adjQBR: Object.hasOwn(player, 'Passing') ? player.Passing.rtg : 0,
                rushingAttempts: Object.hasOwn(player, 'Rushing') ? player.Rushing.carries : 0,
                rushingYards: Object.hasOwn(player, 'Rushing') ? player.Rushing.rushYds : 0,
                yardsPerRushAttempt: Object.hasOwn(player, 'Rushing') ? player.Rushing.rushAvg : 0,
                rushingTouchdowns: Object.hasOwn(player, 'Rushing') ? player.Rushing.rushTD : 0,
                longRushing: Object.hasOwn(player, 'Rushing') ? player.Rushing.longRush : 0,
                receptions: Object.hasOwn(player, 'Receiving') ? player.Receiving.receptions : 0,
                receivingTargets: Object.hasOwn(player, 'Receiving') ? player.Receiving.targets : 0,
                receivingYards: Object.hasOwn(player, 'Receiving') ? player.Receiving.recYds : 0,
                yardsPerReception: Object.hasOwn(player, 'Receiving') ? player.Receiving.recAvg : 0,
                receivingTouchdowns: Object.hasOwn(player, 'Receiving') ? player.Receiving.recTD : 0,
                longReception: Object.hasOwn(player, 'Receiving') ? player.Receiving.longRec : 0,
                totalTackles: Object.hasOwn(player, 'Defense') ? (Object.hasOwn(player.Defense, 'totalTackles') ? player.Defense.totalTackles : 0) : 0,
                sacks: Object.hasOwn(player, 'Defense') ? (Object.hasOwn(player.Defense, 'sacks') ? player.Defense.sacks : 0 ) : 0,
            })
            console.log("pushed:" + player)
        }
        
        finalReturn.push(playerStats)

        return finalReturn
    }

    static convertTeamInfoToDb(teamInfo: any): DbTeamInfo[] {
        let finalTeamInfo: DbTeamInfo[] = []

        for (let team of teamInfo) {
            finalTeamInfo.push({
                teamId: team.teamID,
                teamNameAbvr: team.teamAbv,
                teamNameFull: team.teamCity + " " + team.teamName,
                sport: 'NFL'
            })
        }

        return finalTeamInfo
    }

    static convertGameIdsToArray(gameIds: any): string[] {
        let finalGameIds: string[] = []
        for (let gameId of gameIds) {
            finalGameIds.push(gameId.gameID)
        }
        return finalGameIds
    }
}