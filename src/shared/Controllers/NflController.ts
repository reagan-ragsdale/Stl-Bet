import { Allow, BackendMethod, remult } from "remult"
import { DBNflTeamGameStats } from "../dbTasks/DbNflTeamGameStats"
import { DBNflPlayerGameStats } from "../dbTasks/DbNflPlayerGameStats"


export class NflController {

    //gets all distinct game ids for the given season 
     @BackendMethod({ allowed: true })
    static async nflGetDistinctGameIds(season: number): Promise<string[]> {
        const taskRepo = remult.repo(DBNflTeamGameStats)
        return (await taskRepo.find({where: {season: season}})).map(x => x.gameId).filter((value, index, array) => array.indexOf(value) === index)

    } 


    //team stats
    @BackendMethod({allowed: true})
    static async addTeamGameStats(teamStats: DBNflTeamGameStats[]){
        const taskRepo = remult.repo(DBNflTeamGameStats)
        await taskRepo.insert(teamStats)
    }

    //player stats
    @BackendMethod({allowed: true})
    static async addPlayerGameStats(playerStats: DBNflPlayerGameStats){
        const taskRepo = remult.repo(DBNflPlayerGameStats)
        await taskRepo.insert(playerStats)
    }


}