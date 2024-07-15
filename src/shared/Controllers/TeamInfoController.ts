import { Allow, BackendMethod, remult } from "remult"

import { DbTeamInfo } from "../dbTasks/DBTeamInfo";

export class TeamInfoController {

    @BackendMethod({ allowed: true })
  static async setTeamInfo(teamInfo: DbTeamInfo[]) {
    const taskRepo = remult.repo(DbTeamInfo)

    

    await taskRepo.insert(teamInfo)

  }

  @BackendMethod({ allowed: true })
  static async getTeamInfo(sport: string, teamId: number): Promise<DbTeamInfo[]> {
    const taskRepo = remult.repo(DbTeamInfo)
    return await taskRepo.find({where: {sport: sport, teamId: teamId}})
  }
  @BackendMethod({ allowed: true })
  static async getAllTeamInfo(sport: string): Promise<DbTeamInfo[]> {
    const taskRepo = remult.repo(DbTeamInfo)
    return await taskRepo.find({where: {sport: sport}})
  }
}