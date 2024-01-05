import { Allow, BackendMethod, remult } from "remult"
import {PlayerInfoMlb}   from '../dbTasks/PlayerInfoMlb'

export class MlbController {



  @BackendMethod({ allowed: true })
  static async updatePlayerINfo(player: PlayerInfoMlb[]) {
    const taskRepo = remult.repo(PlayerInfoMlb)
   var d = new Date;
    for (const name of player) {
      await taskRepo.delete(name.playerId)
      await taskRepo.insert({ playerId: name.playerId, playerName: name.playerName, teamName: name.teamName, teamId: name.teamId})
    }

  }

  @BackendMethod({ allowed: true })
  static async getPlayerInfoById(id: number) : Promise<PlayerInfoMlb[]> {
    const taskRepo = remult.repo(PlayerInfoMlb)
    return await taskRepo.find({ where: {playerId: id}})
    

  }

  @BackendMethod({ allowed: true })
  static async getPlayerInfoByName(name: string) : Promise<PlayerInfoMlb[]> {
    const taskRepo = remult.repo(PlayerInfoMlb)
    return await taskRepo.find({ where: {playerName: name}})
    

  }

  @BackendMethod({ allowed: true })
  static async getPlayersInfoByTeamId(id: number) : Promise<PlayerInfoMlb[]> {
    const taskRepo = remult.repo(PlayerInfoMlb)
    return await taskRepo.find({ where: {teamId: id}})
    

  }

  @BackendMethod({ allowed: true })
  static async getPlayersInfoByTeamName(name: string) : Promise<PlayerInfoMlb[]> {
    const taskRepo = remult.repo(PlayerInfoMlb)
    return await taskRepo.find({ where: {teamName: name}})
    

  }

  @BackendMethod({ allowed: true })
  static async getPlayersInfoLength() : Promise<any[]> {
    const taskRepo = remult.repo(PlayerInfoMlb)
    return await taskRepo.find({where: { playerId:{ "!=":0} }})
    

  }

  @BackendMethod({ allowed: true })
  static async loadPlayers() : Promise<PlayerInfoMlb[]> {
    const taskRepo = remult.repo(PlayerInfoMlb)
    return await taskRepo.find({limit: 20})

  }
  
}