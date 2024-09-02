import { DbNhlTeamGameStats } from "../../shared/dbTasks/DbNhlTeamGameStats";
import { DbPlayerInfo } from "../../shared/dbTasks/DbPlayerInfo";
import { remult } from "remult";
import { DbNhlPlayerGameStats } from "../../shared/dbTasks/DbNhlPlayerGameStats";


export class NhlService {

    static convertPlayerInfoToDb(playerInfo: any[]): DbPlayerInfo[] {
        let playerInfoFinal: DbPlayerInfo[] = []
        for (let player of playerInfo) {
            playerInfoFinal.push({
                playerId: 0,
                playerName: '',
                teamId: 0,
                teamName: '',
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
                teamAgainstId:  gameStats.teamStats.home.teamID,
                teamAgainstName: gameStats.teamStats.home.team,
                gameId: gameStats.gameID,
                gameDate : gameStats.gameDate,
                season:  this.getSeason(gameStats.gameDate),
                homeAway: 'Away',
                result: gameStats.awayResult,
                pointsScoredOverall:  gameStats.awayTotal,
                pointsScoredFirstPeriod:  gameStats.lineScore.away['1P'],
                pointsScoredSecondPeriod:  gameStats.lineScore.away['2P'],
                pointsScoredThirdPeriod:  gameStats.lineScore.away['3P'],
                shotsOnGoal:  gameStats.teamStats.away.shots,
                saves: gameStats.teamStats.away.saves,
                pointsAllowedOverall:  gameStats.homeTotal,
                pointsAllowedFirstPeriod:  gameStats.lineScore.home['1P'],
                pointsAllowedSecondPeriod:  gameStats.lineScore.home['2P'],
                pointsAllowedThirdPeriod:  gameStats.lineScore.home['3P'],
                shotsAllowedOnGoal:  gameStats.teamStats.away.shotsAgainst                    
            })
        }
        let team2 = await teamRepo.find({ where: { teamId: gameStats.teamStats.home.teamID, gameId: gameStats.gameID } })
        if (team2.length == 0) {
            teamStats.push({
                teamName: gameStats.teamStats.home.team,
                teamId: gameStats.teamStats.home.teamID,
                teamAgainstId:  gameStats.teamStats.away.teamID,
                teamAgainstName: gameStats.teamStats.away.team,
                gameId: gameStats.gameID,
                gameDate : gameStats.gameDate,
                season:  this.getSeason(gameStats.gameDate),
                homeAway: 'Home',
                result: gameStats.homeResult,
                pointsScoredOverall:  gameStats.homeTotal,
                pointsScoredFirstPeriod:  gameStats.lineScore.home['1P'],
                pointsScoredSecondPeriod:  gameStats.lineScore.home['2P'],
                pointsScoredThirdPeriod:  gameStats.lineScore.home['3P'],
                shotsOnGoal:  gameStats.teamStats.home.shots,
                saves: gameStats.teamStats.home.saves,
                pointsAllowedOverall:  gameStats.awayTotal,
                pointsAllowedFirstPeriod:  gameStats.lineScore.away['1P'],
                pointsAllowedSecondPeriod:  gameStats.lineScore.away['2P'],
                pointsAllowedThirdPeriod:  gameStats.lineScore.away['3P'],
                shotsAllowedOnGoal:  gameStats.teamStats.home.shotsAgainst                    
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
        
        for(let player of newPlayerStatData){
            let playerDb = await playerRepo.find({where:{playerId: player.playerID, gameId: gameStats.gameID}})
            if(playerDb.length == 0){
                playerStats.push({
                    playerId: player.playerID,
                    playerName: player.longName,
                    teamId: player.teamID,
                    teamName: player.team,
                    teamAgainstId: player.teamID == gameStats.teamIDHome ? gameStats.teamIDAway : gameStats.teamIDHome,
                    teamAgainstName: player.teamID == gameStats.teamIDHome ? gameStats.away : gameStats.home,
                    gameId: gameStats.gameID,
                    gameDate: gameStats.gameDate,
                    season: this.getSeason(gameStats.gameDate),
                    homeAway: player.teamID == gameStats.teamIDHome ? 'Home' : 'Away',
                    result: player.teamID == gameStats.teamIDHome ? gameStats.homeResult : gameStats.awayResult,
                    goals: player.goals,
                    assists: player.assists,
                    pim: player.penaltiesInMinutes,
                    shots: player.shots,
                    hits: player.hits,
                    powerPlayGoals: player.powerPlayGoals,
                    powerPlayPoints: player.powerPlayPoints,
                    plusMinus: player.plusMinus,
                    points: player.goals + player.assists,
                    blocks: player.blockedShots
                })
            }

        }
        finalReturn.push(playerStats)

        return finalReturn
    }

    static getSeason(gameDate: string): number{
        let monthDay = gameDate.slice(4)
        let year = gameDate.slice(0,4)
        if(Number(monthDay) < 701){
            year = (Number(year)-1).toString()
        }

        return Number(year)
    }

}