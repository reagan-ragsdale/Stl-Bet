import { DbNhlTeamGameStats } from "../../shared/dbTasks/DbNhlTeamGameStats";
import { DbPlayerInfo } from "../../shared/dbTasks/DbPlayerInfo";
import { remult } from "remult";
import { DbNhlPlayerGameStats } from "../../shared/dbTasks/DbNhlPlayerGameStats";
import { DbTeamInfo } from "src/shared/dbTasks/DBTeamInfo";
import { TeamPropDto } from "../Dtos/TeamPropsDto";
import { DbGameBookData } from "../../shared/dbTasks/DbGameBookData";
import { NhlController } from "../../shared/Controllers/NhlController";
import { DbPlayerPropData } from "../../shared/dbTasks/DbPlayerPropData";
import { PlayerPropController } from "../../shared/Controllers/PlayerPropController";
import { PlayerPropDto } from "../Dtos/PlayerPropsDto";
import { PlayerInfoController } from "../../shared/Controllers/PlayerInfoController";
import { DbNhlTeamGameStatTotals } from "../../shared/dbTasks/DbNhlTeamGameStatTotals";
import { DbNhlPlayerGameStatTotals } from "../../shared/dbTasks/DbNhlPlayerGameStatTotals";
import { DbNhlTeamGameStatAverages } from "../../shared/dbTasks/DbNhlTeamGameStatAverages";
import { DbNhlPlayerGameStatAverages } from "../../shared/dbTasks/DbNhlPlayerGameStatAverages";
import { MatGridTileHeaderCssMatStyler } from "@angular/material/grid-list";
import { reusedFunctions } from "./reusedFunctions";
import { filter } from "compression";


export class NhlService {

    static convertPlayerInfoToDb(playerInfo: any[]): DbPlayerInfo[] {
        let playerInfoFinal: DbPlayerInfo[] = []
        for (let player of playerInfo) {
            playerInfoFinal.push({
                playerId: player.playerID,
                playerName: this.cleanNhlPlayerNames(player.longName),
                teamId: player.teamID,
                teamName: player.team,
                sport: 'NHL'
            })
        }
        return playerInfoFinal
    }

    static convertSchedule(schedule: any[]): string[] {
        let returnFinal: string[] = []

        for (let game of schedule) {
            returnFinal.push(game.gameID)
        }

        return returnFinal
    }

    static async convertGameAndPlayerStatsToDb(gameStats: any): Promise<any[]> {
        let finalReturn: any[] = []
        const teamRepo = remult.repo(DbNhlTeamGameStats)
        let teamStats: DbNhlTeamGameStats[] = []
        let team1 = await teamRepo.find({ where: { teamId: gameStats.teamStats.away.teamID, gameId: gameStats.gameID } })
        if (team1.length == 0) {
            teamStats.push({
                teamName: gameStats.teamStats.away.team,
                teamId: gameStats.teamStats.away.teamID,
                teamAgainstId: gameStats.teamStats.home.teamID,
                teamAgainstName: gameStats.teamStats.home.team,
                gameId: gameStats.gameID,
                gameDate: gameStats.gameDate,
                season: this.getSeason(gameStats.gameDate),
                homeOrAway: 'Away',
                result: gameStats.awayResult,
                scoredFirst: gameStats.scoringPlays[0].team == gameStats.teamStats.away.team ? 'Y' : 'N',
                pointsScoredOverall: gameStats.awayTotal,
                pointsScoredFirstPeriod: gameStats.lineScore.away['1P'],
                pointsScoredSecondPeriod: gameStats.lineScore.away['2P'],
                pointsScoredThirdPeriod: gameStats.lineScore.away['3P'],
                shotsOnGoal: gameStats.teamStats.away.shots,
                saves: gameStats.teamStats.away.saves,
                pointsAllowedOverall: gameStats.homeTotal,
                pointsAllowedFirstPeriod: gameStats.lineScore.home['1P'],
                pointsAllowedSecondPeriod: gameStats.lineScore.home['2P'],
                pointsAllowedThirdPeriod: gameStats.lineScore.home['3P'],
                shotsAllowedOnGoal: gameStats.teamStats.away.shotsAgainst
            })
        }
        let team2 = await teamRepo.find({ where: { teamId: gameStats.teamStats.home.teamID, gameId: gameStats.gameID } })
        if (team2.length == 0) {
            teamStats.push({
                teamName: gameStats.teamStats.home.team,
                teamId: gameStats.teamStats.home.teamID,
                teamAgainstId: gameStats.teamStats.away.teamID,
                teamAgainstName: gameStats.teamStats.away.team,
                gameId: gameStats.gameID,
                gameDate: gameStats.gameDate,
                season: this.getSeason(gameStats.gameDate),
                homeOrAway: 'Home',
                result: gameStats.homeResult,
                scoredFirst: gameStats.scoringPlays[0].team == gameStats.teamStats.home.team ? 'Y' : 'N',
                pointsScoredOverall: gameStats.homeTotal,
                pointsScoredFirstPeriod: gameStats.lineScore.home['1P'],
                pointsScoredSecondPeriod: gameStats.lineScore.home['2P'],
                pointsScoredThirdPeriod: gameStats.lineScore.home['3P'],
                shotsOnGoal: gameStats.teamStats.home.shots,
                saves: gameStats.teamStats.home.saves,
                pointsAllowedOverall: gameStats.awayTotal,
                pointsAllowedFirstPeriod: gameStats.lineScore.away['1P'],
                pointsAllowedSecondPeriod: gameStats.lineScore.away['2P'],
                pointsAllowedThirdPeriod: gameStats.lineScore.away['3P'],
                shotsAllowedOnGoal: gameStats.teamStats.home.shotsAgainst
            })
        }
        finalReturn.push(teamStats)

        let playerStats: DbNhlPlayerGameStats[] = []
        let index = 0
        let newPlayerStatData: any[] = []
        for (let i in gameStats.playerStats) {
            newPlayerStatData[index] = gameStats.playerStats[i]
            index++
        }
        const playerRepo = remult.repo(DbNhlPlayerGameStats)

        for (let player of newPlayerStatData) {
            let playerDb = await playerRepo.find({ where: { playerId: player.playerID, gameId: gameStats.gameID } })
            if (playerDb.length == 0) {
                playerStats.push({
                    playerId: player.playerID,
                    playerName: this.cleanNhlPlayerNames(player.longName),
                    teamId: player.teamID,
                    teamName: player.team,
                    teamAgainstId: player.teamID == gameStats.teamIDHome ? gameStats.teamIDAway : gameStats.teamIDHome,
                    teamAgainstName: player.teamID == gameStats.teamIDHome ? gameStats.away : gameStats.home,
                    gameId: gameStats.gameID,
                    gameDate: gameStats.gameDate,
                    season: this.getSeason(gameStats.gameDate),
                    homeOrAway: player.teamID == gameStats.teamIDHome ? 'Home' : 'Away',
                    result: player.teamID == gameStats.teamIDHome ? gameStats.homeResult : gameStats.awayResult,
                    goals: Object.hasOwn(player, 'goals') ? player.goals : 0,
                    assists: Object.hasOwn(player, 'assists') ? player.assists : 0,
                    pim: Object.hasOwn(player, 'penaltiesInMinutes') ? player.penaltiesInMinutes : 0,
                    shots: Object.hasOwn(player, 'shots') ? player.shots : 0,
                    hits: Object.hasOwn(player, 'hits') ? player.hits : 0,
                    powerPlayGoals: Object.hasOwn(player, 'powerPlayGoals') ? player.powerPlayGoals : 0,
                    powerPlayPoints: Object.hasOwn(player, 'powerPlayPoints') ? player.powerPlayPoints : 0,
                    plusMinus: Object.hasOwn(player, 'plusMinus') ? player.plusMinus : 0,
                    points: Object.hasOwn(player, 'assists') ? (Object.hasOwn(player, 'goals') ? Number(player.goals) + Number(player.assists) : 0) : (Object.hasOwn(player, 'goals') ? Number(player.goals) : 0),
                    blocks: Object.hasOwn(player, 'blockedShots') ? player.blockedShots : 0,
                    saves: Object.hasOwn(player, 'saves') ? player.saves : 0
                })
            }

        }
        finalReturn.push(playerStats)

        return finalReturn
    }

    static getSeason(gameDate: string): number {
        let monthDay = gameDate.slice(4)
        let year = gameDate.slice(0, 4)
        if (Number(monthDay) < 701) {
            year = (Number(year) - 1).toString()
        }

        return Number(year)
    }

    static convertTeamInfoToDb(teams: any[]): DbTeamInfo[] {
        let teamInfoFinal: DbTeamInfo[] = []
        for (let team of teams) {
            teamInfoFinal.push({
                teamId: team.teamID,
                teamNameAbvr: team.teamAbv,
                teamNameFull: team.teamCity + " " + team.teamName,
                sport: 'NHL'
            })
        }
        return teamInfoFinal
    }

    static alternatePropNames: string[] = ['alternate_team_totals', 'alternate_spreads']

    static async getTeamPropData(props: DbGameBookData[], teamsInfo: DbTeamInfo[]): Promise<any[]> {
        let finalReturn: any[] = []
        let homeTeam = teamsInfo.filter(e => e.teamNameFull == props[0].homeTeam)[0]
        let awayTeam = teamsInfo.filter(e => e.teamNameFull == props[0].awayTeam)[0]
        let teamStatsCombined = await NhlController.nhlGetAllTeamStatsByTeamNamesAndSeason([homeTeam.teamNameAbvr, awayTeam.teamNameAbvr], 2024)
        for (let i = 0; i < teamStatsCombined.length; i++) {
            teamStatsCombined[i].gameDate = reusedFunctions.convertGameDateToMonthDay(teamStatsCombined[i].gameDate)
        }
        let homeTeamStats = teamStatsCombined.filter(e => e.teamName == homeTeam.teamNameAbvr)
        let awayTeamStats = teamStatsCombined.filter(e => e.teamName == awayTeam.teamNameAbvr)
        let homeTeamPropsFinal: any[] = []
        let awayTeamPropsFinal: any[] = []
        let teamProps = props.filter(e => {
            return e.teamName != 'Both';
        })
        let overUnderTotalProps = props.filter(e => {
            return e.teamName == 'Both';
        })

        let distinctTeamProps = teamProps.map(e => e.marketKey).filter((v,i,a) => a.indexOf(v) === i)
        for(let i = 0; i < distinctTeamProps.length; i++){
            
            let filteredPropsOnMarketKey = teamProps.filter(e => e.marketKey == distinctTeamProps[i])
            if(this.alternatePropNames.includes(distinctTeamProps[i])){
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
                                teamAgainstName: awayTeam.teamNameFull == filteredPointsProps[m].teamName ? awayTeam.teamNameAbvr : homeTeam.teamNameAbvr,
                                teamAgainstId: awayTeam.teamNameFull == filteredPointsProps[m].teamName ? awayTeam.teamId : homeTeam.teamId,
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
                            }
                            let overAllTableTemp = []
                            let homeAwayTableTemp = []
                            let teamTableTemp = []
                            if(filteredPointsProps[m].marketKey == 'alternate_team_totals'){
                                if (filteredPointsProps[m].description == 'Over') {
                                    teamProp.overallWins = teamStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredPointsProps[m].point).length;
                                    teamProp.overallTotal = teamStats.length
                                    teamProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == teamProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredPointsProps[m].point).length;
                                    teamProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == teamProp.homeAway).length
                                    teamProp.teamWins = teamStats.filter(e => e.teamAgainstId == teamProp.teamAgainstId && (e.pointsScoredOverall + e.pointsAllowedOverall) > filteredPointsProps[m].point).length;
                                    teamProp.teamTotal = teamStats.filter(e => e.teamAgainstId == teamProp.teamAgainstId).length
                                    for (let j = 0; j < teamStats.length; j++) {
                                        overAllTableTemp.push({
                                            teamAgainstName: teamStats[j].teamAgainstName,
                                            gameDate: teamStats[j].gameDate,
                                            pointsScoredOverall: teamStats[j].pointsScoredOverall,
                                            pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                                            homeAway: teamStats[j].homeOrAway
                                        })
                                        if (teamStats[j].homeOrAway == teamProp.homeAway) {
                                            homeAwayTableTemp.push({
                                                teamAgainstName: teamStats[j].teamAgainstName,
                                                gameDate: teamStats[j].gameDate,
                                                pointsScoredOverall: teamStats[j].pointsScoredOverall,
                                                pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                                                homeAway: teamStats[j].homeOrAway
                                            })
                                        }
                                        if (teamStats[j].teamAgainstId == teamProp.teamAgainstId) {
                                            teamTableTemp.push({
                                                teamAgainstName: teamStats[j].teamAgainstName,
                                                gameDate: teamStats[j].gameDate,
                                                pointsScoredOverall: teamStats[j].pointsScoredOverall,
                                                pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                                                homeAway: teamStats[j].homeOrAway
                                            })
                                        }
                                    }
                                    let totalOverall = teamStats.map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                                    let totalHomeAway = teamStats.filter(e => e.homeOrAway == teamProp.homeAway).map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                                    let totalTeam = teamStats.filter(e => e.teamAgainstId == teamProp.teamAgainstId).map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
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
                                    teamProp.last10Overall = overAllTableTemp.slice(0, 10)
                                    teamProp.last10HomeAway = homeAwayTableTemp.slice(0, 10)
                                    teamProp.last10Team = teamTableTemp.slice(0, 10)
                                }
                                else {
                                    teamProp.overallWins = teamStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredPointsProps[m].point).length;
                                    teamProp.overallTotal = teamStats.length
                                    teamProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == teamProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredPointsProps[m].point).length;
                                    teamProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == teamProp.homeAway).length
                                    teamProp.teamWins = teamStats.filter(e => e.teamAgainstId == teamProp.teamAgainstId && (e.pointsScoredOverall + e.pointsAllowedOverall) < filteredPointsProps[m].point).length;
                                    teamProp.teamTotal = teamStats.filter(e => e.teamAgainstId == teamProp.teamAgainstId).length
                                    for (let j = 0; j < teamStats.length; j++) {
                                        overAllTableTemp.push({
                                            teamAgainstName: teamStats[j].teamAgainstName,
                                            gameDate: teamStats[j].gameDate,
                                            pointsScoredOverall: teamStats[j].pointsScoredOverall,
                                            pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                                            homeAway: teamStats[j].homeOrAway
                                        })
                                        if (teamStats[j].homeOrAway == teamProp.homeAway) {
                                            homeAwayTableTemp.push({
                                                teamAgainstName: teamStats[j].teamAgainstName,
                                                gameDate: teamStats[j].gameDate,
                                                pointsScoredOverall: teamStats[j].pointsScoredOverall,
                                                pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                                                homeAway: teamStats[j].homeOrAway
                                            })
                                        }
                                        if (teamStats[j].teamAgainstId == teamProp.teamAgainstId) {
                                            teamTableTemp.push({
                                                teamAgainstName: teamStats[j].teamAgainstName,
                                                gameDate: teamStats[j].gameDate,
                                                pointsScoredOverall: teamStats[j].pointsScoredOverall,
                                                pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                                                homeAway: teamStats[j].homeOrAway
                                            })
                                        }
                                    }
                                    let totalOverall = teamStats.map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                                    let totalHomeAway = teamStats.filter(e => e.homeOrAway == teamProp.homeAway).map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
                                    let totalTeam = teamStats.filter(e => e.teamAgainstId == teamProp.teamAgainstId).map(e => (e.pointsAllowedOverall + e.pointsScoredOverall))
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
                                    teamProp.last10Overall = overAllTableTemp.slice(0, 10)
                                    teamProp.last10HomeAway = homeAwayTableTemp.slice(0, 10)
                                    teamProp.last10Team = teamTableTemp.slice(0, 10)
                                }
                            }
                            else if(filteredPointsProps[m].marketKey == 'alternate_spreads'){

                            }
                            pointArray.push(teamProp)
                        }
                        teamArray.push(pointArray)
                    }
                    if(teamArray[0][0].homeAway == "Home"){
                        homeTeamPropsFinal.push(teamArray)
                        if(teamArray[0][0].gameBookData.marketKey == 'alternate_team_totals'){
                            homeTeamPropsFinal[homeTeamPropsFinal.length -1].propType = 'altTotal'
                        }
                    }
                    else{
                        awayTeamPropsFinal.push(teamArray)
                        if(teamArray[0][0].gameBookData.marketKey == 'alternate_team_totals'){
                            awayTeamPropsFinal[awayTeamPropsFinal.length -1].propType = 'altTotal'
                        }
                    }
                    
                }
            }
            else{
                for (let i = 0; i < filteredPropsOnMarketKey.length; i++) {
                    let teamStats = filteredPropsOnMarketKey[i].teamName == homeTeam.teamNameFull ? homeTeamStats : awayTeamStats
                    let teamAgainstStats = filteredPropsOnMarketKey[i].teamName == homeTeam.teamNameFull ? awayTeamStats : homeTeamStats
        
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
                    }
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
                        for (let j = 0; j < teamStats.length; j++) {
                            overAllTableTemp.push({
                                teamAgainstName: teamStats[j].teamAgainstName,
                                gameDate: teamStats[j].gameDate,
                                pointsScoredOverall: teamStats[j].pointsScoredOverall,
                                pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                                homeAway: teamStats[j].homeOrAway
                            })
                            if (teamStats[j].homeOrAway == propReturn.homeAway) {
                                homeAwayTableTemp.push({
                                    teamAgainstName: teamStats[j].teamAgainstName,
                                    gameDate: teamStats[j].gameDate,
                                    pointsScoredOverall: teamStats[j].pointsScoredOverall,
                                    pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                                    homeAway: teamStats[j].homeOrAway
                                })
                            }
                            if (teamStats[j].teamAgainstId == propReturn.teamAgainstId) {
                                teamTableTemp.push({
                                    teamAgainstName: teamStats[j].teamAgainstName,
                                    gameDate: teamStats[j].gameDate,
                                    pointsScoredOverall: teamStats[j].pointsScoredOverall,
                                    pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                                    homeAway: teamStats[j].homeOrAway
                                })
                            }
                        }
                        propReturn.propType = 'h2h';
                    }
                    else if (filteredPropsOnMarketKey[i].marketKey == 'spreads') {
                        propReturn.overallWins = teamStats.filter(e => e.result == 'W' && (e.pointsAllowedOverall - e.pointsScoredOverall) < filteredPropsOnMarketKey[i].point).length;
                        propReturn.homeAwayWins = teamStats.filter(e => e.result == 'W' && e.homeOrAway == propReturn.homeAway && (e.pointsAllowedOverall - e.pointsScoredOverall) < filteredPropsOnMarketKey[i].point).length;
                        propReturn.teamWins = teamStats.filter(e => e.result == 'W' && e.teamAgainstId == propReturn.teamAgainstId && (e.pointsAllowedOverall - e.pointsScoredOverall) < filteredPropsOnMarketKey[i].point).length;
                        for (let j = 0; j < teamStats.length; j++) {
                            overAllTableTemp.push({
                                teamAgainstName: teamStats[j].teamAgainstName,
                                gameDate: teamStats[j].gameDate,
                                pointsScoredOverall: teamStats[j].pointsScoredOverall,
                                pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                                homeAway: teamStats[j].homeOrAway
                            })
                            if (teamStats[j].homeOrAway == propReturn.homeAway) {
                                homeAwayTableTemp.push({
                                    teamAgainstName: teamStats[j].teamAgainstName,
                                    gameDate: teamStats[j].gameDate,
                                    pointsScoredOverall: teamStats[j].pointsScoredOverall,
                                    pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                                    homeAway: teamStats[j].homeOrAway
                                })
                            }
                            if (teamStats[j].teamAgainstId == propReturn.teamAgainstId) {
                                teamTableTemp.push({
                                    teamAgainstName: teamStats[j].teamAgainstName,
                                    gameDate: teamStats[j].gameDate,
                                    pointsScoredOverall: teamStats[j].pointsScoredOverall,
                                    pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                                    homeAway: teamStats[j].homeOrAway
                                })
                            }
                        }
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
                    else if (filteredPropsOnMarketKey[i].marketKey == 'h2h_p1') {
                        propReturn.overallWins = teamStats.filter(e => e.pointsAllowedFirstPeriod < e.pointsScoredFirstPeriod).length;
                        propReturn.homeAwayWins = teamStats.filter(e => (e.pointsAllowedFirstPeriod < e.pointsScoredFirstPeriod) && e.homeOrAway == propReturn.homeAway).length;
                        propReturn.teamWins = teamStats.filter(e => (e.pointsAllowedFirstPeriod < e.pointsScoredFirstPeriod) && e.teamAgainstId == propReturn.teamAgainstId).length;
                        for (let j = 0; j < teamStats.length; j++) {
                            overAllTableTemp.push({
                                teamAgainstName: teamStats[j].teamAgainstName,
                                gameDate: teamStats[j].gameDate,
                                pointsScoredOverall: teamStats[j].pointsScoredFirstPeriod,
                                pointsAllowedOverall: teamStats[j].pointsAllowedFirstPeriod,
                                homeAway: teamStats[j].homeOrAway
                            })
                            if (teamStats[j].homeOrAway == propReturn.homeAway) {
                                homeAwayTableTemp.push({
                                    teamAgainstName: teamStats[j].teamAgainstName,
                                    gameDate: teamStats[j].gameDate,
                                    pointsScoredOverall: teamStats[j].pointsScoredFirstPeriod,
                                    pointsAllowedOverall: teamStats[j].pointsAllowedFirstPeriod,
                                    homeAway: teamStats[j].homeOrAway
                                })
                            }
                            if (teamStats[j].teamAgainstId == propReturn.teamAgainstId) {
                                teamTableTemp.push({
                                    teamAgainstName: teamStats[j].teamAgainstName,
                                    gameDate: teamStats[j].gameDate,
                                    pointsScoredOverall: teamStats[j].pointsScoredFirstPeriod,
                                    pointsAllowedOverall: teamStats[j].pointsAllowedFirstPeriod,
                                    homeAway: teamStats[j].homeOrAway
                                })
                            }
                        }
                        propReturn.propType = 'h2h'
                    }
                    propReturn.overallChance = propReturn.overallTotal == 0 ? 0 : propReturn.overallWins / propReturn.overallTotal
                    propReturn.homeAwayChance = propReturn.homeAwayTotal == 0 ? 0 : propReturn.homeAwayWins / propReturn.homeAwayTotal
                    propReturn.teamChance = propReturn.teamTotal == 0 ? 0 : propReturn.teamWins / propReturn.teamTotal
                    propReturn.last10Overall = overAllTableTemp.slice(0, 10)
                    propReturn.last10HomeAway = homeAwayTableTemp.slice(0, 10)
                    propReturn.last10Team = teamTableTemp.slice(0, 10)
        
                    propReturn.homeAway == "Home" ? homeTeamPropsFinal.push(propReturn) : awayTeamPropsFinal.push(propReturn)
        
                }
            }
        }
        

        let homeTeamOverUnderFinal = []
        let awayTeamOverUnderFinal = []
        console.log(overUnderTotalProps)
        for (let j = 0; j < overUnderTotalProps.length; j++) {
            let homeProp: TeamPropDto = {
                gameBookData: overUnderTotalProps[j],
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
            }
            let awayProp: TeamPropDto = {
                gameBookData: overUnderTotalProps[j],
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
            }
            let teamStats: DbNhlTeamGameStats[] = []
            //do home first
            teamStats = homeTeamStats

            let overAllTableTemp = []
            let homeAwayTableTemp = []
            let teamTableTemp = []
            if (overUnderTotalProps[j].description == 'Over') {
                teamStats = homeTeamStats
                homeProp.overallWins = teamStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) > overUnderTotalProps[j].point).length;
                homeProp.overallTotal = teamStats.length
                homeProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == homeProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) > overUnderTotalProps[j].point).length;
                homeProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).length
                homeProp.teamWins = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId && (e.pointsScoredOverall + e.pointsAllowedOverall) > overUnderTotalProps[j].point).length;
                homeProp.teamTotal = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).length
                for (let j = 0; j < teamStats.length; j++) {
                    overAllTableTemp.push({
                        teamAgainstName: teamStats[j].teamAgainstName,
                        gameDate: teamStats[j].gameDate,
                        pointsScoredOverall: teamStats[j].pointsScoredOverall,
                        pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                        homeAway: teamStats[j].homeOrAway
                    })
                    if (teamStats[j].homeOrAway == homeProp.homeAway) {
                        homeAwayTableTemp.push({
                            teamAgainstName: teamStats[j].teamAgainstName,
                            gameDate: teamStats[j].gameDate,
                            pointsScoredOverall: teamStats[j].pointsScoredOverall,
                            pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                            homeAway: teamStats[j].homeOrAway
                        })
                    }
                    if (teamStats[j].teamAgainstId == homeProp.teamAgainstId) {
                        teamTableTemp.push({
                            teamAgainstName: teamStats[j].teamAgainstName,
                            gameDate: teamStats[j].gameDate,
                            pointsScoredOverall: teamStats[j].pointsScoredOverall,
                            pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                            homeAway: teamStats[j].homeOrAway
                        })
                    }
                }
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
                homeProp.last10Overall = overAllTableTemp.slice(0, 10)
                homeProp.last10HomeAway = homeAwayTableTemp.slice(0, 10)
                homeProp.last10Team = teamTableTemp.slice(0, 10)

                teamStats = awayTeamStats
                awayProp.overallWins = teamStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) > overUnderTotalProps[j].point).length;
                awayProp.overallTotal = teamStats.length
                awayProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == awayProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) > overUnderTotalProps[j].point).length;
                awayProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).length
                awayProp.teamWins = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId && (e.pointsScoredOverall + e.pointsAllowedOverall) > overUnderTotalProps[j].point).length;
                awayProp.teamTotal = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).length
                for (let j = 0; j < teamStats.length; j++) {
                    overAllTableTemp.push({
                        teamAgainstName: teamStats[j].teamAgainstName,
                        gameDate: teamStats[j].gameDate,
                        pointsScoredOverall: teamStats[j].pointsScoredOverall,
                        pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                        homeAway: teamStats[j].homeOrAway
                    })
                    if (teamStats[j].homeOrAway == awayProp.homeAway) {
                        homeAwayTableTemp.push({
                            teamAgainstName: teamStats[j].teamAgainstName,
                            gameDate: teamStats[j].gameDate,
                            pointsScoredOverall: teamStats[j].pointsScoredOverall,
                            pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                            homeAway: teamStats[j].homeOrAway
                        })
                    }
                    if (teamStats[j].teamAgainstId == awayProp.teamAgainstId) {
                        teamTableTemp.push({
                            teamAgainstName: teamStats[j].teamAgainstName,
                            gameDate: teamStats[j].gameDate,
                            pointsScoredOverall: teamStats[j].pointsScoredOverall,
                            pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                            homeAway: teamStats[j].homeOrAway
                        })
                    }
                }
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
                awayProp.last10Overall = overAllTableTemp.slice(0, 10)
                awayProp.last10HomeAway = homeAwayTableTemp.slice(0, 10)
                awayProp.last10Team = teamTableTemp.slice(0, 10)
            }
            else {
                teamStats = homeTeamStats
                homeProp.overallWins = teamStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) < overUnderTotalProps[j].point).length;
                homeProp.overallTotal = teamStats.length
                homeProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == homeProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) < overUnderTotalProps[j].point).length;
                homeProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == homeProp.homeAway).length
                homeProp.teamWins = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId && (e.pointsScoredOverall + e.pointsAllowedOverall) < overUnderTotalProps[j].point).length;
                homeProp.teamTotal = teamStats.filter(e => e.teamAgainstId == homeProp.teamAgainstId).length
                for (let j = 0; j < teamStats.length; j++) {
                    overAllTableTemp.push({
                        teamAgainstName: teamStats[j].teamAgainstName,
                        gameDate: teamStats[j].gameDate,
                        pointsScoredOverall: teamStats[j].pointsScoredOverall,
                        pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                        homeAway: teamStats[j].homeOrAway
                    })
                    if (teamStats[j].homeOrAway == homeProp.homeAway) {
                        homeAwayTableTemp.push({
                            teamAgainstName: teamStats[j].teamAgainstName,
                            gameDate: teamStats[j].gameDate,
                            pointsScoredOverall: teamStats[j].pointsScoredOverall,
                            pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                            homeAway: teamStats[j].homeOrAway
                        })
                    }
                    if (teamStats[j].teamAgainstId == homeProp.teamAgainstId) {
                        teamTableTemp.push({
                            teamAgainstName: teamStats[j].teamAgainstName,
                            gameDate: teamStats[j].gameDate,
                            pointsScoredOverall: teamStats[j].pointsScoredOverall,
                            pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                            homeAway: teamStats[j].homeOrAway
                        })
                    }
                }
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
                homeProp.last10Overall = overAllTableTemp.slice(0, 10)
                homeProp.last10HomeAway = homeAwayTableTemp.slice(0, 10)
                homeProp.last10Team = teamTableTemp.slice(0, 10)

                teamStats = awayTeamStats
                awayProp.overallWins = teamStats.filter(e => (e.pointsScoredOverall + e.pointsAllowedOverall) < overUnderTotalProps[j].point).length;
                awayProp.overallTotal = teamStats.length
                awayProp.homeAwayWins = teamStats.filter(e => e.homeOrAway == awayProp.homeAway && (e.pointsScoredOverall + e.pointsAllowedOverall) < overUnderTotalProps[j].point).length;
                awayProp.homeAwayTotal = teamStats.filter(e => e.homeOrAway == awayProp.homeAway).length
                awayProp.teamWins = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId && (e.pointsScoredOverall + e.pointsAllowedOverall) < overUnderTotalProps[j].point).length;
                awayProp.teamTotal = teamStats.filter(e => e.teamAgainstId == awayProp.teamAgainstId).length
                for (let j = 0; j < teamStats.length; j++) {
                    overAllTableTemp.push({
                        teamAgainstName: teamStats[j].teamAgainstName,
                        gameDate: teamStats[j].gameDate,
                        pointsScoredOverall: teamStats[j].pointsScoredOverall,
                        pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                        homeAway: teamStats[j].homeOrAway
                    })
                    if (teamStats[j].homeOrAway == awayProp.homeAway) {
                        homeAwayTableTemp.push({
                            teamAgainstName: teamStats[j].teamAgainstName,
                            gameDate: teamStats[j].gameDate,
                            pointsScoredOverall: teamStats[j].pointsScoredOverall,
                            pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                            homeAway: teamStats[j].homeOrAway
                        })
                    }
                    if (teamStats[j].teamAgainstId == awayProp.teamAgainstId) {
                        teamTableTemp.push({
                            teamAgainstName: teamStats[j].teamAgainstName,
                            gameDate: teamStats[j].gameDate,
                            pointsScoredOverall: teamStats[j].pointsScoredOverall,
                            pointsAllowedOverall: teamStats[j].pointsAllowedOverall,
                            homeAway: teamStats[j].homeOrAway
                        })
                    }
                }
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
                awayProp.last10Overall = overAllTableTemp.slice(0, 10)
                awayProp.last10HomeAway = homeAwayTableTemp.slice(0, 10)
                awayProp.last10Team = teamTableTemp.slice(0, 10)

            }




            homeTeamOverUnderFinal.push(homeProp)
            awayTeamOverUnderFinal.push(awayProp)


        }




        homeTeamPropsFinal.push(homeTeamOverUnderFinal)
        homeTeamPropsFinal[homeTeamPropsFinal.length - 1].propType = 'total'
        homeTeamPropsFinal[homeTeamPropsFinal.length - 1].overUnder = false
        awayTeamPropsFinal.push(awayTeamOverUnderFinal)
        awayTeamPropsFinal[awayTeamPropsFinal.length - 1].propType = 'total'
        awayTeamPropsFinal[awayTeamPropsFinal.length - 1].overUnder = false
        finalReturn.push(awayTeamPropsFinal)
        finalReturn.push(homeTeamPropsFinal)

        return finalReturn
    }

    static async getPlayerPropData(bookId: string, allTeamInfo: DbTeamInfo[]): Promise<any[]> {
        let finalReturn: any[] = []

        let playerPropData = await PlayerPropController.loadPlayerPropData('NHL', bookId)

        let homeTeam = playerPropData[0].homeTeam
        let awayTeam = playerPropData[0].awayTeam

        let uniquePlayerProps = playerPropData.map(e => e.marketKey).filter((value, index, array) => array.indexOf(value) === index)

        let uniquePlayerNames = playerPropData.map(e => e.playerName).filter((value, index, array) => array.indexOf(value) === index)

        let allPlayerStats = await NhlController.nhlGetAllPlayerGameStatsByPlayerNameAndSeason(uniquePlayerNames, 2024)

        for (let i = 0; i < allPlayerStats.length; i++) {
            allPlayerStats[i].gameDate = reusedFunctions.convertGameDateToMonthDay(allPlayerStats[i].gameDate)
        }

        let allPlayerInfo = await PlayerInfoController.loadActivePlayerInfoBySport("NHL")

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
                                homeAway: playerTeamNameLong[0].teamNameFull == specificProps[i].awayTeam ? 'Away' : 'Home',
                                propType: '',
                                overallChance: 0,
                                overallWins: 0,
                                overallTotal: playerStats.length,
                                homeAwayChance: 0,
                                homeAwayWins: 0,
                                homeAwayTotal: playerStats.filter(e => e.homeOrAway == (playerTeamNameLong[0].teamNameFull == specificProps[i].awayTeam ? 'Away' : 'Home')).length,
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
                            }
                            let overAllTableTemp = []
                            let homeAwayTableTemp = []
                            let teamTableTemp = []

                            if (specificProps[i].marketKey == 'player_points') {
                                if (specificProps[i].description == 'Over') {
                                    playerPropObj.overallWins = playerStats.filter(e => e.points > specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.points > specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.points > specificProps[i].point).length;

                                }
                                else {
                                    playerPropObj.overallWins = playerStats.filter(e => e.points < specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.points < specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.points < specificProps[i].point).length;
                                }
                                let totalOverall = playerStats.map(e => e.points)
                                let totalHomeAway = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).map(e => e.points)
                                let totalTeam = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).map(e => e.points)
                                playerPropObj.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                                playerPropObj.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                                playerPropObj.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                                playerPropObj.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                                playerPropObj.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                                playerPropObj.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                                playerPropObj.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                                playerPropObj.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                                playerPropObj.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                                for (let j = 0; j < playerStats.length; j++) {
                                    overAllTableTemp.push({
                                        teamAgainstName: playerStats[j].teamAgainstName,
                                        gameDate: playerStats[j].gameDate,
                                        propNumber: playerStats[j].points,
                                        homeAway: playerStats[j].homeOrAway,
                                        propName: 'P'
                                    })
                                    if (playerStats[j].homeOrAway == playerPropObj.homeAway) {
                                        homeAwayTableTemp.push({
                                            teamAgainstName: playerStats[j].teamAgainstName,
                                            gameDate: playerStats[j].gameDate,
                                            propNumber: playerStats[j].points,
                                            homeAway: playerStats[j].homeOrAway,
                                            propName: 'P'
                                        })
                                    }
                                    if (playerStats[j].teamAgainstId == playerPropObj.teamAgainstId) {
                                        teamTableTemp.push({
                                            teamAgainstName: playerStats[j].teamAgainstName,
                                            gameDate: playerStats[j].gameDate,
                                            propNumber: playerStats[j].points,
                                            homeAway: playerStats[j].homeOrAway,
                                            propName: 'P'
                                        })
                                    }
                                }
                                playerPropObj.propType = 'OU'

                            }
                            else if (specificProps[i].marketKey == 'player_assists') {
                                if (specificProps[i].description == 'Over') {
                                    playerPropObj.overallWins = playerStats.filter(e => e.assists > specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.assists > specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.assists > specificProps[i].point).length;

                                }
                                else {
                                    playerPropObj.overallWins = playerStats.filter(e => e.assists < specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.assists < specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.assists < specificProps[i].point).length;
                                }
                                let totalOverall = playerStats.map(e => e.assists)
                                let totalHomeAway = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).map(e => e.assists)
                                let totalTeam = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).map(e => e.assists)
                                playerPropObj.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                                playerPropObj.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                                playerPropObj.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                                playerPropObj.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                                playerPropObj.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                                playerPropObj.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                                playerPropObj.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                                playerPropObj.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                                playerPropObj.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                                for (let j = 0; j < playerStats.length; j++) {
                                    overAllTableTemp.push({
                                        teamAgainstName: playerStats[j].teamAgainstName,
                                        gameDate: playerStats[j].gameDate,
                                        propNumber: playerStats[j].assists,
                                        homeAway: playerStats[j].homeOrAway,
                                        propName: 'A'
                                    })
                                    if (playerStats[j].homeOrAway == playerPropObj.homeAway) {
                                        homeAwayTableTemp.push({
                                            teamAgainstName: playerStats[j].teamAgainstName,
                                            gameDate: playerStats[j].gameDate,
                                            propNumber: playerStats[j].assists,
                                            homeAway: playerStats[j].homeOrAway,
                                            propName: 'A'
                                        })
                                    }
                                    if (playerStats[j].teamAgainstId == playerPropObj.teamAgainstId) {
                                        teamTableTemp.push({
                                            teamAgainstName: playerStats[j].teamAgainstName,
                                            gameDate: playerStats[j].gameDate,
                                            propNumber: playerStats[j].assists,
                                            homeAway: playerStats[j].homeOrAway,
                                            propName: 'A'
                                        })
                                    }
                                }
                                playerPropObj.propType = 'OU'
                            }
                            else if (specificProps[i].marketKey == 'player_shots_on_goal') {
                                if (specificProps[i].description == 'Over') {
                                    playerPropObj.overallWins = playerStats.filter(e => e.shots > specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.shots > specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.shots > specificProps[i].point).length;

                                }
                                else {
                                    playerPropObj.overallWins = playerStats.filter(e => e.shots < specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.shots < specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.shots < specificProps[i].point).length;
                                }
                                let totalOverall = playerStats.map(e => e.shots)
                                let totalHomeAway = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).map(e => e.shots)
                                let totalTeam = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).map(e => e.shots)
                                playerPropObj.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                                playerPropObj.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                                playerPropObj.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                                playerPropObj.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                                playerPropObj.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                                playerPropObj.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                                playerPropObj.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                                playerPropObj.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                                playerPropObj.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                                for (let j = 0; j < playerStats.length; j++) {
                                    overAllTableTemp.push({
                                        teamAgainstName: playerStats[j].teamAgainstName,
                                        gameDate: playerStats[j].gameDate,
                                        propNumber: playerStats[j].shots,
                                        homeAway: playerStats[j].homeOrAway,
                                        propName: 'S'
                                    })
                                    if (playerStats[j].homeOrAway == playerPropObj.homeAway) {
                                        homeAwayTableTemp.push({
                                            teamAgainstName: playerStats[j].teamAgainstName,
                                            gameDate: playerStats[j].gameDate,
                                            propNumber: playerStats[j].shots,
                                            homeAway: playerStats[j].homeOrAway,
                                            propName: 'S'
                                        })
                                    }
                                    if (playerStats[j].teamAgainstId == playerPropObj.teamAgainstId) {
                                        teamTableTemp.push({
                                            teamAgainstName: playerStats[j].teamAgainstName,
                                            gameDate: playerStats[j].gameDate,
                                            propNumber: playerStats[j].shots,
                                            homeAway: playerStats[j].homeOrAway,
                                            propName: 'S'
                                        })
                                    }
                                }
                                playerPropObj.propType = 'OU'
                            }
                            else if (specificProps[i].marketKey == 'player_blocked_shots') {
                                if (specificProps[i].description == 'Over') {
                                    playerPropObj.overallWins = playerStats.filter(e => e.blocks > specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.blocks > specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.blocks > specificProps[i].point).length;

                                }
                                else {
                                    playerPropObj.overallWins = playerStats.filter(e => e.blocks < specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.blocks < specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.blocks < specificProps[i].point).length;
                                }
                                let totalOverall = playerStats.map(e => e.blocks)
                                let totalHomeAway = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).map(e => e.blocks)
                                let totalTeam = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).map(e => e.blocks)
                                playerPropObj.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                                playerPropObj.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                                playerPropObj.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                                playerPropObj.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                                playerPropObj.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                                playerPropObj.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                                playerPropObj.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                                playerPropObj.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                                playerPropObj.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                                for (let j = 0; j < playerStats.length; j++) {
                                    overAllTableTemp.push({
                                        teamAgainstName: playerStats[j].teamAgainstName,
                                        gameDate: playerStats[j].gameDate,
                                        propNumber: playerStats[j].blocks,
                                        homeAway: playerStats[j].homeOrAway,
                                        propName: 'B'
                                    })
                                    if (playerStats[j].homeOrAway == playerPropObj.homeAway) {
                                        homeAwayTableTemp.push({
                                            teamAgainstName: playerStats[j].teamAgainstName,
                                            gameDate: playerStats[j].gameDate,
                                            propNumber: playerStats[j].blocks,
                                            homeAway: playerStats[j].homeOrAway,
                                            propName: 'B'
                                        })
                                    }
                                    if (playerStats[j].teamAgainstId == playerPropObj.teamAgainstId) {
                                        teamTableTemp.push({
                                            teamAgainstName: playerStats[j].teamAgainstName,
                                            gameDate: playerStats[j].gameDate,
                                            propNumber: playerStats[j].blocks,
                                            homeAway: playerStats[j].homeOrAway,
                                            propName: 'B'
                                        })
                                    }
                                }
                                playerPropObj.propType = 'OU'
                            }
                            else if (specificProps[i].marketKey == 'player_total_saves') {
                                if (specificProps[i].description == 'Over') {
                                    playerPropObj.overallWins = playerStats.filter(e => e.saves > specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.saves > specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.saves > specificProps[i].point).length;

                                }
                                else {
                                    playerPropObj.overallWins = playerStats.filter(e => e.saves < specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.saves < specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.saves < specificProps[i].point).length;
                                }
                                let totalOverall = playerStats.map(e => e.saves)
                                let totalHomeAway = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).map(e => e.saves)
                                let totalTeam = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).map(e => e.saves)
                                playerPropObj.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                                playerPropObj.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                                playerPropObj.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                                playerPropObj.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                                playerPropObj.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                                playerPropObj.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                                playerPropObj.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                                playerPropObj.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                                playerPropObj.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                                for (let j = 0; j < playerStats.length; j++) {
                                    overAllTableTemp.push({
                                        teamAgainstName: playerStats[j].teamAgainstName,
                                        gameDate: playerStats[j].gameDate,
                                        propNumber: playerStats[j].saves,
                                        homeAway: playerStats[j].homeOrAway,
                                        propName: 'S'
                                    })
                                    if (playerStats[j].homeOrAway == playerPropObj.homeAway) {
                                        homeAwayTableTemp.push({
                                            teamAgainstName: playerStats[j].teamAgainstName,
                                            gameDate: playerStats[j].gameDate,
                                            propNumber: playerStats[j].saves,
                                            homeAway: playerStats[j].homeOrAway,
                                            propName: 'S'
                                        })
                                    }
                                    if (playerStats[j].teamAgainstId == playerPropObj.teamAgainstId) {
                                        teamTableTemp.push({
                                            teamAgainstName: playerStats[j].teamAgainstName,
                                            gameDate: playerStats[j].gameDate,
                                            propNumber: playerStats[j].saves,
                                            homeAway: playerStats[j].homeOrAway,
                                            propName: 'S'
                                        })
                                    }
                                }
                                playerPropObj.propType = 'OU'
                            }
                            else if (specificProps[i].marketKey == 'player_shots_on_goal_alternate') {
                                if (specificProps[i].description == 'Over') {
                                    playerPropObj.overallWins = playerStats.filter(e => e.shots > specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.shots > specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.shots > specificProps[i].point).length;

                                }
                                else {
                                    playerPropObj.overallWins = playerStats.filter(e => e.shots < specificProps[i].point).length;
                                    playerPropObj.homeAwayWins = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway && e.shots < specificProps[i].point).length;
                                    playerPropObj.teamWins = playerStats.filter(e => e.teamAgainstName == playerPropObj.teamAgainstName && e.shots < specificProps[i].point).length;
                                }
                                let totalOverall = playerStats.map(e => e.shots)
                                let totalHomeAway = playerStats.filter(e => e.homeOrAway == playerPropObj.homeAway).map(e => e.shots)
                                let totalTeam = playerStats.filter(e => e.teamAgainstId == playerPropObj.teamAgainstId).map(e => e.shots)
                                playerPropObj.lowOverall = totalOverall.length > 0 ? Math.min(...totalOverall) : 0
                                playerPropObj.highOverall = totalOverall.length > 0 ? Math.max(...totalOverall) : 0
                                playerPropObj.lowHomeAway = totalHomeAway.length > 0 ? Math.min(...totalHomeAway) : 0
                                playerPropObj.highHomeAway = totalHomeAway.length > 0 ? Math.max(...totalHomeAway) : 0
                                playerPropObj.lowTeam = totalTeam.length > 0 ? Math.min(...totalTeam) : 0
                                playerPropObj.highTeam = totalTeam.length > 0 ? Math.max(...totalTeam) : 0
                                playerPropObj.averageOverall = totalOverall.length > 0 ? totalOverall.reduce((a, b) => a + b) / totalOverall.length : 0
                                playerPropObj.averageHomeAway = totalHomeAway.length > 0 ? totalHomeAway.reduce((a, b) => a + b) / totalHomeAway.length : 0
                                playerPropObj.averageTeam = totalTeam.length > 0 ? totalTeam.reduce((a, b) => a + b) / totalTeam.length : 0
                                for (let j = 0; j < playerStats.length; j++) {
                                    overAllTableTemp.push({
                                        teamAgainstName: playerStats[j].teamAgainstName,
                                        gameDate: playerStats[j].gameDate,
                                        propNumber: playerStats[j].shots,
                                        homeAway: playerStats[j].homeOrAway,
                                        propName: 'S'
                                    })
                                    if (playerStats[j].homeOrAway == playerPropObj.homeAway) {
                                        homeAwayTableTemp.push({
                                            teamAgainstName: playerStats[j].teamAgainstName,
                                            gameDate: playerStats[j].gameDate,
                                            propNumber: playerStats[j].shots,
                                            homeAway: playerStats[j].homeOrAway,
                                            propName: 'S'
                                        })
                                    }
                                    if (playerStats[j].teamAgainstId == playerPropObj.teamAgainstId) {
                                        teamTableTemp.push({
                                            teamAgainstName: playerStats[j].teamAgainstName,
                                            gameDate: playerStats[j].gameDate,
                                            propNumber: playerStats[j].shots,
                                            homeAway: playerStats[j].homeOrAway,
                                            propName: 'S'
                                        })
                                    }
                                }
                                playerPropObj.propType = 'Alt'
                            }
                            playerPropObj.last10Overall = overAllTableTemp.slice(0, 10)
                            playerPropObj.last10HomeAway = homeAwayTableTemp.slice(0, 10)
                            playerPropObj.last10Team = teamTableTemp.slice(0, 10)

                            playerPropObj.overallChance = playerPropObj.overallTotal == 0 ? 0 : playerPropObj.overallWins / playerPropObj.overallTotal
                            playerPropObj.homeAwayChance = playerPropObj.homeAwayTotal == 0 ? 0 : playerPropObj.homeAwayWins / playerPropObj.homeAwayTotal
                            playerPropObj.teamChance = playerPropObj.teamTotal == 0 ? 0 : playerPropObj.teamWins / playerPropObj.teamTotal

                            playerPropStats.push(playerPropObj)
                        }
                        catch (error: any) {
                            console.log("Error in NhlService add player: " + error.message)
                        }


                    }
                    if (playerPropStats[0].propType == 'OU') {
                        if (playerPropStats[0].playerBookData.description == 'Over') {
                            let zero = JSON.parse(JSON.stringify(playerPropStats[0]))
                            let one = JSON.parse(JSON.stringify(playerPropStats[1]))

                            playerPropStats[1] = zero
                            playerPropStats[0] = one

                        }
                        playerPropStats.overUnder = false;
                    }
                    else if (playerPropStats[0].propType = 'Alt') {
                        playerPropStats.sort((a: { playerBookData: { point: any; }; }, b: { playerBookData: { point: any; }; }) => a.playerBookData.point - b.playerBookData.point)
                        playerPropStats.index = 0;
                    }

                    playerPropStats[0].homeAway == 'Home' ? homePlayerProps.push(playerPropStats) : awayPlayerProps.push(playerPropStats)
                }
                catch (error: any) {
                    console.log('Nhl Service player: ' + uniquePlayersWithinProp[m] + ' ' + error.message)
                }

            }
            propArray.push(awayPlayerProps);
            propArray[0].teamName = awayTeam
            propArray.push(homePlayerProps);
            propArray[1].teamName = homeTeam
            finalReturn.push(propArray)


        }



        return finalReturn
    }


    static setTeamGameStatTotals(listOfTeams: DbTeamInfo[], allTeamStats: DbNhlTeamGameStats[]): DbNhlTeamGameStatTotals[] {
        let finalArray: DbNhlTeamGameStatTotals[] = []
        for (let i = 0; i < listOfTeams.length; i++) {
            let teamTotals: DbNhlTeamGameStatTotals = {
                teamId: listOfTeams[i].teamId,
                teamName: listOfTeams[i].teamNameAbvr,
                season: 0,
                wins: 0,
                loss: 0,
                otl: 0,
                pointsScoredOverall: 0,
                pointsScoredFirstPeriod: 0,
                pointsScoredSecondPeriod: 0,
                pointsScoredThirdPeriod: 0,
                shotsOnGoal: 0,
                saves: 0,
                pointsAllowedOverall: 0,
                pointsAllowedFirstPeriod: 0,
                pointsAllowedSecondPeriod: 0,
                pointsAllowedThirdPeriod: 0,
                shotsAllowedOnGoal: 0
            }
            let teamStats = allTeamStats.filter(e => e.teamName == listOfTeams[i].teamNameAbvr)
            teamTotals.season = teamStats[0].season;
            for (let j = 0; j < teamStats.length; j++) {
                if (teamStats[j].result == 'W') {
                    teamTotals.wins++
                }
                else if (teamStats[j].result == 'L') {
                    teamTotals.loss++
                }
                else if (teamStats[j].result == 'OTL') {
                    teamTotals.otl++
                }
                teamTotals.pointsScoredOverall += teamStats[j].pointsScoredOverall;
                teamTotals.pointsScoredFirstPeriod += teamStats[j].pointsScoredFirstPeriod;
                teamTotals.pointsScoredSecondPeriod += teamStats[j].pointsScoredSecondPeriod;
                teamTotals.pointsScoredThirdPeriod += teamStats[j].pointsScoredSecondPeriod;
                teamTotals.shotsOnGoal += teamStats[j].shotsOnGoal;
                teamTotals.saves += teamStats[j].saves;
                teamTotals.pointsAllowedOverall += teamStats[j].pointsAllowedOverall;
                teamTotals.pointsAllowedFirstPeriod += teamStats[j].pointsAllowedFirstPeriod;
                teamTotals.pointsAllowedSecondPeriod += teamStats[j].pointsAllowedSecondPeriod;
                teamTotals.pointsAllowedThirdPeriod += teamStats[j].pointsAllowedThirdPeriod;
                teamTotals.shotsAllowedOnGoal += teamStats[j].shotsAllowedOnGoal;
            }
            finalArray.push(teamTotals)

        }
        return finalArray
    }

    static setPlayerGameStatTotals(listOfPlayers: number[], allPlayerStats: DbNhlPlayerGameStats[]): DbNhlPlayerGameStatTotals[] {
        let finalArray: DbNhlPlayerGameStatTotals[] = []
        for (let i = 0; i < listOfPlayers.length; i++) {
            let playerStats = allPlayerStats.filter(e => e.playerId == listOfPlayers[i])
            let playerTotal: DbNhlPlayerGameStatTotals = {
                playerId: listOfPlayers[i],
                playerName: "",
                teamName: "",
                teamId: 0,
                season: 0,
                goals: 0,
                assists: 0,
                pim: 0,
                shots: 0,
                hits: 0,
                powerPlayGoals: 0,
                powerPlayPoints: 0,
                plusMinus: 0,
                points: 0,
                blocks: 0,
                saves: 0
            }
            for (let j = 0; j < playerStats.length; j++) {
                playerTotal.playerName = playerStats[j].playerName;
                playerTotal.teamName = playerStats[j].teamName;
                playerTotal.teamId = playerStats[j].teamId;
                playerTotal.season = playerStats[j].season;
                playerTotal.goals += playerStats[j].goals;
                playerTotal.assists += playerStats[j].assists;
                playerTotal.pim += playerStats[j].pim;
                playerTotal.shots += playerStats[j].shots;
                playerTotal.hits += playerStats[j].hits;
                playerTotal.powerPlayGoals += playerStats[j].powerPlayGoals;
                playerTotal.powerPlayPoints += playerStats[j].powerPlayPoints;
                playerTotal.plusMinus += playerStats[j].plusMinus;
                playerTotal.points += playerStats[j].points;
                playerTotal.blocks += playerStats[j].blocks;
                playerTotal.saves += playerStats[j].saves;
            }
            finalArray.push(playerTotal)
        }
        return finalArray
    }

    static setTeamGameStatAverages(listOfTeams: DbTeamInfo[], allTeamStats: DbNhlTeamGameStats[]): DbNhlTeamGameStatAverages[] {
        let finalArray: DbNhlTeamGameStatAverages[] = []
        for (let i = 0; i < listOfTeams.length; i++) {
            let teamTotals: DbNhlTeamGameStatAverages = {
                teamId: listOfTeams[i].teamId,
                teamName: listOfTeams[i].teamNameAbvr,
                season: 0,
                pointsScoredOverall: 0,
                pointsScoredFirstPeriod: 0,
                pointsScoredSecondPeriod: 0,
                pointsScoredThirdPeriod: 0,
                shotsOnGoal: 0,
                saves: 0,
                pointsAllowedOverall: 0,
                pointsAllowedFirstPeriod: 0,
                pointsAllowedSecondPeriod: 0,
                pointsAllowedThirdPeriod: 0,
                shotsAllowedOnGoal: 0
            }
            let teamStats = allTeamStats.filter(e => e.teamName == listOfTeams[i].teamNameAbvr)
            teamTotals.season = teamStats[0].season;
            for (let j = 0; j < teamStats.length; j++) {
                teamTotals.pointsScoredOverall += teamStats[j].pointsScoredOverall;
                teamTotals.pointsScoredFirstPeriod += teamStats[j].pointsScoredFirstPeriod;
                teamTotals.pointsScoredSecondPeriod += teamStats[j].pointsScoredSecondPeriod;
                teamTotals.pointsScoredThirdPeriod += teamStats[j].pointsScoredSecondPeriod;
                teamTotals.shotsOnGoal += teamStats[j].shotsOnGoal;
                teamTotals.saves += teamStats[j].saves;
                teamTotals.pointsAllowedOverall += teamStats[j].pointsAllowedOverall;
                teamTotals.pointsAllowedFirstPeriod += teamStats[j].pointsAllowedFirstPeriod;
                teamTotals.pointsAllowedSecondPeriod += teamStats[j].pointsAllowedSecondPeriod;
                teamTotals.pointsAllowedThirdPeriod += teamStats[j].pointsAllowedThirdPeriod;
                teamTotals.shotsAllowedOnGoal += teamStats[j].shotsAllowedOnGoal;
            }
            teamTotals.pointsScoredOverall = teamTotals.pointsScoredOverall / teamStats.length;
            teamTotals.pointsScoredFirstPeriod = teamTotals.pointsScoredFirstPeriod / teamStats.length;
            teamTotals.pointsScoredSecondPeriod = teamTotals.pointsScoredSecondPeriod / teamStats.length;
            teamTotals.pointsScoredThirdPeriod = teamTotals.pointsScoredThirdPeriod / teamStats.length;
            teamTotals.shotsOnGoal = teamTotals.shotsOnGoal / teamStats.length;
            teamTotals.saves = teamTotals.saves / teamStats.length;
            teamTotals.pointsAllowedOverall = teamTotals.pointsAllowedOverall / teamStats.length;
            teamTotals.pointsAllowedFirstPeriod = teamTotals.pointsAllowedFirstPeriod / teamStats.length;
            teamTotals.pointsAllowedSecondPeriod = teamTotals.pointsAllowedSecondPeriod / teamStats.length;
            teamTotals.pointsAllowedThirdPeriod = teamTotals.pointsAllowedThirdPeriod / teamStats.length;
            teamTotals.shotsAllowedOnGoal = teamTotals.shotsAllowedOnGoal / teamStats.length;

            finalArray.push(teamTotals)

        }
        return finalArray
    }

    static setPlayerGameStatAverages(listOfPlayers: number[], allPlayerStats: DbNhlPlayerGameStats[]): DbNhlPlayerGameStatAverages[] {
        let finalArray: DbNhlPlayerGameStatAverages[] = []
        for (let i = 0; i < listOfPlayers.length; i++) {
            let playerStats = allPlayerStats.filter(e => e.playerId == listOfPlayers[i])
            let playerTotal: DbNhlPlayerGameStatTotals = {
                playerId: listOfPlayers[i],
                playerName: "",
                teamName: "",
                teamId: 0,
                season: 0,
                goals: 0,
                assists: 0,
                pim: 0,
                shots: 0,
                hits: 0,
                powerPlayGoals: 0,
                powerPlayPoints: 0,
                plusMinus: 0,
                points: 0,
                blocks: 0,
                saves: 0
            }
            playerTotal.playerName = playerStats[0].playerName;
            for (let j = 0; j < playerStats.length; j++) {
                playerTotal.teamName = playerStats[j].teamName;
                playerTotal.teamId = playerStats[j].teamId;
                playerTotal.season = playerStats[j].season;
                playerTotal.goals += playerStats[j].goals;
                playerTotal.assists += playerStats[j].assists;
                playerTotal.pim += playerStats[j].pim;
                playerTotal.shots += playerStats[j].shots;
                playerTotal.hits += playerStats[j].hits;
                playerTotal.powerPlayGoals += playerStats[j].powerPlayGoals;
                playerTotal.powerPlayPoints += playerStats[j].powerPlayPoints;
                playerTotal.plusMinus += playerStats[j].plusMinus;
                playerTotal.points += playerStats[j].points;
                playerTotal.blocks += playerStats[j].blocks;
                playerTotal.saves += playerStats[j].saves;
            }
            playerTotal.goals = playerTotal.goals / playerStats.length;
            playerTotal.assists = playerTotal.assists / playerStats.length;
            playerTotal.pim = playerTotal.pim / playerStats.length;
            playerTotal.shots = playerTotal.shots / playerStats.length;
            playerTotal.hits = playerTotal.hits / playerStats.length;
            playerTotal.powerPlayGoals = playerTotal.powerPlayGoals / playerStats.length;
            playerTotal.powerPlayPoints = playerTotal.powerPlayPoints / playerStats.length;
            playerTotal.plusMinus = playerTotal.plusMinus / playerStats.length;
            playerTotal.points = playerTotal.points / playerStats.length;
            playerTotal.blocks = playerTotal.blocks / playerStats.length;
            playerTotal.saves = playerTotal.saves / playerStats.length;
            finalArray.push(playerTotal)
        }
        return finalArray
    }

    static cleanNhlPlayerNames(playerName: string): string {
        if (playerName.includes('è')) {
            playerName = playerName.replaceAll('è', 'e')
        }
        if (playerName == 'Pat Maroon') {
            playerName = 'Patrick Maroon'
        }
        return playerName
    }


}