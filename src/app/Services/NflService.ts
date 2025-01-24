import { DBNflTeamGameStatTotals } from "../../shared/dbTasks/DbNflTeamGameStatTotals";
import { DBNflPlayerGameStats } from "../../shared/dbTasks/DbNflPlayerGameStats";
import { DBNflPlayerGameStatTotals } from "../../shared/dbTasks/DbNflPlayerGameStatTotals";
import { DBNflTeamGameStats } from "../../shared/dbTasks/DbNflTeamGameStats";
import { DbTeamInfo } from "../../shared/dbTasks/DBTeamInfo";
import { ErrorEmailController } from "../../shared/Controllers/ErrorEmailController";
import { DbPlayerInfo } from "../../shared/dbTasks/DbPlayerInfo";
import { NflController } from "../../shared/Controllers/NflController";
import { remult } from "remult";
import { DbGameBookData } from "../../shared/dbTasks/DbGameBookData";
import { reusedFunctions } from "./reusedFunctions";
import { TeamPropDto } from "../Dtos/TeamPropsDto";
import { PlayerPropController } from "../../shared/Controllers/PlayerPropController";
import { PlayerInfoController } from "../../shared/Controllers/PlayerInfoController";
import { PlayerPropDto } from "../Dtos/PlayerPropsDto";
import { filter } from "compression";
import { DbPlayerPropData } from "../../shared/dbTasks/DbPlayerPropData";
import { TeamInfoController } from "../../shared/Controllers/TeamInfoController";
import { DbPlayerBestBets } from "src/shared/dbTasks/DBPlayerBestBets";


export class NflService {
    static alternatePropNames: string[] = ['alternate_spreads', 'alternate_team_totals', 'alternate_team_totals_h1', 'alternate_team_totals_h2', 'alternate_team_totals_q1', 'alternate_team_totals_q2', 'alternate_team_totals_q3', 'alternate_team_totals_q4']

    static async convertGameSummaryToDb(gameSummary: any): Promise<any[]> {
        console.log(gameSummary.gameID)
        let finalReturn: any[] = []

        let teamStats: DBNflTeamGameStats[] = []
        const taskRepo = remult.repo(DBNflTeamGameStats)
        let team1 = await taskRepo.find({ where: { teamId: gameSummary.teamStats.away.teamID, gameId: gameSummary.gameID } })

        if (team1.length == 0) {
            teamStats.push({
                teamName: gameSummary.teamStats.away.teamAbv,
                teamId: gameSummary.teamStats.away.teamID,
                teamAgainstName: gameSummary.teamStats.home.teamAbv,
                teamAgainstId: gameSummary.teamStats.home.teamID,
                gameId: gameSummary.gameID,
                gameDate: gameSummary.gameDate,
                season: this.getSeason(gameSummary.gameDate),
                homeOrAway: 'Away',
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
                passCompletions: Number(gameSummary.teamStats.away.passCompletionsAndAttempts.slice(0, gameSummary.teamStats.away.passCompletionsAndAttempts.indexOf('-'))),
                passAttempts: Number(gameSummary.teamStats.away.passCompletionsAndAttempts.slice(gameSummary.teamStats.away.passCompletionsAndAttempts.indexOf('-') + 1)),
                pointsAllowedOverall: gameSummary.lineScore.home.totalPts,
                pointsAllowedFirstQuarter: gameSummary.lineScore.home.Q1,
                pointsAllowedSecondQuarter: gameSummary.lineScore.home.Q2,
                pointsAllowedThirdQuarter: gameSummary.lineScore.home.Q3,
                pointsAllowedFourthQuarter: gameSummary.lineScore.home.Q4,
                totalYardsAllowed: gameSummary.teamStats.home.totalYards,
                totalRushingYardsAllowed: gameSummary.teamStats.home.rushingYards,
                totalPassingYardsAllowed: gameSummary.teamStats.home.passingYards

            });
        }
        let team2 = await taskRepo.find({ where: { teamId: gameSummary.teamStats.home.teamID, gameId: gameSummary.gameID } })
        if (team2.length == 0) {
            teamStats.push({
                teamName: gameSummary.teamStats.home.teamAbv,
                teamId: gameSummary.teamStats.home.teamID,
                teamAgainstName: gameSummary.teamStats.away.teamAbv,
                teamAgainstId: gameSummary.teamStats.away.teamID,
                gameId: gameSummary.gameID,
                gameDate: gameSummary.gameDate,
                season: this.getSeason(gameSummary.gameDate),
                homeOrAway: 'Home',
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
        }
        finalReturn.push(teamStats);


        let playerStats: DBNflPlayerGameStats[] = []
        let index = 0
        let newPlayerStatData: any[] = []
        for (let i in gameSummary.playerStats) {
            newPlayerStatData[index] = gameSummary.playerStats[i]
            index++
        }
        const playerRepo = remult.repo(DBNflPlayerGameStats)
        for (let player of newPlayerStatData) {
            try {
                let playerDb = await playerRepo.find({ where: { playerId: player.playerID, gameId: gameSummary.gameID } })
                if (playerDb.length == 0) {
                    playerStats.push({
                        playerId: player.playerID,
                        playerName: this.setPlayerName(player.longName),
                        teamName: player.teamAbv,
                        teamId: player.teamID,
                        teamAgainstName: gameSummary.away == player.teamAbv ? gameSummary.home : gameSummary.away,
                        teamAgainstId: gameSummary.away == player.teamAbv ? gameSummary.teamIDHome : gameSummary.teamIDAway,
                        gameId: gameSummary.gameID,
                        gameDate: gameSummary.gameDate,
                        season: this.getSeason(gameSummary.gameDate),
                        qbCompletions: Object.hasOwn(player, 'Passing') ? (Object.hasOwn(player.Passing, 'passCompletions') ? player.Passing.passCompletions : 0) : 0,
                        qbPassingAttempts: Object.hasOwn(player, 'Passing') ? (Object.hasOwn(player.Passing, 'passAttempts') ? player.Passing.passAttempts : 0) : 0,
                        qbPassingYards: Object.hasOwn(player, 'Passing') ? (Object.hasOwn(player.Passing, 'passYds') ? player.Passing.passYds : 0) : 0,
                        qbYardsPerPassAttempt: Object.hasOwn(player, 'Passing') ? (Object.hasOwn(player.Passing, 'passAvg') ? player.Passing.passAvg : 0) : 0,
                        qbPassingTouchdowns: Object.hasOwn(player, 'Passing') ? (Object.hasOwn(player.Passing, 'passTD') ? player.Passing.passTD : 0) : 0,
                        qbInterceptions: Object.hasOwn(player, 'Passing') ? (Object.hasOwn(player.Passing, 'int') ? player.Passing.int : 0) : 0,
                        qbsacks: Object.hasOwn(player, 'Passing') ? (Object.hasOwn(player.Passing, 'sacked') ? Number(player.Passing.sacked.slice(0, player.Passing.sacked.indexOf('-'))) : 0) : 0,
                        qBRating: Object.hasOwn(player, 'Passing') ? (Object.hasOwn(player.Passing, 'qbr') ? player.Passing.qbr : 0) : 0,
                        adjQBR: Object.hasOwn(player, 'Passing') ? (Object.hasOwn(player.Passing, 'rtg') ? player.Passing.rtg : 0) : 0,
                        rushingAttempts: Object.hasOwn(player, 'Rushing') ? (Object.hasOwn(player.Rushing, 'carries') ? player.Rushing.carries : 0) : 0,
                        rushingYards: Object.hasOwn(player, 'Rushing') ? (Object.hasOwn(player.Rushing, 'rushYds') ? player.Rushing.rushYds : 0) : 0,
                        yardsPerRushAttempt: Object.hasOwn(player, 'Rushing') ? (Object.hasOwn(player.Rushing, 'rushAvg') ? player.Rushing.rushAvg : 0) : 0,
                        rushingTouchdowns: Object.hasOwn(player, 'Rushing') ? (Object.hasOwn(player.Rushing, 'rushTD') ? player.Rushing.rushTD : 0) : 0,
                        longRushing: Object.hasOwn(player, 'Rushing') ? (Object.hasOwn(player.Rushing, 'longRush') ? player.Rushing.longRush : 0) : 0,
                        receptions: Object.hasOwn(player, 'Receiving') ? (Object.hasOwn(player.Receiving, 'receptions') ? player.Receiving.receptions : 0) : 0,
                        receivingTargets: Object.hasOwn(player, 'Receiving') ? (Object.hasOwn(player.Receiving, 'targets') ? player.Receiving.targets : 0) : 0,
                        receivingYards: Object.hasOwn(player, 'Receiving') ? (Object.hasOwn(player.Receiving, 'recYds') ? player.Receiving.recYds : 0) : 0,
                        yardsPerReception: Object.hasOwn(player, 'Receiving') ? (Object.hasOwn(player.Receiving, 'recAvg') ? player.Receiving.recAvg : 0) : 0,
                        receivingTouchdowns: Object.hasOwn(player, 'Receiving') ? (Object.hasOwn(player.Receiving, 'recTD') ? player.Receiving.recTD : 0) : 0,
                        longReception: Object.hasOwn(player, 'Receiving') ? (Object.hasOwn(player.Receiving, 'longRec') ? player.Receiving.longRec : 0) : 0,
                        totalTackles: Object.hasOwn(player, 'Defense') ? (Object.hasOwn(player.Defense, 'totalTackles') ? player.Defense.totalTackles : 0) : 0,
                        sacks: Object.hasOwn(player, 'Defense') ? (Object.hasOwn(player.Defense, 'sacks') ? player.Defense.sacks : 0) : 0,
                        homeOrAway: reusedFunctions.getHomeAwayFromGameId(gameSummary.gameID, player.teamAbv)
                    })
                }

            }
            catch (error: any) {
                ErrorEmailController.sendEmailError("player stats push" + error.message + ' : ' + player.longName)
            }


        }


        finalReturn.push(playerStats)

        return finalReturn
    }

    static convertPlayerStatsToTotals(playerStats: DBNflPlayerGameStats[]): DBNflPlayerGameStatTotals {
        let finalReturn: DBNflPlayerGameStatTotals = {
            playerId: 0,
            playerName: "",
            teamName: '',
            teamId: 0,
            season: 0,
            qbCompletions: 0,
            qbPassingAttempts: 0,
            qbPassingYards: 0,
            qbYardsPerPassAttempt: 0,
            qbPassingTouchdowns: 0,
            qbInterceptions: 0,
            qbsacks: 0,
            qBRating: 0,
            adjQBR: 0,
            rushingAttempts: 0,
            rushingYards: 0,
            yardsPerRushAttempt: 0,
            rushingTouchdowns: 0,
            longRushing: 0,
            receptions: 0,
            receivingTargets: 0,
            receivingYards: 0,
            yardsPerReception: 0,
            receivingTouchdowns: 0,
            touchdowns: 0,
            longReception: 0,
            totalTackles: 0,
            sacks: 0

        };

        for (let game of playerStats) {
            finalReturn.playerId = game.playerId;
            finalReturn.playerName = game.playerName;
            finalReturn.teamId = game.teamId;
            finalReturn.teamName = game.teamName;
            finalReturn.season = game.season;
            finalReturn.qbCompletions += game.qbCompletions;
            finalReturn.qbPassingAttempts += game.qbPassingAttempts;
            finalReturn.qbPassingYards += game.qbPassingYards;
            finalReturn.qbPassingTouchdowns += game.qbPassingTouchdowns;
            finalReturn.qbInterceptions += game.qbInterceptions;
            finalReturn.qbsacks += game.qbsacks;
            finalReturn.qBRating += game.qBRating;
            finalReturn.adjQBR += game.adjQBR;
            finalReturn.rushingAttempts += game.rushingAttempts;
            finalReturn.rushingYards += game.rushingYards;
            finalReturn.rushingTouchdowns += game.rushingTouchdowns;
            finalReturn.receptions += game.receptions;
            finalReturn.receivingTargets += game.receivingTargets;
            finalReturn.receivingYards += game.receivingYards;
            finalReturn.receivingTouchdowns += game.receivingTouchdowns;
            finalReturn.totalTackles += game.totalTackles;
            finalReturn.sacks += game.sacks
        }

        finalReturn.qbYardsPerPassAttempt = finalReturn.qbPassingAttempts == 0 ? 0 : finalReturn.qbPassingYards / finalReturn.qbPassingAttempts;
        finalReturn.yardsPerRushAttempt = finalReturn.rushingAttempts == 0 ? 0 : finalReturn.rushingYards / finalReturn.rushingAttempts;
        finalReturn.yardsPerReception = finalReturn.receptions == 0 ? 0 : finalReturn.receivingYards / finalReturn.receptions;
        finalReturn.touchdowns = finalReturn.rushingTouchdowns + finalReturn.receivingTouchdowns + finalReturn.qbPassingTouchdowns;

        return finalReturn

    }

    static convertTeamStatsToTotals(teamStats: DBNflTeamGameStats[]): DBNflTeamGameStatTotals {
        let finalReturn: DBNflTeamGameStatTotals = {
            teamName: '',
            teamId: 0,
            season: 0,
            wins: 0,
            losses: 0,
            pointsScoredOverall: 0,
            pointsScoredFirstQuarter: 0,
            pointsScoredSecondQuarter: 0,
            pointsScoredThirdQuarter: 0,
            pointsScoredFourthQuarter: 0,
            totalYards: 0,
            totalRushingYards: 0,
            totalPassingYards: 0,
            totalRushingAttempts: 0,
            interceptionsThrown: 0,
            interceptionsCaught: 0,
            fumblesLost: 0,
            firstDowns: 0,
            sacksAgainst: 0,
            passCompletions: 0,
            passAttempts: 0,
            pointsAllowedOverall: 0,
            pointsAllowedFirstQuarter: 0,
            pointsAllowedSecondQuarter: 0,
            pointsAllowedThirdQuarter: 0,
            pointsAllowedFourthQuarter: 0,
            totalYardsAllowed: 0,
            totalRushingYardsAllowed: 0,
            totalPassingYardsAllowed: 0,
        }
        for (let stat of teamStats) {
            finalReturn.teamId = stat.teamId;
            finalReturn.teamName = stat.teamName;
            finalReturn.season = stat.season;
            finalReturn.wins += stat.result == 'W' ? 1 : 0;
            finalReturn.losses += stat.result == 'L' ? 1 : 0;
            finalReturn.pointsScoredOverall += stat.pointsScoredOverall;
            finalReturn.pointsScoredFirstQuarter += stat.pointsScoredFirstQuarter;
            finalReturn.pointsScoredSecondQuarter += stat.pointsScoredSecondQuarter;
            finalReturn.pointsScoredThirdQuarter += stat.pointsScoredThirdQuarter;
            finalReturn.pointsScoredFourthQuarter += stat.pointsScoredFourthQuarter;
            finalReturn.totalYards += stat.totalYards;
            finalReturn.totalRushingYards += stat.totalRushingYards;
            finalReturn.totalPassingYards += stat.totalPassingYards;
            finalReturn.totalRushingAttempts += stat.totalRushingAttempts;
            finalReturn.interceptionsThrown += stat.interceptionsThrown;
            finalReturn.interceptionsCaught += stat.interceptionsCaught;
            finalReturn.fumblesLost += stat.fumblesLost;
            finalReturn.firstDowns += stat.firstDowns;
            finalReturn.sacksAgainst += stat.sacksAgainst;
            finalReturn.passCompletions += stat.passCompletions;
            finalReturn.passAttempts += stat.passAttempts;
            finalReturn.pointsAllowedOverall += stat.pointsAllowedOverall;
            finalReturn.pointsAllowedFirstQuarter += stat.pointsAllowedFirstQuarter;
            finalReturn.pointsAllowedSecondQuarter += stat.pointsAllowedSecondQuarter;
            finalReturn.pointsAllowedThirdQuarter += stat.pointsAllowedThirdQuarter;
            finalReturn.pointsAllowedFourthQuarter += stat.pointsAllowedFourthQuarter;
            finalReturn.totalYardsAllowed += stat.totalYardsAllowed;
            finalReturn.totalRushingYardsAllowed += stat.totalRushingYardsAllowed;
            finalReturn.totalPassingYardsAllowed += stat.totalPassingYardsAllowed;

        }

        return finalReturn;
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

    static convertPlayers(playerList: any[]): DbPlayerInfo[] {
        let playerInfoFinal: DbPlayerInfo[] = []
        for (let player of playerList) {
            playerInfoFinal.push({
                playerId: player.playerID,
                playerName: this.setPlayerName(player.longName),
                teamName: player.team,
                teamId: player.teamID,
                sport: 'NFL'
            })
        }
        return playerInfoFinal
    }

    static convertGameIdsToArray(gameIds: any): string[] {
        let finalGameIds: string[] = []
        for (let gameId of gameIds) {
            if (gameId.gameStatus == 'Final' || gameId.gameStatus == 'Final/OT') {
                finalGameIds.push(gameId.gameID)
            }

        }
        return finalGameIds
    }
    static setPlayerName(name: string): string {
        let nameNew = name
        if (nameNew == "A.J. Brown") {
            nameNew = "AJ Brown"
        }
        else if (nameNew == 'A.J. Terrell') {
            nameNew = 'AJ Terrell'
        }
        else if (nameNew == 'A.J. Klein') {
            nameNew = 'AJ Klein'
        }
        return nameNew
    }
    static getSeason(gameDate: string): number {
        let monthDay = gameDate.slice(4)
        let year = gameDate.slice(0, 4)
        if (Number(monthDay) < 301) {
            year = (Number(year) - 1).toString()
        }

        return Number(year)
    }

    static async getTeamPropDataNew(props: DbGameBookData[], teamsInfo: DbTeamInfo[]): Promise<any[]> {
        let finalReturn: any[] = []
        let homeTeam = teamsInfo.filter(e => e.teamNameFull == props[0].homeTeam)[0]
        let awayTeam = teamsInfo.filter(e => e.teamNameFull == props[0].awayTeam)[0]
        let teamStatsCombined = await NflController.nflGetAllTeamStatsByTeamNamesAndSeason([homeTeam.teamNameAbvr, awayTeam.teamNameAbvr], 2024)
        let currentDate = new Date(props[0].commenceTime)
        let newCurrent = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
        let homeTeamStats = teamStatsCombined.filter(e => e.teamName == homeTeam.teamNameAbvr)
        let awayTeamStats = teamStatsCombined.filter(e => e.teamName == awayTeam.teamNameAbvr)
        let isHomeBackToBack: boolean = reusedFunctions.isBackToBackGame(reusedFunctions.convertToDateFromStringToDate(homeTeamStats[0].gameDate), newCurrent)
        let isAwayBackToBack: boolean = reusedFunctions.isBackToBackGame(reusedFunctions.convertToDateFromStringToDate(awayTeamStats[0].gameDate), newCurrent)
        /* for (let i = 0; i < homeTeamStats.length; i++) {
            homeTeamStats[i].gameDate = reusedFunctions.convertGameDateToMonthDay(teamStatsCombined[i].gameDate)
        }
        for (let i = 0; i < awayTeamStats.length; i++) {
            awayTeamStats[i].gameDate = reusedFunctions.convertGameDateToMonthDay(teamStatsCombined[i].gameDate)
        } */


        let teamProps = props.filter(e => {
            return e.teamName != 'Both';
        })
        let overUnderTotalProps = props.filter(e => {
            return e.teamName == 'Both';
        })



        let distinctTeamProps = teamProps.map(e => e.marketKey).filter((v, i, a) => a.indexOf(v) === i)

        let propTypeArray: any = []
        let homeTeamPropsFinal: any = []
        let awayTeamPropsFinal: any = []
        for (let i = 0; i < distinctTeamProps.length; i++) {
            homeTeamPropsFinal = []
            awayTeamPropsFinal = []
            let filteredPropsOnMarketKey = teamProps.filter(e => e.marketKey == distinctTeamProps[i])
            if (this.alternatePropNames.includes(distinctTeamProps[i])) {
                let distictTeams = filteredPropsOnMarketKey.map(e => e.teamName).filter((v, i, a) => a.indexOf(v) === i)
                let propArray: any = []
                for (let i = 0; i < distictTeams.length; i++) {
                    let teamProps = filteredPropsOnMarketKey.filter(e => e.teamName == distictTeams[i])
                    let distinctPoints = teamProps.map(e => e.point).filter((v, i, a) => a.indexOf(v) === i)
                    let teamArray: any = []
                    for (let j = 0; j < distinctPoints.length; j++) {
                        let filteredPointsProps = teamProps.filter(e => e.point == distinctPoints[j])
                        let pointArray: any = []
                        for (let m = 0; m < filteredPointsProps.length; m++) {
                            let teamStats = teamProps[i].teamName == homeTeam.teamNameFull ? homeTeamStats : awayTeamStats
                            let teamAgainstStats = teamProps[i].teamName == homeTeam.teamNameFull ? awayTeamStats : homeTeamStats
                            let teamProp: TeamPropDto = {
                                gameBookData: filteredPointsProps[m],
                                teamName: homeTeam.teamNameFull == filteredPointsProps[m].teamName ? homeTeam.teamNameAbvr : awayTeam.teamNameAbvr,
                                teamId: homeTeam.teamNameFull == filteredPointsProps[m].teamName ? homeTeam.teamId : awayTeam.teamId,
                                teamAgainstName: homeTeam.teamNameFull == filteredPointsProps[m].teamName ? awayTeam.teamNameAbvr : homeTeam.teamNameAbvr,
                                teamAgainstId: homeTeam.teamNameFull == filteredPointsProps[m].teamName ? awayTeam.teamId : homeTeam.teamId,
                                homeAway: homeTeam.teamNameAbvr == teamStats[0].teamName ? 'Home' : 'Away',
                                propType: '',
                                overallChance: 0,
                                overallWins: 0,
                                overallTotal: 0,
                                homeAwayChance: 0,
                                homeAwayWins: 0,
                                homeAwayTotal: 0,
                                teamChance: 0,
                                teamWins: 0,
                                teamTotal: 0,
                                overallWeighted: 0,
                                homeAwayWeighted: 0,
                                teamWeighted: 0,
                                averageOverall: 0,
                                averageHomeAway: 0,
                                averageTeam: 0,
                                highOverall: 0,
                                highHomeAway: 0,
                                highTeam: 0,
                                lowOverall: 0,
                                lowHomeAway: 0,
                                lowTeam: 0,
                                isDisabled: false,
                                teamStats: teamStats,
                                teamAgainstStats: teamAgainstStats,
                                last10Overall: [],
                                last10HomeAway: [],
                                last10Team: [],
                                trends: [],
                                fullGameLog: []
                            }
                            let overAllTableTemp = []
                            let homeAwayTableTemp = []
                            let teamTableTemp = []

                            let teamAgainstOverallWins = 0
                            let teamAgainstHomeAwayWins = 0
                            let teamAgainstTeamWins = 0
                            let teamAgainstOverallTotal = teamAgainstStats.length
                            let teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != teamProp.homeAway).length
                            let teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == teamProp.teamId).length
                            let teamAgainstOverallChance = 0
                            let teamAgainstHomeAwayChance = 0
                            let teamAgasintTeamChance = 0

                            teamProp.overallTotal = teamStats.length
                            teamProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == teamProp.homeAway).length
                            teamProp.teamTotal = teamStats.filter(e => e.teamAgainstId == teamProp.teamAgainstId).length
                            if (filteredPointsProps[m].marketKey == 'alternate_team_totals') {
                                if (filteredPointsProps[m].description == 'Over') {
                                    teamProp.overallWins = teamStats.filter(e => (e.pointsScoredOverall) > filteredPointsProps[m].point).length;

                                    teamProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == teamProp.homeAway && (e.pointsScoredOverall) > filteredPointsProps[m].point).length;

                                    teamProp.teamWins = teamStats.filter(e => e.teamAgainstId == teamProp.teamAgainstId && (e.pointsScoredOverall) > filteredPointsProps[m].point).length;

                                    teamAgainstOverallWins = teamAgainstStats.filter(e => e.pointsAllowedOverall < filteredPointsProps[m].point).length
                                    teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != teamProp.homeAway && e.pointsAllowedOverall < filteredPointsProps[m].point).length
                                    teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == teamProp.teamId && e.pointsAllowedOverall < filteredPointsProps[m].point).length

                                    overAllTableTemp = teamStats.slice(0, 10)
                                    homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == teamProp.homeAway).slice(0, 10)
                                    teamTableTemp = teamStats.filter(e => e.teamAgainstId == teamProp.teamAgainstId).slice(0, 10)
                                    let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredOverall) > filteredPointsProps[m].point).length
                                    teamProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                                    let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredOverall) > filteredPointsProps[m].point).length
                                    teamProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                                    let teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredOverall) > filteredPointsProps[m].point).length
                                    teamProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                                    let teamGameLog = []
                                    for (let i = 0; i < teamStats.length; i++) {
                                        teamGameLog.push({
                                            teamAgainstName: teamStats[i].teamAgainstName,
                                            gameDate: teamStats[i].gameDate,
                                            result: teamStats[i].pointsScoredOverall > filteredPointsProps[m].point ? 'W' : 'L',
                                            pointsScoredOverall: teamStats[i].pointsScoredOverall,
                                            pointsAllowedOverall: teamStats[i].pointsAllowedOverall,
                                            homeAway: teamStats[i].homeOrAway,
                                            gameId: teamStats[i].gameId
                                        })
                                    }
                                    teamProp.fullGameLog = teamGameLog

                                    let totalOverall = teamStats.map(e => (e.pointsScoredOverall))
                                    let totalHomeAway = teamStats.filter(e => e.homeOrAway == teamProp.homeAway).map(e => (e.pointsScoredOverall))
                                    let totalTeam = teamStats.filter(e => e.teamAgainstId == teamProp.teamAgainstId).map(e => (e.pointsScoredOverall))
                                    teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                                    teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                                    teamAgasintTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                                    teamProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                                    teamProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                                    teamProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                                    teamProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                                    teamProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                                    teamProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                                    teamProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                                    teamProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                                    teamProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                                    teamProp.overallChance = teamProp.overallTotal == 0 ? 0 : teamProp.overallWins / teamProp.overallTotal
                                    teamProp.homeAwayChance = teamProp.homeAwayTotal == 0 ? 0 : teamProp.homeAwayWins / teamProp.homeAwayTotal
                                    teamProp.teamChance = teamProp.teamTotal == 0 ? 0 : teamProp.teamWins / teamProp.teamTotal
                                    teamProp.overallWeighted = (teamProp.overallChance * (1 - teamAgainstOverallChance)) / ((teamProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - teamProp.overallChance)))
                                    teamProp.homeAwayWeighted = (teamProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((teamProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - teamProp.homeAwayChance)))
                                    teamProp.teamWeighted = (teamProp.teamChance * (1 - teamAgasintTeamChance)) / ((teamProp.teamChance * (1 - teamAgasintTeamChance)) + (teamAgasintTeamChance * (1 - teamProp.teamChance)))

                                    teamProp.propType = 'altTotal'
                                }
                                else {
                                    teamProp.overallWins = teamStats.filter(e => (e.pointsScoredOverall) < filteredPointsProps[m].point).length;

                                    teamProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == teamProp.homeAway && e.pointsScoredOverall < filteredPointsProps[m].point).length;

                                    teamProp.teamWins = teamStats.filter(e => e.teamAgainstId == teamProp.teamAgainstId && e.pointsScoredOverall < filteredPointsProps[m].point).length;

                                    teamAgainstOverallWins = teamAgainstStats.filter(e => e.pointsAllowedOverall > filteredPointsProps[m].point).length
                                    teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != teamProp.homeAway && e.pointsAllowedOverall > filteredPointsProps[m].point).length
                                    teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == teamProp.teamId && e.pointsAllowedOverall > filteredPointsProps[m].point).length

                                    overAllTableTemp = teamStats.slice(0, 10)
                                    homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == teamProp.homeAway).slice(0, 10)
                                    teamTableTemp = teamStats.filter(e => e.teamAgainstId == teamProp.teamAgainstId).slice(0, 10)
                                    let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredOverall) < filteredPointsProps[m].point).length
                                    teamProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                                    let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredOverall) < filteredPointsProps[m].point).length
                                    teamProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                                    let teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredOverall) < filteredPointsProps[m].point).length
                                    teamProp.last10Team = [teamLast10Wins, teamTableTemp.length]
                                    let teamGameLog = []
                                    for (let i = 0; i < teamStats.length; i++) {
                                        teamGameLog.push({
                                            teamAgainstName: teamStats[i].teamAgainstName,
                                            gameDate: teamStats[i].gameDate,
                                            result: teamStats[i].pointsScoredOverall < filteredPointsProps[m].point ? 'W' : 'L',
                                            pointsScoredOverall: teamStats[i].pointsScoredOverall,
                                            pointsAllowedOverall: teamStats[i].pointsAllowedOverall,
                                            homeAway: teamStats[i].homeOrAway,
                                            gameId: teamStats[i].gameId
                                        })
                                    }
                                    teamProp.fullGameLog = teamGameLog

                                    let totalOverall = teamStats.map(e => (e.pointsScoredOverall))
                                    let totalHomeAway = teamStats.filter(e => e.homeOrAway == teamProp.homeAway).map(e => (e.pointsScoredOverall))
                                    let totalTeam = teamStats.filter(e => e.teamAgainstId == teamProp.teamAgainstId).map(e => (e.pointsScoredOverall))
                                    teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                                    teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                                    teamAgasintTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                                    teamProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                                    teamProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                                    teamProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                                    teamProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                                    teamProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                                    teamProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                                    teamProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                                    teamProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                                    teamProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                                    teamProp.overallChance = teamProp.overallTotal == 0 ? 0 : teamProp.overallWins / teamProp.overallTotal
                                    teamProp.homeAwayChance = teamProp.homeAwayTotal == 0 ? 0 : teamProp.homeAwayWins / teamProp.homeAwayTotal
                                    teamProp.teamChance = teamProp.teamTotal == 0 ? 0 : teamProp.teamWins / teamProp.teamTotal
                                    teamProp.overallWeighted = (teamProp.overallChance * (1 - teamAgainstOverallChance)) / ((teamProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - teamProp.overallChance)))
                                    teamProp.homeAwayWeighted = (teamProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((teamProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - teamProp.homeAwayChance)))
                                    teamProp.teamWeighted = (teamProp.teamChance * (1 - teamAgasintTeamChance)) / ((teamProp.teamChance * (1 - teamAgasintTeamChance)) + (teamAgasintTeamChance * (1 - teamProp.teamChance)))

                                    teamProp.propType = 'altTotal'
                                }
                            }
                            else if (filteredPointsProps[m].marketKey == 'alternate_spreads') {
                                teamProp.overallWins = teamStats.filter(e => (e.pointsAllowedOverall - e.pointsScoredOverall) < filteredPointsProps[m].point).length;
                                teamProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == teamProp.homeAway && (e.pointsAllowedOverall - e.pointsScoredOverall) < filteredPointsProps[m].point).length;
                                teamProp.teamWins = teamStats.filter(e => e.teamAgainstId == teamProp.teamAgainstId && (e.pointsAllowedOverall - e.pointsScoredOverall) < filteredPointsProps[m].point).length;
                                teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredOverall - e.pointsAllowedOverall) > filteredPointsProps[m].point).length;
                                teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != teamProp.homeAway && (e.pointsScoredOverall - e.pointsAllowedOverall) > filteredPointsProps[m].point).length;
                                teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == teamProp.teamId && (e.pointsScoredOverall - e.pointsAllowedOverall) > filteredPointsProps[m].point).length;

                                let backToBack = teamProp.homeAway == 'Home' ? isHomeBackToBack : isAwayBackToBack
                                teamProp.trends = this.findTrends(teamProp.gameBookData, backToBack, 'spread', teamProp.homeAway, teamStats, teamAgainstStats)

                                overAllTableTemp = teamStats.slice(0, 10)
                                homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == teamProp.homeAway).slice(0, 10)
                                teamTableTemp = teamStats.filter(e => e.teamAgainstId == teamProp.teamAgainstId).slice(0, 10)
                                let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsAllowedOverall - e.pointsScoredOverall) < filteredPointsProps[m].point).length
                                teamProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                                let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsAllowedOverall - e.pointsScoredOverall) < filteredPointsProps[m].point).length
                                teamProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                                let teamLast10Wins = teamTableTemp.filter(e => (e.pointsAllowedOverall - e.pointsScoredOverall) < filteredPointsProps[m].point).length
                                teamProp.last10Team = [teamLast10Wins, teamTableTemp.length]
                                let teamGameLog = []
                                for (let i = 0; i < teamStats.length; i++) {
                                    teamGameLog.push({
                                        teamAgainstName: teamStats[i].teamAgainstName,
                                        gameDate: teamStats[i].gameDate,
                                        result: (teamStats[i].pointsAllowedOverall - teamStats[i].pointsScoredOverall) < filteredPointsProps[m].point ? 'W' : 'L',
                                        pointsScoredOverall: teamStats[i].pointsScoredOverall,
                                        pointsAllowedOverall: teamStats[i].pointsAllowedOverall,
                                        homeAway: teamStats[i].homeOrAway,
                                        gameId: teamStats[i].gameId

                                    })
                                }
                                teamProp.fullGameLog = teamGameLog

                                let spreadOverall = teamStats.map(e => (e.pointsAllowedOverall - e.pointsScoredOverall))
                                let spreadHomeAway = teamStats.filter(e => e.homeOrAway == teamProp.homeAway).map(e => (e.pointsAllowedOverall - e.pointsScoredOverall))
                                let spreadTeam = teamStats.filter(e => e.teamAgainstId == teamProp.teamAgainstId).map(e => (e.pointsAllowedOverall - e.pointsScoredOverall))
                                teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                                teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                                teamAgasintTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                                teamProp.lowOverall = spreadOverall.length > 0 ? Math.max(...spreadOverall) : 0
                                teamProp.highOverall = spreadOverall.length > 0 ? Math.min(...spreadOverall) : 0
                                teamProp.lowHomeAway = spreadHomeAway.length > 0 ? Math.max(...spreadHomeAway) : 0
                                teamProp.highHomeAway = spreadHomeAway.length > 0 ? Math.min(...spreadHomeAway) : 0
                                teamProp.lowTeam = spreadTeam.length > 0 ? Math.max(...spreadTeam) : 0
                                teamProp.highTeam = spreadTeam.length > 0 ? Math.min(...spreadTeam) : 0
                                teamProp.averageOverall = spreadOverall.length > 0 ? spreadOverall.reduce((a, b) => a + b) / spreadOverall.length : 0
                                teamProp.averageHomeAway = spreadHomeAway.length > 0 ? spreadHomeAway.reduce((a, b) => a + b) / spreadHomeAway.length : 0
                                teamProp.averageTeam = spreadTeam.length > 0 ? spreadTeam.reduce((a, b) => a + b) / spreadTeam.length : 0
                                teamProp.overallChance = teamProp.overallTotal == 0 ? 0 : teamProp.overallWins / teamProp.overallTotal
                                teamProp.homeAwayChance = teamProp.homeAwayTotal == 0 ? 0 : teamProp.homeAwayWins / teamProp.homeAwayTotal
                                teamProp.teamChance = teamProp.teamTotal == 0 ? 0 : teamProp.teamWins / teamProp.teamTotal
                                teamProp.overallWeighted = (teamProp.overallChance * (1 - teamAgainstOverallChance)) / ((teamProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - teamProp.overallChance)))
                                teamProp.homeAwayWeighted = (teamProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((teamProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - teamProp.homeAwayChance)))
                                teamProp.teamWeighted = (teamProp.teamChance * (1 - teamAgasintTeamChance)) / ((teamProp.teamChance * (1 - teamAgasintTeamChance)) + (teamAgasintTeamChance * (1 - teamProp.teamChance)))
                                teamProp.propType = 'altSpread'
                            }

                            pointArray.push(teamProp)
                        }
                        if (pointArray[0].gameBookData.marketKey == 'alternate_team_totals') {
                            pointArray.sort((a: any, b: any) => b.gameBookData.description.localeCompare(a.gameBookData.description))
                            pointArray.sort((a: any, b: any) => a.gameBookData.point - b.gameBookData.point)
                        }

                        teamArray.push(pointArray)

                    }
                    if (teamArray[0][0].gameBookData.marketKey == 'alternate_spreads') {
                        teamArray.sort((a: any, b: any) => b[0].gameBookData.point - a[0].gameBookData.point)
                    }
                    else {
                        teamArray.sort((a: any, b: any) => a[0].gameBookData.point - b[0].gameBookData.point)
                    }
                    if (teamArray[0][0].homeAway == "Home") {
                        homeTeamPropsFinal.push(teamArray)
                        if (teamArray[0][0].gameBookData.marketKey == 'alternate_team_totals') {
                            homeTeamPropsFinal[homeTeamPropsFinal.length - 1].propType = 'altTotal'
                            homeTeamPropsFinal[homeTeamPropsFinal.length - 1].index = 0

                        }
                        else if (teamArray[0][0].gameBookData.marketKey == 'alternate_spreads') {
                            homeTeamPropsFinal[homeTeamPropsFinal.length - 1].propType = 'altSpread'
                            homeTeamPropsFinal[homeTeamPropsFinal.length - 1].index = 0
                        }
                    }
                    else {
                        awayTeamPropsFinal.push(teamArray)
                        if (teamArray[0][0].gameBookData.marketKey == 'alternate_team_totals') {
                            awayTeamPropsFinal[awayTeamPropsFinal.length - 1].propType = 'altTotal'
                            awayTeamPropsFinal[awayTeamPropsFinal.length - 1].index = 0
                        }
                        else if (teamArray[0][0].gameBookData.marketKey == 'alternate_spreads') {
                            awayTeamPropsFinal[awayTeamPropsFinal.length - 1].propType = 'altSpread'
                            awayTeamPropsFinal[awayTeamPropsFinal.length - 1].index = 0
                        }
                    }


                }
                propTypeArray.push([awayTeamPropsFinal[0], homeTeamPropsFinal[0]])
                if (awayTeamPropsFinal[0][0][0].gameBookData.marketKey == 'alternate_team_totals') {
                    propTypeArray[propTypeArray.length - 1].propType = 'altTotal'

                }
                else if (awayTeamPropsFinal[0][0][0].gameBookData.marketKey == 'alternate_spreads') {
                    propTypeArray[propTypeArray.length - 1].propType = 'altSpread'

                }
                awayTeamPropsFinal = []
                homeTeamPropsFinal = []
            }
            else {
                let isByTeam = false;
                for (let i = 0; i < filteredPropsOnMarketKey.length; i++) {
                    let teamStats = filteredPropsOnMarketKey[i].teamName == homeTeam.teamNameFull ? homeTeamStats : awayTeamStats
                    let teamAgainstStats = filteredPropsOnMarketKey[i].teamName == homeTeam.teamNameFull ? awayTeamStats : homeTeamStats

                    let teamAgainstOverallWins = 0
                    let teamAgainstHomeAwayWins = 0
                    let teamAgainstTeamWins = 0

                    let propReturn: TeamPropDto = {
                        gameBookData: filteredPropsOnMarketKey[i],
                        teamName: homeTeam.teamNameFull == filteredPropsOnMarketKey[i].teamName ? homeTeam.teamNameAbvr : awayTeam.teamNameAbvr,
                        teamId: homeTeam.teamNameFull == filteredPropsOnMarketKey[i].teamName ? homeTeam.teamId : awayTeam.teamId,
                        teamAgainstName: homeTeam.teamNameFull == filteredPropsOnMarketKey[i].teamName ? awayTeam.teamNameAbvr : homeTeam.teamNameAbvr,
                        teamAgainstId: homeTeam.teamNameFull == filteredPropsOnMarketKey[i].teamName ? awayTeam.teamId : homeTeam.teamId,
                        homeAway: homeTeam.teamNameAbvr == teamStats[0].teamName ? 'Home' : 'Away',
                        propType: '',
                        overallChance: 0,
                        overallWins: 0,
                        overallTotal: 0,
                        homeAwayChance: 0,
                        homeAwayWins: 0,
                        homeAwayTotal: 0,
                        teamChance: 0,
                        teamWins: 0,
                        teamTotal: 0,
                        overallWeighted: 0,
                        homeAwayWeighted: 0,
                        teamWeighted: 0,
                        averageOverall: 0,
                        averageHomeAway: 0,
                        averageTeam: 0,
                        highOverall: 0,
                        highHomeAway: 0,
                        highTeam: 0,
                        lowOverall: 0,
                        lowHomeAway: 0,
                        lowTeam: 0,
                        isDisabled: false,
                        teamStats: teamStats,
                        teamAgainstStats: teamAgainstStats,
                        last10Overall: [],
                        last10HomeAway: [],
                        last10Team: [],
                        trends: [],
                        fullGameLog: []
                    }

                    let teamAgainstOverallTotal = teamAgainstStats.length
                    let teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway).length
                    let teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId).length


                    propReturn.overallTotal = teamStats.length;
                    propReturn.homeAwayTotal = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).length;
                    propReturn.teamTotal = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).length;
                    let overAllTableTemp = []
                    let homeAwayTableTemp = []
                    let teamTableTemp = []
                    if (filteredPropsOnMarketKey[i].marketKey == 'h2h') {
                        propReturn.overallWins = teamStats.filter(e => e.result == 'W').length;
                        propReturn.homeAwayWins = teamStats.filter(e => e.result == 'W' && e.homeOrAway == propReturn.homeAway).length;
                        propReturn.teamWins = teamStats.filter(e => e.result == 'W' && e.teamAgainstId == propReturn.teamAgainstId).length;
                        teamAgainstOverallWins = teamAgainstStats.filter(e => e.result == 'W').length;
                        teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.result == 'W' && e.homeOrAway != propReturn.homeAway).length;
                        teamAgainstTeamWins = teamAgainstStats.filter(e => e.result == 'W' && e.teamAgainstId == propReturn.teamId).length;

                        let backToBack = propReturn.homeAway == 'Home' ? isHomeBackToBack : isAwayBackToBack
                        propReturn.trends = this.findTrends(propReturn.gameBookData, backToBack, 'h2h', propReturn.homeAway, teamStats, teamAgainstStats)


                        overAllTableTemp = teamStats.slice(0, 10)
                        homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                        teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                        let overallLast10Wins = overAllTableTemp.filter(e => e.result == 'W').length
                        propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                        let homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.result == 'W').length
                        propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                        let teamLast10Wins = teamTableTemp.filter(e => e.result == 'W').length
                        propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]
                        let teamGameLog = []
                        for (let i = 0; i < teamStats.length; i++) {
                            teamGameLog.push({
                                teamAgainstName: teamStats[i].teamAgainstName,
                                gameDate: teamStats[i].gameDate,
                                result: teamStats[i].result,
                                pointsScoredOverall: teamStats[i].pointsScoredOverall,
                                pointsAllowedOverall: teamStats[i].pointsAllowedOverall,
                                homeAway: teamStats[i].homeOrAway,
                                gameId: teamStats[i].gameId
                            })
                        }
                        propReturn.fullGameLog = teamGameLog
                        propReturn.propType = 'h2h';
                    }
                    else if (filteredPropsOnMarketKey[i].marketKey == 'spreads') {
                        propReturn.overallWins = teamStats.filter(e => (e.pointsAllowedOverall - e.pointsScoredOverall) < filteredPropsOnMarketKey[i].point).length;
                        propReturn.homeAwayWins = teamStats.filter(e => e.homeOrAway == propReturn.homeAway && (e.pointsAllowedOverall - e.pointsScoredOverall) < filteredPropsOnMarketKey[i].point).length;
                        propReturn.teamWins = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId && (e.pointsAllowedOverall - e.pointsScoredOverall) < filteredPropsOnMarketKey[i].point).length;
                        teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredOverall - e.pointsAllowedOverall) > filteredPropsOnMarketKey[i].point).length;
                        teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && (e.pointsScoredOverall - e.pointsAllowedOverall) > filteredPropsOnMarketKey[i].point).length;
                        teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && (e.pointsScoredOverall - e.pointsAllowedOverall) > filteredPropsOnMarketKey[i].point).length;

                        let backToBack = propReturn.homeAway == 'Home' ? isHomeBackToBack : isAwayBackToBack
                        propReturn.trends = this.findTrends(propReturn.gameBookData, backToBack, 'spread', propReturn.homeAway, teamStats, teamAgainstStats)

                        overAllTableTemp = teamStats.slice(0, 10)
                        homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                        teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                        let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsAllowedOverall - e.pointsScoredOverall) < filteredPropsOnMarketKey[i].point).length
                        propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                        let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsAllowedOverall - e.pointsScoredOverall) < filteredPropsOnMarketKey[i].point).length
                        propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                        let teamLast10Wins = teamTableTemp.filter(e => (e.pointsAllowedOverall - e.pointsScoredOverall) < filteredPropsOnMarketKey[i].point).length
                        propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]
                        let teamGameLog = []
                        for (let z = 0; z < teamStats.length; z++) {
                            teamGameLog.push({
                                teamAgainstName: teamStats[z].teamAgainstName,
                                gameDate: teamStats[z].gameDate,
                                result: (teamStats[z].pointsAllowedOverall - teamStats[z].pointsScoredOverall) < filteredPropsOnMarketKey[i].point ? 'W' : 'L',
                                pointsScoredOverall: teamStats[z].pointsScoredOverall,
                                pointsAllowedOverall: teamStats[z].pointsAllowedOverall,
                                homeAway: teamStats[z].homeOrAway,
                                gameId: teamStats[z].gameId
                            })
                        }
                        propReturn.fullGameLog = teamGameLog

                        let spreadOverall = teamStats.map(e => (e.pointsAllowedOverall - e.pointsScoredOverall))
                        let spreadHomeAway = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).map(e => (e.pointsAllowedOverall - e.pointsScoredOverall))
                        let spreadTeam = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).map(e => (e.pointsAllowedOverall - e.pointsScoredOverall))
                        propReturn.lowOverall = spreadOverall.length > 0 ? Math.max(...spreadOverall) : 0
                        propReturn.highOverall = spreadOverall.length > 0 ? Math.min(...spreadOverall) : 0
                        propReturn.lowHomeAway = spreadHomeAway.length > 0 ? Math.max(...spreadHomeAway) : 0
                        propReturn.highHomeAway = spreadHomeAway.length > 0 ? Math.min(...spreadHomeAway) : 0
                        propReturn.lowTeam = spreadTeam.length > 0 ? Math.max(...spreadTeam) : 0
                        propReturn.highTeam = spreadTeam.length > 0 ? Math.min(...spreadTeam) : 0
                        propReturn.averageOverall = spreadOverall.length > 0 ? spreadOverall.reduce((a, b) => a + b) / spreadOverall.length : 0
                        propReturn.averageHomeAway = spreadHomeAway.length > 0 ? spreadHomeAway.reduce((a, b) => a + b) / spreadHomeAway.length : 0
                        propReturn.averageTeam = spreadTeam.length > 0 ? spreadTeam.reduce((a, b) => a + b) / spreadTeam.length : 0
                        propReturn.propType = 'spread'
                    }
                    else if (filteredPropsOnMarketKey[i].marketKey == 'h2h_q1') {
                        propReturn.overallWins = teamStats.filter(e => e.pointsAllowedFirstQuarter < e.pointsScoredFirstQuarter).length;
                        propReturn.homeAwayWins = teamStats.filter(e => (e.pointsAllowedFirstQuarter < e.pointsScoredFirstQuarter) && e.homeOrAway == propReturn.homeAway).length;
                        propReturn.teamWins = teamStats.filter(e => (e.pointsAllowedFirstQuarter < e.pointsScoredFirstQuarter) && e.teamAgainstId == propReturn.teamAgainstId).length;
                        teamAgainstOverallWins = teamAgainstStats.filter(e => e.pointsScoredFirstQuarter >= e.pointsAllowedFirstQuarter).length;
                        teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && e.pointsScoredFirstQuarter >= e.pointsAllowedFirstQuarter).length;
                        teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && e.pointsScoredFirstQuarter >= e.pointsAllowedFirstQuarter).length;
                        overAllTableTemp = teamStats.slice(0, 10)
                        homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                        teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                        let overallLast10Wins = overAllTableTemp.filter(e => e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter).length
                        propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                        let homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter).length
                        propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                        let teamLast10Wins = teamTableTemp.filter(e => e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter).length
                        propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]
                        let teamGameLog = []
                        for (let i = 0; i < teamStats.length; i++) {
                            teamGameLog.push({
                                teamAgainstName: teamStats[i].teamAgainstName,
                                gameDate: teamStats[i].gameDate,
                                result: teamStats[i].pointsScoredFirstQuarter > teamStats[i].pointsAllowedFirstQuarter ? 'W' : 'L',
                                pointsScoredOverall: teamStats[i].pointsScoredFirstQuarter,
                                pointsAllowedOverall: teamStats[i].pointsAllowedFirstQuarter,
                                homeAway: teamStats[i].homeOrAway,
                                gameId: teamStats[i].gameId
                            })
                        }
                        propReturn.fullGameLog = teamGameLog
                        propReturn.propType = 'h2h'
                    }
                    else if (filteredPropsOnMarketKey[i].marketKey == 'h2h_q2') {
                        propReturn.overallWins = teamStats.filter(e => e.pointsAllowedSecondQuarter < e.pointsScoredSecondQuarter).length;
                        propReturn.homeAwayWins = teamStats.filter(e => (e.pointsAllowedSecondQuarter < e.pointsScoredSecondQuarter) && e.homeOrAway == propReturn.homeAway).length;
                        propReturn.teamWins = teamStats.filter(e => (e.pointsAllowedSecondQuarter < e.pointsScoredSecondQuarter) && e.teamAgainstId == propReturn.teamAgainstId).length;
                        teamAgainstOverallWins = teamAgainstStats.filter(e => e.pointsScoredSecondQuarter >= e.pointsAllowedSecondQuarter).length;
                        teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && e.pointsScoredSecondQuarter >= e.pointsAllowedSecondQuarter).length;
                        teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && e.pointsScoredSecondQuarter >= e.pointsAllowedSecondQuarter).length;
                        overAllTableTemp = teamStats.slice(0, 10)
                        homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                        teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                        let overallLast10Wins = overAllTableTemp.filter(e => e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter).length
                        propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                        let homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter).length
                        propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                        let teamLast10Wins = teamTableTemp.filter(e => e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter).length
                        propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]
                        let teamGameLog = []
                        for (let i = 0; i < teamStats.length; i++) {
                            teamGameLog.push({
                                teamAgainstName: teamStats[i].teamAgainstName,
                                gameDate: teamStats[i].gameDate,
                                result: teamStats[i].pointsScoredSecondQuarter > teamStats[i].pointsAllowedSecondQuarter ? 'W' : 'L',
                                pointsScoredOverall: teamStats[i].pointsScoredSecondQuarter,
                                pointsAllowedOverall: teamStats[i].pointsAllowedSecondQuarter,
                                homeAway: teamStats[i].homeOrAway,
                                gameId: teamStats[i].gameId
                            })
                        }
                        propReturn.fullGameLog = teamGameLog
                        propReturn.propType = 'h2h'
                    }
                    else if (filteredPropsOnMarketKey[i].marketKey == 'h2h_q3') {
                        propReturn.overallWins = teamStats.filter(e => e.pointsAllowedThirdQuarter < e.pointsScoredThirdQuarter).length;
                        propReturn.homeAwayWins = teamStats.filter(e => (e.pointsAllowedThirdQuarter < e.pointsScoredThirdQuarter) && e.homeOrAway == propReturn.homeAway).length;
                        propReturn.teamWins = teamStats.filter(e => (e.pointsAllowedThirdQuarter < e.pointsScoredThirdQuarter) && e.teamAgainstId == propReturn.teamAgainstId).length;
                        teamAgainstOverallWins = teamAgainstStats.filter(e => e.pointsScoredThirdQuarter >= e.pointsAllowedThirdQuarter).length;
                        teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && e.pointsScoredThirdQuarter >= e.pointsAllowedThirdQuarter).length;
                        teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && e.pointsScoredThirdQuarter >= e.pointsAllowedThirdQuarter).length;
                        overAllTableTemp = teamStats.slice(0, 10)
                        homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                        teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                        let overallLast10Wins = overAllTableTemp.filter(e => e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter).length
                        propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                        let homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter).length
                        propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                        let teamLast10Wins = teamTableTemp.filter(e => e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter).length
                        propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]
                        let teamGameLog = []
                        for (let i = 0; i < teamStats.length; i++) {
                            teamGameLog.push({
                                teamAgainstName: teamStats[i].teamAgainstName,
                                gameDate: teamStats[i].gameDate,
                                result: teamStats[i].pointsScoredThirdQuarter > teamStats[i].pointsAllowedThirdQuarter ? 'W' : 'L',
                                pointsScoredOverall: teamStats[i].pointsScoredThirdQuarter,
                                pointsAllowedOverall: teamStats[i].pointsAllowedThirdQuarter,
                                homeAway: teamStats[i].homeOrAway,
                                gameId: teamStats[i].gameId
                            })
                        }
                        propReturn.fullGameLog = teamGameLog
                        propReturn.propType = 'h2h'
                    }
                    else if (filteredPropsOnMarketKey[i].marketKey == 'h2h_q4') {
                        propReturn.overallWins = teamStats.filter(e => e.pointsAllowedFourthQuarter < e.pointsScoredFourthQuarter).length;
                        propReturn.homeAwayWins = teamStats.filter(e => (e.pointsAllowedFourthQuarter < e.pointsScoredFourthQuarter) && e.homeOrAway == propReturn.homeAway).length;
                        propReturn.teamWins = teamStats.filter(e => (e.pointsAllowedFourthQuarter < e.pointsScoredFourthQuarter) && e.teamAgainstId == propReturn.teamAgainstId).length;
                        teamAgainstOverallWins = teamAgainstStats.filter(e => e.pointsScoredFourthQuarter >= e.pointsAllowedFourthQuarter).length;
                        teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && e.pointsScoredFourthQuarter >= e.pointsAllowedFourthQuarter).length;
                        teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && e.pointsScoredFourthQuarter >= e.pointsAllowedFourthQuarter).length;
                        overAllTableTemp = teamStats.slice(0, 10)
                        homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                        teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                        let overallLast10Wins = overAllTableTemp.filter(e => e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter).length
                        propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                        let homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter).length
                        propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                        let teamLast10Wins = teamTableTemp.filter(e => e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter).length
                        propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]
                        let teamGameLog = []
                        for (let i = 0; i < teamStats.length; i++) {
                            teamGameLog.push({
                                teamAgainstName: teamStats[i].teamAgainstName,
                                gameDate: teamStats[i].gameDate,
                                result: teamStats[i].pointsScoredFourthQuarter > teamStats[i].pointsAllowedFourthQuarter ? 'W' : 'L',
                                pointsScoredOverall: teamStats[i].pointsScoredFourthQuarter,
                                pointsAllowedOverall: teamStats[i].pointsAllowedFourthQuarter,
                                homeAway: teamStats[i].homeOrAway,
                                gameId: teamStats[i].gameId
                            })
                        }
                        propReturn.fullGameLog = teamGameLog
                        propReturn.propType = 'h2h'
                    }
                    else if (filteredPropsOnMarketKey[i].marketKey == 'h2h_h1') {
                        propReturn.overallWins = teamStats.filter(e => (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) < (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)).length;
                        propReturn.homeAwayWins = teamStats.filter(e => (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) < (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) && e.homeOrAway == propReturn.homeAway).length;
                        propReturn.teamWins = teamStats.filter(e => (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) < (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) && e.teamAgainstId == propReturn.teamAgainstId).length;
                        teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) >= (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)).length;
                        teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) >= (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)).length;
                        teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) >= (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)).length;
                        overAllTableTemp = teamStats.slice(0, 10)
                        homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                        teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                        let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)).length
                        propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                        let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)).length
                        propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                        let teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)).length
                        propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]
                        let teamGameLog = []
                        for (let i = 0; i < teamStats.length; i++) {
                            teamGameLog.push({
                                teamAgainstName: teamStats[i].teamAgainstName,
                                gameDate: teamStats[i].gameDate,
                                result: (teamStats[i].pointsScoredFirstQuarter + teamStats[i].pointsScoredSecondQuarter) > (teamStats[i].pointsAllowedFirstQuarter + teamStats[i].pointsAllowedSecondQuarter) ? 'W' : 'L',
                                pointsScoredOverall: (teamStats[i].pointsScoredFirstQuarter + teamStats[i].pointsScoredSecondQuarter),
                                pointsAllowedOverall: (teamStats[i].pointsAllowedFirstQuarter + teamStats[i].pointsAllowedSecondQuarter),
                                homeAway: teamStats[i].homeOrAway,
                                gameId: teamStats[i].gameId
                            })
                        }
                        propReturn.fullGameLog = teamGameLog
                        propReturn.propType = 'h2h'
                    }
                    else if (filteredPropsOnMarketKey[i].marketKey == 'h2h_h2') {
                        propReturn.overallWins = teamStats.filter(e => (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) < (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)).length;
                        propReturn.homeAwayWins = teamStats.filter(e => (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) < (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) && e.homeOrAway == propReturn.homeAway).length;
                        propReturn.teamWins = teamStats.filter(e => (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) < (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) && e.teamAgainstId == propReturn.teamAgainstId).length;
                        teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) >= (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)).length;
                        teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) >= (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)).length;
                        teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) >= (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)).length;
                        overAllTableTemp = teamStats.slice(0, 10)
                        homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                        teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                        let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)).length
                        propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                        let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)).length
                        propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                        let teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)).length
                        propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]
                        let teamGameLog = []
                        for (let i = 0; i < teamStats.length; i++) {
                            teamGameLog.push({
                                teamAgainstName: teamStats[i].teamAgainstName,
                                gameDate: teamStats[i].gameDate,
                                result: (teamStats[i].pointsScoredThirdQuarter + teamStats[i].pointsScoredFourthQuarter) > (teamStats[i].pointsAllowedThirdQuarter + teamStats[i].pointsAllowedFourthQuarter) ? 'W' : 'L',
                                pointsScoredOverall: (teamStats[i].pointsScoredThirdQuarter + teamStats[i].pointsScoredFourthQuarter),
                                pointsAllowedOverall: (teamStats[i].pointsAllowedThirdQuarter + teamStats[i].pointsAllowedFourthQuarter),
                                homeAway: teamStats[i].homeOrAway,
                                gameId: teamStats[i].gameId
                            })
                        }
                        propReturn.fullGameLog = teamGameLog
                        propReturn.propType = 'h2h'
                    }
                    else if (filteredPropsOnMarketKey[i].marketKey == 'spreads_q1') {
                        propReturn.overallWins = teamStats.filter(e => (e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter) < filteredPropsOnMarketKey[i].point).length;
                        propReturn.homeAwayWins = teamStats.filter(e => e.homeOrAway == propReturn.homeAway && (e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter) < filteredPropsOnMarketKey[i].point).length;
                        propReturn.teamWins = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId && (e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter) < filteredPropsOnMarketKey[i].point).length;
                        teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredFirstQuarter - e.pointsAllowedFirstQuarter) > filteredPropsOnMarketKey[i].point).length;
                        teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && (e.pointsScoredFirstQuarter - e.pointsAllowedFirstQuarter) > filteredPropsOnMarketKey[i].point).length;
                        teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && (e.pointsScoredFirstQuarter - e.pointsAllowedFirstQuarter) > filteredPropsOnMarketKey[i].point).length;

                        let backToBack = propReturn.homeAway == 'Home' ? isHomeBackToBack : isAwayBackToBack
                        propReturn.trends = this.findTrends(propReturn.gameBookData, backToBack, 'spread', propReturn.homeAway, teamStats, teamAgainstStats)

                        overAllTableTemp = teamStats.slice(0, 10)
                        homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                        teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                        let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter) < filteredPropsOnMarketKey[i].point).length
                        propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                        let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter) < filteredPropsOnMarketKey[i].point).length
                        propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                        let teamLast10Wins = teamTableTemp.filter(e => (e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter) < filteredPropsOnMarketKey[i].point).length
                        propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]
                        let teamGameLog = []
                        for (let z = 0; z < teamStats.length; z++) {
                            teamGameLog.push({
                                teamAgainstName: teamStats[z].teamAgainstName,
                                gameDate: teamStats[z].gameDate,
                                result: (teamStats[z].pointsAllowedFirstQuarter - teamStats[z].pointsScoredFirstQuarter) < filteredPropsOnMarketKey[i].point ? 'W' : 'L',
                                pointsScoredOverall: teamStats[z].pointsScoredFirstQuarter,
                                pointsAllowedOverall: teamStats[z].pointsAllowedFirstQuarter,
                                homeAway: teamStats[z].homeOrAway,
                                gameId: teamStats[z].gameId
                            })
                        }
                        propReturn.fullGameLog = teamGameLog

                        let spreadOverall = teamStats.map(e => (e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter))
                        let spreadHomeAway = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).map(e => (e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter))
                        let spreadTeam = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).map(e => (e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter))
                        propReturn.lowOverall = spreadOverall.length > 0 ? Math.max(...spreadOverall) : 0
                        propReturn.highOverall = spreadOverall.length > 0 ? Math.min(...spreadOverall) : 0
                        propReturn.lowHomeAway = spreadHomeAway.length > 0 ? Math.max(...spreadHomeAway) : 0
                        propReturn.highHomeAway = spreadHomeAway.length > 0 ? Math.min(...spreadHomeAway) : 0
                        propReturn.lowTeam = spreadTeam.length > 0 ? Math.max(...spreadTeam) : 0
                        propReturn.highTeam = spreadTeam.length > 0 ? Math.min(...spreadTeam) : 0
                        propReturn.averageOverall = spreadOverall.length > 0 ? spreadOverall.reduce((a, b) => a + b) / spreadOverall.length : 0
                        propReturn.averageHomeAway = spreadHomeAway.length > 0 ? spreadHomeAway.reduce((a, b) => a + b) / spreadHomeAway.length : 0
                        propReturn.averageTeam = spreadTeam.length > 0 ? spreadTeam.reduce((a, b) => a + b) / spreadTeam.length : 0
                        propReturn.propType = 'spread'
                    }
                    else if (filteredPropsOnMarketKey[i].marketKey == 'spreads_q2') {
                        propReturn.overallWins = teamStats.filter(e => (e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter) < filteredPropsOnMarketKey[i].point).length;
                        propReturn.homeAwayWins = teamStats.filter(e => e.homeOrAway == propReturn.homeAway && (e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter) < filteredPropsOnMarketKey[i].point).length;
                        propReturn.teamWins = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId && (e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter) < filteredPropsOnMarketKey[i].point).length;
                        teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredSecondQuarter - e.pointsAllowedSecondQuarter) > filteredPropsOnMarketKey[i].point).length;
                        teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && (e.pointsScoredSecondQuarter - e.pointsAllowedSecondQuarter) > filteredPropsOnMarketKey[i].point).length;
                        teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && (e.pointsScoredSecondQuarter - e.pointsAllowedSecondQuarter) > filteredPropsOnMarketKey[i].point).length;

                        let backToBack = propReturn.homeAway == 'Home' ? isHomeBackToBack : isAwayBackToBack
                        propReturn.trends = this.findTrends(propReturn.gameBookData, backToBack, 'spread', propReturn.homeAway, teamStats, teamAgainstStats)

                        overAllTableTemp = teamStats.slice(0, 10)
                        homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                        teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                        let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter) < filteredPropsOnMarketKey[i].point).length
                        propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                        let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter) < filteredPropsOnMarketKey[i].point).length
                        propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                        let teamLast10Wins = teamTableTemp.filter(e => (e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter) < filteredPropsOnMarketKey[i].point).length
                        propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]
                        let teamGameLog = []
                        for (let z = 0; z < teamStats.length; z++) {
                            teamGameLog.push({
                                teamAgainstName: teamStats[z].teamAgainstName,
                                gameDate: teamStats[z].gameDate,
                                result: (teamStats[z].pointsAllowedSecondQuarter - teamStats[z].pointsScoredSecondQuarter) < filteredPropsOnMarketKey[i].point ? 'W' : 'L',
                                pointsScoredOverall: teamStats[z].pointsScoredSecondQuarter,
                                pointsAllowedOverall: teamStats[z].pointsAllowedSecondQuarter,
                                homeAway: teamStats[z].homeOrAway,
                                gameId: teamStats[z].gameId
                            })
                        }
                        propReturn.fullGameLog = teamGameLog

                        let spreadOverall = teamStats.map(e => (e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter))
                        let spreadHomeAway = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).map(e => (e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter))
                        let spreadTeam = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).map(e => (e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter))
                        propReturn.lowOverall = spreadOverall.length > 0 ? Math.max(...spreadOverall) : 0
                        propReturn.highOverall = spreadOverall.length > 0 ? Math.min(...spreadOverall) : 0
                        propReturn.lowHomeAway = spreadHomeAway.length > 0 ? Math.max(...spreadHomeAway) : 0
                        propReturn.highHomeAway = spreadHomeAway.length > 0 ? Math.min(...spreadHomeAway) : 0
                        propReturn.lowTeam = spreadTeam.length > 0 ? Math.max(...spreadTeam) : 0
                        propReturn.highTeam = spreadTeam.length > 0 ? Math.min(...spreadTeam) : 0
                        propReturn.averageOverall = spreadOverall.length > 0 ? spreadOverall.reduce((a, b) => a + b) / spreadOverall.length : 0
                        propReturn.averageHomeAway = spreadHomeAway.length > 0 ? spreadHomeAway.reduce((a, b) => a + b) / spreadHomeAway.length : 0
                        propReturn.averageTeam = spreadTeam.length > 0 ? spreadTeam.reduce((a, b) => a + b) / spreadTeam.length : 0
                        propReturn.propType = 'spread'
                    }
                    else if (filteredPropsOnMarketKey[i].marketKey == 'spreads_q3') {
                        propReturn.overallWins = teamStats.filter(e => (e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter) < filteredPropsOnMarketKey[i].point).length;
                        propReturn.homeAwayWins = teamStats.filter(e => e.homeOrAway == propReturn.homeAway && (e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter) < filteredPropsOnMarketKey[i].point).length;
                        propReturn.teamWins = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId && (e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter) < filteredPropsOnMarketKey[i].point).length;
                        teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredThirdQuarter - e.pointsAllowedThirdQuarter) > filteredPropsOnMarketKey[i].point).length;
                        teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && (e.pointsScoredThirdQuarter - e.pointsAllowedThirdQuarter) > filteredPropsOnMarketKey[i].point).length;
                        teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && (e.pointsScoredThirdQuarter - e.pointsAllowedThirdQuarter) > filteredPropsOnMarketKey[i].point).length;

                        let backToBack = propReturn.homeAway == 'Home' ? isHomeBackToBack : isAwayBackToBack
                        propReturn.trends = this.findTrends(propReturn.gameBookData, backToBack, 'spread', propReturn.homeAway, teamStats, teamAgainstStats)

                        overAllTableTemp = teamStats.slice(0, 10)
                        homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                        teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                        let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter) < filteredPropsOnMarketKey[i].point).length
                        propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                        let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter) < filteredPropsOnMarketKey[i].point).length
                        propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                        let teamLast10Wins = teamTableTemp.filter(e => (e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter) < filteredPropsOnMarketKey[i].point).length
                        propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]
                        let teamGameLog = []
                        for (let z = 0; z < teamStats.length; z++) {
                            teamGameLog.push({
                                teamAgainstName: teamStats[z].teamAgainstName,
                                gameDate: teamStats[z].gameDate,
                                result: (teamStats[z].pointsAllowedThirdQuarter - teamStats[z].pointsScoredThirdQuarter) < filteredPropsOnMarketKey[i].point ? 'W' : 'L',
                                pointsScoredOverall: teamStats[z].pointsScoredThirdQuarter,
                                pointsAllowedOverall: teamStats[z].pointsAllowedThirdQuarter,
                                homeAway: teamStats[z].homeOrAway,
                                gameId: teamStats[z].gameId
                            })
                        }
                        propReturn.fullGameLog = teamGameLog

                        let spreadOverall = teamStats.map(e => (e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter))
                        let spreadHomeAway = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).map(e => (e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter))
                        let spreadTeam = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).map(e => (e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter))
                        propReturn.lowOverall = spreadOverall.length > 0 ? Math.max(...spreadOverall) : 0
                        propReturn.highOverall = spreadOverall.length > 0 ? Math.min(...spreadOverall) : 0
                        propReturn.lowHomeAway = spreadHomeAway.length > 0 ? Math.max(...spreadHomeAway) : 0
                        propReturn.highHomeAway = spreadHomeAway.length > 0 ? Math.min(...spreadHomeAway) : 0
                        propReturn.lowTeam = spreadTeam.length > 0 ? Math.max(...spreadTeam) : 0
                        propReturn.highTeam = spreadTeam.length > 0 ? Math.min(...spreadTeam) : 0
                        propReturn.averageOverall = spreadOverall.length > 0 ? spreadOverall.reduce((a, b) => a + b) / spreadOverall.length : 0
                        propReturn.averageHomeAway = spreadHomeAway.length > 0 ? spreadHomeAway.reduce((a, b) => a + b) / spreadHomeAway.length : 0
                        propReturn.averageTeam = spreadTeam.length > 0 ? spreadTeam.reduce((a, b) => a + b) / spreadTeam.length : 0
                        propReturn.propType = 'spread'
                    }
                    else if (filteredPropsOnMarketKey[i].marketKey == 'spreads_q4') {
                        propReturn.overallWins = teamStats.filter(e => (e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter) < filteredPropsOnMarketKey[i].point).length;
                        propReturn.homeAwayWins = teamStats.filter(e => e.homeOrAway == propReturn.homeAway && (e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter) < filteredPropsOnMarketKey[i].point).length;
                        propReturn.teamWins = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId && (e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter) < filteredPropsOnMarketKey[i].point).length;
                        teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredFourthQuarter - e.pointsAllowedFourthQuarter) > filteredPropsOnMarketKey[i].point).length;
                        teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && (e.pointsScoredFourthQuarter - e.pointsAllowedFourthQuarter) > filteredPropsOnMarketKey[i].point).length;
                        teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && (e.pointsScoredFourthQuarter - e.pointsAllowedFourthQuarter) > filteredPropsOnMarketKey[i].point).length;

                        let backToBack = propReturn.homeAway == 'Home' ? isHomeBackToBack : isAwayBackToBack
                        propReturn.trends = this.findTrends(propReturn.gameBookData, backToBack, 'spread', propReturn.homeAway, teamStats, teamAgainstStats)

                        overAllTableTemp = teamStats.slice(0, 10)
                        homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                        teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                        let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter) < filteredPropsOnMarketKey[i].point).length
                        propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                        let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter) < filteredPropsOnMarketKey[i].point).length
                        propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                        let teamLast10Wins = teamTableTemp.filter(e => (e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter) < filteredPropsOnMarketKey[i].point).length
                        propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]
                        let teamGameLog = []
                        for (let z = 0; z < teamStats.length; z++) {
                            teamGameLog.push({
                                teamAgainstName: teamStats[z].teamAgainstName,
                                gameDate: teamStats[z].gameDate,
                                result: (teamStats[z].pointsAllowedFourthQuarter - teamStats[z].pointsScoredFourthQuarter) < filteredPropsOnMarketKey[i].point ? 'W' : 'L',
                                pointsScoredOverall: teamStats[z].pointsScoredFourthQuarter,
                                pointsAllowedOverall: teamStats[z].pointsAllowedFourthQuarter,
                                homeAway: teamStats[z].homeOrAway,
                                gameId: teamStats[z].gameId
                            })
                        }
                        propReturn.fullGameLog = teamGameLog

                        let spreadOverall = teamStats.map(e => (e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter))
                        let spreadHomeAway = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).map(e => (e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter))
                        let spreadTeam = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).map(e => (e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter))
                        propReturn.lowOverall = spreadOverall.length > 0 ? Math.max(...spreadOverall) : 0
                        propReturn.highOverall = spreadOverall.length > 0 ? Math.min(...spreadOverall) : 0
                        propReturn.lowHomeAway = spreadHomeAway.length > 0 ? Math.max(...spreadHomeAway) : 0
                        propReturn.highHomeAway = spreadHomeAway.length > 0 ? Math.min(...spreadHomeAway) : 0
                        propReturn.lowTeam = spreadTeam.length > 0 ? Math.max(...spreadTeam) : 0
                        propReturn.highTeam = spreadTeam.length > 0 ? Math.min(...spreadTeam) : 0
                        propReturn.averageOverall = spreadOverall.length > 0 ? spreadOverall.reduce((a, b) => a + b) / spreadOverall.length : 0
                        propReturn.averageHomeAway = spreadHomeAway.length > 0 ? spreadHomeAway.reduce((a, b) => a + b) / spreadHomeAway.length : 0
                        propReturn.averageTeam = spreadTeam.length > 0 ? spreadTeam.reduce((a, b) => a + b) / spreadTeam.length : 0
                        propReturn.propType = 'spread'
                    }
                    else if (filteredPropsOnMarketKey[i].marketKey == 'spreads_h1') {
                        propReturn.overallWins = teamStats.filter(e => ((e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)) < filteredPropsOnMarketKey[i].point).length;
                        propReturn.homeAwayWins = teamStats.filter(e => e.homeOrAway == propReturn.homeAway && ((e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)) < filteredPropsOnMarketKey[i].point).length;
                        propReturn.teamWins = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId && ((e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)) < filteredPropsOnMarketKey[i].point).length;
                        teamAgainstOverallWins = teamAgainstStats.filter(e => ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) - (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) > filteredPropsOnMarketKey[i].point).length;
                        teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) - (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) > filteredPropsOnMarketKey[i].point).length;
                        teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) - (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) > filteredPropsOnMarketKey[i].point).length;

                        let backToBack = propReturn.homeAway == 'Home' ? isHomeBackToBack : isAwayBackToBack
                        propReturn.trends = this.findTrends(propReturn.gameBookData, backToBack, 'spread', propReturn.homeAway, teamStats, teamAgainstStats)

                        overAllTableTemp = teamStats.slice(0, 10)
                        homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                        teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                        let overallLast10Wins = overAllTableTemp.filter(e => ((e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)) < filteredPropsOnMarketKey[i].point).length
                        propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                        let homeAwayLast10Wins = homeAwayTableTemp.filter(e => ((e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)) < filteredPropsOnMarketKey[i].point).length
                        propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                        let teamLast10Wins = teamTableTemp.filter(e => ((e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)) < filteredPropsOnMarketKey[i].point).length
                        propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]
                        let teamGameLog = []
                        for (let z = 0; z < teamStats.length; z++) {
                            teamGameLog.push({
                                teamAgainstName: teamStats[z].teamAgainstName,
                                gameDate: teamStats[z].gameDate,
                                result: ((teamStats[z].pointsAllowedFirstQuarter + teamStats[z].pointsAllowedSecondQuarter) - (teamStats[z].pointsScoredFirstQuarter + teamStats[z].pointsScoredSecondQuarter) < filteredPropsOnMarketKey[i].point) ? 'W' : 'L',
                                pointsScoredOverall: teamStats[z].pointsScoredFirstQuarter + teamStats[z].pointsScoredSecondQuarter,
                                pointsAllowedOverall: teamStats[z].pointsAllowedFirstQuarter + teamStats[z].pointsAllowedSecondQuarter,
                                homeAway: teamStats[z].homeOrAway,
                                gameId: teamStats[z].gameId
                            })
                        }
                        propReturn.fullGameLog = teamGameLog

                        let spreadOverall = teamStats.map(e => ((e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)))
                        let spreadHomeAway = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).map(e => ((e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)))
                        let spreadTeam = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).map(e => ((e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)))
                        propReturn.lowOverall = spreadOverall.length > 0 ? Math.max(...spreadOverall) : 0
                        propReturn.highOverall = spreadOverall.length > 0 ? Math.min(...spreadOverall) : 0
                        propReturn.lowHomeAway = spreadHomeAway.length > 0 ? Math.max(...spreadHomeAway) : 0
                        propReturn.highHomeAway = spreadHomeAway.length > 0 ? Math.min(...spreadHomeAway) : 0
                        propReturn.lowTeam = spreadTeam.length > 0 ? Math.max(...spreadTeam) : 0
                        propReturn.highTeam = spreadTeam.length > 0 ? Math.min(...spreadTeam) : 0
                        propReturn.averageOverall = spreadOverall.length > 0 ? spreadOverall.reduce((a, b) => a + b) / spreadOverall.length : 0
                        propReturn.averageHomeAway = spreadHomeAway.length > 0 ? spreadHomeAway.reduce((a, b) => a + b) / spreadHomeAway.length : 0
                        propReturn.averageTeam = spreadTeam.length > 0 ? spreadTeam.reduce((a, b) => a + b) / spreadTeam.length : 0
                        propReturn.propType = 'spread'
                    }
                    else if (filteredPropsOnMarketKey[i].marketKey == 'spreads_h2') {
                        propReturn.overallWins = teamStats.filter(e => ((e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)) < filteredPropsOnMarketKey[i].point).length;
                        propReturn.homeAwayWins = teamStats.filter(e => e.homeOrAway == propReturn.homeAway && ((e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)) < filteredPropsOnMarketKey[i].point).length;
                        propReturn.teamWins = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId && ((e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)) < filteredPropsOnMarketKey[i].point).length;
                        teamAgainstOverallWins = teamAgainstStats.filter(e => ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) - (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) > filteredPropsOnMarketKey[i].point).length;
                        teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) - (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) > filteredPropsOnMarketKey[i].point).length;
                        teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) - (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) > filteredPropsOnMarketKey[i].point).length;

                        let backToBack = propReturn.homeAway == 'Home' ? isHomeBackToBack : isAwayBackToBack
                        propReturn.trends = this.findTrends(propReturn.gameBookData, backToBack, 'spread', propReturn.homeAway, teamStats, teamAgainstStats)

                        overAllTableTemp = teamStats.slice(0, 10)
                        homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                        teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                        let overallLast10Wins = overAllTableTemp.filter(e => ((e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)) < filteredPropsOnMarketKey[i].point).length
                        propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                        let homeAwayLast10Wins = homeAwayTableTemp.filter(e => ((e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)) < filteredPropsOnMarketKey[i].point).length
                        propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                        let teamLast10Wins = teamTableTemp.filter(e => ((e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)) < filteredPropsOnMarketKey[i].point).length
                        propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]
                        let teamGameLog = []
                        for (let z = 0; z < teamStats.length; z++) {
                            teamGameLog.push({
                                teamAgainstName: teamStats[z].teamAgainstName,
                                gameDate: teamStats[z].gameDate,
                                result: ((teamStats[z].pointsAllowedThirdQuarter + teamStats[z].pointsAllowedFourthQuarter) - (teamStats[z].pointsScoredThirdQuarter + teamStats[z].pointsScoredFourthQuarter) < filteredPropsOnMarketKey[i].point) ? 'W' : 'L',
                                pointsScoredOverall: teamStats[z].pointsScoredThirdQuarter + teamStats[z].pointsScoredFourthQuarter,
                                pointsAllowedOverall: teamStats[z].pointsAllowedThirdQuarter + teamStats[z].pointsAllowedFourthQuarter,
                                homeAway: teamStats[z].homeOrAway,
                                gameId: teamStats[z].gameId
                            })
                        }
                        propReturn.fullGameLog = teamGameLog

                        let spreadOverall = teamStats.map(e => ((e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)))
                        let spreadHomeAway = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).map(e => ((e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)))
                        let spreadTeam = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).map(e => ((e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)))
                        propReturn.lowOverall = spreadOverall.length > 0 ? Math.max(...spreadOverall) : 0
                        propReturn.highOverall = spreadOverall.length > 0 ? Math.min(...spreadOverall) : 0
                        propReturn.lowHomeAway = spreadHomeAway.length > 0 ? Math.max(...spreadHomeAway) : 0
                        propReturn.highHomeAway = spreadHomeAway.length > 0 ? Math.min(...spreadHomeAway) : 0
                        propReturn.lowTeam = spreadTeam.length > 0 ? Math.max(...spreadTeam) : 0
                        propReturn.highTeam = spreadTeam.length > 0 ? Math.min(...spreadTeam) : 0
                        propReturn.averageOverall = spreadOverall.length > 0 ? spreadOverall.reduce((a, b) => a + b) / spreadOverall.length : 0
                        propReturn.averageHomeAway = spreadHomeAway.length > 0 ? spreadHomeAway.reduce((a, b) => a + b) / spreadHomeAway.length : 0
                        propReturn.averageTeam = spreadTeam.length > 0 ? spreadTeam.reduce((a, b) => a + b) / spreadTeam.length : 0
                        propReturn.propType = 'spread'
                    }
                    else if (filteredPropsOnMarketKey[i].marketKey == 'team_totals_q1') {
                        isByTeam = true;
                        if (filteredPropsOnMarketKey[i].description == 'Over') {
                            propReturn.overallWins = teamStats.filter(e => e.pointsScoredFirstQuarter > filteredPropsOnMarketKey[i].point).length;

                            propReturn.homeAwayWins = teamStats.filter(e => e.homeOrAway == propReturn.homeAway && e.pointsScoredFirstQuarter > filteredPropsOnMarketKey[i].point).length;

                            propReturn.teamWins = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId && e.pointsScoredFirstQuarter > filteredPropsOnMarketKey[i].point).length;

                            teamAgainstOverallWins = teamAgainstStats.filter(e => e.pointsAllowedFirstQuarter < filteredPropsOnMarketKey[i].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && e.pointsAllowedFirstQuarter < filteredPropsOnMarketKey[i].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && e.pointsAllowedFirstQuarter < filteredPropsOnMarketKey[i].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => e.pointsScoredFirstQuarter > filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.pointsScoredFirstQuarter > filteredPropsOnMarketKey[i].point).length
                            propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => e.pointsScoredFirstQuarter > filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]

                            let teamGameLog = []
                            for (let j = 0; j < teamStats.length; j++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[j].teamAgainstName,
                                    gameDate: teamStats[j].gameDate,
                                    result: teamStats[j].pointsScoredFirstQuarter > filteredPropsOnMarketKey[i].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[j].pointsScoredFirstQuarter,
                                    pointsAllowedOverall: teamStats[j].pointsAllowedFirstQuarter,
                                    homeAway: teamStats[j].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            propReturn.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => e.pointsScoredFirstQuarter)
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).map(e => e.pointsScoredFirstQuarter)
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).map(e => e.pointsScoredFirstQuarter)
                            propReturn.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            propReturn.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            propReturn.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            propReturn.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            propReturn.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            propReturn.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            propReturn.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            propReturn.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            propReturn.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            propReturn.overallChance = propReturn.overallTotal == 0 ? 0 : propReturn.overallWins / propReturn.overallTotal
                            propReturn.homeAwayChance = propReturn.homeAwayTotal == 0 ? 0 : propReturn.homeAwayWins / propReturn.homeAwayTotal
                            propReturn.teamChance = propReturn.teamTotal == 0 ? 0 : propReturn.teamWins / propReturn.teamTotal

                            propReturn.propType = 'total'
                        }
                        else {
                            propReturn.overallWins = teamStats.filter(e => e.pointsScoredFirstQuarter < filteredPropsOnMarketKey[i].point).length;

                            propReturn.homeAwayWins = teamStats.filter(e => e.homeOrAway == propReturn.homeAway && e.pointsScoredFirstQuarter < filteredPropsOnMarketKey[i].point).length;

                            propReturn.teamWins = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId && e.pointsScoredFirstQuarter < filteredPropsOnMarketKey[i].point).length;

                            teamAgainstOverallWins = teamAgainstStats.filter(e => e.pointsAllowedFirstQuarter > filteredPropsOnMarketKey[i].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && e.pointsAllowedFirstQuarter > filteredPropsOnMarketKey[i].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && e.pointsAllowedFirstQuarter > filteredPropsOnMarketKey[i].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => e.pointsScoredFirstQuarter < filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.pointsScoredFirstQuarter < filteredPropsOnMarketKey[i].point).length
                            propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => e.pointsScoredFirstQuarter < filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]
                            let teamGameLog = []
                            for (let j = 0; j < teamStats.length; j++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[j].teamAgainstName,
                                    gameDate: teamStats[j].gameDate,
                                    result: teamStats[j].pointsScoredFirstQuarter < filteredPropsOnMarketKey[i].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[j].pointsScoredFirstQuarter,
                                    pointsAllowedOverall: teamStats[j].pointsAllowedFirstQuarter,
                                    homeAway: teamStats[j].homeOrAway
                                })
                            }
                            propReturn.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => e.pointsScoredFirstQuarter)
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).map(e => e.pointsScoredFirstQuarter)
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).map(e => e.pointsScoredFirstQuarter)
                            propReturn.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            propReturn.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            propReturn.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            propReturn.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            propReturn.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            propReturn.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            propReturn.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            propReturn.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            propReturn.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            propReturn.overallChance = propReturn.overallTotal == 0 ? 0 : propReturn.overallWins / propReturn.overallTotal
                            propReturn.homeAwayChance = propReturn.homeAwayTotal == 0 ? 0 : propReturn.homeAwayWins / propReturn.homeAwayTotal
                            propReturn.teamChance = propReturn.teamTotal == 0 ? 0 : propReturn.teamWins / propReturn.teamTotal

                            propReturn.propType = 'total'
                        }
                    }
                    else if (filteredPropsOnMarketKey[i].marketKey == 'team_totals_q2') {
                        isByTeam = true;
                        if (filteredPropsOnMarketKey[i].description == 'Over') {
                            propReturn.overallWins = teamStats.filter(e => e.pointsScoredSecondQuarter > filteredPropsOnMarketKey[i].point).length;

                            propReturn.homeAwayWins = teamStats.filter(e => e.homeOrAway == propReturn.homeAway && e.pointsScoredSecondQuarter > filteredPropsOnMarketKey[i].point).length;

                            propReturn.teamWins = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId && e.pointsScoredSecondQuarter > filteredPropsOnMarketKey[i].point).length;

                            teamAgainstOverallWins = teamAgainstStats.filter(e => e.pointsAllowedSecondQuarter < filteredPropsOnMarketKey[i].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && e.pointsAllowedSecondQuarter < filteredPropsOnMarketKey[i].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && e.pointsAllowedSecondQuarter < filteredPropsOnMarketKey[i].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => e.pointsScoredSecondQuarter > filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.pointsScoredSecondQuarter > filteredPropsOnMarketKey[i].point).length
                            propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => e.pointsScoredSecondQuarter > filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]

                            let teamGameLog = []
                            for (let j = 0; j < teamStats.length; j++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[j].teamAgainstName,
                                    gameDate: teamStats[j].gameDate,
                                    result: teamStats[j].pointsScoredSecondQuarter > filteredPropsOnMarketKey[i].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[j].pointsScoredSecondQuarter,
                                    pointsAllowedOverall: teamStats[j].pointsAllowedSecondQuarter,
                                    homeAway: teamStats[j].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            propReturn.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => e.pointsScoredSecondQuarter)
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).map(e => e.pointsScoredSecondQuarter)
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).map(e => e.pointsScoredSecondQuarter)
                            propReturn.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            propReturn.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            propReturn.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            propReturn.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            propReturn.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            propReturn.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            propReturn.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            propReturn.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            propReturn.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            propReturn.overallChance = propReturn.overallTotal == 0 ? 0 : propReturn.overallWins / propReturn.overallTotal
                            propReturn.homeAwayChance = propReturn.homeAwayTotal == 0 ? 0 : propReturn.homeAwayWins / propReturn.homeAwayTotal
                            propReturn.teamChance = propReturn.teamTotal == 0 ? 0 : propReturn.teamWins / propReturn.teamTotal

                            propReturn.propType = 'total'
                        }
                        else {
                            propReturn.overallWins = teamStats.filter(e => e.pointsScoredSecondQuarter < filteredPropsOnMarketKey[i].point).length;

                            propReturn.homeAwayWins = teamStats.filter(e => e.homeOrAway == propReturn.homeAway && e.pointsScoredSecondQuarter < filteredPropsOnMarketKey[i].point).length;

                            propReturn.teamWins = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId && e.pointsScoredSecondQuarter < filteredPropsOnMarketKey[i].point).length;

                            teamAgainstOverallWins = teamAgainstStats.filter(e => e.pointsAllowedSecondQuarter > filteredPropsOnMarketKey[i].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && e.pointsAllowedSecondQuarter > filteredPropsOnMarketKey[i].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && e.pointsAllowedSecondQuarter > filteredPropsOnMarketKey[i].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => e.pointsScoredSecondQuarter < filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.pointsScoredSecondQuarter < filteredPropsOnMarketKey[i].point).length
                            propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => e.pointsScoredSecondQuarter < filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]
                            let teamGameLog = []
                            for (let j = 0; j < teamStats.length; j++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[j].teamAgainstName,
                                    gameDate: teamStats[j].gameDate,
                                    result: teamStats[j].pointsScoredSecondQuarter < filteredPropsOnMarketKey[i].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[j].pointsScoredSecondQuarter,
                                    pointsAllowedOverall: teamStats[j].pointsAllowedSecondQuarter,
                                    homeAway: teamStats[j].homeOrAway
                                })
                            }
                            propReturn.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => e.pointsScoredSecondQuarter)
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).map(e => e.pointsScoredSecondQuarter)
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).map(e => e.pointsScoredSecondQuarter)
                            propReturn.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            propReturn.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            propReturn.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            propReturn.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            propReturn.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            propReturn.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            propReturn.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            propReturn.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            propReturn.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            propReturn.overallChance = propReturn.overallTotal == 0 ? 0 : propReturn.overallWins / propReturn.overallTotal
                            propReturn.homeAwayChance = propReturn.homeAwayTotal == 0 ? 0 : propReturn.homeAwayWins / propReturn.homeAwayTotal
                            propReturn.teamChance = propReturn.teamTotal == 0 ? 0 : propReturn.teamWins / propReturn.teamTotal

                            propReturn.propType = 'total'
                        }
                    }
                    else if (filteredPropsOnMarketKey[i].marketKey == 'team_totals_q3') {
                        isByTeam = true;
                        if (filteredPropsOnMarketKey[i].description == 'Over') {
                            propReturn.overallWins = teamStats.filter(e => e.pointsScoredThirdQuarter > filteredPropsOnMarketKey[i].point).length;

                            propReturn.homeAwayWins = teamStats.filter(e => e.homeOrAway == propReturn.homeAway && e.pointsScoredThirdQuarter > filteredPropsOnMarketKey[i].point).length;

                            propReturn.teamWins = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId && e.pointsScoredThirdQuarter > filteredPropsOnMarketKey[i].point).length;

                            teamAgainstOverallWins = teamAgainstStats.filter(e => e.pointsAllowedThirdQuarter < filteredPropsOnMarketKey[i].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && e.pointsAllowedThirdQuarter < filteredPropsOnMarketKey[i].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && e.pointsAllowedThirdQuarter < filteredPropsOnMarketKey[i].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => e.pointsScoredThirdQuarter > filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.pointsScoredThirdQuarter > filteredPropsOnMarketKey[i].point).length
                            propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => e.pointsScoredThirdQuarter > filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]

                            let teamGameLog = []
                            for (let j = 0; j < teamStats.length; j++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[j].teamAgainstName,
                                    gameDate: teamStats[j].gameDate,
                                    result: teamStats[j].pointsScoredThirdQuarter > filteredPropsOnMarketKey[i].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[j].pointsScoredThirdQuarter,
                                    pointsAllowedOverall: teamStats[j].pointsAllowedThirdQuarter,
                                    homeAway: teamStats[j].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            propReturn.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => e.pointsScoredThirdQuarter)
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).map(e => e.pointsScoredThirdQuarter)
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).map(e => e.pointsScoredThirdQuarter)
                            propReturn.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            propReturn.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            propReturn.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            propReturn.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            propReturn.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            propReturn.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            propReturn.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            propReturn.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            propReturn.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            propReturn.overallChance = propReturn.overallTotal == 0 ? 0 : propReturn.overallWins / propReturn.overallTotal
                            propReturn.homeAwayChance = propReturn.homeAwayTotal == 0 ? 0 : propReturn.homeAwayWins / propReturn.homeAwayTotal
                            propReturn.teamChance = propReturn.teamTotal == 0 ? 0 : propReturn.teamWins / propReturn.teamTotal

                            propReturn.propType = 'total'
                        }
                        else {
                            propReturn.overallWins = teamStats.filter(e => e.pointsScoredThirdQuarter < filteredPropsOnMarketKey[i].point).length;

                            propReturn.homeAwayWins = teamStats.filter(e => e.homeOrAway == propReturn.homeAway && e.pointsScoredThirdQuarter < filteredPropsOnMarketKey[i].point).length;

                            propReturn.teamWins = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId && e.pointsScoredThirdQuarter < filteredPropsOnMarketKey[i].point).length;

                            teamAgainstOverallWins = teamAgainstStats.filter(e => e.pointsAllowedThirdQuarter > filteredPropsOnMarketKey[i].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && e.pointsAllowedThirdQuarter > filteredPropsOnMarketKey[i].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && e.pointsAllowedThirdQuarter > filteredPropsOnMarketKey[i].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => e.pointsScoredThirdQuarter < filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.pointsScoredThirdQuarter < filteredPropsOnMarketKey[i].point).length
                            propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => e.pointsScoredThirdQuarter < filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]
                            let teamGameLog = []
                            for (let j = 0; j < teamStats.length; j++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[j].teamAgainstName,
                                    gameDate: teamStats[j].gameDate,
                                    result: teamStats[j].pointsScoredThirdQuarter > filteredPropsOnMarketKey[i].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[j].pointsScoredThirdQuarter,
                                    pointsAllowedOverall: teamStats[j].pointsAllowedThirdQuarter,
                                    homeAway: teamStats[j].homeOrAway
                                })
                            }
                            propReturn.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => e.pointsScoredThirdQuarter)
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).map(e => e.pointsScoredThirdQuarter)
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).map(e => e.pointsScoredThirdQuarter)
                            propReturn.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            propReturn.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            propReturn.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            propReturn.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            propReturn.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            propReturn.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            propReturn.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            propReturn.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            propReturn.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            propReturn.overallChance = propReturn.overallTotal == 0 ? 0 : propReturn.overallWins / propReturn.overallTotal
                            propReturn.homeAwayChance = propReturn.homeAwayTotal == 0 ? 0 : propReturn.homeAwayWins / propReturn.homeAwayTotal
                            propReturn.teamChance = propReturn.teamTotal == 0 ? 0 : propReturn.teamWins / propReturn.teamTotal

                            propReturn.propType = 'total'
                        }
                    }
                    else if (filteredPropsOnMarketKey[i].marketKey == 'team_totals_q4') {
                        isByTeam = true;
                        if (filteredPropsOnMarketKey[i].description == 'Over') {
                            propReturn.overallWins = teamStats.filter(e => e.pointsScoredFourthQuarter > filteredPropsOnMarketKey[i].point).length;

                            propReturn.homeAwayWins = teamStats.filter(e => e.homeOrAway == propReturn.homeAway && e.pointsScoredFourthQuarter > filteredPropsOnMarketKey[i].point).length;

                            propReturn.teamWins = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId && e.pointsScoredFourthQuarter > filteredPropsOnMarketKey[i].point).length;

                            teamAgainstOverallWins = teamAgainstStats.filter(e => e.pointsAllowedFourthQuarter < filteredPropsOnMarketKey[i].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && e.pointsAllowedFourthQuarter < filteredPropsOnMarketKey[i].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && e.pointsAllowedFourthQuarter < filteredPropsOnMarketKey[i].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => e.pointsScoredFourthQuarter > filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.pointsScoredFourthQuarter > filteredPropsOnMarketKey[i].point).length
                            propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => e.pointsScoredFourthQuarter > filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]

                            let teamGameLog = []
                            for (let j = 0; j < teamStats.length; j++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[j].teamAgainstName,
                                    gameDate: teamStats[j].gameDate,
                                    result: teamStats[j].pointsScoredFourthQuarter > filteredPropsOnMarketKey[i].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[j].pointsScoredFourthQuarter,
                                    pointsAllowedOverall: teamStats[j].pointsAllowedFourthQuarter,
                                    homeAway: teamStats[j].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            propReturn.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => e.pointsScoredFourthQuarter)
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).map(e => e.pointsScoredFourthQuarter)
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).map(e => e.pointsScoredFourthQuarter)
                            propReturn.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            propReturn.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            propReturn.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            propReturn.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            propReturn.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            propReturn.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            propReturn.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            propReturn.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            propReturn.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            propReturn.overallChance = propReturn.overallTotal == 0 ? 0 : propReturn.overallWins / propReturn.overallTotal
                            propReturn.homeAwayChance = propReturn.homeAwayTotal == 0 ? 0 : propReturn.homeAwayWins / propReturn.homeAwayTotal
                            propReturn.teamChance = propReturn.teamTotal == 0 ? 0 : propReturn.teamWins / propReturn.teamTotal

                            propReturn.propType = 'total'
                        }
                        else {
                            propReturn.overallWins = teamStats.filter(e => e.pointsScoredFourthQuarter < filteredPropsOnMarketKey[i].point).length;

                            propReturn.homeAwayWins = teamStats.filter(e => e.homeOrAway == propReturn.homeAway && e.pointsScoredFourthQuarter < filteredPropsOnMarketKey[i].point).length;

                            propReturn.teamWins = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId && e.pointsScoredFourthQuarter < filteredPropsOnMarketKey[i].point).length;

                            teamAgainstOverallWins = teamAgainstStats.filter(e => e.pointsAllowedFourthQuarter > filteredPropsOnMarketKey[i].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && e.pointsAllowedFourthQuarter > filteredPropsOnMarketKey[i].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && e.pointsAllowedFourthQuarter > filteredPropsOnMarketKey[i].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => e.pointsScoredFourthQuarter < filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.pointsScoredFourthQuarter < filteredPropsOnMarketKey[i].point).length
                            propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => e.pointsScoredFourthQuarter < filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]
                            let teamGameLog = []
                            for (let j = 0; j < teamStats.length; j++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[j].teamAgainstName,
                                    gameDate: teamStats[j].gameDate,
                                    result: teamStats[j].pointsScoredFourthQuarter < filteredPropsOnMarketKey[i].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[j].pointsScoredFourthQuarter,
                                    pointsAllowedOverall: teamStats[j].pointsAllowedFourthQuarter,
                                    homeAway: teamStats[j].homeOrAway
                                })
                            }
                            propReturn.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => e.pointsScoredFourthQuarter)
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).map(e => e.pointsScoredFourthQuarter)
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).map(e => e.pointsScoredFourthQuarter)
                            propReturn.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            propReturn.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            propReturn.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            propReturn.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            propReturn.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            propReturn.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            propReturn.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            propReturn.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            propReturn.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            propReturn.overallChance = propReturn.overallTotal == 0 ? 0 : propReturn.overallWins / propReturn.overallTotal
                            propReturn.homeAwayChance = propReturn.homeAwayTotal == 0 ? 0 : propReturn.homeAwayWins / propReturn.homeAwayTotal
                            propReturn.teamChance = propReturn.teamTotal == 0 ? 0 : propReturn.teamWins / propReturn.teamTotal

                            propReturn.propType = 'total'
                        }
                    }
                    else if (filteredPropsOnMarketKey[i].marketKey == 'team_totals_h1') {
                        isByTeam = true;
                        if (filteredPropsOnMarketKey[i].description == 'Over') {
                            propReturn.overallWins = teamStats.filter(e => (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > filteredPropsOnMarketKey[i].point).length;

                            propReturn.homeAwayWins = teamStats.filter(e => e.homeOrAway == propReturn.homeAway && (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > filteredPropsOnMarketKey[i].point).length;

                            propReturn.teamWins = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId && (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > filteredPropsOnMarketKey[i].point).length;

                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) < filteredPropsOnMarketKey[i].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) < filteredPropsOnMarketKey[i].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) < filteredPropsOnMarketKey[i].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > filteredPropsOnMarketKey[i].point).length
                            propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]

                            let teamGameLog = []
                            for (let j = 0; j < teamStats.length; j++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[j].teamAgainstName,
                                    gameDate: teamStats[j].gameDate,
                                    result: (teamStats[j].pointsScoredFirstQuarter + teamStats[j].pointsScoredSecondQuarter) > filteredPropsOnMarketKey[i].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[j].pointsScoredFirstQuarter + teamStats[j].pointsScoredSecondQuarter,
                                    pointsAllowedOverall: teamStats[j].pointsAllowedFirstQuarter + teamStats[j].pointsAllowedSecondQuarter,
                                    homeAway: teamStats[j].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            propReturn.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter))
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).map(e => (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter))
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).map(e => (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter))
                            propReturn.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            propReturn.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            propReturn.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            propReturn.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            propReturn.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            propReturn.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            propReturn.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            propReturn.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            propReturn.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            propReturn.overallChance = propReturn.overallTotal == 0 ? 0 : propReturn.overallWins / propReturn.overallTotal
                            propReturn.homeAwayChance = propReturn.homeAwayTotal == 0 ? 0 : propReturn.homeAwayWins / propReturn.homeAwayTotal
                            propReturn.teamChance = propReturn.teamTotal == 0 ? 0 : propReturn.teamWins / propReturn.teamTotal

                            propReturn.propType = 'total'
                        }
                        else {
                            propReturn.overallWins = teamStats.filter(e => (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) < filteredPropsOnMarketKey[i].point).length;

                            propReturn.homeAwayWins = teamStats.filter(e => e.homeOrAway == propReturn.homeAway && (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) < filteredPropsOnMarketKey[i].point).length;

                            propReturn.teamWins = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId && (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) < filteredPropsOnMarketKey[i].point).length;

                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) > filteredPropsOnMarketKey[i].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) > filteredPropsOnMarketKey[i].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) > filteredPropsOnMarketKey[i].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) < filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) < filteredPropsOnMarketKey[i].point).length
                            propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) < filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]
                            let teamGameLog = []
                            for (let j = 0; j < teamStats.length; j++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[j].teamAgainstName,
                                    gameDate: teamStats[j].gameDate,
                                    result: (teamStats[j].pointsScoredFirstQuarter + teamStats[j].pointsScoredSecondQuarter) < filteredPropsOnMarketKey[i].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[j].pointsScoredFirstQuarter + teamStats[j].pointsScoredSecondQuarter,
                                    pointsAllowedOverall: teamStats[j].pointsAllowedFirstQuarter + teamStats[j].pointsAllowedSecondQuarter,
                                    homeAway: teamStats[j].homeOrAway
                                })
                            }
                            propReturn.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter))
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).map(e => (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter))
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).map(e => (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter))
                            propReturn.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            propReturn.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            propReturn.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            propReturn.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            propReturn.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            propReturn.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            propReturn.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            propReturn.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            propReturn.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            propReturn.overallChance = propReturn.overallTotal == 0 ? 0 : propReturn.overallWins / propReturn.overallTotal
                            propReturn.homeAwayChance = propReturn.homeAwayTotal == 0 ? 0 : propReturn.homeAwayWins / propReturn.homeAwayTotal
                            propReturn.teamChance = propReturn.teamTotal == 0 ? 0 : propReturn.teamWins / propReturn.teamTotal

                            propReturn.propType = 'total'
                        }
                    }
                    else if (filteredPropsOnMarketKey[i].marketKey == 'team_totals_h2') {
                        isByTeam = true;
                        if (filteredPropsOnMarketKey[i].description == 'Over') {
                            propReturn.overallWins = teamStats.filter(e => (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > filteredPropsOnMarketKey[i].point).length;

                            propReturn.homeAwayWins = teamStats.filter(e => e.homeOrAway == propReturn.homeAway && (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > filteredPropsOnMarketKey[i].point).length;

                            propReturn.teamWins = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId && (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > filteredPropsOnMarketKey[i].point).length;

                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) < filteredPropsOnMarketKey[i].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) < filteredPropsOnMarketKey[i].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) < filteredPropsOnMarketKey[i].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > filteredPropsOnMarketKey[i].point).length
                            propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]

                            let teamGameLog = []
                            for (let j = 0; j < teamStats.length; j++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[j].teamAgainstName,
                                    gameDate: teamStats[j].gameDate,
                                    result: (teamStats[j].pointsScoredThirdQuarter + teamStats[j].pointsScoredFourthQuarter) > filteredPropsOnMarketKey[i].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[j].pointsScoredThirdQuarter + teamStats[j].pointsScoredFourthQuarter,
                                    pointsAllowedOverall: teamStats[j].pointsAllowedFirstQuarter + teamStats[j].pointsAllowedFourthQuarter,
                                    homeAway: teamStats[j].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            propReturn.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter))
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).map(e => (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter))
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).map(e => (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter))
                            propReturn.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            propReturn.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            propReturn.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            propReturn.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            propReturn.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            propReturn.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            propReturn.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            propReturn.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            propReturn.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            propReturn.overallChance = propReturn.overallTotal == 0 ? 0 : propReturn.overallWins / propReturn.overallTotal
                            propReturn.homeAwayChance = propReturn.homeAwayTotal == 0 ? 0 : propReturn.homeAwayWins / propReturn.homeAwayTotal
                            propReturn.teamChance = propReturn.teamTotal == 0 ? 0 : propReturn.teamWins / propReturn.teamTotal

                            propReturn.propType = 'total'
                        }
                        else {
                            propReturn.overallWins = teamStats.filter(e => (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) < filteredPropsOnMarketKey[i].point).length;

                            propReturn.homeAwayWins = teamStats.filter(e => e.homeOrAway == propReturn.homeAway && (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) < filteredPropsOnMarketKey[i].point).length;

                            propReturn.teamWins = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId && (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) < filteredPropsOnMarketKey[i].point).length;

                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) > filteredPropsOnMarketKey[i].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != propReturn.homeAway && (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) > filteredPropsOnMarketKey[i].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == propReturn.teamId && (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) > filteredPropsOnMarketKey[i].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) < filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) < filteredPropsOnMarketKey[i].point).length
                            propReturn.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) < filteredPropsOnMarketKey[i].point).length
                            propReturn.last10Team = [teamLast10Wins, teamTableTemp.length]
                            let teamGameLog = []
                            for (let j = 0; j < teamStats.length; j++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[j].teamAgainstName,
                                    gameDate: teamStats[j].gameDate,
                                    result: (teamStats[j].pointsScoredThirdQuarter + teamStats[j].pointsScoredFourthQuarter) < filteredPropsOnMarketKey[i].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[j].pointsScoredThirdQuarter + teamStats[j].pointsScoredFourthQuarter,
                                    pointsAllowedOverall: teamStats[j].pointsAllowedThirdQuarter + teamStats[j].pointsAllowedFourthQuarter,
                                    homeAway: teamStats[j].homeOrAway
                                })
                            }
                            propReturn.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter))
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == propReturn.homeAway).map(e => (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter))
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == propReturn.teamAgainstId).map(e => (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter))
                            propReturn.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            propReturn.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            propReturn.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            propReturn.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            propReturn.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            propReturn.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            propReturn.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            propReturn.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            propReturn.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            propReturn.overallChance = propReturn.overallTotal == 0 ? 0 : propReturn.overallWins / propReturn.overallTotal
                            propReturn.homeAwayChance = propReturn.homeAwayTotal == 0 ? 0 : propReturn.homeAwayWins / propReturn.homeAwayTotal
                            propReturn.teamChance = propReturn.teamTotal == 0 ? 0 : propReturn.teamWins / propReturn.teamTotal

                            propReturn.propType = 'total'
                        }
                    }
                    let teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                    let teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                    let teamAgasintTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal

                    propReturn.overallChance = propReturn.overallTotal == 0 ? 0 : propReturn.overallWins / propReturn.overallTotal
                    propReturn.homeAwayChance = propReturn.homeAwayTotal == 0 ? 0 : propReturn.homeAwayWins / propReturn.homeAwayTotal
                    propReturn.teamChance = propReturn.teamTotal == 0 ? 0 : propReturn.teamWins / propReturn.teamTotal
                    propReturn.overallWeighted = ((propReturn.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - propReturn.overallChance))) == 0 ? 0 : (propReturn.overallChance * (1 - teamAgainstOverallChance)) / ((propReturn.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - propReturn.overallChance)))
                    propReturn.homeAwayWeighted = ((propReturn.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - propReturn.homeAwayChance))) == 0 ? 0 : (propReturn.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((propReturn.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - propReturn.homeAwayChance)))
                    propReturn.teamWeighted = ((propReturn.teamChance * (1 - teamAgasintTeamChance)) + (teamAgasintTeamChance * (1 - propReturn.teamChance))) == 0 ? 0 : (propReturn.teamChance * (1 - teamAgasintTeamChance)) / ((propReturn.teamChance * (1 - teamAgasintTeamChance)) + (teamAgasintTeamChance * (1 - propReturn.teamChance)))


                    propReturn.homeAway == "Home" ? homeTeamPropsFinal.push(propReturn) : awayTeamPropsFinal.push(propReturn)

                }
                if (isByTeam) {
                    awayTeamPropsFinal.propType = 'total'
                    awayTeamPropsFinal.propName = distinctTeamProps[i]
                    homeTeamPropsFinal.propType = 'total'
                    homeTeamPropsFinal.propName = distinctTeamProps[i]
                    propTypeArray.push([awayTeamPropsFinal, homeTeamPropsFinal])
                }
                else {
                    propTypeArray.push([awayTeamPropsFinal[0], homeTeamPropsFinal[0]])
                }
                isByTeam = false;

                awayTeamPropsFinal = []
                homeTeamPropsFinal = []
            }
            propTypeArray[propTypeArray.length - 1].propName = distinctTeamProps[i]
            if (propTypeArray[propTypeArray.length - 1][0].propType == 'total') {
                propTypeArray[propTypeArray.length - 1].propType = 'total'
            }

        }


        let homeTeamOverUnderFinal: any = []
        let awayTeamOverUnderFinal: any = []
        //get each distinct prop with Both
        console.log('overunder array below')
        console.log(overUnderTotalProps)
        let distinctBothTeamBoth = overUnderTotalProps.map(e => e.marketKey).filter((v, i, a) => a.indexOf(v) === i)
        for (let k = 0; k < distinctBothTeamBoth.length; k++) {
            //filter on the specific prop
            let filteredBothTeamProp = overUnderTotalProps.filter(e => e.marketKey == distinctBothTeamBoth[k])
            //if the prop has more than two we assume it is alternate
            if (filteredBothTeamProp.length > 2) {
                //find the specific points and create overunder for each pairing
                let distinctPointsByProp = filteredBothTeamProp.map(e => e.point).filter((v, i, a) => a.indexOf(v) === i)
                distinctPointsByProp.sort((a, b) => a - b)
                let homeTeamPropArray: any[] = []
                let awayTeamPropArray: any[] = []
                for (let m = 0; m < distinctPointsByProp.length; m++) {
                    let homeTeamPointArray = []
                    let awayTeamPointArray = []
                    let filteredPropsByPoint = filteredBothTeamProp.filter(e => e.point == distinctPointsByProp[m])
                    //now loop through to do homeaway for the over then under
                    for (let n = 0; n < filteredPropsByPoint.length; n++) {

                        let homeProp: TeamPropDto = {
                            gameBookData: filteredPropsByPoint[n],
                            teamName: homeTeam.teamNameAbvr,
                            teamId: homeTeam.teamId,
                            teamAgainstName: awayTeam.teamNameAbvr,
                            teamAgainstId: awayTeam.teamId,
                            homeAway: 'Home',
                            propType: 'altTotal',
                            overallChance: 0,
                            overallWins: 0,
                            overallTotal: 0,
                            homeAwayChance: 0,
                            homeAwayWins: 0,
                            homeAwayTotal: 0,
                            teamChance: 0,
                            teamWins: 0,
                            teamTotal: 0,
                            overallWeighted: 0,
                            homeAwayWeighted: 0,
                            teamWeighted: 0,
                            averageOverall: 0,
                            averageHomeAway: 0,
                            averageTeam: 0,
                            highOverall: 0,
                            highHomeAway: 0,
                            highTeam: 0,
                            lowOverall: 0,
                            lowHomeAway: 0,
                            lowTeam: 0,
                            isDisabled: false,
                            teamStats: homeTeamStats,
                            teamAgainstStats: awayTeamStats,
                            last10Overall: [],
                            last10HomeAway: [],
                            last10Team: [],
                            trends: [],
                            fullGameLog: []
                        }
                        let awayProp: TeamPropDto = {
                            gameBookData: filteredPropsByPoint[n],
                            teamName: awayTeam.teamNameAbvr,
                            teamId: awayTeam.teamId,
                            teamAgainstName: homeTeam.teamNameAbvr,
                            teamAgainstId: homeTeam.teamId,
                            homeAway: 'Away',
                            propType: 'altTotal',
                            overallChance: 0,
                            overallWins: 0,
                            overallTotal: 0,
                            homeAwayChance: 0,
                            homeAwayWins: 0,
                            homeAwayTotal: 0,
                            teamChance: 0,
                            teamWins: 0,
                            teamTotal: 0,
                            overallWeighted: 0,
                            homeAwayWeighted: 0,
                            teamWeighted: 0,
                            averageOverall: 0,
                            averageHomeAway: 0,
                            averageTeam: 0,
                            highOverall: 0,
                            highHomeAway: 0,
                            highTeam: 0,
                            lowOverall: 0,
                            lowHomeAway: 0,
                            lowTeam: 0,
                            isDisabled: false,
                            teamStats: awayTeamStats,
                            teamAgainstStats: homeTeamStats,
                            last10Overall: [],
                            last10HomeAway: [],
                            last10Team: [],
                            trends: [],
                            fullGameLog: []
                        }
                        let teamStats: DBNflTeamGameStats[] = []
                        let teamAgainstStats: DBNflTeamGameStats[] = []

                        let teamAgainstOverallTotal = 0
                        let teamAgainstHomeAwayTotal = 0
                        let teamAgainstTeamTotal = 0
                        let teamAgainstOverallWins = 0
                        let teamAgainstHomeAwayWins = 0
                        let teamAgainstTeamWins = 0
                        let teamAgainstOverallChance = 0
                        let teamAgainstHomeAwayChance = 0
                        let teamAgainstTeamChance = 0
                        //do home first
                        teamStats = homeTeamStats


                        let overAllTableTemp = []
                        let homeAwayTableTemp = []
                        let teamTableTemp = []
                        if (filteredPropsByPoint[n].marketKey == 'alternate_totals') {
                            if (filteredPropsByPoint[n].description == 'Over') {
                                teamStats = homeTeamStats
                                homeProp.overallWins = teamStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredPropsByPoint[n].point).length;
                                homeProp.overallTotal = teamStats.length
                                homeProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == homeProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredPropsByPoint[n].point).length;
                                homeProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).length
                                homeProp.teamWins = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId && (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredPropsByPoint[n].point).length;
                                homeProp.teamTotal = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).length

                                teamAgainstStats = awayTeamStats

                                teamAgainstOverallTotal = teamAgainstStats.length
                                teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway).length
                                teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId).length
                                teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) <= filteredPropsByPoint[n].point).length
                                teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) <= filteredPropsByPoint[n].point).length
                                teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId && (e.pointsScoredOverall + e.pointsAllowedOverall) <= filteredPropsByPoint[n].point).length

                                overAllTableTemp = teamStats.slice(0, 10)
                                homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).slice(0, 10)
                                teamTableTemp = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).slice(0, 10)
                                let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredPropsByPoint[n].point).length
                                homeProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                                let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredPropsByPoint[n].point).length
                                homeProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                                let teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredPropsByPoint[n].point).length
                                homeProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                                let teamGameLog = []
                                for (let i = 0; i < teamStats.length; i++) {
                                    teamGameLog.push({
                                        teamAgainstName: teamStats[i].teamAgainstName,
                                        gameDate: teamStats[i].gameDate,
                                        result: (teamStats[i].pointsScoredOverall + teamStats[i].pointsAllowedOverall) > filteredPropsByPoint[n].point ? 'W' : 'L',
                                        pointsScoredOverall: teamStats[i].pointsScoredOverall,
                                        pointsAllowedOverall: teamStats[i].pointsAllowedOverall,
                                        homeAway: teamStats[i].homeOrAway,
                                        gameId: teamStats[i].gameId
                                    })
                                }
                                homeProp.fullGameLog = teamGameLog

                                let totalOverall = teamStats.map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                                let totalHomeAway = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                                let totalTeam = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                                homeProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                                homeProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                                homeProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                                homeProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                                homeProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                                homeProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                                homeProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                                homeProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                                homeProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                                homeProp.overallChance = homeProp.overallTotal == 0 ? 0 : homeProp.overallWins / homeProp.overallTotal
                                homeProp.homeAwayChance = homeProp.homeAwayTotal == 0 ? 0 : homeProp.homeAwayWins / homeProp.homeAwayTotal
                                homeProp.teamChance = homeProp.teamTotal == 0 ? 0 : homeProp.teamWins / homeProp.teamTotal
                                teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                                teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                                teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                                homeProp.overallWeighted = ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance))) == 0 ? 0 : (homeProp.overallChance * (1 - teamAgainstOverallChance)) / ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance)))
                                homeProp.homeAwayWeighted = ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance))) == 0 ? 0 : (homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance)))
                                homeProp.teamWeighted = ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance))) == 0 ? 0 : (homeProp.teamChance * (1 - teamAgainstTeamChance)) / ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance)))


                                teamStats = awayTeamStats
                                teamAgainstStats = homeTeamStats
                                awayProp.overallWins = teamStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredPropsByPoint[n].point).length;
                                awayProp.overallTotal = teamStats.length
                                awayProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == awayProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredPropsByPoint[n].point).length;
                                awayProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).length
                                awayProp.teamWins = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId && (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredPropsByPoint[n].point).length;
                                awayProp.teamTotal = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).length

                                teamAgainstOverallTotal = teamAgainstStats.length
                                teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway).length
                                teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId).length
                                teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) <= filteredPropsByPoint[n].point).length
                                teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) <= filteredPropsByPoint[n].point).length
                                teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId && (e.pointsScoredOverall + e.pointsAllowedOverall) <= filteredPropsByPoint[n].point).length

                                overAllTableTemp = teamStats.slice(0, 10)
                                homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).slice(0, 10)
                                teamTableTemp = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).slice(0, 10)
                                overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredPropsByPoint[n].point).length
                                awayProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                                homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredPropsByPoint[n].point).length
                                awayProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                                teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredPropsByPoint[n].point).length
                                awayProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                                teamGameLog = []
                                for (let i = 0; i < teamStats.length; i++) {
                                    teamGameLog.push({
                                        teamAgainstName: teamStats[i].teamAgainstName,
                                        gameDate: teamStats[i].gameDate,
                                        result: (teamStats[i].pointsScoredOverall + teamStats[i].pointsAllowedOverall) > filteredPropsByPoint[n].point ? 'W' : 'L',
                                        pointsScoredOverall: teamStats[i].pointsScoredOverall,
                                        pointsAllowedOverall: teamStats[i].pointsAllowedOverall,
                                        homeAway: teamStats[i].homeOrAway,
                                        gameId: teamStats[i].gameId
                                    })
                                }
                                awayProp.fullGameLog = teamGameLog

                                totalOverall = teamStats.map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                                totalHomeAway = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                                totalTeam = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                                awayProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                                awayProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                                awayProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                                awayProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                                awayProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                                awayProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                                awayProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                                awayProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                                awayProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                                awayProp.overallChance = awayProp.overallTotal == 0 ? 0 : awayProp.overallWins / awayProp.overallTotal
                                awayProp.homeAwayChance = awayProp.homeAwayTotal == 0 ? 0 : awayProp.homeAwayWins / awayProp.homeAwayTotal
                                awayProp.teamChance = awayProp.teamTotal == 0 ? 0 : awayProp.teamWins / awayProp.teamTotal
                                teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                                teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                                teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                                awayProp.overallWeighted = ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance))) == 0 ? 0 : (awayProp.overallChance * (1 - teamAgainstOverallChance)) / ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance)))
                                awayProp.homeAwayWeighted = ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance))) == 0 ? 0 : (awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance)))
                                awayProp.teamWeighted = ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance))) == 0 ? 0 : (awayProp.teamChance * (1 - teamAgainstTeamChance)) / ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance)))

                            }
                            else {
                                teamStats = homeTeamStats
                                teamAgainstStats = awayTeamStats
                                homeProp.overallWins = teamStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredPropsByPoint[n].point).length;
                                homeProp.overallTotal = teamStats.length
                                homeProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == homeProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredPropsByPoint[n].point).length;
                                homeProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).length
                                homeProp.teamWins = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId && (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredPropsByPoint[n].point).length;
                                homeProp.teamTotal = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).length

                                teamAgainstOverallTotal = teamAgainstStats.length
                                teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway).length
                                teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId).length
                                teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) >= filteredPropsByPoint[n].point).length
                                teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) >= filteredPropsByPoint[n].point).length
                                teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId && (e.pointsScoredOverall + e.pointsAllowedOverall) >= filteredPropsByPoint[n].point).length

                                overAllTableTemp = teamStats.slice(0, 10)
                                homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).slice(0, 10)
                                teamTableTemp = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).slice(0, 10)
                                let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredPropsByPoint[n].point).length
                                homeProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                                let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredPropsByPoint[n].point).length
                                homeProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                                let teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredPropsByPoint[n].point).length
                                homeProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                                let teamGameLog = []
                                for (let i = 0; i < teamStats.length; i++) {
                                    teamGameLog.push({
                                        teamAgainstName: teamStats[i].teamAgainstName,
                                        gameDate: teamStats[i].gameDate,
                                        result: (teamStats[i].pointsScoredOverall + teamStats[i].pointsAllowedOverall) < filteredPropsByPoint[n].point ? 'W' : 'L',
                                        pointsScoredOverall: teamStats[i].pointsScoredOverall,
                                        pointsAllowedOverall: teamStats[i].pointsAllowedOverall,
                                        homeAway: teamStats[i].homeOrAway,
                                        gameId: teamStats[i].gameId
                                    })
                                }
                                homeProp.fullGameLog = teamGameLog

                                let totalOverall = teamStats.map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                                let totalHomeAway = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                                let totalTeam = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                                homeProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                                homeProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                                homeProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                                homeProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                                homeProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                                homeProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                                homeProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                                homeProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                                homeProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                                homeProp.overallChance = homeProp.overallTotal == 0 ? 0 : homeProp.overallWins / homeProp.overallTotal
                                homeProp.homeAwayChance = homeProp.homeAwayTotal == 0 ? 0 : homeProp.homeAwayWins / homeProp.homeAwayTotal
                                homeProp.teamChance = homeProp.teamTotal == 0 ? 0 : homeProp.teamWins / homeProp.teamTotal
                                teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                                teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                                teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                                homeProp.overallWeighted = ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance))) == 0 ? 0 : (homeProp.overallChance * (1 - teamAgainstOverallChance)) / ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance)))
                                homeProp.homeAwayWeighted = ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance))) == 0 ? 0 : (homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance)))
                                homeProp.teamWeighted = ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance))) == 0 ? 0 : (homeProp.teamChance * (1 - teamAgainstTeamChance)) / ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance)))


                                teamStats = awayTeamStats
                                teamAgainstStats = homeTeamStats
                                awayProp.overallWins = teamStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredPropsByPoint[n].point).length;
                                awayProp.overallTotal = teamStats.length
                                awayProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == awayProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredPropsByPoint[n].point).length;
                                awayProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).length
                                awayProp.teamWins = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId && (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredPropsByPoint[n].point).length;
                                awayProp.teamTotal = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).length

                                teamAgainstOverallTotal = teamAgainstStats.length
                                teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway).length
                                teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId).length
                                teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) >= filteredPropsByPoint[n].point).length
                                teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) >= filteredPropsByPoint[n].point).length
                                teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId && (e.pointsScoredOverall + e.pointsAllowedOverall) >= filteredPropsByPoint[n].point).length

                                overAllTableTemp = teamStats.slice(0, 10)
                                homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).slice(0, 10)
                                teamTableTemp = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).slice(0, 10)
                                overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredPropsByPoint[n].point).length
                                awayProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                                homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredPropsByPoint[n].point).length
                                awayProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                                teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredPropsByPoint[n].point).length
                                awayProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                                teamGameLog = []
                                for (let i = 0; i < teamStats.length; i++) {
                                    teamGameLog.push({
                                        teamAgainstName: teamStats[i].teamAgainstName,
                                        gameDate: teamStats[i].gameDate,
                                        result: (teamStats[i].pointsScoredOverall + teamStats[i].pointsAllowedOverall) < filteredPropsByPoint[n].point ? 'W' : 'L',
                                        pointsScoredOverall: teamStats[i].pointsScoredOverall,
                                        pointsAllowedOverall: teamStats[i].pointsAllowedOverall,
                                        homeAway: teamStats[i].homeOrAway,
                                        gameId: teamStats[i].gameId
                                    })
                                }
                                awayProp.fullGameLog = teamGameLog

                                totalOverall = teamStats.map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                                totalHomeAway = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                                totalTeam = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                                awayProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                                awayProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                                awayProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                                awayProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                                awayProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                                awayProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                                awayProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                                awayProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                                awayProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                                awayProp.overallChance = awayProp.overallTotal == 0 ? 0 : awayProp.overallWins / awayProp.overallTotal
                                awayProp.homeAwayChance = awayProp.homeAwayTotal == 0 ? 0 : awayProp.homeAwayWins / awayProp.homeAwayTotal
                                awayProp.teamChance = awayProp.teamTotal == 0 ? 0 : awayProp.teamWins / awayProp.teamTotal
                                teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                                teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                                teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                                awayProp.overallWeighted = ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance))) == 0 ? 0 : (awayProp.overallChance * (1 - teamAgainstOverallChance)) / ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance)))
                                awayProp.homeAwayWeighted = ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance))) == 0 ? 0 : (awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance)))
                                awayProp.teamWeighted = ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance))) == 0 ? 0 : (awayProp.teamChance * (1 - teamAgainstTeamChance)) / ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance)))

                            }
                        }
                        homeTeamPointArray.push(homeProp)
                        awayTeamPointArray.push(awayProp)
                    }
                    homeTeamPointArray.sort((a: any, b: any) => b.gameBookData.description.localeCompare(a.gameBookData.description))
                    awayTeamPointArray.sort((a: any, b: any) => b.gameBookData.description.localeCompare(a.gameBookData.description))
                    homeTeamOverUnderFinal.push(homeTeamPointArray)
                    awayTeamOverUnderFinal.push(awayTeamPointArray)
                    homeTeamOverUnderFinal.propType = 'altTotal'
                    homeTeamOverUnderFinal.index = 0
                    awayTeamOverUnderFinal.propType = 'altTotal'
                    awayTeamOverUnderFinal.index = 0
                }
                //homeTeamOverUnderFinal.push(homeTeamPropArray)
                //awayTeamOverUnderFinal.push(awayTeamPropArray)
                homeTeamPropArray = []
                awayTeamPropArray = []
                propTypeArray.push([homeTeamOverUnderFinal, awayTeamOverUnderFinal])
                propTypeArray[propTypeArray.length - 1].propName = distinctBothTeamBoth[k]
                propTypeArray[propTypeArray.length - 1].propType = 'altTotal'
                homeTeamOverUnderFinal = []
                awayTeamOverUnderFinal = []
            }
            else {
                for (let j = 0; j < filteredBothTeamProp.length; j++) {
                    let homeProp: TeamPropDto = {
                        gameBookData: filteredBothTeamProp[j],
                        teamName: homeTeam.teamNameAbvr,
                        teamId: homeTeam.teamId,
                        teamAgainstName: awayTeam.teamNameAbvr,
                        teamAgainstId: awayTeam.teamId,
                        homeAway: 'Home',
                        propType: 'total',
                        overallChance: 0,
                        overallWins: 0,
                        overallTotal: 0,
                        homeAwayChance: 0,
                        homeAwayWins: 0,
                        homeAwayTotal: 0,
                        teamChance: 0,
                        teamWins: 0,
                        teamTotal: 0,
                        overallWeighted: 0,
                        homeAwayWeighted: 0,
                        teamWeighted: 0,
                        averageOverall: 0,
                        averageHomeAway: 0,
                        averageTeam: 0,
                        highOverall: 0,
                        highHomeAway: 0,
                        highTeam: 0,
                        lowOverall: 0,
                        lowHomeAway: 0,
                        lowTeam: 0,
                        isDisabled: false,
                        teamStats: homeTeamStats,
                        teamAgainstStats: awayTeamStats,
                        last10Overall: [],
                        last10HomeAway: [],
                        last10Team: [],
                        trends: [],
                        fullGameLog: []
                    }
                    let awayProp: TeamPropDto = {
                        gameBookData: filteredBothTeamProp[j],
                        teamName: awayTeam.teamNameAbvr,
                        teamId: awayTeam.teamId,
                        teamAgainstName: homeTeam.teamNameAbvr,
                        teamAgainstId: homeTeam.teamId,
                        homeAway: 'Away',
                        propType: 'total',
                        overallChance: 0,
                        overallWins: 0,
                        overallTotal: 0,
                        homeAwayChance: 0,
                        homeAwayWins: 0,
                        homeAwayTotal: 0,
                        teamChance: 0,
                        teamWins: 0,
                        teamTotal: 0,
                        overallWeighted: 0,
                        homeAwayWeighted: 0,
                        teamWeighted: 0,
                        averageOverall: 0,
                        averageHomeAway: 0,
                        averageTeam: 0,
                        highOverall: 0,
                        highHomeAway: 0,
                        highTeam: 0,
                        lowOverall: 0,
                        lowHomeAway: 0,
                        lowTeam: 0,
                        isDisabled: false,
                        teamStats: awayTeamStats,
                        teamAgainstStats: homeTeamStats,
                        last10Overall: [],
                        last10HomeAway: [],
                        last10Team: [],
                        trends: [],
                        fullGameLog: []
                    }
                    let teamStats: DBNflTeamGameStats[] = []
                    let teamAgainstStats: DBNflTeamGameStats[] = []

                    let teamAgainstOverallTotal = 0
                    let teamAgainstHomeAwayTotal = 0
                    let teamAgainstTeamTotal = 0
                    let teamAgainstOverallWins = 0
                    let teamAgainstHomeAwayWins = 0
                    let teamAgainstTeamWins = 0
                    let teamAgainstOverallChance = 0
                    let teamAgainstHomeAwayChance = 0
                    let teamAgainstTeamChance = 0
                    //do home first
                    teamStats = homeTeamStats


                    let overAllTableTemp = []
                    let homeAwayTableTemp = []
                    let teamTableTemp = []
                    if (filteredBothTeamProp[j].marketKey == 'totals') {
                        if (filteredBothTeamProp[j].description == 'Over') {
                            teamStats = homeTeamStats
                            homeProp.overallWins = teamStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredBothTeamProp[j].point).length;
                            homeProp.overallTotal = teamStats.length
                            homeProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == homeProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredBothTeamProp[j].point).length;
                            homeProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).length
                            homeProp.teamWins = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId && (e.pointsScoredOverall + e.pointsAllowedOverall) > overUnderTotalProps[j].point).length;
                            homeProp.teamTotal = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).length

                            teamAgainstStats = awayTeamStats

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) <= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) <= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId && (e.pointsScoredOverall + e.pointsAllowedOverall) <= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredBothTeamProp[j].point).length
                            homeProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredBothTeamProp[j].point).length
                            homeProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredBothTeamProp[j].point).length
                            homeProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            let teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredOverall + teamStats[i].pointsAllowedOverall) > filteredBothTeamProp[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredOverall,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedOverall,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            homeProp.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                            homeProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            homeProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            homeProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            homeProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            homeProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            homeProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            homeProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            homeProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            homeProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            homeProp.overallChance = homeProp.overallTotal == 0 ? 0 : homeProp.overallWins / homeProp.overallTotal
                            homeProp.homeAwayChance = homeProp.homeAwayTotal == 0 ? 0 : homeProp.homeAwayWins / homeProp.homeAwayTotal
                            homeProp.teamChance = homeProp.teamTotal == 0 ? 0 : homeProp.teamWins / homeProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            homeProp.overallWeighted = ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance))) == 0 ? 0 : (homeProp.overallChance * (1 - teamAgainstOverallChance)) / ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance)))
                            homeProp.homeAwayWeighted = ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance))) == 0 ? 0 : (homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance)))
                            homeProp.teamWeighted = ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance))) == 0 ? 0 : (homeProp.teamChance * (1 - teamAgainstTeamChance)) / ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance)))


                            teamStats = awayTeamStats
                            teamAgainstStats = homeTeamStats
                            awayProp.overallWins = teamStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredBothTeamProp[j].point).length;
                            awayProp.overallTotal = teamStats.length
                            awayProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == awayProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredBothTeamProp[j].point).length;
                            awayProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).length
                            awayProp.teamWins = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId && (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredBothTeamProp[j].point).length;
                            awayProp.teamTotal = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).length

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) <= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) <= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId && (e.pointsScoredOverall + e.pointsAllowedOverall) <= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).slice(0, 10)
                            overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredBothTeamProp[j].point).length
                            awayProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredBothTeamProp[j].point).length
                            awayProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredBothTeamProp[j].point).length
                            awayProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredOverall + teamStats[i].pointsAllowedOverall) > overUnderTotalProps[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredOverall,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedOverall,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            awayProp.fullGameLog = teamGameLog

                            totalOverall = teamStats.map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                            totalHomeAway = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                            totalTeam = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                            awayProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            awayProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            awayProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            awayProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            awayProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            awayProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            awayProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            awayProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            awayProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            awayProp.overallChance = awayProp.overallTotal == 0 ? 0 : awayProp.overallWins / awayProp.overallTotal
                            awayProp.homeAwayChance = awayProp.homeAwayTotal == 0 ? 0 : awayProp.homeAwayWins / awayProp.homeAwayTotal
                            awayProp.teamChance = awayProp.teamTotal == 0 ? 0 : awayProp.teamWins / awayProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            awayProp.overallWeighted = ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance))) == 0 ? 0 : (awayProp.overallChance * (1 - teamAgainstOverallChance)) / ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance)))
                            awayProp.homeAwayWeighted = ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance))) == 0 ? 0 : (awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance)))
                            awayProp.teamWeighted = ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance))) == 0 ? 0 : (awayProp.teamChance * (1 - teamAgainstTeamChance)) / ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance)))

                        }
                        else {
                            teamStats = homeTeamStats
                            teamAgainstStats = awayTeamStats
                            homeProp.overallWins = teamStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredBothTeamProp[j].point).length;
                            homeProp.overallTotal = teamStats.length
                            homeProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == homeProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredBothTeamProp[j].point).length;
                            homeProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).length
                            homeProp.teamWins = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId && (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredBothTeamProp[j].point).length;
                            homeProp.teamTotal = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).length

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) >= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) >= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId && (e.pointsScoredOverall + e.pointsAllowedOverall) >= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredBothTeamProp[j].point).length
                            homeProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredBothTeamProp[j].point).length
                            homeProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredBothTeamProp[j].point).length
                            homeProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            let teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredOverall + teamStats[i].pointsAllowedOverall) < filteredBothTeamProp[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredOverall,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedOverall,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            homeProp.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                            homeProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            homeProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            homeProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            homeProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            homeProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            homeProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            homeProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            homeProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            homeProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            homeProp.overallChance = homeProp.overallTotal == 0 ? 0 : homeProp.overallWins / homeProp.overallTotal
                            homeProp.homeAwayChance = homeProp.homeAwayTotal == 0 ? 0 : homeProp.homeAwayWins / homeProp.homeAwayTotal
                            homeProp.teamChance = homeProp.teamTotal == 0 ? 0 : homeProp.teamWins / homeProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            homeProp.overallWeighted = ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance))) == 0 ? 0 : (homeProp.overallChance * (1 - teamAgainstOverallChance)) / ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance)))
                            homeProp.homeAwayWeighted = ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance))) == 0 ? 0 : (homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance)))
                            homeProp.teamWeighted = ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance))) == 0 ? 0 : (homeProp.teamChance * (1 - teamAgainstTeamChance)) / ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance)))


                            teamStats = awayTeamStats
                            teamAgainstStats = homeTeamStats
                            awayProp.overallWins = teamStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredBothTeamProp[j].point).length;
                            awayProp.overallTotal = teamStats.length
                            awayProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == awayProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredBothTeamProp[j].point).length;
                            awayProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).length
                            awayProp.teamWins = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId && (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredBothTeamProp[j].point).length;
                            awayProp.teamTotal = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).length

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) >= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) >= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId && (e.pointsScoredOverall + e.pointsAllowedOverall) >= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).slice(0, 10)
                            overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredBothTeamProp[j].point).length
                            awayProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredBothTeamProp[j].point).length
                            awayProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredBothTeamProp[j].point).length
                            awayProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredOverall + teamStats[i].pointsAllowedOverall) < filteredBothTeamProp[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredOverall,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedOverall,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            awayProp.fullGameLog = teamGameLog

                            totalOverall = teamStats.map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                            totalHomeAway = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                            totalTeam = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                            awayProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            awayProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            awayProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            awayProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            awayProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            awayProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            awayProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            awayProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            awayProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            awayProp.overallChance = awayProp.overallTotal == 0 ? 0 : awayProp.overallWins / awayProp.overallTotal
                            awayProp.homeAwayChance = awayProp.homeAwayTotal == 0 ? 0 : awayProp.homeAwayWins / awayProp.homeAwayTotal
                            awayProp.teamChance = awayProp.teamTotal == 0 ? 0 : awayProp.teamWins / awayProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            awayProp.overallWeighted = ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance))) == 0 ? 0 : (awayProp.overallChance * (1 - teamAgainstOverallChance)) / ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance)))
                            awayProp.homeAwayWeighted = ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance))) == 0 ? 0 : (awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance)))
                            awayProp.teamWeighted = ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance))) == 0 ? 0 : (awayProp.teamChance * (1 - teamAgainstTeamChance)) / ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance)))


                        }
                    }
                    else if (filteredBothTeamProp[j].marketKey == 'totals_h1') {
                        if (filteredBothTeamProp[j].description == 'Over') {
                            teamStats = homeTeamStats
                            homeProp.overallWins = teamStats.filter(e => ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) > filteredBothTeamProp[j].point).length;
                            homeProp.overallTotal = teamStats.length
                            homeProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == homeProp.homeAway && ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) > filteredBothTeamProp[j].point).length;
                            homeProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).length
                            homeProp.teamWins = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId && ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) > overUnderTotalProps[j].point).length;
                            homeProp.teamTotal = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).length

                            teamAgainstStats = awayTeamStats

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) <= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway && ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) <= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId && ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) <= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) > filteredBothTeamProp[j].point).length
                            homeProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) > filteredBothTeamProp[j].point).length
                            homeProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) > filteredBothTeamProp[j].point).length
                            homeProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            let teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredFirstQuarter + teamStats[i].pointsScoredSecondQuarter + teamStats[i].pointsAllowedFirstQuarter + teamStats[i].pointsAllowedSecondQuarter) > filteredBothTeamProp[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredFirstQuarter + teamStats[i].pointsScoredSecondQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedFirstQuarter + teamStats[i].pointsAllowedSecondQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            homeProp.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => ((e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) + (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)))
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).map(e => ((e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) + (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)))
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).map(e => ((e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) + (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)))
                            homeProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            homeProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            homeProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            homeProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            homeProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            homeProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            homeProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            homeProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            homeProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            homeProp.overallChance = homeProp.overallTotal == 0 ? 0 : homeProp.overallWins / homeProp.overallTotal
                            homeProp.homeAwayChance = homeProp.homeAwayTotal == 0 ? 0 : homeProp.homeAwayWins / homeProp.homeAwayTotal
                            homeProp.teamChance = homeProp.teamTotal == 0 ? 0 : homeProp.teamWins / homeProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            homeProp.overallWeighted = ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance))) == 0 ? 0 : (homeProp.overallChance * (1 - teamAgainstOverallChance)) / ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance)))
                            homeProp.homeAwayWeighted = ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance))) == 0 ? 0 : (homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance)))
                            homeProp.teamWeighted = ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance))) == 0 ? 0 : (homeProp.teamChance * (1 - teamAgainstTeamChance)) / ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance)))


                            teamStats = awayTeamStats
                            teamAgainstStats = homeTeamStats
                            awayProp.overallWins = teamStats.filter(e => ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) > filteredBothTeamProp[j].point).length;
                            awayProp.overallTotal = teamStats.length
                            awayProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == awayProp.homeAway && ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) > filteredBothTeamProp[j].point).length;
                            awayProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).length
                            awayProp.teamWins = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId && ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) > filteredBothTeamProp[j].point).length;
                            awayProp.teamTotal = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).length

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) <= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway && ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) <= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId && ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) <= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).slice(0, 10)
                            overallLast10Wins = overAllTableTemp.filter(e => ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) > filteredBothTeamProp[j].point).length
                            awayProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) > filteredBothTeamProp[j].point).length
                            awayProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            teamLast10Wins = teamTableTemp.filter(e => ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) > filteredBothTeamProp[j].point).length
                            awayProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredFirstQuarter + teamStats[i].pointsScoredSecondQuarter + teamStats[i].pointsAllowedFirstQuarter + teamStats[i].pointsAllowedSecondQuarter) > overUnderTotalProps[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredFirstQuarter + teamStats[i].pointsScoredSecondQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedFirstQuarter + teamStats[i].pointsAllowedSecondQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            awayProp.fullGameLog = teamGameLog

                            totalOverall = teamStats.map(e => ((e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) + (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)))
                            totalHomeAway = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).map(e => ((e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) + (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)))
                            totalTeam = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).map(e => ((e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) + (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)))
                            awayProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            awayProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            awayProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            awayProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            awayProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            awayProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            awayProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            awayProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            awayProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            awayProp.overallChance = awayProp.overallTotal == 0 ? 0 : awayProp.overallWins / awayProp.overallTotal
                            awayProp.homeAwayChance = awayProp.homeAwayTotal == 0 ? 0 : awayProp.homeAwayWins / awayProp.homeAwayTotal
                            awayProp.teamChance = awayProp.teamTotal == 0 ? 0 : awayProp.teamWins / awayProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            awayProp.overallWeighted = ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance))) == 0 ? 0 : (awayProp.overallChance * (1 - teamAgainstOverallChance)) / ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance)))
                            awayProp.homeAwayWeighted = ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance))) == 0 ? 0 : (awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance)))
                            awayProp.teamWeighted = ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance))) == 0 ? 0 : (awayProp.teamChance * (1 - teamAgainstTeamChance)) / ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance)))

                        }
                        else {
                            teamStats = homeTeamStats
                            teamAgainstStats = awayTeamStats
                            homeProp.overallWins = teamStats.filter(e => ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) < filteredBothTeamProp[j].point).length;
                            homeProp.overallTotal = teamStats.length
                            homeProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == homeProp.homeAway && ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) < filteredBothTeamProp[j].point).length;
                            homeProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).length
                            homeProp.teamWins = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId && ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) < filteredBothTeamProp[j].point).length;
                            homeProp.teamTotal = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).length

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) >= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway && ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) >= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId && ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) >= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) < filteredBothTeamProp[j].point).length
                            homeProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) < filteredBothTeamProp[j].point).length
                            homeProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) < filteredBothTeamProp[j].point).length
                            homeProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            let teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredFirstQuarter + teamStats[i].pointsScoredSecondQuarter + teamStats[i].pointsAllowedFirstQuarter + teamStats[i].pointsAllowedSecondQuarter) < filteredBothTeamProp[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredFirstQuarter + teamStats[i].pointsScoredSecondQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedFirstQuarter + teamStats[i].pointsAllowedSecondQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            homeProp.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => ((e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) + (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)))
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).map(e => ((e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) + (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)))
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).map(e => ((e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) + (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)))
                            homeProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            homeProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            homeProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            homeProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            homeProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            homeProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            homeProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            homeProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            homeProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            homeProp.overallChance = homeProp.overallTotal == 0 ? 0 : homeProp.overallWins / homeProp.overallTotal
                            homeProp.homeAwayChance = homeProp.homeAwayTotal == 0 ? 0 : homeProp.homeAwayWins / homeProp.homeAwayTotal
                            homeProp.teamChance = homeProp.teamTotal == 0 ? 0 : homeProp.teamWins / homeProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            homeProp.overallWeighted = ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance))) == 0 ? 0 : (homeProp.overallChance * (1 - teamAgainstOverallChance)) / ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance)))
                            homeProp.homeAwayWeighted = ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance))) == 0 ? 0 : (homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance)))
                            homeProp.teamWeighted = ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance))) == 0 ? 0 : (homeProp.teamChance * (1 - teamAgainstTeamChance)) / ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance)))


                            teamStats = awayTeamStats
                            teamAgainstStats = homeTeamStats
                            awayProp.overallWins = teamStats.filter(e => ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) < filteredBothTeamProp[j].point).length;
                            awayProp.overallTotal = teamStats.length
                            awayProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == awayProp.homeAway && ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) < filteredBothTeamProp[j].point).length;
                            awayProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).length
                            awayProp.teamWins = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId && ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) < filteredBothTeamProp[j].point).length;
                            awayProp.teamTotal = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).length

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) >= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway && ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) >= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId && ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) >= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).slice(0, 10)
                            overallLast10Wins = overAllTableTemp.filter(e => ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) < filteredBothTeamProp[j].point).length
                            awayProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) < filteredBothTeamProp[j].point).length
                            awayProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            teamLast10Wins = teamTableTemp.filter(e => ((e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) + (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter)) < filteredBothTeamProp[j].point).length
                            awayProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredFirstQuarter + teamStats[i].pointsScoredSecondQuarter + teamStats[i].pointsAllowedFirstQuarter + teamStats[i].pointsAllowedSecondQuarter) < filteredBothTeamProp[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredFirstQuarter + teamStats[i].pointsScoredSecondQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedFirstQuarter + teamStats[i].pointsAllowedSecondQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            awayProp.fullGameLog = teamGameLog

                            totalOverall = teamStats.map(e => ((e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) + (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)))
                            totalHomeAway = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).map(e => ((e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) + (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)))
                            totalTeam = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).map(e => ((e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) + (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter)))
                            awayProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            awayProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            awayProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            awayProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            awayProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            awayProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            awayProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            awayProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            awayProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            awayProp.overallChance = awayProp.overallTotal == 0 ? 0 : awayProp.overallWins / awayProp.overallTotal
                            awayProp.homeAwayChance = awayProp.homeAwayTotal == 0 ? 0 : awayProp.homeAwayWins / awayProp.homeAwayTotal
                            awayProp.teamChance = awayProp.teamTotal == 0 ? 0 : awayProp.teamWins / awayProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            awayProp.overallWeighted = ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance))) == 0 ? 0 : (awayProp.overallChance * (1 - teamAgainstOverallChance)) / ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance)))
                            awayProp.homeAwayWeighted = ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance))) == 0 ? 0 : (awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance)))
                            awayProp.teamWeighted = ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance))) == 0 ? 0 : (awayProp.teamChance * (1 - teamAgainstTeamChance)) / ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance)))


                        }
                    }
                    else if (filteredBothTeamProp[j].marketKey == 'totals_h2') {
                        if (filteredBothTeamProp[j].description == 'Over') {
                            teamStats = homeTeamStats
                            homeProp.overallWins = teamStats.filter(e => ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) > filteredBothTeamProp[j].point).length;
                            homeProp.overallTotal = teamStats.length
                            homeProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == homeProp.homeAway && ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) > filteredBothTeamProp[j].point).length;
                            homeProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).length
                            homeProp.teamWins = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId && ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) > overUnderTotalProps[j].point).length;
                            homeProp.teamTotal = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).length

                            teamAgainstStats = awayTeamStats

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) <= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway && ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) <= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId && ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) <= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) > filteredBothTeamProp[j].point).length
                            homeProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) > filteredBothTeamProp[j].point).length
                            homeProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) > filteredBothTeamProp[j].point).length
                            homeProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            let teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredThirdQuarter + teamStats[i].pointsScoredFourthQuarter + teamStats[i].pointsAllowedThirdQuarter + teamStats[i].pointsAllowedFourthQuarter) > filteredBothTeamProp[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredThirdQuarter + teamStats[i].pointsScoredFourthQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedThirdQuarter + teamStats[i].pointsAllowedFourthQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            homeProp.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => ((e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) + (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)))
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).map(e => ((e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) + (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)))
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).map(e => ((e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) + (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)))
                            homeProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            homeProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            homeProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            homeProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            homeProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            homeProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            homeProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            homeProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            homeProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            homeProp.overallChance = homeProp.overallTotal == 0 ? 0 : homeProp.overallWins / homeProp.overallTotal
                            homeProp.homeAwayChance = homeProp.homeAwayTotal == 0 ? 0 : homeProp.homeAwayWins / homeProp.homeAwayTotal
                            homeProp.teamChance = homeProp.teamTotal == 0 ? 0 : homeProp.teamWins / homeProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            homeProp.overallWeighted = ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance))) == 0 ? 0 : (homeProp.overallChance * (1 - teamAgainstOverallChance)) / ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance)))
                            homeProp.homeAwayWeighted = ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance))) == 0 ? 0 : (homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance)))
                            homeProp.teamWeighted = ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance))) == 0 ? 0 : (homeProp.teamChance * (1 - teamAgainstTeamChance)) / ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance)))


                            teamStats = awayTeamStats
                            teamAgainstStats = homeTeamStats
                            awayProp.overallWins = teamStats.filter(e => ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) > filteredBothTeamProp[j].point).length;
                            awayProp.overallTotal = teamStats.length
                            awayProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == awayProp.homeAway && ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) > filteredBothTeamProp[j].point).length;
                            awayProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).length
                            awayProp.teamWins = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId && ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) > filteredBothTeamProp[j].point).length;
                            awayProp.teamTotal = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).length

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) <= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway && ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) <= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId && ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) <= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).slice(0, 10)
                            overallLast10Wins = overAllTableTemp.filter(e => ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) > filteredBothTeamProp[j].point).length
                            awayProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) > filteredBothTeamProp[j].point).length
                            awayProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            teamLast10Wins = teamTableTemp.filter(e => ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) > filteredBothTeamProp[j].point).length
                            awayProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredThirdQuarter + teamStats[i].pointsScoredFourthQuarter + teamStats[i].pointsAllowedThirdQuarter + teamStats[i].pointsAllowedFourthQuarter) > overUnderTotalProps[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredThirdQuarter + teamStats[i].pointsScoredFourthQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedThirdQuarter + teamStats[i].pointsAllowedFourthQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            awayProp.fullGameLog = teamGameLog

                            totalOverall = teamStats.map(e => ((e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) + (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)))
                            totalHomeAway = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).map(e => ((e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) + (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)))
                            totalTeam = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).map(e => ((e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) + (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)))
                            awayProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            awayProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            awayProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            awayProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            awayProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            awayProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            awayProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            awayProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            awayProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            awayProp.overallChance = awayProp.overallTotal == 0 ? 0 : awayProp.overallWins / awayProp.overallTotal
                            awayProp.homeAwayChance = awayProp.homeAwayTotal == 0 ? 0 : awayProp.homeAwayWins / awayProp.homeAwayTotal
                            awayProp.teamChance = awayProp.teamTotal == 0 ? 0 : awayProp.teamWins / awayProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            awayProp.overallWeighted = ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance))) == 0 ? 0 : (awayProp.overallChance * (1 - teamAgainstOverallChance)) / ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance)))
                            awayProp.homeAwayWeighted = ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance))) == 0 ? 0 : (awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance)))
                            awayProp.teamWeighted = ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance))) == 0 ? 0 : (awayProp.teamChance * (1 - teamAgainstTeamChance)) / ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance)))

                        }
                        else {
                            teamStats = homeTeamStats
                            teamAgainstStats = awayTeamStats
                            homeProp.overallWins = teamStats.filter(e => ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) < filteredBothTeamProp[j].point).length;
                            homeProp.overallTotal = teamStats.length
                            homeProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == homeProp.homeAway && ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) < filteredBothTeamProp[j].point).length;
                            homeProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).length
                            homeProp.teamWins = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId && ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) < filteredBothTeamProp[j].point).length;
                            homeProp.teamTotal = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).length

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) >= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway && ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) >= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId && ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) >= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) < filteredBothTeamProp[j].point).length
                            homeProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) < filteredBothTeamProp[j].point).length
                            homeProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) < filteredBothTeamProp[j].point).length
                            homeProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            let teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredThirdQuarter + teamStats[i].pointsScoredFourthQuarter + teamStats[i].pointsAllowedThirdQuarter + teamStats[i].pointsAllowedFourthQuarter) < filteredBothTeamProp[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredThirdQuarter + teamStats[i].pointsScoredFourthQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedThirdQuarter + teamStats[i].pointsAllowedFourthQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            homeProp.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => ((e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) + (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)))
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).map(e => ((e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) + (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)))
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).map(e => ((e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) + (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)))
                            homeProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            homeProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            homeProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            homeProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            homeProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            homeProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            homeProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            homeProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            homeProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            homeProp.overallChance = homeProp.overallTotal == 0 ? 0 : homeProp.overallWins / homeProp.overallTotal
                            homeProp.homeAwayChance = homeProp.homeAwayTotal == 0 ? 0 : homeProp.homeAwayWins / homeProp.homeAwayTotal
                            homeProp.teamChance = homeProp.teamTotal == 0 ? 0 : homeProp.teamWins / homeProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            homeProp.overallWeighted = ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance))) == 0 ? 0 : (homeProp.overallChance * (1 - teamAgainstOverallChance)) / ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance)))
                            homeProp.homeAwayWeighted = ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance))) == 0 ? 0 : (homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance)))
                            homeProp.teamWeighted = ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance))) == 0 ? 0 : (homeProp.teamChance * (1 - teamAgainstTeamChance)) / ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance)))


                            teamStats = awayTeamStats
                            teamAgainstStats = homeTeamStats
                            awayProp.overallWins = teamStats.filter(e => ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) < filteredBothTeamProp[j].point).length;
                            awayProp.overallTotal = teamStats.length
                            awayProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == awayProp.homeAway && ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) < filteredBothTeamProp[j].point).length;
                            awayProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).length
                            awayProp.teamWins = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId && ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) < filteredBothTeamProp[j].point).length;
                            awayProp.teamTotal = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).length

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) >= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway && ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) >= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId && ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) >= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).slice(0, 10)
                            overallLast10Wins = overAllTableTemp.filter(e => ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) < filteredBothTeamProp[j].point).length
                            awayProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) < filteredBothTeamProp[j].point).length
                            awayProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            teamLast10Wins = teamTableTemp.filter(e => ((e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) + (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter)) < filteredBothTeamProp[j].point).length
                            awayProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredThirdQuarter + teamStats[i].pointsScoredFourthQuarter + teamStats[i].pointsAllowedThirdQuarter + teamStats[i].pointsAllowedFourthQuarter) < filteredBothTeamProp[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredThirdQuarter + teamStats[i].pointsScoredFourthQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedThirdQuarter + teamStats[i].pointsAllowedFourthQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            awayProp.fullGameLog = teamGameLog

                            totalOverall = teamStats.map(e => ((e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) + (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)))
                            totalHomeAway = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).map(e => ((e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) + (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)))
                            totalTeam = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).map(e => ((e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) + (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter)))
                            awayProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            awayProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            awayProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            awayProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            awayProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            awayProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            awayProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            awayProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            awayProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            awayProp.overallChance = awayProp.overallTotal == 0 ? 0 : awayProp.overallWins / awayProp.overallTotal
                            awayProp.homeAwayChance = awayProp.homeAwayTotal == 0 ? 0 : awayProp.homeAwayWins / awayProp.homeAwayTotal
                            awayProp.teamChance = awayProp.teamTotal == 0 ? 0 : awayProp.teamWins / awayProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            awayProp.overallWeighted = ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance))) == 0 ? 0 : (awayProp.overallChance * (1 - teamAgainstOverallChance)) / ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance)))
                            awayProp.homeAwayWeighted = ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance))) == 0 ? 0 : (awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance)))
                            awayProp.teamWeighted = ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance))) == 0 ? 0 : (awayProp.teamChance * (1 - teamAgainstTeamChance)) / ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance)))


                        }
                    }
                    else if (filteredBothTeamProp[j].marketKey == 'totals_q1') {
                        if (filteredBothTeamProp[j].description == 'Over') {
                            teamStats = homeTeamStats
                            homeProp.overallWins = teamStats.filter(e => (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) > filteredBothTeamProp[j].point).length;
                            homeProp.overallTotal = teamStats.length
                            homeProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == homeProp.homeAway && (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) > filteredBothTeamProp[j].point).length;
                            homeProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).length
                            homeProp.teamWins = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId && (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) > overUnderTotalProps[j].point).length;
                            homeProp.teamTotal = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).length

                            teamAgainstStats = awayTeamStats

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) <= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway && (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) <= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId && (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) <= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) > filteredBothTeamProp[j].point).length
                            homeProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) > filteredBothTeamProp[j].point).length
                            homeProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) > filteredBothTeamProp[j].point).length
                            homeProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            let teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredFirstQuarter + teamStats[i].pointsAllowedFirstQuarter) > filteredBothTeamProp[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredFirstQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedFirstQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            homeProp.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => (e.pointsAllowedFirstQuarter + e.pointsScoredFirstQuarter))
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).map(e => (e.pointsAllowedFirstQuarter + e.pointsScoredFirstQuarter))
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).map(e => (e.pointsAllowedFirstQuarter + e.pointsScoredFirstQuarter))
                            homeProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            homeProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            homeProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            homeProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            homeProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            homeProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            homeProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            homeProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            homeProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            homeProp.overallChance = homeProp.overallTotal == 0 ? 0 : homeProp.overallWins / homeProp.overallTotal
                            homeProp.homeAwayChance = homeProp.homeAwayTotal == 0 ? 0 : homeProp.homeAwayWins / homeProp.homeAwayTotal
                            homeProp.teamChance = homeProp.teamTotal == 0 ? 0 : homeProp.teamWins / homeProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            homeProp.overallWeighted = ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance))) == 0 ? 0 : (homeProp.overallChance * (1 - teamAgainstOverallChance)) / ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance)))
                            homeProp.homeAwayWeighted = ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance))) == 0 ? 0 : (homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance)))
                            homeProp.teamWeighted = ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance))) == 0 ? 0 : (homeProp.teamChance * (1 - teamAgainstTeamChance)) / ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance)))


                            teamStats = awayTeamStats
                            teamAgainstStats = homeTeamStats
                            awayProp.overallWins = teamStats.filter(e => (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) > filteredBothTeamProp[j].point).length;
                            awayProp.overallTotal = teamStats.length
                            awayProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == awayProp.homeAway && (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) > filteredBothTeamProp[j].point).length;
                            awayProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).length
                            awayProp.teamWins = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId && (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) > filteredBothTeamProp[j].point).length;
                            awayProp.teamTotal = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).length

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) <= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway && (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) <= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId && (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) <= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).slice(0, 10)
                            overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) > filteredBothTeamProp[j].point).length
                            awayProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) > filteredBothTeamProp[j].point).length
                            awayProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) > filteredBothTeamProp[j].point).length
                            awayProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredFirstQuarter + teamStats[i].pointsAllowedFirstQuarter) > overUnderTotalProps[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredFirstQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedFirstQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            awayProp.fullGameLog = teamGameLog

                            totalOverall = teamStats.map(e => (e.pointsAllowedFirstQuarter + e.pointsScoredFirstQuarter))
                            totalHomeAway = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).map(e => (e.pointsAllowedFirstQuarter + e.pointsScoredFirstQuarter))
                            totalTeam = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).map(e => (e.pointsAllowedFirstQuarter + e.pointsScoredFirstQuarter))
                            awayProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            awayProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            awayProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            awayProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            awayProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            awayProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            awayProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            awayProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            awayProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            awayProp.overallChance = awayProp.overallTotal == 0 ? 0 : awayProp.overallWins / awayProp.overallTotal
                            awayProp.homeAwayChance = awayProp.homeAwayTotal == 0 ? 0 : awayProp.homeAwayWins / awayProp.homeAwayTotal
                            awayProp.teamChance = awayProp.teamTotal == 0 ? 0 : awayProp.teamWins / awayProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            awayProp.overallWeighted = ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance))) == 0 ? 0 : (awayProp.overallChance * (1 - teamAgainstOverallChance)) / ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance)))
                            awayProp.homeAwayWeighted = ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance))) == 0 ? 0 : (awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance)))
                            awayProp.teamWeighted = ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance))) == 0 ? 0 : (awayProp.teamChance * (1 - teamAgainstTeamChance)) / ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance)))

                        }
                        else {
                            teamStats = homeTeamStats
                            teamAgainstStats = awayTeamStats
                            homeProp.overallWins = teamStats.filter(e => (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) < filteredBothTeamProp[j].point).length;
                            homeProp.overallTotal = teamStats.length
                            homeProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == homeProp.homeAway && (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) < filteredBothTeamProp[j].point).length;
                            homeProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).length
                            homeProp.teamWins = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId && (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) < filteredBothTeamProp[j].point).length;
                            homeProp.teamTotal = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).length

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) >= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway && (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) >= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId && (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) >= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) < filteredBothTeamProp[j].point).length
                            homeProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) < filteredBothTeamProp[j].point).length
                            homeProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) < filteredBothTeamProp[j].point).length
                            homeProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            let teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredFirstQuarter + teamStats[i].pointsAllowedFirstQuarter) < filteredBothTeamProp[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredFirstQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedFirstQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            homeProp.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => (e.pointsAllowedFirstQuarter + e.pointsScoredFirstQuarter))
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).map(e => (e.pointsAllowedFirstQuarter + e.pointsScoredFirstQuarter))
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).map(e => (e.pointsAllowedFirstQuarter + e.pointsScoredFirstQuarter))
                            homeProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            homeProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            homeProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            homeProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            homeProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            homeProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            homeProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            homeProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            homeProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            homeProp.overallChance = homeProp.overallTotal == 0 ? 0 : homeProp.overallWins / homeProp.overallTotal
                            homeProp.homeAwayChance = homeProp.homeAwayTotal == 0 ? 0 : homeProp.homeAwayWins / homeProp.homeAwayTotal
                            homeProp.teamChance = homeProp.teamTotal == 0 ? 0 : homeProp.teamWins / homeProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            homeProp.overallWeighted = ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance))) == 0 ? 0 : (homeProp.overallChance * (1 - teamAgainstOverallChance)) / ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance)))
                            homeProp.homeAwayWeighted = ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance))) == 0 ? 0 : (homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance)))
                            homeProp.teamWeighted = ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance))) == 0 ? 0 : (homeProp.teamChance * (1 - teamAgainstTeamChance)) / ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance)))


                            teamStats = awayTeamStats
                            teamAgainstStats = homeTeamStats
                            awayProp.overallWins = teamStats.filter(e => (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) < filteredBothTeamProp[j].point).length;
                            awayProp.overallTotal = teamStats.length
                            awayProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == awayProp.homeAway && (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) < filteredBothTeamProp[j].point).length;
                            awayProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).length
                            awayProp.teamWins = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId && (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) < filteredBothTeamProp[j].point).length;
                            awayProp.teamTotal = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).length

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) >= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway && (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) >= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId && (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) >= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).slice(0, 10)
                            overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) < filteredBothTeamProp[j].point).length
                            awayProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) < filteredBothTeamProp[j].point).length
                            awayProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter) < filteredBothTeamProp[j].point).length
                            awayProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredFirstQuarter + teamStats[i].pointsAllowedFirstQuarter) < filteredBothTeamProp[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredFirstQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedFirstQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            awayProp.fullGameLog = teamGameLog

                            totalOverall = teamStats.map(e => (e.pointsAllowedFirstQuarter + e.pointsScoredFirstQuarter))
                            totalHomeAway = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).map(e => (e.pointsAllowedFirstQuarter + e.pointsScoredFirstQuarter))
                            totalTeam = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).map(e => (e.pointsAllowedFirstQuarter + e.pointsScoredFirstQuarter))
                            awayProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            awayProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            awayProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            awayProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            awayProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            awayProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            awayProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            awayProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            awayProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            awayProp.overallChance = awayProp.overallTotal == 0 ? 0 : awayProp.overallWins / awayProp.overallTotal
                            awayProp.homeAwayChance = awayProp.homeAwayTotal == 0 ? 0 : awayProp.homeAwayWins / awayProp.homeAwayTotal
                            awayProp.teamChance = awayProp.teamTotal == 0 ? 0 : awayProp.teamWins / awayProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            awayProp.overallWeighted = ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance))) == 0 ? 0 : (awayProp.overallChance * (1 - teamAgainstOverallChance)) / ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance)))
                            awayProp.homeAwayWeighted = ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance))) == 0 ? 0 : (awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance)))
                            awayProp.teamWeighted = ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance))) == 0 ? 0 : (awayProp.teamChance * (1 - teamAgainstTeamChance)) / ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance)))


                        }
                    }
                    else if (filteredBothTeamProp[j].marketKey == 'totals_q2') {
                        if (filteredBothTeamProp[j].description == 'Over') {
                            teamStats = homeTeamStats
                            homeProp.overallWins = teamStats.filter(e => (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) > filteredBothTeamProp[j].point).length;
                            homeProp.overallTotal = teamStats.length
                            homeProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == homeProp.homeAway && (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) > filteredBothTeamProp[j].point).length;
                            homeProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).length
                            homeProp.teamWins = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId && (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) > overUnderTotalProps[j].point).length;
                            homeProp.teamTotal = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).length

                            teamAgainstStats = awayTeamStats

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) <= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway && (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) <= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId && (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) <= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) > filteredBothTeamProp[j].point).length
                            homeProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) > filteredBothTeamProp[j].point).length
                            homeProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) > filteredBothTeamProp[j].point).length
                            homeProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            let teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredSecondQuarter + teamStats[i].pointsAllowedSecondQuarter) > filteredBothTeamProp[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredSecondQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedSecondQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            homeProp.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => (e.pointsAllowedSecondQuarter + e.pointsScoredSecondQuarter))
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).map(e => (e.pointsAllowedSecondQuarter + e.pointsScoredSecondQuarter))
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).map(e => (e.pointsAllowedSecondQuarter + e.pointsScoredSecondQuarter))
                            homeProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            homeProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            homeProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            homeProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            homeProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            homeProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            homeProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            homeProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            homeProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            homeProp.overallChance = homeProp.overallTotal == 0 ? 0 : homeProp.overallWins / homeProp.overallTotal
                            homeProp.homeAwayChance = homeProp.homeAwayTotal == 0 ? 0 : homeProp.homeAwayWins / homeProp.homeAwayTotal
                            homeProp.teamChance = homeProp.teamTotal == 0 ? 0 : homeProp.teamWins / homeProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            homeProp.overallWeighted = ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance))) == 0 ? 0 : (homeProp.overallChance * (1 - teamAgainstOverallChance)) / ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance)))
                            homeProp.homeAwayWeighted = ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance))) == 0 ? 0 : (homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance)))
                            homeProp.teamWeighted = ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance))) == 0 ? 0 : (homeProp.teamChance * (1 - teamAgainstTeamChance)) / ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance)))


                            teamStats = awayTeamStats
                            teamAgainstStats = homeTeamStats
                            awayProp.overallWins = teamStats.filter(e => (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) > filteredBothTeamProp[j].point).length;
                            awayProp.overallTotal = teamStats.length
                            awayProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == awayProp.homeAway && (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) > filteredBothTeamProp[j].point).length;
                            awayProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).length
                            awayProp.teamWins = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId && (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) > filteredBothTeamProp[j].point).length;
                            awayProp.teamTotal = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).length

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) <= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway && (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) <= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId && (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) <= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).slice(0, 10)
                            overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) > filteredBothTeamProp[j].point).length
                            awayProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) > filteredBothTeamProp[j].point).length
                            awayProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) > filteredBothTeamProp[j].point).length
                            awayProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredSecondQuarter + teamStats[i].pointsAllowedSecondQuarter) > overUnderTotalProps[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredSecondQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedSecondQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            awayProp.fullGameLog = teamGameLog

                            totalOverall = teamStats.map(e => (e.pointsAllowedSecondQuarter + e.pointsScoredSecondQuarter))
                            totalHomeAway = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).map(e => (e.pointsAllowedSecondQuarter + e.pointsScoredSecondQuarter))
                            totalTeam = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).map(e => (e.pointsAllowedSecondQuarter + e.pointsScoredSecondQuarter))
                            awayProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            awayProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            awayProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            awayProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            awayProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            awayProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            awayProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            awayProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            awayProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            awayProp.overallChance = awayProp.overallTotal == 0 ? 0 : awayProp.overallWins / awayProp.overallTotal
                            awayProp.homeAwayChance = awayProp.homeAwayTotal == 0 ? 0 : awayProp.homeAwayWins / awayProp.homeAwayTotal
                            awayProp.teamChance = awayProp.teamTotal == 0 ? 0 : awayProp.teamWins / awayProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            awayProp.overallWeighted = ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance))) == 0 ? 0 : (awayProp.overallChance * (1 - teamAgainstOverallChance)) / ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance)))
                            awayProp.homeAwayWeighted = ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance))) == 0 ? 0 : (awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance)))
                            awayProp.teamWeighted = ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance))) == 0 ? 0 : (awayProp.teamChance * (1 - teamAgainstTeamChance)) / ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance)))

                        }
                        else {
                            teamStats = homeTeamStats
                            teamAgainstStats = awayTeamStats
                            homeProp.overallWins = teamStats.filter(e => (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) < filteredBothTeamProp[j].point).length;
                            homeProp.overallTotal = teamStats.length
                            homeProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == homeProp.homeAway && (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) < filteredBothTeamProp[j].point).length;
                            homeProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).length
                            homeProp.teamWins = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId && (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) < filteredBothTeamProp[j].point).length;
                            homeProp.teamTotal = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).length

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) >= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway && (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) >= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId && (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) >= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) < filteredBothTeamProp[j].point).length
                            homeProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) < filteredBothTeamProp[j].point).length
                            homeProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) < filteredBothTeamProp[j].point).length
                            homeProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            let teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredSecondQuarter + teamStats[i].pointsAllowedSecondQuarter) < filteredBothTeamProp[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredSecondQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedSecondQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            homeProp.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => (e.pointsAllowedSecondQuarter + e.pointsScoredSecondQuarter))
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).map(e => (e.pointsAllowedSecondQuarter + e.pointsScoredSecondQuarter))
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).map(e => (e.pointsAllowedSecondQuarter + e.pointsScoredSecondQuarter))
                            homeProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            homeProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            homeProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            homeProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            homeProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            homeProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            homeProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            homeProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            homeProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            homeProp.overallChance = homeProp.overallTotal == 0 ? 0 : homeProp.overallWins / homeProp.overallTotal
                            homeProp.homeAwayChance = homeProp.homeAwayTotal == 0 ? 0 : homeProp.homeAwayWins / homeProp.homeAwayTotal
                            homeProp.teamChance = homeProp.teamTotal == 0 ? 0 : homeProp.teamWins / homeProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            homeProp.overallWeighted = ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance))) == 0 ? 0 : (homeProp.overallChance * (1 - teamAgainstOverallChance)) / ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance)))
                            homeProp.homeAwayWeighted = ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance))) == 0 ? 0 : (homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance)))
                            homeProp.teamWeighted = ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance))) == 0 ? 0 : (homeProp.teamChance * (1 - teamAgainstTeamChance)) / ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance)))


                            teamStats = awayTeamStats
                            teamAgainstStats = homeTeamStats
                            awayProp.overallWins = teamStats.filter(e => (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) < filteredBothTeamProp[j].point).length;
                            awayProp.overallTotal = teamStats.length
                            awayProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == awayProp.homeAway && (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) < filteredBothTeamProp[j].point).length;
                            awayProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).length
                            awayProp.teamWins = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId && (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) < filteredBothTeamProp[j].point).length;
                            awayProp.teamTotal = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).length

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) >= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway && (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) >= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId && (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) >= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).slice(0, 10)
                            overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) < filteredBothTeamProp[j].point).length
                            awayProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) < filteredBothTeamProp[j].point).length
                            awayProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter) < filteredBothTeamProp[j].point).length
                            awayProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredSecondQuarter + teamStats[i].pointsAllowedSecondQuarter) < filteredBothTeamProp[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredSecondQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedSecondQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            awayProp.fullGameLog = teamGameLog

                            totalOverall = teamStats.map(e => (e.pointsAllowedSecondQuarter + e.pointsScoredSecondQuarter))
                            totalHomeAway = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).map(e => (e.pointsAllowedSecondQuarter + e.pointsScoredSecondQuarter))
                            totalTeam = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).map(e => (e.pointsAllowedSecondQuarter + e.pointsScoredSecondQuarter))
                            awayProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            awayProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            awayProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            awayProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            awayProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            awayProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            awayProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            awayProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            awayProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            awayProp.overallChance = awayProp.overallTotal == 0 ? 0 : awayProp.overallWins / awayProp.overallTotal
                            awayProp.homeAwayChance = awayProp.homeAwayTotal == 0 ? 0 : awayProp.homeAwayWins / awayProp.homeAwayTotal
                            awayProp.teamChance = awayProp.teamTotal == 0 ? 0 : awayProp.teamWins / awayProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            awayProp.overallWeighted = ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance))) == 0 ? 0 : (awayProp.overallChance * (1 - teamAgainstOverallChance)) / ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance)))
                            awayProp.homeAwayWeighted = ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance))) == 0 ? 0 : (awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance)))
                            awayProp.teamWeighted = ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance))) == 0 ? 0 : (awayProp.teamChance * (1 - teamAgainstTeamChance)) / ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance)))


                        }
                    }
                    else if (filteredBothTeamProp[j].marketKey == 'totals_q3') {
                        if (filteredBothTeamProp[j].description == 'Over') {
                            teamStats = homeTeamStats
                            homeProp.overallWins = teamStats.filter(e => (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) > filteredBothTeamProp[j].point).length;
                            homeProp.overallTotal = teamStats.length
                            homeProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == homeProp.homeAway && (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) > filteredBothTeamProp[j].point).length;
                            homeProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).length
                            homeProp.teamWins = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId && (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) > overUnderTotalProps[j].point).length;
                            homeProp.teamTotal = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).length

                            teamAgainstStats = awayTeamStats

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) <= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway && (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) <= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId && (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) <= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) > filteredBothTeamProp[j].point).length
                            homeProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) > filteredBothTeamProp[j].point).length
                            homeProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) > filteredBothTeamProp[j].point).length
                            homeProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            let teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredThirdQuarter + teamStats[i].pointsAllowedThirdQuarter) > filteredBothTeamProp[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredThirdQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedThirdQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            homeProp.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => (e.pointsAllowedThirdQuarter + e.pointsScoredThirdQuarter))
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).map(e => (e.pointsAllowedThirdQuarter + e.pointsScoredThirdQuarter))
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).map(e => (e.pointsAllowedThirdQuarter + e.pointsScoredThirdQuarter))
                            homeProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            homeProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            homeProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            homeProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            homeProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            homeProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            homeProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            homeProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            homeProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            homeProp.overallChance = homeProp.overallTotal == 0 ? 0 : homeProp.overallWins / homeProp.overallTotal
                            homeProp.homeAwayChance = homeProp.homeAwayTotal == 0 ? 0 : homeProp.homeAwayWins / homeProp.homeAwayTotal
                            homeProp.teamChance = homeProp.teamTotal == 0 ? 0 : homeProp.teamWins / homeProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            homeProp.overallWeighted = ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance))) == 0 ? 0 : (homeProp.overallChance * (1 - teamAgainstOverallChance)) / ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance)))
                            homeProp.homeAwayWeighted = ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance))) == 0 ? 0 : (homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance)))
                            homeProp.teamWeighted = ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance))) == 0 ? 0 : (homeProp.teamChance * (1 - teamAgainstTeamChance)) / ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance)))


                            teamStats = awayTeamStats
                            teamAgainstStats = homeTeamStats
                            awayProp.overallWins = teamStats.filter(e => (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) > filteredBothTeamProp[j].point).length;
                            awayProp.overallTotal = teamStats.length
                            awayProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == awayProp.homeAway && (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) > filteredBothTeamProp[j].point).length;
                            awayProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).length
                            awayProp.teamWins = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId && (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) > filteredBothTeamProp[j].point).length;
                            awayProp.teamTotal = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).length

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) <= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway && (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) <= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId && (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) <= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).slice(0, 10)
                            overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) > filteredBothTeamProp[j].point).length
                            awayProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) > filteredBothTeamProp[j].point).length
                            awayProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) > filteredBothTeamProp[j].point).length
                            awayProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredThirdQuarter + teamStats[i].pointsAllowedThirdQuarter) > overUnderTotalProps[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredThirdQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedThirdQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            awayProp.fullGameLog = teamGameLog

                            totalOverall = teamStats.map(e => (e.pointsAllowedThirdQuarter + e.pointsScoredThirdQuarter))
                            totalHomeAway = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).map(e => (e.pointsAllowedThirdQuarter + e.pointsScoredThirdQuarter))
                            totalTeam = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).map(e => (e.pointsAllowedThirdQuarter + e.pointsScoredThirdQuarter))
                            awayProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            awayProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            awayProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            awayProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            awayProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            awayProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            awayProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            awayProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            awayProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            awayProp.overallChance = awayProp.overallTotal == 0 ? 0 : awayProp.overallWins / awayProp.overallTotal
                            awayProp.homeAwayChance = awayProp.homeAwayTotal == 0 ? 0 : awayProp.homeAwayWins / awayProp.homeAwayTotal
                            awayProp.teamChance = awayProp.teamTotal == 0 ? 0 : awayProp.teamWins / awayProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            awayProp.overallWeighted = ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance))) == 0 ? 0 : (awayProp.overallChance * (1 - teamAgainstOverallChance)) / ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance)))
                            awayProp.homeAwayWeighted = ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance))) == 0 ? 0 : (awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance)))
                            awayProp.teamWeighted = ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance))) == 0 ? 0 : (awayProp.teamChance * (1 - teamAgainstTeamChance)) / ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance)))

                        }
                        else {
                            teamStats = homeTeamStats
                            teamAgainstStats = awayTeamStats
                            homeProp.overallWins = teamStats.filter(e => (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) < filteredBothTeamProp[j].point).length;
                            homeProp.overallTotal = teamStats.length
                            homeProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == homeProp.homeAway && (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) < filteredBothTeamProp[j].point).length;
                            homeProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).length
                            homeProp.teamWins = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId && (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) < filteredBothTeamProp[j].point).length;
                            homeProp.teamTotal = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).length

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) >= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway && (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) >= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId && (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) >= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) < filteredBothTeamProp[j].point).length
                            homeProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) < filteredBothTeamProp[j].point).length
                            homeProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) < filteredBothTeamProp[j].point).length
                            homeProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            let teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredThirdQuarter + teamStats[i].pointsAllowedThirdQuarter) < filteredBothTeamProp[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredThirdQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedThirdQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            homeProp.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => (e.pointsAllowedThirdQuarter + e.pointsScoredThirdQuarter))
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).map(e => (e.pointsAllowedThirdQuarter + e.pointsScoredThirdQuarter))
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).map(e => (e.pointsAllowedThirdQuarter + e.pointsScoredThirdQuarter))
                            homeProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            homeProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            homeProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            homeProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            homeProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            homeProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            homeProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            homeProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            homeProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            homeProp.overallChance = homeProp.overallTotal == 0 ? 0 : homeProp.overallWins / homeProp.overallTotal
                            homeProp.homeAwayChance = homeProp.homeAwayTotal == 0 ? 0 : homeProp.homeAwayWins / homeProp.homeAwayTotal
                            homeProp.teamChance = homeProp.teamTotal == 0 ? 0 : homeProp.teamWins / homeProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            homeProp.overallWeighted = ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance))) == 0 ? 0 : (homeProp.overallChance * (1 - teamAgainstOverallChance)) / ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance)))
                            homeProp.homeAwayWeighted = ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance))) == 0 ? 0 : (homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance)))
                            homeProp.teamWeighted = ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance))) == 0 ? 0 : (homeProp.teamChance * (1 - teamAgainstTeamChance)) / ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance)))


                            teamStats = awayTeamStats
                            teamAgainstStats = homeTeamStats
                            awayProp.overallWins = teamStats.filter(e => (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) < filteredBothTeamProp[j].point).length;
                            awayProp.overallTotal = teamStats.length
                            awayProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == awayProp.homeAway && (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) < filteredBothTeamProp[j].point).length;
                            awayProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).length
                            awayProp.teamWins = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId && (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) < filteredBothTeamProp[j].point).length;
                            awayProp.teamTotal = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).length

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) >= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway && (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) >= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId && (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) >= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).slice(0, 10)
                            overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) < filteredBothTeamProp[j].point).length
                            awayProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) < filteredBothTeamProp[j].point).length
                            awayProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter) < filteredBothTeamProp[j].point).length
                            awayProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredThirdQuarter + teamStats[i].pointsAllowedThirdQuarter) < filteredBothTeamProp[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredThirdQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedThirdQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            awayProp.fullGameLog = teamGameLog

                            totalOverall = teamStats.map(e => (e.pointsAllowedThirdQuarter + e.pointsScoredThirdQuarter))
                            totalHomeAway = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).map(e => (e.pointsAllowedThirdQuarter + e.pointsScoredThirdQuarter))
                            totalTeam = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).map(e => (e.pointsAllowedThirdQuarter + e.pointsScoredThirdQuarter))
                            awayProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            awayProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            awayProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            awayProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            awayProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            awayProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            awayProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            awayProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            awayProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            awayProp.overallChance = awayProp.overallTotal == 0 ? 0 : awayProp.overallWins / awayProp.overallTotal
                            awayProp.homeAwayChance = awayProp.homeAwayTotal == 0 ? 0 : awayProp.homeAwayWins / awayProp.homeAwayTotal
                            awayProp.teamChance = awayProp.teamTotal == 0 ? 0 : awayProp.teamWins / awayProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            awayProp.overallWeighted = ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance))) == 0 ? 0 : (awayProp.overallChance * (1 - teamAgainstOverallChance)) / ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance)))
                            awayProp.homeAwayWeighted = ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance))) == 0 ? 0 : (awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance)))
                            awayProp.teamWeighted = ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance))) == 0 ? 0 : (awayProp.teamChance * (1 - teamAgainstTeamChance)) / ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance)))


                        }
                    }
                    else if (filteredBothTeamProp[j].marketKey == 'totals_q4') {
                        if (filteredBothTeamProp[j].description == 'Over') {
                            teamStats = homeTeamStats
                            homeProp.overallWins = teamStats.filter(e => (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) > filteredBothTeamProp[j].point).length;
                            homeProp.overallTotal = teamStats.length
                            homeProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == homeProp.homeAway && (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) > filteredBothTeamProp[j].point).length;
                            homeProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).length
                            homeProp.teamWins = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId && (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) > overUnderTotalProps[j].point).length;
                            homeProp.teamTotal = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).length

                            teamAgainstStats = awayTeamStats

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) <= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway && (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) <= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId && (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) <= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) > filteredBothTeamProp[j].point).length
                            homeProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) > filteredBothTeamProp[j].point).length
                            homeProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) > filteredBothTeamProp[j].point).length
                            homeProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            let teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredFourthQuarter + teamStats[i].pointsAllowedFourthQuarter) > filteredBothTeamProp[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredFourthQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedFourthQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            homeProp.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => (e.pointsAllowedFourthQuarter + e.pointsScoredFourthQuarter))
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).map(e => (e.pointsAllowedFourthQuarter + e.pointsScoredFourthQuarter))
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).map(e => (e.pointsAllowedFourthQuarter + e.pointsScoredFourthQuarter))
                            homeProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            homeProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            homeProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            homeProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            homeProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            homeProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            homeProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            homeProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            homeProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            homeProp.overallChance = homeProp.overallTotal == 0 ? 0 : homeProp.overallWins / homeProp.overallTotal
                            homeProp.homeAwayChance = homeProp.homeAwayTotal == 0 ? 0 : homeProp.homeAwayWins / homeProp.homeAwayTotal
                            homeProp.teamChance = homeProp.teamTotal == 0 ? 0 : homeProp.teamWins / homeProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            homeProp.overallWeighted = ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance))) == 0 ? 0 : (homeProp.overallChance * (1 - teamAgainstOverallChance)) / ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance)))
                            homeProp.homeAwayWeighted = ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance))) == 0 ? 0 : (homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance)))
                            homeProp.teamWeighted = ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance))) == 0 ? 0 : (homeProp.teamChance * (1 - teamAgainstTeamChance)) / ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance)))


                            teamStats = awayTeamStats
                            teamAgainstStats = homeTeamStats
                            awayProp.overallWins = teamStats.filter(e => (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) > filteredBothTeamProp[j].point).length;
                            awayProp.overallTotal = teamStats.length
                            awayProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == awayProp.homeAway && (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) > filteredBothTeamProp[j].point).length;
                            awayProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).length
                            awayProp.teamWins = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId && (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) > filteredBothTeamProp[j].point).length;
                            awayProp.teamTotal = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).length

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) <= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway && (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) <= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId && (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) <= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).slice(0, 10)
                            overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) > filteredBothTeamProp[j].point).length
                            awayProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) > filteredBothTeamProp[j].point).length
                            awayProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) > filteredBothTeamProp[j].point).length
                            awayProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredFourthQuarter + teamStats[i].pointsAllowedFourthQuarter) > overUnderTotalProps[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredFourthQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedFourthQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            awayProp.fullGameLog = teamGameLog

                            totalOverall = teamStats.map(e => (e.pointsAllowedFourthQuarter + e.pointsScoredFourthQuarter))
                            totalHomeAway = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).map(e => (e.pointsAllowedFourthQuarter + e.pointsScoredFourthQuarter))
                            totalTeam = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).map(e => (e.pointsAllowedFourthQuarter + e.pointsScoredFourthQuarter))
                            awayProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            awayProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            awayProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            awayProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            awayProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            awayProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            awayProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            awayProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            awayProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            awayProp.overallChance = awayProp.overallTotal == 0 ? 0 : awayProp.overallWins / awayProp.overallTotal
                            awayProp.homeAwayChance = awayProp.homeAwayTotal == 0 ? 0 : awayProp.homeAwayWins / awayProp.homeAwayTotal
                            awayProp.teamChance = awayProp.teamTotal == 0 ? 0 : awayProp.teamWins / awayProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            awayProp.overallWeighted = ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance))) == 0 ? 0 : (awayProp.overallChance * (1 - teamAgainstOverallChance)) / ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance)))
                            awayProp.homeAwayWeighted = ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance))) == 0 ? 0 : (awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance)))
                            awayProp.teamWeighted = ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance))) == 0 ? 0 : (awayProp.teamChance * (1 - teamAgainstTeamChance)) / ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance)))

                        }
                        else {
                            teamStats = homeTeamStats
                            teamAgainstStats = awayTeamStats
                            homeProp.overallWins = teamStats.filter(e => (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) < filteredBothTeamProp[j].point).length;
                            homeProp.overallTotal = teamStats.length
                            homeProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == homeProp.homeAway && (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) < filteredBothTeamProp[j].point).length;
                            homeProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).length
                            homeProp.teamWins = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId && (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) < filteredBothTeamProp[j].point).length;
                            homeProp.teamTotal = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).length

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) >= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != homeProp.homeAway && (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) >= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == homeProp.teamId && (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) >= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) < filteredBothTeamProp[j].point).length
                            homeProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            let homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) < filteredBothTeamProp[j].point).length
                            homeProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            let teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) < filteredBothTeamProp[j].point).length
                            homeProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            let teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredFourthQuarter + teamStats[i].pointsAllowedFourthQuarter) < filteredBothTeamProp[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredFourthQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedFourthQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            homeProp.fullGameLog = teamGameLog

                            let totalOverall = teamStats.map(e => (e.pointsAllowedFourthQuarter + e.pointsScoredFourthQuarter))
                            let totalHomeAway = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).map(e => (e.pointsAllowedFourthQuarter + e.pointsScoredFourthQuarter))
                            let totalTeam = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).map(e => (e.pointsAllowedFourthQuarter + e.pointsScoredFourthQuarter))
                            homeProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            homeProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            homeProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            homeProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            homeProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            homeProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            homeProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            homeProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            homeProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            homeProp.overallChance = homeProp.overallTotal == 0 ? 0 : homeProp.overallWins / homeProp.overallTotal
                            homeProp.homeAwayChance = homeProp.homeAwayTotal == 0 ? 0 : homeProp.homeAwayWins / homeProp.homeAwayTotal
                            homeProp.teamChance = homeProp.teamTotal == 0 ? 0 : homeProp.teamWins / homeProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            homeProp.overallWeighted = ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance))) == 0 ? 0 : (homeProp.overallChance * (1 - teamAgainstOverallChance)) / ((homeProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - homeProp.overallChance)))
                            homeProp.homeAwayWeighted = ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance))) == 0 ? 0 : (homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((homeProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - homeProp.homeAwayChance)))
                            homeProp.teamWeighted = ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance))) == 0 ? 0 : (homeProp.teamChance * (1 - teamAgainstTeamChance)) / ((homeProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - homeProp.teamChance)))


                            teamStats = awayTeamStats
                            teamAgainstStats = homeTeamStats
                            awayProp.overallWins = teamStats.filter(e => (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) < filteredBothTeamProp[j].point).length;
                            awayProp.overallTotal = teamStats.length
                            awayProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == awayProp.homeAway && (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) < filteredBothTeamProp[j].point).length;
                            awayProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).length
                            awayProp.teamWins = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId && (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) < filteredBothTeamProp[j].point).length;
                            awayProp.teamTotal = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).length

                            teamAgainstOverallTotal = teamAgainstStats.length
                            teamAgainstHomeAwayTotal = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway).length
                            teamAgainstTeamTotal = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId).length
                            teamAgainstOverallWins = teamAgainstStats.filter(e => (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) >= filteredBothTeamProp[j].point).length
                            teamAgainstHomeAwayWins = teamAgainstStats.filter(e => e.homeOrAway != awayProp.homeAway && (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) >= filteredBothTeamProp[j].point).length
                            teamAgainstTeamWins = teamAgainstStats.filter(e => e.teamAgainstId == awayProp.teamId && (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) >= filteredBothTeamProp[j].point).length

                            overAllTableTemp = teamStats.slice(0, 10)
                            homeAwayTableTemp = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).slice(0, 10)
                            teamTableTemp = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).slice(0, 10)
                            overallLast10Wins = overAllTableTemp.filter(e => (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) < filteredBothTeamProp[j].point).length
                            awayProp.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) < filteredBothTeamProp[j].point).length
                            awayProp.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            teamLast10Wins = teamTableTemp.filter(e => (e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter) < filteredBothTeamProp[j].point).length
                            awayProp.last10Team = [teamLast10Wins, teamTableTemp.length]

                            teamGameLog = []
                            for (let i = 0; i < teamStats.length; i++) {
                                teamGameLog.push({
                                    teamAgainstName: teamStats[i].teamAgainstName,
                                    gameDate: teamStats[i].gameDate,
                                    result: (teamStats[i].pointsScoredFourthQuarter + teamStats[i].pointsAllowedFourthQuarter) < filteredBothTeamProp[j].point ? 'W' : 'L',
                                    pointsScoredOverall: teamStats[i].pointsScoredFourthQuarter,
                                    pointsAllowedOverall: teamStats[i].pointsAllowedFourthQuarter,
                                    homeAway: teamStats[i].homeOrAway,
                                    gameId: teamStats[i].gameId
                                })
                            }
                            awayProp.fullGameLog = teamGameLog

                            totalOverall = teamStats.map(e => (e.pointsAllowedFourthQuarter + e.pointsScoredFourthQuarter))
                            totalHomeAway = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).map(e => (e.pointsAllowedFourthQuarter + e.pointsScoredFourthQuarter))
                            totalTeam = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).map(e => (e.pointsAllowedFourthQuarter + e.pointsScoredFourthQuarter))
                            awayProp.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                            awayProp.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                            awayProp.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                            awayProp.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                            awayProp.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                            awayProp.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                            awayProp.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                            awayProp.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                            awayProp.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                            awayProp.overallChance = awayProp.overallTotal == 0 ? 0 : awayProp.overallWins / awayProp.overallTotal
                            awayProp.homeAwayChance = awayProp.homeAwayTotal == 0 ? 0 : awayProp.homeAwayWins / awayProp.homeAwayTotal
                            awayProp.teamChance = awayProp.teamTotal == 0 ? 0 : awayProp.teamWins / awayProp.teamTotal
                            teamAgainstOverallChance = teamAgainstOverallTotal == 0 ? 0 : teamAgainstOverallWins / teamAgainstOverallTotal
                            teamAgainstHomeAwayChance = teamAgainstHomeAwayTotal == 0 ? 0 : teamAgainstHomeAwayWins / teamAgainstHomeAwayTotal
                            teamAgainstTeamChance = teamAgainstTeamTotal == 0 ? 0 : teamAgainstTeamWins / teamAgainstTeamTotal
                            awayProp.overallWeighted = ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance))) == 0 ? 0 : (awayProp.overallChance * (1 - teamAgainstOverallChance)) / ((awayProp.overallChance * (1 - teamAgainstOverallChance)) + (teamAgainstOverallChance * (1 - awayProp.overallChance)))
                            awayProp.homeAwayWeighted = ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance))) == 0 ? 0 : (awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) / ((awayProp.homeAwayChance * (1 - teamAgainstHomeAwayChance)) + (teamAgainstHomeAwayChance * (1 - awayProp.homeAwayChance)))
                            awayProp.teamWeighted = ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance))) == 0 ? 0 : (awayProp.teamChance * (1 - teamAgainstTeamChance)) / ((awayProp.teamChance * (1 - teamAgainstTeamChance)) + (teamAgainstTeamChance * (1 - awayProp.teamChance)))


                        }
                    }





                    homeTeamOverUnderFinal.push(homeProp)
                    awayTeamOverUnderFinal.push(awayProp)


                }
                awayTeamOverUnderFinal.propType = 'total'
                awayTeamOverUnderFinal.propName = distinctBothTeamBoth[k]
                homeTeamOverUnderFinal.propType = 'total'
                homeTeamOverUnderFinal.propName = distinctBothTeamBoth[k]
                propTypeArray.push([awayTeamOverUnderFinal, homeTeamOverUnderFinal])
                propTypeArray[propTypeArray.length - 1].propType = 'total'
                propTypeArray[propTypeArray.length - 1].propName = distinctBothTeamBoth[k]
                homeTeamOverUnderFinal = []
                awayTeamOverUnderFinal = []
            }

        }

        //homeTeamOverUnderFinal.sort((a: any, b: any) => b.gameBookData.description.localeCompare(a.gameBookData.description))
        //awayTeamOverUnderFinal.sort((a: any, b: any) => b.gameBookData.description.localeCompare(a.gameBookData.description))
        homeTeamOverUnderFinal.propType = 'total'
        awayTeamOverUnderFinal.propType = 'total'






        finalReturn.push(propTypeArray)
        return propTypeArray
    }

    static async getPlayerPropDataNew(bookId: string, allTeamInfo: DbTeamInfo[]): Promise<any[]> {
        console.log("start player service")
        let finalReturn: any[] = []

        let playerPropData = await PlayerPropController.loadPlayerPropData('NFL', bookId)
        let homeTeam = playerPropData[0].homeTeam
        let awayTeam = playerPropData[0].awayTeam

        let uniquePlayerProps = playerPropData.map(e => e.marketKey).filter((value, index, array) => array.indexOf(value) === index)

        let uniquePlayerNames = playerPropData.map(e => e.playerName).filter((value, index, array) => array.indexOf(value) === index)

        let playerCall = await Promise.all([NflController.nflGetAllPlayerGameStatsByPlayerNameAndSeason(uniquePlayerNames, 2024), PlayerInfoController.loadActivePlayerInfoBySport("NFL")])
        let allPlayerStats = playerCall[0]
        let allPlayerInfo = playerCall[1]

        //create an array for each prop that has a home and away array that contains an array for each player props
        for (let j = 0; j < uniquePlayerProps.length; j++) {
            let propArray: any[] = []
            let homePlayerProps: any[] = []
            let awayPlayerProps: any[] = []
            let uniquePlayersWithinProp = playerPropData.filter(e => e.marketKey == uniquePlayerProps[j]).map(e => e.playerName).filter((value, index, array) => array.indexOf(value) === index)
            for (let m = 0; m < uniquePlayersWithinProp.length; m++) {
                try {

                    let specificProps = playerPropData.filter(e => e.marketKey == uniquePlayerProps[j] && e.playerName == uniquePlayersWithinProp[m])
                    let playerPropStats: any = []
                    for (let i = 0; i < specificProps.length; i++) {
                        try {
                            let playerStats = allPlayerStats.filter(e => e.playerName == specificProps[i].playerName)
                            let playerInfo = allPlayerInfo.filter(e => e.playerId == playerStats[0].playerId)
                            let playerTeamNameLong = allTeamInfo.filter(e => e.teamNameAbvr == playerInfo[0].teamName)
                            let playerTeamAgainst = playerTeamNameLong[0].teamNameFull == specificProps[i].awayTeam ? allTeamInfo.filter(e => e.teamNameFull == specificProps[i].homeTeam) : allTeamInfo.filter(e => e.teamNameFull == specificProps[i].awayTeam)
                            let playerPropObj: PlayerPropDto = {
                                playerBookData: specificProps[i],
                                playerName: playerInfo[0].playerName,
                                playerId: playerInfo[0].playerId,
                                teamName: playerInfo[0].teamName,
                                teamId: playerInfo[0].teamId,
                                teamAgainstName: playerTeamAgainst[0].teamNameAbvr,
                                teamAgainstId: playerTeamAgainst[0].teamId,
                                homeAway: playerTeamNameLong[0].teamNameFull == specificProps[i].awayTeam ? 'away' : 'home',
                                propType: '',
                                overallChance: 0,
                                overallWins: 0,
                                overallTotal: playerStats.length,
                                homeAwayChance: 0,
                                homeAwayWins: 0,
                                homeAwayTotal: playerStats.filter(e => e.homeOrAway == (playerTeamNameLong[0].teamNameFull == specificProps[i].awayTeam ? 'away' : 'home')).length,
                                teamChance: 0,
                                teamWins: 0,
                                teamTotal: playerStats.filter(e => e.teamAgainstName == playerTeamAgainst[0].teamNameAbvr).length,
                                averageOverall: 0,
                                averageHomeAway: 0,
                                averageTeam: 0,
                                highOverall: 0,
                                highHomeAway: 0,
                                highTeam: 0,
                                lowOverall: 0,
                                lowHomeAway: 0,
                                lowTeam: 0,
                                isDisabled: false,
                                playerStats: playerStats,
                                last10Overall: [],
                                last10HomeAway: [],
                                last10Team: [],
                                fullGameLog: [],
                                trends: [],
                                propTrendLabels: [],
                                propTrendData:[]
                            }
                            let overAllTableTemp = playerStats.slice(0, 10)
                            let homeAwayTableTemp = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).slice(0, 10)
                            let teamTableTemp = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).slice(0, 10)
                            let overallLast10Wins = 0
                            let homeAwayLast10Wins = 0
                            let teamLast10Wins = 0

                            if (specificProps[i].marketKey == 'player_pass_tds') {
                                if (specificProps[i].description == 'Over') {
                                    playerPropObj.overallWins = playerStats.filter(e => e.qbPassingTouchdowns > specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingTouchdowns > specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingTouchdowns > specificProps[i].point).length;
                                    overallLast10Wins = overAllTableTemp.filter(e => e.qbPassingTouchdowns > specificProps[i].point).length
                                    homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingTouchdowns > specificProps[i].point).length
                                    teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingTouchdowns > specificProps[i].point).length
                                }
                                else {
                                    playerPropObj.overallWins = playerStats.filter(e => e.qbPassingTouchdowns < specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingTouchdowns < specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingTouchdowns < specificProps[i].point).length;
                                    overallLast10Wins = overAllTableTemp.filter(e => e.qbPassingTouchdowns < specificProps[i].point).length
                                    homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingTouchdowns < specificProps[i].point).length
                                    teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingTouchdowns < specificProps[i].point).length
                                }

                                let totalOverall = playerStats.map(e => e.qbPassingTouchdowns)
                                let totalHomeAway = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).map(e => e.qbPassingTouchdowns)
                                let totalTeam = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).map(e => e.qbPassingTouchdowns)
                                playerPropObj.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                                playerPropObj.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                                playerPropObj.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                                playerPropObj.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                                playerPropObj.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                                playerPropObj.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                                playerPropObj.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                                playerPropObj.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                                playerPropObj.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0

                                let playerGameLog = []
                                for (let z = 0; z < playerStats.length; z++) {
                                    playerGameLog.push({
                                        teamAgainstName: playerStats[z].teamAgainstName,
                                        gameDate: playerStats[z].gameDate,
                                        propPoint: playerStats[z].qbPassingTouchdowns,
                                        homeAway: playerStats[z].homeOrAway,
                                        propName: 'TD',
                                        result: specificProps[i].description == 'Over' ? (playerStats[z].qbPassingTouchdowns > specificProps[i].point ? 'W' : 'L') : (playerStats[z].qbPassingTouchdowns < specificProps[i].point ? 'W' : 'L'),
                                        gameId: playerStats[z].gameId
                                    })
                                }
                                playerPropObj.fullGameLog = playerGameLog
                                playerPropObj.propType = 'total'

                            }
                            else if (specificProps[i].marketKey == 'player_pass_yds') {
                                if (specificProps[i].description == 'Over') {
                                    playerPropObj.overallWins = playerStats.filter(e => e.qbPassingYards > specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingYards > specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingYards > specificProps[i].point).length;
                                    overallLast10Wins = overAllTableTemp.filter(e => e.qbPassingYards > specificProps[i].point).length
                                    homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingYards > specificProps[i].point).length
                                    teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingYards > specificProps[i].point).length

                                }
                                else {
                                    playerPropObj.overallWins = playerStats.filter(e => e.qbPassingYards < specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingYards < specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingYards < specificProps[i].point).length;
                                    overallLast10Wins = overAllTableTemp.filter(e => e.qbPassingYards < specificProps[i].point).length
                                    homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingYards < specificProps[i].point).length
                                    teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingYards < specificProps[i].point).length
                                }
                                let totalOverall = playerStats.map(e => e.qbPassingYards)
                                let totalHomeAway = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).map(e => e.qbPassingYards)
                                let totalTeam = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).map(e => e.qbPassingYards)
                                playerPropObj.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                                playerPropObj.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                                playerPropObj.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                                playerPropObj.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                                playerPropObj.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                                playerPropObj.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                                playerPropObj.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                                playerPropObj.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                                playerPropObj.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                                let playerGameLog = []
                                for (let z = 0; z < playerStats.length; z++) {
                                    playerGameLog.push({
                                        teamAgainstName: playerStats[i].teamAgainstName,
                                        gameDate: playerStats[z].gameDate,
                                        propPoint: playerStats[z].qbPassingYards,
                                        homeAway: playerStats[z].homeOrAway,
                                        propName: 'Y',
                                        result: specificProps[i].description == 'Over' ? (playerStats[z].qbPassingYards > specificProps[i].point ? 'W' : 'L') : (playerStats[z].qbPassingYards < specificProps[i].point ? 'W' : 'L'),
                                        gameId: playerStats[z].gameId
                                    })
                                }
                                playerPropObj.fullGameLog = playerGameLog
                                playerPropObj.propType = 'total'
                            }
                            else if (specificProps[i].marketKey == 'player_reception_yds') {
                                if (specificProps[i].description == 'Over') {
                                    playerPropObj.overallWins = playerStats.filter(e => e.receivingYards > specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.receivingYards > specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.receivingYards > specificProps[i].point).length;
                                    overallLast10Wins = overAllTableTemp.filter(e => e.receivingYards > specificProps[i].point).length
                                    homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.receivingYards > specificProps[i].point).length
                                    teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.receivingYards > specificProps[i].point).length

                                }
                                else {
                                    playerPropObj.overallWins = playerStats.filter(e => e.receivingYards < specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.receivingYards < specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.receivingYards < specificProps[i].point).length;
                                    overallLast10Wins = overAllTableTemp.filter(e => e.receivingYards < specificProps[i].point).length
                                    homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.receivingYards < specificProps[i].point).length
                                    teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.receivingYards < specificProps[i].point).length
                                }
                                let totalOverall = playerStats.map(e => e.receivingYards)
                                let totalHomeAway = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).map(e => e.receivingYards)
                                let totalTeam = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).map(e => e.receivingYards)
                                playerPropObj.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                                playerPropObj.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                                playerPropObj.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                                playerPropObj.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                                playerPropObj.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                                playerPropObj.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                                playerPropObj.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                                playerPropObj.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                                playerPropObj.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                                let playerGameLog = []
                                for (let z = 0; z < playerStats.length; z++) {
                                    playerGameLog.push({
                                        teamAgainstName: playerStats[z].teamAgainstName,
                                        gameDate: playerStats[z].gameDate,
                                        propPoint: playerStats[z].receivingYards,
                                        homeAway: playerStats[z].homeOrAway,
                                        propName: 'Y',
                                        result: specificProps[i].description == 'Over' ? (playerStats[z].receivingYards > specificProps[i].point ? 'W' : 'L') : (playerStats[z].receivingYards < specificProps[i].point ? 'W' : 'L'),
                                        gameId: playerStats[z].gameId
                                    })
                                }
                                playerPropObj.fullGameLog = playerGameLog
                                playerPropObj.propType = 'total'
                            }
                            else if (specificProps[i].marketKey == 'player_rush_yds') {
                                if (specificProps[i].description == 'Over') {
                                    playerPropObj.overallWins = playerStats.filter(e => e.rushingYards > specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.rushingYards > specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.rushingYards > specificProps[i].point).length;
                                    overallLast10Wins = overAllTableTemp.filter(e => e.rushingYards > specificProps[i].point).length
                                    homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.rushingYards > specificProps[i].point).length
                                    teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.rushingYards > specificProps[i].point).length

                                }
                                else {
                                    playerPropObj.overallWins = playerStats.filter(e => e.rushingYards < specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.rushingYards < specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.rushingYards < specificProps[i].point).length;
                                    overallLast10Wins = overAllTableTemp.filter(e => e.rushingYards < specificProps[i].point).length
                                    homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.rushingYards < specificProps[i].point).length
                                    teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.rushingYards < specificProps[i].point).length
                                }
                                let totalOverall = playerStats.map(e => e.rushingYards)
                                let totalHomeAway = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).map(e => e.rushingYards)
                                let totalTeam = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).map(e => e.rushingYards)
                                playerPropObj.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                                playerPropObj.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                                playerPropObj.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                                playerPropObj.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                                playerPropObj.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                                playerPropObj.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                                playerPropObj.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                                playerPropObj.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                                playerPropObj.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                                let playerGameLog = []
                                for (let z = 0; z < playerStats.length; z++) {
                                    playerGameLog.push({
                                        teamAgainstName: playerStats[z].teamAgainstName,
                                        gameDate: playerStats[z].gameDate,
                                        propPoint: playerStats[z].rushingYards,
                                        homeAway: playerStats[z].homeOrAway,
                                        propName: 'Y',
                                        result: specificProps[i].description == 'Over' ? (playerStats[z].rushingYards > specificProps[i].point ? 'W' : 'L') : (playerStats[z].rushingYards < specificProps[i].point ? 'W' : 'L'),
                                        gameId: playerStats[z].gameId
                                    })
                                }
                                playerPropObj.fullGameLog = playerGameLog
                                playerPropObj.propType = 'total'
                            }
                            else if (specificProps[i].marketKey == 'player_pass_yds_alternate') {
                                if (specificProps[i].description == 'Over') {
                                    playerPropObj.overallWins = playerStats.filter(e => e.qbPassingYards > specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingYards > specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingYards > specificProps[i].point).length;
                                    overallLast10Wins = overAllTableTemp.filter(e => e.qbPassingYards > specificProps[i].point).length
                                    homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingYards > specificProps[i].point).length
                                    teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingYards > specificProps[i].point).length

                                }
                                else {
                                    playerPropObj.overallWins = playerStats.filter(e => e.qbPassingYards < specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingYards < specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingYards < specificProps[i].point).length;
                                    overallLast10Wins = overAllTableTemp.filter(e => e.qbPassingYards < specificProps[i].point).length
                                    homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingYards < specificProps[i].point).length
                                    teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingYards < specificProps[i].point).length
                                }
                                let totalOverall = playerStats.map(e => e.qbPassingYards)
                                let totalHomeAway = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).map(e => e.qbPassingYards)
                                let totalTeam = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).map(e => e.qbPassingYards)
                                playerPropObj.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                                playerPropObj.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                                playerPropObj.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                                playerPropObj.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                                playerPropObj.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                                playerPropObj.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                                playerPropObj.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                                playerPropObj.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                                playerPropObj.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                                let playerGameLog = []
                                for (let z = 0; z < playerStats.length; z++) {
                                    playerGameLog.push({
                                        teamAgainstName: playerStats[z].teamAgainstName,
                                        gameDate: playerStats[z].gameDate,
                                        propPoint: playerStats[z].qbPassingYards,
                                        homeAway: playerStats[z].homeOrAway,
                                        propName: 'Y',
                                        result: specificProps[i].description == 'Over' ? (playerStats[z].qbPassingYards > specificProps[i].point ? 'W' : 'L') : (playerStats[z].qbPassingYards < specificProps[i].point ? 'W' : 'L'),
                                        gameId: playerStats[z].gameId
                                    })
                                }
                                playerPropObj.fullGameLog = playerGameLog
                                playerPropObj.propType = 'total'
                            }
                            else if (specificProps[i].marketKey == 'player_reception_yds_alternate') {
                                if (specificProps[i].description == 'Over') {
                                    playerPropObj.overallWins = playerStats.filter(e => e.receivingYards > specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.receivingYards > specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.receivingYards > specificProps[i].point).length;
                                    overallLast10Wins = overAllTableTemp.filter(e => e.receivingYards > specificProps[i].point).length
                                    homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.receivingYards > specificProps[i].point).length
                                    teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.receivingYards > specificProps[i].point).length

                                }
                                else {
                                    playerPropObj.overallWins = playerStats.filter(e => e.receivingYards < specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.receivingYards < specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.receivingYards < specificProps[i].point).length;
                                    overallLast10Wins = overAllTableTemp.filter(e => e.receivingYards < specificProps[i].point).length
                                    homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.receivingYards < specificProps[i].point).length
                                    teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.receivingYards < specificProps[i].point).length
                                }
                                let totalOverall = playerStats.map(e => e.receivingYards)
                                let totalHomeAway = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).map(e => e.receivingYards)
                                let totalTeam = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).map(e => e.receivingYards)
                                playerPropObj.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                                playerPropObj.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                                playerPropObj.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                                playerPropObj.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                                playerPropObj.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                                playerPropObj.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                                playerPropObj.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                                playerPropObj.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                                playerPropObj.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                                let playerGameLog = []
                                for (let z = 0; z < playerStats.length; z++) {
                                    playerGameLog.push({
                                        teamAgainstName: playerStats[z].teamAgainstName,
                                        gameDate: playerStats[z].gameDate,
                                        propPoint: playerStats[z].receivingYards,
                                        homeAway: playerStats[z].homeOrAway,
                                        propName: 'Y',
                                        result: specificProps[i].description == 'Over' ? (playerStats[z].receivingYards > specificProps[i].point ? 'W' : 'L') : (playerStats[z].receivingYards < specificProps[i].point ? 'W' : 'L'),
                                        gameId: playerStats[z].gameId
                                    })
                                }
                                playerPropObj.fullGameLog = playerGameLog
                                playerPropObj.propType = 'altTotal'
                            }
                            else if (specificProps[i].marketKey == 'player_rush_yds_alternate') {
                                if (specificProps[i].description == 'Over') {
                                    playerPropObj.overallWins = playerStats.filter(e => e.rushingYards > specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.rushingYards > specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.rushingYards > specificProps[i].point).length;
                                    overallLast10Wins = overAllTableTemp.filter(e => e.rushingYards > specificProps[i].point).length
                                    homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.rushingYards > specificProps[i].point).length
                                    teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.rushingYards > specificProps[i].point).length

                                }
                                else {
                                    playerPropObj.overallWins = playerStats.filter(e => e.rushingYards < specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.rushingYards < specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.rushingYards < specificProps[i].point).length;
                                    overallLast10Wins = overAllTableTemp.filter(e => e.rushingYards < specificProps[i].point).length
                                    homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.rushingYards < specificProps[i].point).length
                                    teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.rushingYards < specificProps[i].point).length
                                }
                                let totalOverall = playerStats.map(e => e.rushingYards)
                                let totalHomeAway = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).map(e => e.rushingYards)
                                let totalTeam = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).map(e => e.rushingYards)
                                playerPropObj.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                                playerPropObj.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                                playerPropObj.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                                playerPropObj.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                                playerPropObj.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                                playerPropObj.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                                playerPropObj.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                                playerPropObj.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                                playerPropObj.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                                let playerGameLog = []
                                for (let z = 0; z < playerStats.length; z++) {
                                    playerGameLog.push({
                                        teamAgainstName: playerStats[z].teamAgainstName,
                                        gameDate: playerStats[z].gameDate,
                                        propPoint: playerStats[z].rushingYards,
                                        homeAway: playerStats[z].homeOrAway,
                                        propName: 'Y',
                                        result: specificProps[i].description == 'Over' ? (playerStats[z].rushingYards > specificProps[i].point ? 'W' : 'L') : (playerStats[z].rushingYards < specificProps[i].point ? 'W' : 'L'),
                                        gameId: playerStats[z].gameId
                                    })
                                }
                                playerPropObj.fullGameLog = playerGameLog
                                playerPropObj.propType = 'altTotal'
                            }
                            playerPropObj.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                            playerPropObj.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                            playerPropObj.last10Team = [teamLast10Wins, teamTableTemp.length]


                            playerPropObj.overallChance = playerPropObj.overallTotal == 0 ? 0 : playerPropObj.overallWins / playerPropObj.overallTotal
                            playerPropObj.homeAwayChance = playerPropObj.homeAwayTotal == 0 ? 0 : playerPropObj.homeAwayWins / playerPropObj.homeAwayTotal
                            playerPropObj.teamChance = playerPropObj.teamTotal == 0 ? 0 : playerPropObj.teamWins / playerPropObj.teamTotal

                            playerPropStats.push(playerPropObj)
                        }
                        catch (error: any) {
                            console.log("Error in NflService add player: " + error.message)
                        }


                    }
                    if (playerPropStats[0].propType == 'total') {
                        if (playerPropStats[0].playerBookData.description == 'Over') {
                            let zero = JSON.parse(JSON.stringify(playerPropStats[0]))
                            let one = JSON.parse(JSON.stringify(playerPropStats[1]))

                            playerPropStats[1] = zero
                            playerPropStats[0] = one

                        }
                        playerPropStats.overUnder = false;
                    }
                    else if (playerPropStats[0].propType = 'altTotal') {
                        playerPropStats.sort((a: { playerBookData: { point: any; }; }, b: { playerBookData: { point: any; }; }) => a.playerBookData.point - b.playerBookData.point)
                        playerPropStats.index = 0;
                    }

                    playerPropStats[0].homeAway == 'Home' ? homePlayerProps.push(playerPropStats) : awayPlayerProps.push(playerPropStats)
                }
                catch (error: any) {
                    console.log('Nhl Service player: ' + uniquePlayersWithinProp[m] + ' ' + error.message)
                }

            }
            let fullArray: any = awayPlayerProps.concat(homePlayerProps)
            propArray.push(awayPlayerProps);
            propArray[0].teamName = awayTeam
            propArray.push(homePlayerProps);
            propArray[1].teamName = homeTeam

            fullArray.propName = uniquePlayerProps[j]
            finalReturn.push(fullArray)


        }


        console.log("end player service")
        return finalReturn
    }

    static async getSinglePlayerPropDataNew(playerProps: DbPlayerPropData[], allTeamInfo: DbTeamInfo[], playerId: number, playerInfo: DbPlayerInfo, playerStats: DBNflPlayerGameStats[]): Promise<any[]> {
        console.log("start player service")
        let finalReturn: any[] = []

        let homeTeam = playerProps[0].homeTeam
        let awayTeam = playerProps[0].awayTeam

        let uniquePlayerProps = playerProps.map(e => e.marketKey).filter((value, index, array) => array.indexOf(value) === index)

        //create an array for each prop that has a home and away array that contains an array for each player props
        for (let j = 0; j < uniquePlayerProps.length; j++) {
            let propArray: any[] = []
            let homePlayerProps: any[] = []
            let awayPlayerProps: any[] = []
            let specificProps = playerProps.filter(e => e.marketKey == uniquePlayerProps[j])
            let playerPropStats: any = []
            for (let i = 0; i < specificProps.length; i++) {
                try {
                    let playerTeamNameLong = allTeamInfo.filter(e => e.teamNameAbvr == playerInfo.teamName)
                    let playerTeamAgainst = playerTeamNameLong[0].teamNameFull == specificProps[i].awayTeam ? allTeamInfo.filter(e => e.teamNameFull == specificProps[i].homeTeam) : allTeamInfo.filter(e => e.teamNameFull == specificProps[i].awayTeam)
                    let playerPropObj: PlayerPropDto = {
                        playerBookData: specificProps[i],
                        playerName: playerInfo.playerName,
                        playerId: playerInfo.playerId,
                        teamName: playerInfo.teamName,
                        teamId: playerInfo.teamId,
                        teamAgainstName: playerTeamAgainst[0].teamNameAbvr,
                        teamAgainstId: playerTeamAgainst[0].teamId,
                        homeAway: playerTeamNameLong[0].teamNameFull == specificProps[i].awayTeam ? 'away' : 'home',
                        propType: '',
                        overallChance: 0,
                        overallWins: 0,
                        overallTotal: playerStats.length,
                        homeAwayChance: 0,
                        homeAwayWins: 0,
                        homeAwayTotal: playerStats.filter(e => e.homeOrAway == (playerTeamNameLong[0].teamNameFull == specificProps[i].awayTeam ? 'away' : 'home')).length,
                        teamChance: 0,
                        teamWins: 0,
                        teamTotal: playerStats.filter(e => e.teamAgainstName == playerTeamAgainst[0].teamNameAbvr).length,
                        averageOverall: 0,
                        averageHomeAway: 0,
                        averageTeam: 0,
                        highOverall: 0,
                        highHomeAway: 0,
                        highTeam: 0,
                        lowOverall: 0,
                        lowHomeAway: 0,
                        lowTeam: 0,
                        isDisabled: false,
                        playerStats: playerStats,
                        last10Overall: [],
                        last10HomeAway: [],
                        last10Team: [],
                        fullGameLog: [],
                        trends: [],
                        propTrendLabels: [],
                        propTrendData: []
                    }
                    let overAllTableTemp = playerStats.slice(0, 10)
                    let homeAwayTableTemp = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).slice(0, 10)
                    let teamTableTemp = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).slice(0, 10)
                    let overallLast10Wins = 0
                    let homeAwayLast10Wins = 0
                    let teamLast10Wins = 0

                    if (specificProps[i].marketKey == 'player_pass_tds') {
                        if (specificProps[i].description == 'Over') {
                            playerPropObj.overallWins = playerStats.filter(e => e.qbPassingTouchdowns > specificProps[i].point).length;
                            playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingTouchdowns > specificProps[i].point).length;
                            playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingTouchdowns > specificProps[i].point).length;
                            overallLast10Wins = overAllTableTemp.filter(e => e.qbPassingTouchdowns > specificProps[i].point).length
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingTouchdowns > specificProps[i].point).length
                            teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingTouchdowns > specificProps[i].point).length
                        }
                        else {
                            playerPropObj.overallWins = playerStats.filter(e => e.qbPassingTouchdowns < specificProps[i].point).length;
                            playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingTouchdowns < specificProps[i].point).length;
                            playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingTouchdowns < specificProps[i].point).length;
                            overallLast10Wins = overAllTableTemp.filter(e => e.qbPassingTouchdowns < specificProps[i].point).length
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingTouchdowns < specificProps[i].point).length
                            teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingTouchdowns < specificProps[i].point).length
                        }

                        let totalOverall = playerStats.map(e => e.qbPassingTouchdowns)
                        let totalHomeAway = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).map(e => e.qbPassingTouchdowns)
                        let totalTeam = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).map(e => e.qbPassingTouchdowns)
                        playerPropObj.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                        playerPropObj.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                        playerPropObj.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                        playerPropObj.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                        playerPropObj.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                        playerPropObj.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                        playerPropObj.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                        playerPropObj.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                        playerPropObj.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0

                        let playerGameLog = []
                        for (let z = 0; z < playerStats.length; z++) {
                            playerGameLog.push({
                                teamAgainstName: playerStats[z].teamAgainstName,
                                gameDate: playerStats[z].gameDate,
                                propPoint: playerStats[z].qbPassingTouchdowns,
                                homeAway: playerStats[z].homeOrAway,
                                propName: 'TD',
                                result: specificProps[i].description == 'Over' ? (playerStats[z].qbPassingTouchdowns > specificProps[i].point ? 'W' : 'L') : (playerStats[z].qbPassingTouchdowns < specificProps[i].point ? 'W' : 'L'),
                                gameId: playerStats[z].gameId
                            })
                        }
                        playerPropObj.fullGameLog = playerGameLog
                        playerPropObj.propType = 'total'

                    }
                    else if (specificProps[i].marketKey == 'player_pass_yds') {
                        if (specificProps[i].description == 'Over') {
                            playerPropObj.overallWins = playerStats.filter(e => e.qbPassingYards > specificProps[i].point).length;
                            playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingYards > specificProps[i].point).length;
                            playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingYards > specificProps[i].point).length;
                            overallLast10Wins = overAllTableTemp.filter(e => e.qbPassingYards > specificProps[i].point).length
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingYards > specificProps[i].point).length
                            teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingYards > specificProps[i].point).length

                        }
                        else {
                            playerPropObj.overallWins = playerStats.filter(e => e.qbPassingYards < specificProps[i].point).length;
                            playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingYards < specificProps[i].point).length;
                            playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingYards < specificProps[i].point).length;
                            overallLast10Wins = overAllTableTemp.filter(e => e.qbPassingYards < specificProps[i].point).length
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingYards < specificProps[i].point).length
                            teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingYards < specificProps[i].point).length
                        }
                        let totalOverall = playerStats.map(e => e.qbPassingYards)
                        let totalHomeAway = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).map(e => e.qbPassingYards)
                        let totalTeam = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).map(e => e.qbPassingYards)
                        playerPropObj.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                        playerPropObj.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                        playerPropObj.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                        playerPropObj.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                        playerPropObj.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                        playerPropObj.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                        playerPropObj.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                        playerPropObj.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                        playerPropObj.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                        let playerGameLog = []
                        for (let z = 0; z < playerStats.length; z++) {
                            playerGameLog.push({
                                teamAgainstName: playerStats[i].teamAgainstName,
                                gameDate: playerStats[z].gameDate,
                                propPoint: playerStats[z].qbPassingYards,
                                homeAway: playerStats[z].homeOrAway,
                                propName: 'Y',
                                result: specificProps[i].description == 'Over' ? (playerStats[z].qbPassingYards > specificProps[i].point ? 'W' : 'L') : (playerStats[z].qbPassingYards < specificProps[i].point ? 'W' : 'L'),
                                gameId: playerStats[z].gameId
                            })
                        }
                        playerPropObj.fullGameLog = playerGameLog
                        playerPropObj.propType = 'total'
                    }
                    else if (specificProps[i].marketKey == 'player_reception_yds') {
                        if (specificProps[i].description == 'Over') {
                            playerPropObj.overallWins = playerStats.filter(e => e.receivingYards > specificProps[i].point).length;
                            playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.receivingYards > specificProps[i].point).length;
                            playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.receivingYards > specificProps[i].point).length;
                            overallLast10Wins = overAllTableTemp.filter(e => e.receivingYards > specificProps[i].point).length
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.receivingYards > specificProps[i].point).length
                            teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.receivingYards > specificProps[i].point).length

                        }
                        else {
                            playerPropObj.overallWins = playerStats.filter(e => e.receivingYards < specificProps[i].point).length;
                            playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.receivingYards < specificProps[i].point).length;
                            playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.receivingYards < specificProps[i].point).length;
                            overallLast10Wins = overAllTableTemp.filter(e => e.receivingYards < specificProps[i].point).length
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.receivingYards < specificProps[i].point).length
                            teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.receivingYards < specificProps[i].point).length
                        }
                        let totalOverall = playerStats.map(e => e.receivingYards)
                        let totalHomeAway = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).map(e => e.receivingYards)
                        let totalTeam = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).map(e => e.receivingYards)
                        playerPropObj.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                        playerPropObj.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                        playerPropObj.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                        playerPropObj.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                        playerPropObj.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                        playerPropObj.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                        playerPropObj.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                        playerPropObj.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                        playerPropObj.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                        let playerGameLog = []
                        for (let z = 0; z < playerStats.length; z++) {
                            playerGameLog.push({
                                teamAgainstName: playerStats[z].teamAgainstName,
                                gameDate: playerStats[z].gameDate,
                                propPoint: playerStats[z].receivingYards,
                                homeAway: playerStats[z].homeOrAway,
                                propName: 'Y',
                                result: specificProps[i].description == 'Over' ? (playerStats[z].receivingYards > specificProps[i].point ? 'W' : 'L') : (playerStats[z].receivingYards < specificProps[i].point ? 'W' : 'L'),
                                gameId: playerStats[z].gameId
                            })
                        }
                        playerPropObj.fullGameLog = playerGameLog
                        playerPropObj.propType = 'total'
                    }
                    else if (specificProps[i].marketKey == 'player_rush_yds') {
                        if (specificProps[i].description == 'Over') {
                            playerPropObj.overallWins = playerStats.filter(e => e.rushingYards > specificProps[i].point).length;
                            playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.rushingYards > specificProps[i].point).length;
                            playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.rushingYards > specificProps[i].point).length;
                            overallLast10Wins = overAllTableTemp.filter(e => e.rushingYards > specificProps[i].point).length
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.rushingYards > specificProps[i].point).length
                            teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.rushingYards > specificProps[i].point).length

                        }
                        else {
                            playerPropObj.overallWins = playerStats.filter(e => e.rushingYards < specificProps[i].point).length;
                            playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.rushingYards < specificProps[i].point).length;
                            playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.rushingYards < specificProps[i].point).length;
                            overallLast10Wins = overAllTableTemp.filter(e => e.rushingYards < specificProps[i].point).length
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.rushingYards < specificProps[i].point).length
                            teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.rushingYards < specificProps[i].point).length
                        }
                        let totalOverall = playerStats.map(e => e.rushingYards)
                        let totalHomeAway = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).map(e => e.rushingYards)
                        let totalTeam = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).map(e => e.rushingYards)
                        playerPropObj.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                        playerPropObj.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                        playerPropObj.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                        playerPropObj.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                        playerPropObj.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                        playerPropObj.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                        playerPropObj.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                        playerPropObj.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                        playerPropObj.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                        let playerGameLog = []
                        for (let z = 0; z < playerStats.length; z++) {
                            playerGameLog.push({
                                teamAgainstName: playerStats[z].teamAgainstName,
                                gameDate: playerStats[z].gameDate,
                                propPoint: playerStats[z].rushingYards,
                                homeAway: playerStats[z].homeOrAway,
                                propName: 'Y',
                                result: specificProps[i].description == 'Over' ? (playerStats[z].rushingYards > specificProps[i].point ? 'W' : 'L') : (playerStats[z].rushingYards < specificProps[i].point ? 'W' : 'L'),
                                gameId: playerStats[z].gameId
                            })
                        }
                        playerPropObj.fullGameLog = playerGameLog
                        playerPropObj.propType = 'total'
                    }
                    else if (specificProps[i].marketKey == 'player_pass_yds_alternate') {
                        if (specificProps[i].description == 'Over') {
                            playerPropObj.overallWins = playerStats.filter(e => e.qbPassingYards > specificProps[i].point).length;
                            playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingYards > specificProps[i].point).length;
                            playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingYards > specificProps[i].point).length;
                            overallLast10Wins = overAllTableTemp.filter(e => e.qbPassingYards > specificProps[i].point).length
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingYards > specificProps[i].point).length
                            teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingYards > specificProps[i].point).length

                        }
                        else {
                            playerPropObj.overallWins = playerStats.filter(e => e.qbPassingYards < specificProps[i].point).length;
                            playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingYards < specificProps[i].point).length;
                            playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingYards < specificProps[i].point).length;
                            overallLast10Wins = overAllTableTemp.filter(e => e.qbPassingYards < specificProps[i].point).length
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.qbPassingYards < specificProps[i].point).length
                            teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.qbPassingYards < specificProps[i].point).length
                        }
                        let totalOverall = playerStats.map(e => e.qbPassingYards)
                        let totalHomeAway = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).map(e => e.qbPassingYards)
                        let totalTeam = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).map(e => e.qbPassingYards)
                        playerPropObj.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                        playerPropObj.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                        playerPropObj.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                        playerPropObj.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                        playerPropObj.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                        playerPropObj.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                        playerPropObj.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                        playerPropObj.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                        playerPropObj.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                        let playerGameLog = []
                        for (let z = 0; z < playerStats.length; z++) {
                            playerGameLog.push({
                                teamAgainstName: playerStats[z].teamAgainstName,
                                gameDate: playerStats[z].gameDate,
                                propPoint: playerStats[z].qbPassingYards,
                                homeAway: playerStats[z].homeOrAway,
                                propName: 'Y',
                                result: specificProps[i].description == 'Over' ? (playerStats[z].qbPassingYards > specificProps[i].point ? 'W' : 'L') : (playerStats[z].qbPassingYards < specificProps[i].point ? 'W' : 'L'),
                                gameId: playerStats[z].gameId
                            })
                        }
                        playerPropObj.fullGameLog = playerGameLog
                        playerPropObj.propType = 'total'
                    }
                    else if (specificProps[i].marketKey == 'player_reception_yds_alternate') {
                        if (specificProps[i].description == 'Over') {
                            playerPropObj.overallWins = playerStats.filter(e => e.receivingYards > specificProps[i].point).length;
                            playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.receivingYards > specificProps[i].point).length;
                            playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.receivingYards > specificProps[i].point).length;
                            overallLast10Wins = overAllTableTemp.filter(e => e.receivingYards > specificProps[i].point).length
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.receivingYards > specificProps[i].point).length
                            teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.receivingYards > specificProps[i].point).length

                        }
                        else {
                            playerPropObj.overallWins = playerStats.filter(e => e.receivingYards < specificProps[i].point).length;
                            playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.receivingYards < specificProps[i].point).length;
                            playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.receivingYards < specificProps[i].point).length;
                            overallLast10Wins = overAllTableTemp.filter(e => e.receivingYards < specificProps[i].point).length
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.receivingYards < specificProps[i].point).length
                            teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.receivingYards < specificProps[i].point).length
                        }
                        let totalOverall = playerStats.map(e => e.receivingYards)
                        let totalHomeAway = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).map(e => e.receivingYards)
                        let totalTeam = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).map(e => e.receivingYards)
                        playerPropObj.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                        playerPropObj.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                        playerPropObj.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                        playerPropObj.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                        playerPropObj.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                        playerPropObj.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                        playerPropObj.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                        playerPropObj.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                        playerPropObj.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                        let playerGameLog = []
                        for (let z = 0; z < playerStats.length; z++) {
                            playerGameLog.push({
                                teamAgainstName: playerStats[z].teamAgainstName,
                                gameDate: playerStats[z].gameDate,
                                propPoint: playerStats[z].receivingYards,
                                homeAway: playerStats[z].homeOrAway,
                                propName: 'Y',
                                result: specificProps[i].description == 'Over' ? (playerStats[z].receivingYards > specificProps[i].point ? 'W' : 'L') : (playerStats[z].receivingYards < specificProps[i].point ? 'W' : 'L'),
                                gameId: playerStats[z].gameId
                            })
                        }
                        playerPropObj.fullGameLog = playerGameLog
                        playerPropObj.propType = 'altTotal'
                    }
                    else if (specificProps[i].marketKey == 'player_rush_yds_alternate') {
                        if (specificProps[i].description == 'Over') {
                            playerPropObj.overallWins = playerStats.filter(e => e.rushingYards > specificProps[i].point).length;
                            playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.rushingYards > specificProps[i].point).length;
                            playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.rushingYards > specificProps[i].point).length;
                            overallLast10Wins = overAllTableTemp.filter(e => e.rushingYards > specificProps[i].point).length
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.rushingYards > specificProps[i].point).length
                            teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.rushingYards > specificProps[i].point).length

                        }
                        else {
                            playerPropObj.overallWins = playerStats.filter(e => e.rushingYards < specificProps[i].point).length;
                            playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.rushingYards < specificProps[i].point).length;
                            playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.rushingYards < specificProps[i].point).length;
                            overallLast10Wins = overAllTableTemp.filter(e => e.rushingYards < specificProps[i].point).length
                            homeAwayLast10Wins = homeAwayTableTemp.filter(e => e.homeOrAway == playerPropObj.homeAway && e.rushingYards < specificProps[i].point).length
                            teamLast10Wins = teamTableTemp.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.rushingYards < specificProps[i].point).length
                        }
                        let totalOverall = playerStats.map(e => e.rushingYards)
                        let totalHomeAway = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).map(e => e.rushingYards)
                        let totalTeam = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).map(e => e.rushingYards)
                        playerPropObj.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                        playerPropObj.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                        playerPropObj.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                        playerPropObj.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                        playerPropObj.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                        playerPropObj.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                        playerPropObj.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                        playerPropObj.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                        playerPropObj.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                        let playerGameLog = []
                        for (let z = 0; z < playerStats.length; z++) {
                            playerGameLog.push({
                                teamAgainstName: playerStats[z].teamAgainstName,
                                gameDate: playerStats[z].gameDate,
                                propPoint: playerStats[z].rushingYards,
                                homeAway: playerStats[z].homeOrAway,
                                propName: 'Y',
                                result: specificProps[i].description == 'Over' ? (playerStats[z].rushingYards > specificProps[i].point ? 'W' : 'L') : (playerStats[z].rushingYards < specificProps[i].point ? 'W' : 'L'),
                                gameId: playerStats[z].gameId
                            })
                        }
                        playerPropObj.fullGameLog = playerGameLog
                        playerPropObj.propType = 'altTotal'
                    }
                    playerPropObj.last10Overall = [overallLast10Wins, overAllTableTemp.length]
                    playerPropObj.last10HomeAway = [homeAwayLast10Wins, homeAwayTableTemp.length]
                    playerPropObj.last10Team = [teamLast10Wins, teamTableTemp.length]


                    playerPropObj.overallChance = playerPropObj.overallTotal == 0 ? 0 : playerPropObj.overallWins / playerPropObj.overallTotal
                    playerPropObj.homeAwayChance = playerPropObj.homeAwayTotal == 0 ? 0 : playerPropObj.homeAwayWins / playerPropObj.homeAwayTotal
                    playerPropObj.teamChance = playerPropObj.teamTotal == 0 ? 0 : playerPropObj.teamWins / playerPropObj.teamTotal

                    playerPropStats.push(playerPropObj)
                }
                catch (error: any) {
                    console.log("Error in NflService add player: " + error.message)
                }


            }
            if (playerPropStats[0].propType == 'total') {
                if (playerPropStats[0].playerBookData.description == 'Over') {
                    let zero = JSON.parse(JSON.stringify(playerPropStats[0]))
                    let one = JSON.parse(JSON.stringify(playerPropStats[1]))

                    playerPropStats[1] = zero
                    playerPropStats[0] = one

                }
                playerPropStats.overUnder = false;
                playerPropStats.propType = 'total'
            }
            else if (playerPropStats[0].propType = 'altTotal') {
                playerPropStats.sort((a: { playerBookData: { point: any; }; }, b: { playerBookData: { point: any; }; }) => a.playerBookData.point - b.playerBookData.point)
                playerPropStats.index = 0;
                playerPropStats.propType = 'altTotal'
            }

            playerPropStats[0].homeAway == 'Home' ? homePlayerProps.push(playerPropStats) : awayPlayerProps.push(playerPropStats)

            let fullArray: any = playerPropStats
            propArray.push(awayPlayerProps);
            propArray[0].teamName = awayTeam
            propArray.push(homePlayerProps);
            propArray[1].teamName = homeTeam

            fullArray.propName = uniquePlayerProps[j]
            fullArray.propType = playerPropStats[0].propType
            finalReturn.push(fullArray)

        }


        console.log("end player service")
        return finalReturn
    }

    static findTrends(bookData: DbGameBookData, backToBack: boolean, type: string, homeAway: string, teamStats: DBNflTeamGameStats[], teamAgainstGameStats: DBNflTeamGameStats[]): string[] {
        let finalReturn: string[] = []

        let backToBackWinCount = 0
        let backToBackWinTotal = 0
        if (backToBack) {
            if (type == 'h2h') {
                for (let i = 0; i < teamStats.length - 2; i++) {
                    if (reusedFunctions.isBackToBackGame(reusedFunctions.convertToDateFromStringToDate(teamStats[i].gameDate), reusedFunctions.convertToDateFromStringToDate(teamStats[i + 1].gameDate))) {
                        backToBackWinTotal++;
                        if (teamStats[i].result == 'W') {
                            backToBackWinCount++;
                        }
                    }
                }
                if (backToBackWinTotal > 0) {
                    finalReturn.push('Back To Back Game: ' + teamStats[0].teamName + ' is ' + backToBackWinCount + '-' + (backToBackWinTotal - backToBackWinCount) + ' in 2nd games in a back to back series.')
                }
            }
            else if (type == 'spread') {
                for (let i = 0; i < teamStats.length - 2; i++) {
                    if (reusedFunctions.isBackToBackGame(reusedFunctions.convertToDateFromStringToDate(teamStats[i].gameDate), reusedFunctions.convertToDateFromStringToDate(teamStats[i + 1].gameDate))) {
                        backToBackWinTotal++;
                        if ((teamStats[i].pointsAllowedOverall - teamStats[i].pointsScoredOverall) < bookData.point) {
                            backToBackWinCount++;
                        }
                    }
                }
                if (backToBackWinTotal > 0) {
                    finalReturn.push('Back To Back Game: ' + teamStats[0].teamName + ' is ' + backToBackWinCount + '-' + (backToBackWinTotal - backToBackWinCount) + ' with spread of ' + (bookData.point > 0 ? '+' : '') + bookData.point + ' in 2nd games in a back to back series.')
                }
            }






        }

        let lastGameWinLoss
        let winLossCount = 1
        let winLossTotal = 0
        let winLossNumber = 0
        //find the number of games in a row with the total win loss
        // Ex 3 game loss streak
        if (type == 'h2h') {
            lastGameWinLoss = teamStats[0].result
            for (let i = 1; i < teamStats.length; i++) {
                if (lastGameWinLoss == 'W' || lastGameWinLoss == 'L') {
                    if (teamStats[i].result == lastGameWinLoss) {
                        winLossCount++;
                    }
                    else {
                        break;
                    }
                }
                else {
                    if (teamStats[i].result == lastGameWinLoss || teamStats[i].result == 'L') {
                        winLossCount++;
                    }
                    else {
                        break;
                    }
                }
            }
            //find the result on every game given the win loss streak
            // Ex win every game when coming off of a three game loss streak
            //loop through each game, check to see if the previous winLossCount number of games all match lastGameWinLoss
            //if so add to total and add result to result total

            for (let i = 0; i < teamStats.length - winLossCount; i++) {
                let winLossCheck: boolean[] = []
                for (let j = 1; j <= winLossCount; j++) {
                    if (lastGameWinLoss == 'L' || lastGameWinLoss == 'OTL') {
                        if (teamStats[i + j].result == 'L' || teamStats[i + j].result == 'OTL') {
                            winLossCheck.push(true)
                        }
                        else {
                            winLossCheck.push(false)
                        }
                    }
                    else {
                        if (teamStats[i + j].result == lastGameWinLoss) {
                            winLossCheck.push(true)
                        }
                        else {
                            winLossCheck.push(false)
                        }
                    }
                }
                if (!winLossCheck.includes(false)) {
                    winLossTotal++
                    winLossNumber += teamStats[i].result == 'W' ? 1 : 0
                }
            }
            if (winLossTotal > 0) {
                finalReturn.push(teamStats[0].teamName + ' is ' + winLossNumber + ' - ' + (winLossTotal - winLossNumber) + ' following a ' + winLossCount + ' game ' + (lastGameWinLoss == 'W' ? 'win' : 'loss') + ' streak')
            }
        }
        else if (type == 'spread') {
            lastGameWinLoss = (teamStats[0].pointsAllowedOverall - teamStats[0].pointsScoredOverall) < bookData.point
            for (let i = 1; i < teamStats.length; i++) {
                if (lastGameWinLoss) {
                    if ((teamStats[i].pointsAllowedOverall - teamStats[i].pointsScoredOverall) < bookData.point) {
                        winLossCount++;
                    }
                    else {
                        break;
                    }
                }
                else {
                    if ((teamStats[0].pointsAllowedOverall - teamStats[0].pointsScoredOverall) > bookData.point) {
                        winLossCount++;
                    }
                    else {
                        break;
                    }
                }
            }
            //find the result on every game given the win loss streak
            // Ex win every game when coming off of a three game loss streak
            //loop through each game, check to see if the previous winLossCount number of games all match lastGameWinLoss
            //if so add to total and add result to result total

            for (let i = 0; i < teamStats.length - winLossCount; i++) {
                let winLossCheck: boolean[] = []
                for (let j = 1; j <= winLossCount; j++) {
                    if (lastGameWinLoss) {
                        if ((teamStats[i + j].pointsAllowedOverall - teamStats[i + j].pointsScoredOverall) < bookData.point) {
                            winLossCheck.push(true)
                        }
                        else {
                            winLossCheck.push(false)
                        }
                    }
                    else {
                        if ((teamStats[i + j].pointsAllowedOverall - teamStats[i + j].pointsScoredOverall) > bookData.point) {
                            winLossCheck.push(true)
                        }
                        else {
                            winLossCheck.push(false)
                        }
                    }
                }
                if (!winLossCheck.includes(false)) {
                    winLossTotal++
                    winLossNumber += ((teamStats[i].pointsAllowedOverall - teamStats[i].pointsScoredOverall) < bookData.point) ? 1 : 0
                }
            }
            if (winLossTotal > 0) {
                finalReturn.push(teamStats[0].teamName + ' is ' + winLossNumber + ' - ' + (winLossTotal - winLossNumber) + ' following a ' + winLossCount + ' game ' + (bookData.point > 0 ? '+' : '') + bookData.point + (lastGameWinLoss ? ' win' : ' loss') + ' streak')
            }
        }





        return finalReturn;
    }
    static async getLiveBets(teamNames: string[]) {
        let finalTeamReturn: any[] = []
        let listOfLivePropTypes: string[] = ['h2h']
        let listOfTeamStats: DBNflTeamGameStats[] = await NflController.nflGetAllTeamStatsByTeamNamesAndSeason(teamNames, 2024)
        let awayTeamStats = listOfTeamStats.filter(e => e.teamName == teamNames[0])
        let homeTeamStats = listOfTeamStats.filter(e => e.teamName == teamNames[1])

        //need an array for each prop type which has an array for each team
        //each of the team arrays has:
        //an array of each type of selection for the prop. Ex: winning by, winning after
        // each element of the array needs to have a name of the above and an object with all the data for that graph

        for (let i = 0; i < listOfLivePropTypes.length; i++) {
            let propTypeArray: any = []
            let propName: string = ''
            let selectionList: string[] = []
            for (let j = 0; j < teamNames.length; j++) {
                let teamArray: any = []
                if (listOfLivePropTypes[i] == 'h2h') {
                    selectionList = ['Winning after X', 'Scoring']
                    let teamStats = j == 0 ? awayTeamStats : homeTeamStats


                    propName = 'Chance of winning if winning after given quarter'
                    let labels: string[] = ['1st Qtr', '2nd Qtr', '3rd Qtr']
                    let barChartFinal: any = []
                    for (let i = 1; i < 4; i++) {
                        let totalQuarterChance = 0;
                        let totalGames = 0
                        let totalWins = 0
                        if (i == 1) {
                            let filteredGames: DBNflTeamGameStats[] = []
                            filteredGames = teamStats.filter(game => game.pointsScoredFirstQuarter > game.pointsAllowedFirstQuarter)
                            let gamesWon = filteredGames.filter(e => e.result == 'W')
                            totalGames = filteredGames.length
                            totalWins = gamesWon.length
                        }
                        else if (i == 2) {
                            let filteredGames = teamStats.filter(game => (game.pointsScoredFirstQuarter + game.pointsScoredSecondQuarter) > (game.pointsAllowedFirstQuarter + game.pointsAllowedSecondQuarter))
                            let gamesWon = filteredGames.filter(e => e.result == 'W')
                            totalGames = filteredGames.length
                            totalWins = gamesWon.length
                        }
                        else if (i == 3) {
                            let filteredGames = teamStats.filter(game => (game.pointsScoredFirstQuarter + game.pointsScoredSecondQuarter + game.pointsScoredThirdQuarter) > (game.pointsAllowedFirstQuarter + game.pointsAllowedSecondQuarter + game.pointsAllowedThirdQuarter))
                            let gamesWon = filteredGames.filter(e => e.result == 'W')
                            totalGames = filteredGames.length
                            totalWins = gamesWon.length
                        }

                        totalQuarterChance = totalGames == 0 ? 0 : totalWins / totalGames
                        barChartFinal.push(totalQuarterChance * 100)
                    }
                    teamArray.push({ propName: propName, labels: labels, barData: barChartFinal })
                    teamArray[teamArray.length - 1].teamName = teamNames[j]


                    propName = 'Chance of winning if scoring at least X'
                    labels = []
                    barChartFinal = []
                    let highestScore: number = 0
                    for (let k = 0; k < teamStats.length; k++) {
                        if (highestScore < teamStats[k].pointsScoredOverall) {
                            highestScore = teamStats[k].pointsScoredOverall
                        }
                    }
                    for (let i = 2; i <= highestScore; i++) {
                        let totalScoringChance = 0;
                        let totalGames = 0
                        let totalWins = 0

                        let filteredGames: DBNflTeamGameStats[] = []
                        filteredGames = teamStats.filter(game => game.pointsScoredOverall >= i)
                        let gamesWon = filteredGames.filter(e => e.result == 'W')
                        totalGames = filteredGames.length
                        totalWins = gamesWon.length

                        labels.push(i.toString())

                        totalScoringChance = totalGames == 0 ? 0 : totalWins / totalGames
                        barChartFinal.push(totalScoringChance * 100)
                    }
                    teamArray.push({ propName: propName, labels: labels, barData: barChartFinal })
                    teamArray[teamArray.length - 1].teamName = teamNames[j]


                }
                propTypeArray.push(teamArray)

            }
            finalTeamReturn.push(propTypeArray)
            finalTeamReturn[finalTeamReturn.length - 1].propName = listOfLivePropTypes[i]
            finalTeamReturn[finalTeamReturn.length - 1].listOfSelections = selectionList
        }
        return finalTeamReturn

    }

    static async getPlayerBestBetStats(listOfPlayerBets: DbPlayerPropData[], listOfTeamBets: DbGameBookData[]) {
        let finalReturn: any = []
        let allTeamInfo = await TeamInfoController.getAllTeamInfo('NFL')
        let distinctBookIds = listOfPlayerBets.map(e => e.bookId).filter((v, i, a) => a.indexOf(v) === i)
        for (let i = 0; i < distinctBookIds.length; i++) {
            let bookIdPlayerProps = await this.getPlayerPropDataNew(distinctBookIds[i], allTeamInfo)
            finalReturn.push(bookIdPlayerProps)
        }

        let finalTeamReturn: any = []
        let distinctTeamBookIds = listOfTeamBets.map(e => e.bookId).filter((v, i, a) => a.indexOf(v) === i)
        for (let i = 0; i < distinctTeamBookIds.length; i++) {
            let filteredPropsByBookId = listOfTeamBets.filter(e => e.bookId == distinctTeamBookIds[i])
            let bookIdTeamProps = await this.getTeamPropDataNew(filteredPropsByBookId, allTeamInfo)
            finalTeamReturn.push(bookIdTeamProps)
        }


        let listOfPlayersInFormat = []
        for (let i = 0; i < finalReturn.length; i++) {
            for (let j = 0; j < finalReturn[i].length; j++) {
                for (let k = 0; k < finalReturn[i][j].length; k++) {
                    for (let m = 0; m < finalReturn[i][j][k].length; m++) {
                        listOfPlayersInFormat.push(finalReturn[i][j][k][m])
                    }
                }
            }
        }

        let finalBestBets: DbPlayerBestBets[] = []
        for (let i = 0; i < listOfPlayersInFormat.length; i++) {
            if (listOfPlayersInFormat[i].overallChance > .9 || listOfPlayersInFormat[i].homeAwayChance > .9) {
                let playerBestBest: DbPlayerBestBets = {
                    bookId: listOfPlayersInFormat[i].playerBookData.bookId,
                    sportTitle: listOfPlayersInFormat[i].playerBookData.sportTitle,
                    teamName: listOfPlayersInFormat[i].teamName,
                    teamAgainstName: listOfPlayersInFormat[i].teamAgainstName,
                    homeAway: listOfPlayersInFormat[i].homeAway,
                    commenceTime: listOfPlayersInFormat[i].playerBookData.commenceTime,
                    bookMaker: listOfPlayersInFormat[i].playerBookData.bookMaker,
                    marketKey: listOfPlayersInFormat[i].playerBookData.marketKey,
                    description: listOfPlayersInFormat[i].playerBookData.description,
                    playerName: listOfPlayersInFormat[i].playerName,
                    price: listOfPlayersInFormat[i].playerBookData.price,
                    point: listOfPlayersInFormat[i].playerBookData.point,
                    overallChance: listOfPlayersInFormat[i].overallChance,
                    homeAwayChance: listOfPlayersInFormat[i].homeAwayChance,
                    teamChance: listOfPlayersInFormat[i].teamChance
                }
                finalBestBets.push(playerBestBest)
            }
        }

        let listOfTeamsInFormat = []
        for (let i = 0; i < finalTeamReturn.length; i++) {
            for (let j = 0; j < finalTeamReturn[i].length; j++) {
                for (let k = 0; k < finalTeamReturn[i][j].length; k++) {
                    for (let m = 0; m < finalTeamReturn[i][j][k].length; m++) {
                        for (let n = 0; n < finalTeamReturn[i][j][k][m].length; n++) {
                            listOfTeamsInFormat.push(finalTeamReturn[i][j][k][m][n])
                        }
                    }
                }
            }
        }

        let finalTeamBets: any = []
        for (let i = 0; i < listOfTeamsInFormat.length; i++) {
            if (listOfTeamsInFormat[i].overallChance > .9 || listOfTeamsInFormat[i].homeAwayChance > .9) {
                let playerBestBest: DbPlayerBestBets = {
                    bookId: listOfTeamsInFormat[i].gameBookData.bookId,
                    sportTitle: listOfTeamsInFormat[i].gameBookData.sportTitle,
                    teamName: listOfTeamsInFormat[i].teamName,
                    teamAgainstName: listOfTeamsInFormat[i].teamAgainstName,
                    homeAway: listOfTeamsInFormat[i].homeAway,
                    commenceTime: listOfTeamsInFormat[i].gameBookData.commenceTime,
                    bookMaker: listOfTeamsInFormat[i].gameBookData.bookMaker,
                    marketKey: listOfTeamsInFormat[i].gameBookData.marketKey,
                    description: listOfTeamsInFormat[i].gameBookData.description,
                    playerName: listOfTeamsInFormat[i].teamName,
                    price: listOfTeamsInFormat[i].gameBookData.price,
                    point: listOfTeamsInFormat[i].gameBookData.point,
                    overallChance: listOfTeamsInFormat[i].overallChance,
                    homeAwayChance: listOfTeamsInFormat[i].homeAwayChance,
                    teamChance: listOfTeamsInFormat[i].teamChance
                }
                finalBestBets.push(playerBestBest)
            }
        }


        return finalBestBets
    }


}