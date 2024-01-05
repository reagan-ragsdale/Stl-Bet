

import { Injectable } from '@angular/core';

import { DbNhlPlayerGameStats } from 'src/shared/dbTasks/dbNhlPlayerGameStats';
import { NhlPlayerInfoController } from 'src/shared/Controllers/nhlPlayerInfoController.js';
import { DbNhlPlayerInfo } from 'src/shared/dbTasks/dbNhlPlayerInfo';

@Injectable()
export class nhlApiController {

    playerStatData: any
    nhlPlayerStatData: DbNhlPlayerGameStats[] = []
    playerInfo: any
    nhlPlayerInfo: DbNhlPlayerInfo[] = []

    async loadNhl2022PlayerStatData(id: number) {
        const url = `https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=gameLog&season=20222023`
        const promise = await fetch(url);
        const processedResponse = await promise.json();
        this.playerStatData = processedResponse;
        await this.convertNhlStatDataToInterface(id).then(items => this.nhlPlayerStatData = items);
        return this.nhlPlayerStatData;
    }
    async loadNhl2023PlayerStatData(id: number) {
        const url = `https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=gameLog&season=20232024`
        const promise = await fetch(url);
        const processedResponse = await promise.json();
        this.playerStatData = processedResponse;
        this.nhlPlayerStatData = await this.convertNhlStatDataToInterface(id)
        return this.nhlPlayerStatData;
    }

    async convertNhlStatDataToInterface(id: number) {
        var temp: DbNhlPlayerGameStats[] = []
        var player = await NhlPlayerInfoController.nhlLoadPlayerInfoFromId(id)
        for (let i = 0; i < this.playerStatData.stats[0].splits.length; i++) {
            temp.push({
                playerId: id,
                playerName: player[0].playerName,
                teamName: this.playerStatData.stats[0].splits[i].team.name,
                teamId: this.playerStatData.stats[0].splits[i].team.id,
                gameDate: this.playerStatData.stats[0].splits[i].date,
                playerStarted: this.playerStatData.stats[0].splits[i].stat.shifts > 0 ? "Y" : "N",
                assists: this.playerStatData.stats[0].splits[i].stat.assists,
                goals: this.playerStatData.stats[0].splits[i].stat.goals,
                pim: this.playerStatData.stats[0].splits[i].stat.pim,
                shots: this.playerStatData.stats[0].splits[i].stat.shots,
                shotPct: this.playerStatData.stats[0].splits[i].stat.shotPct,
                games: this.playerStatData.stats[0].splits[i].stat.games,
                hits: this.playerStatData.stats[0].splits[i].stat.hits,
                powerPlayGoals: this.playerStatData.stats[0].splits[i].stat.powerPlayGoals,
                powerPlayPoints: this.playerStatData.stats[0].splits[i].stat.powerPlayPoints,
                plusMinus: this.playerStatData.stats[0].splits[i].stat.plusMinus,
                points: this.playerStatData.stats[0].splits[i].stat.points,
                gameId: this.playerStatData.stats[0].splits[i].game.gamePk,
                teamAgainst: this.playerStatData.stats[0].splits[i].opponent.name,
                teamAgainstId: this.playerStatData.stats[0].splits[i].opponent.id,
                season: this.playerStatData.stats[0].splits[i].season,
                winLossTie: this.playerStatData.stats[0].splits[i].isWin == true ? "Win" : (this.playerStatData.stats[0].splits[i].isOT == false ? "Loss" : "Tie")

            })

        }
        return temp
    }


    async getplayerInfo() {
        var url = "https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster";
    
        const promise = await fetch(url);
        const processedResponse = await promise.json();
        this.playerInfo = processedResponse;
        this.nhlPlayerInfo = this.convertInfoDataToInterface();
        return this.nhlPlayerInfo;
      }
      convertInfoDataToInterface() {
        var temp: DbNhlPlayerInfo[] = []
    
        for (let i = 0; i < this.playerInfo.teams.length; i++) {
          for (let j = 0; j < this.playerInfo.teams[i].roster.roster.length; j++) {
            temp.push({
              playerId: this.playerInfo.teams[i].roster.roster[j].person.id,
              playerName: this.playerInfo.teams[i].roster.roster[j].person.fullName,
              teamName: this.playerInfo.teams[i].abbreviation,
              teamId: this.playerInfo.teams[i].id
            })
          }
        }
    
        return temp;
      }
}