import { BackendMethod, remult } from "remult";
import { DbNhlTeamGameStats } from "../dbTasks/DbNhlTeamGameStats";
import { DbNhlPlayerGameStats } from "../dbTasks/DbNhlPlayerGameStats";
import { DbNhlTeamGameStatTotals } from "../dbTasks/DbNhlTeamGameStatTotals";
import { DbNhlPlayerGameStatTotals } from "../dbTasks/DbNhlPlayerGameStatTotals";
import { DbNhlPlayerGameStatAverages } from "../dbTasks/DbNhlPlayerGameStatAverages";
import { DbNhlTeamGameStatAverages } from "../dbTasks/DbNhlTeamGameStatAverages";

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
        return await taskRepo.find({where: {teamName: teamName, season: season}, orderBy: {gameDate: 'asc'}})
    }
    @BackendMethod({allowed:true})
    static async nhlGetAllTeamStatsByTeamNamesAndSeason(teamName: string[], season: number): Promise<DbNhlTeamGameStats[]>{
        const taskRepo = remult.repo(DbNhlTeamGameStats)
        return await taskRepo.find({where: {teamName: teamName, season: season}, orderBy: {gameDate: 'desc'}})
    }

    //team stat totals
    @BackendMethod({allowed:true})
    static async NhlSetTeamGameStatTotals(teamStats: DbNhlTeamGameStatTotals[]){
        const taskRepo = remult.repo(DbNhlTeamGameStatTotals)
        await taskRepo.deleteMany({where: {teamId: {$gte: 0}}})
        await taskRepo.insert(teamStats)
    }
    //team stat averages
    @BackendMethod({allowed:true})
    static async NhlSetTeamGameStatAverages(teamStats: DbNhlTeamGameStatAverages[]){
        const taskRepo = remult.repo(DbNhlTeamGameStatAverages)
        await taskRepo.deleteMany({where: {teamId: {$gte: 0}}})
        await taskRepo.insert(teamStats)
    }
    

    //player stats
    @BackendMethod({allowed:true})
    static async nhlSetPlayerStats(playerStats: DbNhlPlayerGameStats[]){
        const taskRepo = remult.repo(DbNhlPlayerGameStats)
        await taskRepo.insert(playerStats)
    }


    //returns every players game stats for the selected season
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
        return await taskRepo.find({where:{playerName: playerName, season: season}, orderBy:{gameDate: 'desc'}})
    }

    //player stat totals
    @BackendMethod({allowed:true})
    static async NhlSetPlayerGameStatTotals(playerStats: DbNhlPlayerGameStatTotals[]){
        const taskRepo = remult.repo(DbNhlPlayerGameStatTotals)
        await taskRepo.deleteMany({where: {playerId: {$gte: 0}}})
        await taskRepo.insert(playerStats)
    }

    //player stat averages
    @BackendMethod({allowed:true})
    static async NhlSetPlayerGameStatAverages(playerStats: DbNhlPlayerGameStatAverages[]){
        const taskRepo = remult.repo(DbNhlPlayerGameStatAverages)
        await taskRepo.deleteMany({where: {playerId: {$gte: 0}}})
        await taskRepo.insert(playerStats)
    }
    
    

}