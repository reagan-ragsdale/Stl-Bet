import { Allow, BackendMethod, remult } from "remult"
import { NbaPlayerInfoDb } from "../dbTasks/NbaPlayerInfoDb"
import { DbNbaGameStats } from "../dbTasks/DbNbaGameStats"
import { DbNbaTeamLogos } from "../dbTasks/DbNbaTeamLogos"
import { DbNbaTeamGameStats } from "../dbTasks/DbNbaTeamGameStats"
import { DbNbaPlayerStatAverages } from "../dbTasks/DbNbaPlayerStatAverages"
import { DbNbaTeamStatAverages } from "../dbTasks/DbNbaTeamStatAverages"

export class NbaController {




  //player info database calls

  @BackendMethod({ allowed: true })
  static async nbaAddPlayerInfoData(playerData: NbaPlayerInfoDb[]) {
    const taskRepo = remult.repo(NbaPlayerInfoDb)

    var dbToDelete = await taskRepo.find({ where: { playerId: { "!=": 0 } } })
    if (dbToDelete.length > 0) {
      for (const d of dbToDelete) {
        await taskRepo.delete(d)
      }
    }

    playerData.forEach((e) => {
      if (e.playerName.includes("ü")) {
        e.playerName = e.playerName.replaceAll("ü", "u")
      }
      if (e.playerName.includes("é")) {
        e.playerName = e.playerName.replaceAll("é", "e")
      }
      if (e.playerName.includes("è")) {
        e.playerName = e.playerName.replaceAll("è", "e")
      }
      if (e.playerName.includes(".")) {
        e.playerName = e.playerName.replaceAll(".", "")
      }

    })
    await taskRepo.insert(playerData)


  }

  @BackendMethod({ allowed: true })
  static async nbaLoadPlayerInfoFromId(id: number): Promise<NbaPlayerInfoDb[]> {
    const taskRepo = remult.repo(NbaPlayerInfoDb)
    return await taskRepo.find({ where: { playerId: id } })
  }

  @BackendMethod({ allowed: true })
  static async nbaLoadPlayerInfoFromName(name: string): Promise<NbaPlayerInfoDb[]> {
    const taskRepo = remult.repo(NbaPlayerInfoDb)
    return await taskRepo.find({ where: { playerName: name } })
  }

  @BackendMethod({ allowed: true })
  static async nbaLoadPlayerInfoFromTeamId(id: number): Promise<NbaPlayerInfoDb[]> {
    const taskRepo = remult.repo(NbaPlayerInfoDb)
    return await taskRepo.find({ where: { teamId: id } })
  }

  @BackendMethod({ allowed: true })
  static async nbaLoadPlayerInfoFromPlayerNameAndTeamId(teamId: number, playerName: string): Promise<NbaPlayerInfoDb[]> {
    const taskRepo = remult.repo(NbaPlayerInfoDb)
    return await taskRepo.find({ where: { teamId: teamId, playerName: playerName } })
  }

  

  @BackendMethod({ allowed: true })
  static async nbaLoadAllPlayerInfo(): Promise<NbaPlayerInfoDb[]> {
    const taskRepo = remult.repo(NbaPlayerInfoDb)
    return await taskRepo.find({ where: { playerId: { "!=": 0 } } })
  }



  // player game stat database calls

  @BackendMethod({ allowed: true })
  static async nbaAddPlayerGameStats2022(playerData: DbNbaGameStats[]) {
    const taskRepo2 = remult.repo(DbNbaGameStats)


    var dbToDelete = await taskRepo2.find({ where: { playerId: playerData[0].playerId, season: 2022 } })
    if (dbToDelete.length < 1) {
      playerData.forEach((e) => {
        if (e.playerName.includes("ü")) {
          e.playerName = e.playerName.replaceAll("ü", "u")
        }
        if (e.playerName.includes("é")) {
          e.playerName = e.playerName.replaceAll("é", "e")
        }
        if (e.playerName.includes("è")) {
          e.playerName = e.playerName.replaceAll("è", "e")
        }

      })


      await taskRepo2.insert(playerData)

    }



  }

  @BackendMethod({ allowed: true })
  static async nbaAddPlayerGameStats2023(playerData: DbNbaGameStats[]) {
    const taskRepo2 = remult.repo(DbNbaGameStats)

    playerData.forEach((e) => {
      if (e.playerName.includes("ü")) {
        e.playerName = e.playerName.replaceAll("ü", "u")
      }
      if (e.playerName.includes("é")) {
        e.playerName = e.playerName.replaceAll("é", "e")
      }
      if (e.playerName.includes("è")) {
        e.playerName = e.playerName.replaceAll("è", "e")
      }

    })

    await taskRepo2.insert(playerData)

  }

  @BackendMethod({ allowed: true })
  static async nbaLoadPlayerStatsInfoFromIdAndSeason(id: number, season: number): Promise<DbNbaGameStats[]> {
    const taskRepo = remult.repo(DbNbaGameStats)
    return await taskRepo.find({ where: { playerId: id, season: season }, orderBy: { uniquegameid: "asc" } })
  }

  @BackendMethod({ allowed: true })
  static async nbaLoadPlayerStatsInfoFromNameAndSeason(name: string, season: number): Promise<DbNbaGameStats[]> {
    const taskRepo = remult.repo(DbNbaGameStats)
    return await taskRepo.find({ where: { playerName: name, season: season }, orderBy: { gameId: "desc" } })
  }



  @BackendMethod({ allowed: true })
  static async nbaAddPlayerStat2022BlankData(playerId: number, playerName: string) {
    const taskRepo = remult.repo(DbNbaGameStats)
    await taskRepo.insert({ playerId: playerId, playerName: playerName, teamName: "", teamId: 0, season: 2022, gameId: 0, playerStarted: "N", assists: 0, points: 0, fgm: 0, fga: 0, fgp: 0, ftm: 0, fta: 0, ftp: 0, tpm: 0, tpa: 0, tpp: 0, offReb: 0, defReb: 0, totReb: 0, pFouls: 0, steals: 0, turnover: 0, blocks: 0 })


  }


  // nba team stats

  @BackendMethod({ allowed: true })
  static async nbaAddTeamGameStats(teamData: DbNbaTeamGameStats[]) {
    const taskRepo2 = remult.repo(DbNbaTeamGameStats)
   

    await taskRepo2.insert(teamData)

  }

  @BackendMethod({ allowed: true })
  static async nbaLoadTeamGameStatsByTeamIdAndSeason(id: number, season: number): Promise<DbNbaTeamGameStats[]> {
    const taskRepo2 = remult.repo(DbNbaTeamGameStats)
   

    return await taskRepo2.find({ where: { teamId: id, season: season }, orderBy: { uniquegameid: "desc" } })

  }

  




  // nba team logos


  @BackendMethod({ allowed: true })
  static async nbaGetLogoFromTeamId(id: number): Promise<DbNbaTeamLogos[]> {
    const taskRepo = remult.repo(DbNbaTeamLogos)
    return await taskRepo.find({ where: { teamId: id } })
  }

  @BackendMethod({ allowed: true })
  static async nbaGetLogoFromTeamName(name: string): Promise<DbNbaTeamLogos[]> {
    const taskRepo = remult.repo(DbNbaTeamLogos)
    return await taskRepo.find({ where: { teamName: name } })
  }


  // nba player stat averages
  @BackendMethod({ allowed: true })
  static async nbaSetPlayerStatAverage(stat: DbNbaPlayerStatAverages) {
    const taskRepo = remult.repo(DbNbaPlayerStatAverages)

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
  static async nbaGetPlayerStatAverage(playerId: number): Promise<DbNbaPlayerStatAverages[]> {
    const taskRepo = remult.repo(DbNbaPlayerStatAverages)

    return await taskRepo.find({where: {playerId: playerId}})
    
  }

  @BackendMethod({ allowed: true })
  static async nbaGetPlayerStatAverageTop5(stat: string): Promise<DbNbaPlayerStatAverages[]> {
    const taskRepo = remult.repo(DbNbaPlayerStatAverages)
    var finalData: DbNbaPlayerStatAverages[] = []

    if(stat == "points"){
      finalData = await taskRepo.find({orderBy: {points: "desc"}, limit: 5})
    }
    else if(stat == "assists"){
      finalData = await taskRepo.find({orderBy: {assists: "desc"}, limit: 5})
    }
    else if(stat == "rebounds"){
      finalData = await taskRepo.find({orderBy: {totReb: "desc"}, limit: 5})
    }
    else if(stat == "threes"){
      finalData = await taskRepo.find({orderBy: {tpp: "desc"}, limit: 5})
    }
    return finalData
    
    
  }


  // nba team stat averages
  @BackendMethod({ allowed: true })
  static async nbaSetTeamStatAverage(stat: DbNbaTeamStatAverages) {
    const taskRepo = remult.repo(DbNbaTeamStatAverages)

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
  static async nbaGetTeamStatAverage(teamId: number): Promise<DbNbaTeamStatAverages[]> {
    const taskRepo = remult.repo(DbNbaTeamStatAverages)

    return await taskRepo.find({where: {teamId: teamId}})
    
  }

  @BackendMethod({ allowed: true })
  static async nbaGetTeamStatAverageTop5(stat: string): Promise<DbNbaTeamStatAverages[]> {
    const taskRepo = remult.repo(DbNbaTeamStatAverages)
    var finalData: DbNbaTeamStatAverages[] = []
    if(stat == "pointsScored"){
      finalData =  await taskRepo.find({orderBy: {pointsScored: "desc"}, limit: 5})
    }
    else if(stat == "wins"){
      finalData = await taskRepo.find({orderBy: {wins: "desc"}, limit: 5})
    }
    else if(stat == "pointsAllowed"){
      finalData = await taskRepo.find({orderBy: {pointsAllowed: "asc"}, limit: 5})
    }
    return finalData
    
    
    
  }









}