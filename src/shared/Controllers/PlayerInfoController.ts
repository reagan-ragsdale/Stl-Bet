import { Allow, BackendMethod, remult } from "remult"

import { DbPlayerInfo } from "../dbTasks/DbPlayerInfo";

export class PlayerInfoController {





  @BackendMethod({ allowed: true })
  static async playerInfoAddPlayers(playerInfo: DbPlayerInfo[]) {
    const taskRepo = remult.repo(DbPlayerInfo)

    var dbToDelete = await taskRepo.find({ where: { sport: playerInfo[0].sport } })
    if (dbToDelete.length > 0) {
      for (const d of dbToDelete) {
        await taskRepo.delete(d)
      }
    }

    await taskRepo.insert(playerInfo)

  }

  @BackendMethod({ allowed: true })
  static async loadAllSportPlayerInfo(): Promise<DbPlayerInfo[]> {
    const taskRepo = remult.repo(DbPlayerInfo)
    return await taskRepo.find()
  }

  @BackendMethod({ allowed: true })
  static async loadPlayerInfoBySport(sport: string): Promise<DbPlayerInfo[]> {
    const taskRepo = remult.repo(DbPlayerInfo)
    return await taskRepo.find({where: {sport: sport}})
  }

  @BackendMethod({ allowed: true })
  static async loadPlayerInfoBySportAndId(sport: string, id:number): Promise<DbPlayerInfo[]> {
    const taskRepo = remult.repo(DbPlayerInfo)
    return await taskRepo.find({where: {sport: sport, playerId: id}})
  }

  @BackendMethod({ allowed: true })
  static async loadActivePlayerInfoBySport(sport: string): Promise<DbPlayerInfo[]> {
    const taskRepo = remult.repo(DbPlayerInfo)
    return await taskRepo.find({where: {sport: sport, teamName: {'!=': 'None'}}})
  }

}