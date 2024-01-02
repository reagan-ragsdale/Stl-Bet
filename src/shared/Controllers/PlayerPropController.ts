import { Allow, BackendMethod, remult } from "remult"

import { DbPlayerPropData } from "../dbTasks/dbPlayerPropData";

export class PlayerPropController {





  @BackendMethod({ allowed: true })
  static async addPlayerPropData(playerData: DbPlayerPropData[]) {
    const taskRepo = remult.repo(DbPlayerPropData)
    var d = new Date;

    var dbToDelete = await taskRepo.find({ where: { sportTitle: playerData[0].sportTitle, bookId: playerData[0].bookId } })
    if (dbToDelete.length > 0) {
      for (const d of dbToDelete) {
        await taskRepo.delete(d)
      }
    }

    await taskRepo.insert(playerData)

  }


  //possibly look into just pulling back ceratin game or players? instead of all by sport
  @BackendMethod({ allowed: true })
  static async loadPlayerPropData(sport: string, bookId: string): Promise<DbPlayerPropData[]> {
    const taskRepo = remult.repo(DbPlayerPropData)
    return await taskRepo.find({ where: { sportTitle: sport, bookId: bookId }, orderBy: { playerName: "asc" } })
  }

}