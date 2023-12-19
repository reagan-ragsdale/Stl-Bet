import { Allow, BackendMethod, remult } from "remult"
import { NbaPlayerInfoDb } from "../dbTasks/NbaPlayerInfoDb"
import { DbNbaGameStats } from "../dbTasks/DbNbaGameStats"
import { DbNbaTeamLogos } from "../dbTasks/DbNbaTeamLogos"

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
    console.log("here in loadPlayerInfoFromName")
    const taskRepo = remult.repo(NbaPlayerInfoDb)
    return await taskRepo.find({ where: { playerName: name } })
  }

  @BackendMethod({ allowed: true })
  static async nbaLoadPlayerInfoFromTeamId(id: number): Promise<NbaPlayerInfoDb[]> {
    console.log("here in nbaLoadPlayerInfoFromTeamId")
    const taskRepo = remult.repo(NbaPlayerInfoDb)
    return await taskRepo.find({ where: { teamId: id } })
  }

  

  @BackendMethod({ allowed: true })
  static async nbaLoadAllPlayerInfo(): Promise<NbaPlayerInfoDb[]> {
    console.log("here in nbaLoadAllPlayerInfo")
    const taskRepo = remult.repo(NbaPlayerInfoDb)
    return await taskRepo.find({ where: { playerId: { "!=": 0 } } })
  }



  // player game stat database calls

  @BackendMethod({ allowed: true })
  static async nbaAddPlayerGameStats2022(playerData: DbNbaGameStats[]) {
    const taskRepo2 = remult.repo(DbNbaGameStats)

    console.log("Here in addPlayerGameStats2022")

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
    console.log("Here in addPlayerGameStats2023")

    /* var db2023: DbNbaGameStats[] = await taskRepo2.find({ where: { playerId: playerData[0].playerId, season: 2023 } })
    var newGamesToAdd: DbNbaGameStats[] = playerData

    var db2023WithoutIdOrCreatedDate: DbNbaGameStats[] = []
    if (db2023.length > 0) {
      db2023.forEach(data => db2023WithoutIdOrCreatedDate.push({
        playerId: data.playerId,
        playerName: data.playerName,
        teamName: data.teamName,
        teamId: data.teamId,
        teamAgainstName: data.teamAgainstName,
        teamAgainstId: data.teamAgainstId,
        homeOrAway: data.homeOrAway,
        season: data.season,
        gameId: data.gameId,
        gameDate: data.gameDate,
        playerStarted: data.playerStarted,
        assists: data.assists,
        points: data.points,
        fgm: data.fgm,
        fga: data.fga,
        fgp: data.fgp,
        ftm: data.ftm,
        fta: data.fta,
        ftp: data.ftp,
        tpm: data.tpm,
        tpa: data.tpa,
        tpp: data.tpp,
        offReb: data.offReb,
        defReb: data.defReb,
        totReb: data.totReb,
        pFouls: data.pFouls,
        steals: data.steals,
        turnover: data.turnover,
        blocks: data.blocks,
        doubleDouble: data.doubleDouble,
        tripleDouble: data.tripleDouble
      }))
      newGamesToAdd = []
      //if there is already data in for the player then we need to find the difference between the already stored data and the data coming in and then insert just the difference 
      //instead of deleting everything and reinserting 

      
      newGamesToAdd = playerData.filter(({gameId: game1}) => !db2023WithoutIdOrCreatedDate.some(({gameId: game2}) => game1 === game2))
    } */

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

    /* for (const data of newGamesToAdd) {
      await taskRepo2.insert({ playerId: data.playerId, playerName: data.playerName, teamName: data.teamName, teamId: data.teamId, teamAgainstName: data.teamAgainstName, teamAgainstId: data.teamAgainstId, homeOrAway: data.homeOrAway, season: data.season, gameId: data.gameId, gameDate: data.gameDate, playerStarted: data.playerStarted, assists: data.assists, points: data.points, fgm: data.fgm, fga: data.fga, fgp: data.fgp, ftm: data.ftm, fta: data.fta, ftp: data.ftp, tpm: data.tpm, tpa: data.tpa, tpp: data.tpp, offReb: data.offReb, defReb: data.defReb, totReb: data.totReb, pFouls: data.pFouls, steals: data.steals, turnover: data.turnover, blocks: data.blocks })
    } */
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








}