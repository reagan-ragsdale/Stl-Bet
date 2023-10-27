import { Allow, BackendMethod, remult } from "remult"
import { NbaPlayerInfoDb } from "../dbTasks/NbaPlayerInfoDb"
import { DbNbaGameStats } from "../dbTasks/DbNbaGameStats"

export class NbaController {




  //player info database calls

  @BackendMethod({ allowed: true })
  static async nbaAddPlayerInfoData(playerData: NbaPlayerInfoDb[]) {
    const taskRepo = remult.repo(NbaPlayerInfoDb)
    console.log("Here in addPlayerInfoData")

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

    })

    for (const data of playerData) {
      await taskRepo.insert({ playerId: data.playerId, playerName: data.playerName, teamId: data.teamId })
    }

  }

  @BackendMethod({ allowed: true })
  static async nbaLoadPlayerInfoFromId(id: number): Promise<NbaPlayerInfoDb[]> {
    const taskRepo = remult.repo(NbaPlayerInfoDb)
    return await taskRepo.find({where: {playerId: id}})
  }

  @BackendMethod({ allowed: true })
  static async nbaLoadPlayerInfoFromName(name: string): Promise<NbaPlayerInfoDb[]> {
    console.log("here in loadPlayerInfoFromName")
    const taskRepo = remult.repo(NbaPlayerInfoDb)
    return await taskRepo.find({where: {playerName: name}})
  }

  @BackendMethod({ allowed: true })
  static async nbaLoadPlayerInfoFromTeamId(id: number): Promise<NbaPlayerInfoDb[]> {
    console.log("here in nbaLoadPlayerInfoFromTeamId")
    const taskRepo = remult.repo(NbaPlayerInfoDb)
    return await taskRepo.find({where: {teamId: id}})
  }



  // player game stat database calls

  @BackendMethod({ allowed: true })
  static async nbaAddPlayerGameStats2022(playerData: DbNbaGameStats[]) {
    const taskRepo2 = remult.repo(DbNbaGameStats)
    //var d = new Date;
    console.log("Here in addPlayerGameStats2022")

    var dbToDelete = await taskRepo2.find({where: { playerId: playerData[0].playerId, season: 2022} })
    if (dbToDelete.length > 0) {
      for (const d of dbToDelete) {
        await taskRepo2.delete(d)
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

    })

    for (const data of playerData) {
      await taskRepo2.insert({ playerId: data.playerId, playerName: data.playerName, teamName: data.teamName, teamId: data.teamId, season: data.season, gameId: data.gameId, playerStarted: data.playerStarted, assists: data.assists, points: data.points, fgm: data.fgm, fga: data.fga, fgp: data.fgp, ftm: data.ftm, fta: data.fta, ftp: data.ftp, tpm: data.tpm, tpa: data.tpa, tpp: data.tpp, offReb: data.offReb, defReb: data.defReb, totReb: data.totReb, pFouls: data.pFouls, steals: data.steals, turnover: data.turnover, blocks: data.blocks })
    }

  }
  
  @BackendMethod({ allowed: true })
  static async nbaAddPlayerGameStats2023(playerData: DbNbaGameStats[]) {
    const taskRepo2 = remult.repo(DbNbaGameStats)
    //var d = new Date;
    console.log("Here in addPlayerGameStats2023")

    var dbToDelete = await taskRepo2.find({ where: { playerId: playerData[0].playerId, season: 2023 } })
    if (dbToDelete.length > 0) {
      for (const d of dbToDelete) {
        await taskRepo2.delete(d)
      }
    }
    console.log("Here in addPlayerGameStats2023 after delete")
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

    for (const data of playerData) {
      await taskRepo2.insert({ playerId: data.playerId, playerName: data.playerName, teamName: data.teamName, teamId: data.teamId, season: data.season, gameId: data.gameId, playerStarted: data.playerStarted, assists: data.assists, points: data.points, fgm: data.fgm, fga: data.fga, fgp: data.fgp, ftm: data.ftm, fta: data.fta, ftp: data.ftp, tpm: data.tpm, tpa: data.tpa, tpp: data.tpp, offReb: data.offReb, defReb: data.defReb, totReb: data.totReb, pFouls: data.pFouls, steals: data.steals, turnover: data.turnover, blocks: data.blocks })
    }

  }

  @BackendMethod({ allowed: true })
  static async nbaLoadPlayerStatsInfoFromIdAndSeason(id: number, season: number): Promise<DbNbaGameStats[]> {
    const taskRepo = remult.repo(DbNbaGameStats)
    return await taskRepo.find({where: {playerId: id, season: season}})
  }

  @BackendMethod({ allowed: true })
  static async nbaLoadPlayerStatsInfoFromNameAndSeason(name: string, season: number): Promise<DbNbaGameStats[]> {
    const taskRepo = remult.repo(DbNbaGameStats)
    return await taskRepo.find({where: {playerName: name, season: season}})
  }

  

  @BackendMethod({ allowed: true })
  static async nbaAddPlayerStat2022BlankData(playerId: number, playerName: string) {
    const taskRepo = remult.repo(DbNbaGameStats)
    await taskRepo.insert({ playerId: playerId, playerName: playerName, teamName: "", teamId: 0, season: 2022, gameId: 0, playerStarted: "N", assists: 0, points: 0, fgm: 0, fga: 0, fgp: 0, ftm: 0, fta: 0, ftp: 0, tpm: 0, tpa: 0, tpp: 0, offReb: 0, defReb: 0, totReb: 0, pFouls: 0, steals: 0, turnover: 0, blocks: 0})
    

  }


  
  

    

  

}