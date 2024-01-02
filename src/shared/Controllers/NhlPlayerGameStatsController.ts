import { Allow, BackendMethod, remult } from "remult"
import { DbNhlPlayerGameStats } from "../dbTasks/DbNhlPlayerGameStats";


export class NhlPlayerGameStatsController {





  @BackendMethod({ allowed: true })
  static async nhlAddPlayerINfo2022Data(playerData: DbNhlPlayerGameStats[]) {
    const taskRepo = remult.repo(DbNhlPlayerGameStats)
   
    
    for (const data of playerData) {
      await taskRepo.insert({playerId: data.playerId, playerName: data.playerName, teamName: data.teamName, teamId: data.teamId, gameDate: data.gameDate, playerStarted: data.playerStarted, assists: data.assists, goals: data.goals, pim: data.pim, shots: data.shots, shotPct: data.shotPct, games: data.games, hits: data.hits, powerPlayGoals: data.powerPlayGoals, powerPlayPoints: data.powerPlayPoints, plusMinus: data.plusMinus, points: data.points, gameId: data.gameId, teamAgainst: data.teamAgainst, teamAgainstId: data.teamAgainstId, season: data.season, winLossTie: data.winLossTie})
    }

  }

  @BackendMethod({ allowed: true })
  static async nhlAddPlayerINfo2022BlankData(id: number, name: string) {
    const taskRepo = remult.repo(DbNhlPlayerGameStats)
    await taskRepo.insert({playerId: id, playerName: name, teamName: "asd", teamId: 0, gameDate: "fasdf", playerStarted: "as", assists: 0, goals: 0, pim: 0, shots: 0, shotPct: 0, games: 0, hits: 0, powerPlayGoals: 0, powerPlayPoints: 0, plusMinus: 0, points: 0, gameId: "asd", teamAgainst: "asd", teamAgainstId: "asd", season: "20222023", winLossTie: "data.winLossTie"})
  }

  @BackendMethod({ allowed: true })
  static async nhlAddPlayerINfo2023Data(playerData: DbNhlPlayerGameStats[]) {
    const taskRepo = remult.repo(DbNhlPlayerGameStats)
    
    var db2023 = await taskRepo.find({where: {season: playerData[0].season, playerId: playerData[0].playerId}})
    for( var d of db2023){
        await taskRepo.delete(d)
    }
    for (const data of playerData) {
      await taskRepo.insert({playerId: data.playerId, playerName: data.playerName, teamName: data.teamName, teamId: data.teamId, gameDate: data.gameDate, playerStarted: data.playerStarted, assists: data.assists, goals: data.goals, pim: data.pim, shots: data.shots, shotPct: data.shotPct, games: data.games, hits: data.hits, powerPlayGoals: data.powerPlayGoals, powerPlayPoints: data.powerPlayPoints, plusMinus: data.plusMinus, points: data.points, gameId: data.gameId, teamAgainst: data.teamAgainst, teamAgainstId: data.teamAgainstId, season: data.season, winLossTie: data.winLossTie})
    }

  }

  @BackendMethod({ allowed: true })
  static async nhlLoadPlayerInfo2022FromId(id: number): Promise<DbNhlPlayerGameStats[]> {
    const taskRepo = remult.repo(DbNhlPlayerGameStats)
    return await taskRepo.find({where: {playerId: id, season: "20222023"}})
  }

  @BackendMethod({ allowed: true })
  static async nhlLoadPlayerInfo2023FromId(id: number): Promise<DbNhlPlayerGameStats[]> {
    const taskRepo = remult.repo(DbNhlPlayerGameStats)
    return await taskRepo.find({where: {playerId: id, season: "20232024"}})
  }

}