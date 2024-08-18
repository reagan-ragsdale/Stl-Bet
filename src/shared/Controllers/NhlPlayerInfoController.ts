import { Allow, BackendMethod, remult } from "remult"
import { DbNhlPlayerInfo } from "../dbTasks/DbNhlPlayerInfo";


export class NhlPlayerInfoController {





  @BackendMethod({ allowed: true })
  static async nhlAddPlayerINfoData(playerData: DbNhlPlayerInfo[]) {
     const taskRepo = remult.repo(DbNhlPlayerInfo)
   //var d = new Date;
   
    var dbToDelete = await taskRepo.find({where: { playerId: {"!=": 0} }})
    if(dbToDelete.length > 0){
      for( const d of dbToDelete){
      await taskRepo.delete(d)
    } }

    playerData.forEach((e) => {
      if(e.playerName.includes("ü")){
        e.playerName = e.playerName.replaceAll("ü","u")
      }
      if(e.playerName.includes("é")){
        e.playerName = e.playerName.replaceAll("é","e")
      }
      if(e.playerName.includes("è")){
        e.playerName = e.playerName.replaceAll("è","e")
      }
      
    })
    
    for (const data of playerData) {
      await taskRepo.insert({playerId: data.playerId, playerName: data.playerName, teamName: data.teamName, teamId: data.teamId})
    } 

  }

  @BackendMethod({ allowed: true })
  static async nhlLoadPlayerInfoFromId(id: number): Promise<DbNhlPlayerInfo[]> {
    const taskRepo = remult.repo(DbNhlPlayerInfo)
    return await taskRepo.find({where: {playerId: id}})
  }

  @BackendMethod({ allowed: true })
  static async nhlLoadPlayerInfoFromName(name: string): Promise<DbNhlPlayerInfo[]> {
    const taskRepo = remult.repo(DbNhlPlayerInfo)
    return await taskRepo.find({where: {playerName: name}})
  } 

}