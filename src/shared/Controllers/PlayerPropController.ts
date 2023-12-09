import { Allow, BackendMethod, remult } from "remult"

import { DbPlayerPropData } from "../dbTasks/DbPlayerPropData";

export class PlayerPropController {





  @BackendMethod({ allowed: true })
  static async addPlayerPropData(playerData: DbPlayerPropData[]) {
    const taskRepo = remult.repo(DbPlayerPropData)
   var d = new Date;
   
    var dbToDelete = await taskRepo.find({where: { sportTitle: playerData[0].sportTitle }})
    if(dbToDelete.length > 0){
      for( const d of dbToDelete){
      await taskRepo.delete(d)
    } }
    
    for (const data of playerData) {
      await taskRepo.insert({bookId: data.bookId, sportKey: data.sportKey, sportTitle: data.sportTitle, homeTeam: data.homeTeam, awayTeam: data.awayTeam, commenceTime: data.commenceTime, bookMaker: data.bookMaker, marketKey: data.marketKey, description: data.description, playerName: data.playerName, price: data.price, point: data.point})
    }

  }


  //possibly look into just pulling back ceratin game or players? instead of all by sport
  @BackendMethod({ allowed: true })
  static async loadPlayerPropData(sport: string): Promise<DbPlayerPropData[]> {
    const taskRepo = remult.repo(DbPlayerPropData)
    return await taskRepo.find({where: {sportTitle: sport}, orderBy: { playerName: "asc" }})
  }

}