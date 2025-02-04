import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import { DbPlayerInfo } from "../../shared/dbTasks/DbPlayerInfo";
import { DbTeamInfo } from "../../shared/dbTasks/DBTeamInfo";
import { DbNhlTeamGameStats } from "../../shared/dbTasks/DbNhlTeamGameStats";
import { DBNflTeamGameStats } from "../../shared/dbTasks/DbNflTeamGameStats";
import { DbMlbTeamGameStats } from "../../shared/dbTasks/DbMlbTeamGameStats";
import { DbNbaTeamGameStats } from "../../shared/dbTasks/DbNbaTeamGameStats";

type TeamStatsTypes = DbNhlTeamGameStats[] | DBNflTeamGameStats[] | DbMlbTeamGameStats[] | DbNbaTeamGameStats[] | null

@Injectable({
    providedIn: 'root'
})
export class SharedCaching{
    


    public currentPlayerInfo = new BehaviorSubject<DbPlayerInfo | null>(null)
    public currentTeamInfo = new BehaviorSubject<DbTeamInfo | null>(null)
    public currentGameData = new BehaviorSubject<any[] | null>(null)
    public static currentSportTeamStats = new BehaviorSubject<TeamStatsTypes>(null) 
    public currentAllPlayerInfo = new BehaviorSubject<DbPlayerInfo[] | null>(null)
    public static currentAllPlayerInfoStatic = new BehaviorSubject<DbPlayerInfo[] | null>(null)

    constructor(){}

    changeCurrentPlayerInfo(player: DbPlayerInfo){
        this.currentPlayerInfo.next(player)
    }

    changeCurrentTeamInfo(team: DbTeamInfo){
        this.currentTeamInfo.next(team)
    }

    changeCurrentGameData(gameData: any[]){
        this.currentGameData.next(gameData)
    }

    static changeCurrentTeamsStats(stats: TeamStatsTypes){
        this.currentSportTeamStats.next(stats)
    }

    changeCurrentAllPlayerInfo(players: DbPlayerInfo[]){
        this.currentAllPlayerInfo.next(players)
        SharedCaching.currentAllPlayerInfoStatic.next(players)
    }



    
}