import { Allow, BackendMethod, remult } from "remult"

import { DbMlbTeamInfo } from "../dbTasks/DBMlbTeamInfo";

export class TeamInfoController {

    @BackendMethod({ allowed: true })
  static async setTeamInfo(teamInfo: DbMlbTeamInfo[]) {
    const taskRepo = remult.repo(DbMlbTeamInfo)

    

    await taskRepo.insert(teamInfo)

  }
}