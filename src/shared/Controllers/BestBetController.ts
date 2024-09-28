import { Allow, BackendMethod, remult } from "remult"
import { DbPlayerBestBets } from "../dbTasks/DBPlayerBestBets"

export class BestBetController {

    @BackendMethod({ allowed: true})
    static async addBestBet(playerStats: DbPlayerBestBets[]){
      const taskRepo = remult.repo(DbPlayerBestBets)
      await taskRepo.insert(playerStats)
    }
    @BackendMethod({ allowed: true})
    static async getBestBets(sport: string): Promise<DbPlayerBestBets[]>{
      const taskRepo = remult.repo(DbPlayerBestBets)
      return await taskRepo.find({where: {sportTitle:sport}})
    }
}