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
    @BackendMethod({allowed:true})
    static async nhlGetAllTeamStatsByTeamId(teamId: number): Promise<DbNhlTeamGameStats[]>{
        const taskRepo = remult.repo(DbNhlTeamGameStats)
        return await taskRepo.find({where: {teamId: teamId}})
    }
    @BackendMethod({allowed:true})
    static async nhlGetAllTeamStatsByTeamIdAndSeason(teamId: number, season: number): Promise<DbNhlTeamGameStats[]>{
        const taskRepo = remult.repo(DbNhlTeamGameStats)
        return await taskRepo.find({where: {teamId: teamId, season: season}})
    }

    @BackendMethod({allowed:true})
    static async nhlGetAllTeamStatsByTeamNameAndSeason(teamName: string, season: number): Promise<DbNhlTeamGameStats[]>{
        const taskRepo = remult.repo(DbNhlTeamGameStats)
        return await taskRepo.find({where: {teamName: teamName, season: season}})
    }

    //player stats
    @BackendMethod({allowed:true})
    static async nhlSetPlayerStats(playerStats: DbNhlPlayerGameStats[]){
        const taskRepo = remult.repo(DbNhlPlayerGameStats)
        await taskRepo.insert(playerStats)
    }

    @BackendMethod({allowed:true})
    static async nhlGetAllPlayerStatsBySeason(season: number): Promise<DbNhlPlayerGameStats[]>{
        const taskRepo = remult.repo(DbNhlPlayerGameStats)
        return await taskRepo.find({where:{season: season}})
    }
    @BackendMethod({allowed:true})
    static async nhlGetAllPlayerStatsByPlayerIdAndSeason(playerId: number, season: number): Promise<DbNhlPlayerGameStats[]>{
        const taskRepo = remult.repo(DbNhlPlayerGameStats)
        return await taskRepo.find({where:{playerId: playerId, season: season}})
    }
    @BackendMethod({allowed:true})
    static async nhlGetAllPlayerStatsByPlayerId(playerId: number, season: number): Promise<DbNhlPlayerGameStats[]>{
        const taskRepo = remult.repo(DbNhlPlayerGameStats)
        return await taskRepo.find({where:{playerId: playerId}})
    }
    @BackendMethod({allowed:true})
    static async nhlGetAllPlayerGameStatsByPlayerNameAndSeason(playerName: string[], season: number): Promise<DbNhlPlayerGameStats[]>{
        const taskRepo = remult.repo(DbNhlPlayerGameStats)
        return await taskRepo.find({where:{playerName: playerName, season: season}})
    }
    
    

}