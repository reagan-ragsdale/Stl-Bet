import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import { DbPlayerInfo } from "../../shared/dbTasks/DbPlayerInfo";
import { DbTeamInfo } from "src/shared/dbTasks/DBTeamInfo";

@Injectable({
    providedIn: 'root'
})
export class SharedCaching{
    public currentPlayerInfo = new BehaviorSubject<DbPlayerInfo | null>(null)
    public currentTeamInfo = new BehaviorSubject<DbTeamInfo | null>(null)

    constructor(){}

    changeCurrentPlayerInfo(player: DbPlayerInfo){
        this.currentPlayerInfo.next(player)
    }

    changeCurrentTeamInfo(team: DbTeamInfo){
        this.currentTeamInfo.next(team)
    }

    
}