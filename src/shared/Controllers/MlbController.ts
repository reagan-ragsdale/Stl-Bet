import { Allow, BackendMethod, remult } from "remult"
import {DbMlbPlayerInfo}   from '../dbTasks/DbMlbPlayerInfo'
import { DBMlbPlayerGameStats } from "../dbTasks/DbMlbPlayerGameStats"
import { DbMlbTeamGameStats } from "../dbTasks/DbMlbTeamGameStats"
import { DBMlbPlayerGameStatAverages } from "../dbTasks/DbMlbPlayerGameStatAverages"
import { DbMlbTeamGameStatAverages } from "../dbTasks/DbMlbTeamGameStatAverages"
import { DbPlayerInfo } from "../dbTasks/DbPlayerInfo"

export class MlbController {



  //player info 
  @BackendMethod({ allowed: true})
  static async mlbSetPlayerInfo(playerData: DbMlbPlayerInfo[]){
    const taskRepo = remult.repo(DbMlbPlayerInfo)
    var currentDb = await taskRepo.find({ where: { playerId: { ">=": 0 } } })
    if(currentDb.length > 0){
      for(let player of currentDb){
        await taskRepo.delete(player)
      }
    }
    try{
      await taskRepo.insert(playerData)
    }catch(error: any){console.log(error.message)}
    
  }

  @BackendMethod({ allowed: true})
  static async mlbGetPlayerInfoByPlayerId(id: number): Promise<DbMlbPlayerInfo[]>{
    const taskRepo = remult.repo(DbMlbPlayerInfo)
    return await taskRepo.find({where: {playerId: id}})
  }

  @BackendMethod({ allowed: true})
  static async mlbGetPlayerInfoByPlayerName(name: string): Promise<DbMlbPlayerInfo[]>{
    const taskRepo = remult.repo(DbMlbPlayerInfo)
    return await taskRepo.find({where: {playerName: name}})
  }

  @BackendMethod({ allowed: true})
  static async mlbGetAllPlayerInfo(): Promise<DbMlbPlayerInfo[]>{
    const taskRepo = remult.repo(DbMlbPlayerInfo)
    return await taskRepo.find({ where: { playerId: { "!=": 0 } }, limit: 5 })
  }

  @BackendMethod({ allowed: true})
  static async mlbGetActivePlayerInfo(): Promise<DbMlbPlayerInfo[]>{
    const taskRepo = remult.repo(DbMlbPlayerInfo)
    return await taskRepo.find({ where: { teamId: { "!=": 0 } } })
  }
  

  //player game stats
  @BackendMethod({ allowed: true})
  static async mlbSetPlayerGameStats(playerStats: DBMlbPlayerGameStats[]){
    console.log("HEre in controler")
    const taskRepo = remult.repo(DBMlbPlayerGameStats)
    await taskRepo.insert(playerStats)
  }

  @BackendMethod({ allowed: true})
  static async mlbGetPlayerGameStatsByPlayerIdAndSeason(id: number, season: number): Promise<DBMlbPlayerGameStats[]>{
    const taskRepo = remult.repo(DBMlbPlayerGameStats)
    return await taskRepo.find({where: {playerId : id, season: season}})
  }
  @BackendMethod({ allowed: true})
  static async mlbSetBlankPlayerGameStats(player: DbPlayerInfo, season: number){
    const taskRepo = remult.repo(DBMlbPlayerGameStats)
    await taskRepo.insert({playerId: player.playerId, playerName: player.playerName, season: season })
  }
  

  //team game stats
  @BackendMethod({ allowed: true})
  static async mlbSetTeamGameStats(teamStats: DbMlbTeamGameStats[]){
    const taskRepo = remult.repo(DbMlbTeamGameStats)
    await taskRepo.insert(teamStats)
  }

  @BackendMethod({ allowed: true})
  static async mlbGetTeamGameStatsByTeamIdAndSeason(id: number, season: number): Promise<DbMlbTeamGameStats[]>{
    const taskRepo = remult.repo(DbMlbTeamGameStats)
    return await taskRepo.find({where: {teamId : id, season: season}})
    
  }

  //player stat averages
  @BackendMethod({ allowed: true })
  static async mlbSetPlayerStatAverage(stat: DBMlbPlayerGameStatAverages) {
    const taskRepo = remult.repo(DBMlbPlayerGameStatAverages)

    var playerStat = await taskRepo.find({where: {playerId: stat.playerId}})
    if(playerStat.length > 0){
      await taskRepo.delete(playerStat[0])
      await taskRepo.insert(stat)
    }
    else{
      await taskRepo.insert(stat)
    }
    
  }

  @BackendMethod({ allowed: true })
  static async mlbGetPlayerStatAverage(playerId: number): Promise<DBMlbPlayerGameStatAverages[]> {
    const taskRepo = remult.repo(DBMlbPlayerGameStatAverages)
    return await taskRepo.find({where: {playerId: playerId}})
  }

  @BackendMethod({ allowed: true })
  static async mlbGetPlayerStatAverageTop5(stat: string, season: number): Promise<DBMlbPlayerGameStatAverages[]> {
    const taskRepo = remult.repo(DBMlbPlayerGameStatAverages)
    var finalData: DBMlbPlayerGameStatAverages[] = []

    if(stat == "hits"){
      finalData = await taskRepo.find({where: {totalGames:{">": 0}, season: season },  orderBy: {batterHits: "desc"}, limit: 5})
    }
    else if(stat == "homeRuns"){
      finalData = await taskRepo.find({where: {totalGames:{">": 0}, season: season },orderBy: {batterHomeRuns: "desc"}, limit: 5})
    }
    else if(stat == "rbis"){
      finalData = await taskRepo.find({where: {totalGames:{">": 0}, season: season },orderBy: {batterRbis: "desc"}, limit: 5})
    }
    else if(stat == "pitcherStrikes"){
      finalData = await taskRepo.find({where: {totalGames:{">": 0}, season: season },orderBy: {pitcherStrikes: "desc"}, limit: 5})
    }
    
    return finalData
  }


  //team stat averages
  @BackendMethod({ allowed: true })
  static async mlbSetTeamStatAverage(stat: DbMlbTeamGameStatAverages) {
    const taskRepo = remult.repo(DbMlbTeamGameStatAverages)

    var teamStat = await taskRepo.find({where: {teamId: stat.teamId}})
    if(teamStat.length > 0){
      await taskRepo.delete(teamStat[0])
      await taskRepo.insert(stat)
    }
    else{
      await taskRepo.insert(stat)
    }
    
  }

  @BackendMethod({ allowed: true })
  static async mlbGetTeamStatAverage(teamId: number): Promise<DbMlbTeamGameStatAverages[]> {
    const taskRepo = remult.repo(DbMlbTeamGameStatAverages)
    return await taskRepo.find({where: {teamId: teamId}})    
  }

  @BackendMethod({ allowed: true })
  static async mlbGetTeamStatAverageTop5(stat: string, season: number): Promise<DbMlbTeamGameStatAverages[]> {
    const taskRepo = remult.repo(DbMlbTeamGameStatAverages)
    var finalData: DbMlbTeamGameStatAverages[] = []
    if(stat == "pointsScored"){
      finalData =  await taskRepo.find({where: {season: season}, orderBy: {pointsScoredOverall: "desc"}, limit: 5})
    }
    else if(stat == "wins"){
      finalData = await taskRepo.find({where: {season: season},orderBy: {wins: "desc"}, limit: 5})
    }
    else if(stat == "pointsAllowed"){
      finalData = await taskRepo.find({where: {season: season},orderBy: {pointsAllowedOverall: "asc"}, limit: 5})
    }
    return finalData
  }

  
}