import { BackendMethod, remult } from "remult";
import { DbNhlTeamGameStats } from "../dbTasks/DbNhlTeamGameStats";
import { DbNhlPlayerGameStats } from "../dbTasks/DbNhlPlayerGameStats";

export class NhlController{

    //team stats
    @BackendMethod({allowed:true})
    static async nhlSetGameStats(gameStats: DbNhlTeamGameStats[]){
        const taskRepo = remult.repo(DbNhlTeamGameStats)
        await taskRepo.insert(gameStats)
    }

    //player stats
    @BackendMethod({allowed:true})
    static async nhlSetPlayerStats(playerStats: DbNhlPlayerGameStats[]){
        const taskRepo = remult.repo(DbNhlPlayerGameStats)
        await taskRepo.insert(playerStats)
    }
    

}