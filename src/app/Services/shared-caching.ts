import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import { DbPlayerInfo } from "../../shared/dbTasks/DbPlayerInfo";

@Injectable({
    providedIn: 'root'
})
export class SharedCaching{
    public currentPlayerInfo = new BehaviorSubject<DbPlayerInfo | null>(null)


    constructor(){}

    changeCurrentPlayerInfo(player: DbPlayerInfo){
        this.currentPlayerInfo.next(player)
    }
}