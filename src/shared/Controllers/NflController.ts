import { Allow, BackendMethod, remult } from "remult"
import { DBNflTeamGameStats } from "../dbTasks/DbNflTeamGameStats"
import { DBNflPlayerGameStats } from "../dbTasks/DbNflPlayerGameStats"
import { DBNflPlayerGameStatTotals } from "../dbTasks/DbNflPlayerGameStatTotals"
import { DBNflTeamGameStatTotals } from "../dbTasks/DbNflTeamGameStatTotals"
import { ErrorEmailController } from "./ErrorEmailController"

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

    @BackendMethod({allowed: true})
    static async nflGetAllTeamGameStatsBySeason(season: number): Promise<DBNflTeamGameStats[]>{
        const taskRepo = remult.repo(DBNflTeamGameStats)
        let returnFinal: DBNflTeamGameStats[] = []
        if(season == 2023){
            returnFinal = await taskRepo.find({where:{gameDate: {$lte: '20240301', $gte: '20230801'}}}) 
        }
        else if(season == 2024){
            returnFinal = await taskRepo.find({where:{gameDate: {$lte: '20250301', $gte: '20240801'}}})
        }
        return returnFinal
    }

    @BackendMethod({allowed: true})
    static async nflGetAllTeamGameStatsByIdAndSeason(id: number,season: number): Promise<DBNflTeamGameStats[]>{
        const taskRepo = remult.repo(DBNflTeamGameStats)
        return await taskRepo.find({where:{teamId: id,season:season}})
    }

    
    @BackendMethod({allowed: true})
    static async nflGetAllTeamGameStatsByNameAndSeason(name: string, season: number): Promise<DBNflTeamGameStats[]>{
        const taskRepo = remult.repo(DBNflTeamGameStats)
        let returnFinal: DBNflTeamGameStats[] = []
        if(season == 2023){
            returnFinal = await taskRepo.find({where:{teamName: name, gameDate: {$lte: '20240301', $gte: '20230801'}}}) 
        }
        else if(season == 2024){
            returnFinal = await taskRepo.find({where:{teamName: name, gameDate: {$lte: '20250301', $gte: '20240801'}}})
        }
        return returnFinal
    }
    
    
    //team stat totals
    @BackendMethod({allowed:true})
    static async nflGetTeamStatTotals(stat: string, season: number): Promise<DBNflTeamGameStatTotals[]>{
        const taskRepo = remult.repo(DBNflTeamGameStatTotals)
        return await taskRepo.find({where:{season:season},orderBy: {wins: 'desc', losses: "asc"}, limit: 5})
    }
    @BackendMethod({allowed:true})
    static async nflSetTeamStatTotals(teamTotal:DBNflTeamGameStatTotals){
        const taskRepo = remult.repo(DBNflTeamGameStatTotals)
        let currentStat = await taskRepo.findFirst({teamId: teamTotal.teamId})
        await taskRepo.delete(currentStat)
        await taskRepo.insert(teamTotal)
    }
    

    //player stats
    @BackendMethod({allowed: true})
    static async addPlayerGameStats(playerStats: DBNflPlayerGameStats){
        const taskRepo = remult.repo(DBNflPlayerGameStats)
        try{
            await taskRepo.insert(playerStats)
        }
        catch(error:any){
            ErrorEmailController.sendEmailError("add player game stats: " + error.message)
        }
        
       
    }

    @BackendMethod({allowed:true})
    static async nflGetPlayerGameStatsByPlayerId(playerId: number): Promise<DBNflPlayerGameStats[]>{
        const taskRepo = remult.repo(DBNflPlayerGameStats)
        return await taskRepo.find({where: {playerId: playerId}, orderBy: {gameDate: 'desc'}})
    }

    @BackendMethod({allowed:true})
    static async nflGetPlayerGameStatsByPlayerIdAndSeason(playerId: number, season: number): Promise<DBNflPlayerGameStats[]>{
        const taskRepo = remult.repo(DBNflPlayerGameStats)
        return await taskRepo.find({where: {playerId: playerId, season: season}, orderBy: {gameDate: 'desc'}})
    }

    @BackendMethod({allowed:true})
    static async nflGetPlayerGameStatsByTeamIdAndSeason(team: number[], season: number): Promise<DBNflPlayerGameStats[]>{
        const taskRepo = remult.repo(DBNflPlayerGameStats)
        return await taskRepo.find({where: {teamId : [team[0], team[1]], season: season}, orderBy: {playerName: 'asc', gameDate: 'desc'}})
    }
  

    @BackendMethod({allowed:true})
    static async nflGetAllPlayerGameStatsBySeason(season: number): Promise<DBNflPlayerGameStats[]>{
        const taskRepo = remult.repo(DBNflPlayerGameStats)
        return await taskRepo.find({where: {season: season}, orderBy: {gameDate: 'desc'}})
    }

    @BackendMethod({allowed:true})
    static async nflGetAllPlayerGameStats(): Promise<DBNflPlayerGameStats[]>{
        const taskRepo = remult.repo(DBNflPlayerGameStats)
        return await taskRepo.find({orderBy: {gameDate: 'desc'}})
    }

    @BackendMethod({allowed:true})
    static async nflGetAllPlayerGameStatsByPlayerNameAndSeason(listOfPlayers: string[], season: number): Promise<DBNflPlayerGameStats[]>{
        const taskRepo = remult.repo(DBNflPlayerGameStats)
        return await taskRepo.find({where:{playerName: listOfPlayers, season: season},orderBy: {gameDate: 'desc'}})
    }

    

    //player game stat totals
    @BackendMethod({allowed:true})
    static async nflGetPlayerStatTotals(stat: string, season:number): Promise<DBNflPlayerGameStatTotals[]>{
        const taskRepo = remult.repo(DBNflPlayerGameStatTotals)
        let finalReturn: DBNflPlayerGameStatTotals[] = []
        if(stat == 'touchdowns'){
            finalReturn = await taskRepo.find({where: {season: season},orderBy: {touchdowns: 'desc'}, limit: 5})
        }
        else if(stat == 'rushingYards'){
            finalReturn = await taskRepo.find({where: {season: season},orderBy: {rushingYards: 'desc'}, limit: 5})
        }
        else if(stat == 'receivingYards'){
            finalReturn = await taskRepo.find({where: {season: season},orderBy: {receivingYards: 'desc'}, limit: 5})
        }
        return finalReturn
    }

    @BackendMethod({allowed:true})
    static async nflSetPlayerStatTotals(playerTotals: DBNflPlayerGameStatTotals){
        const taskRepo = remult.repo(DBNflPlayerGameStatTotals)
        let currentStat = await taskRepo.findFirst({playerId: playerTotals.playerId})
        if(currentStat){
            await taskRepo.delete(currentStat)
        }
        
        await taskRepo.insert(playerTotals)
    }

    


}