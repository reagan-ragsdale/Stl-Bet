import { DbPlayerPropData } from "../../shared/dbTasks/DbPlayerPropData"

export interface PlayerPropDto {
    playerBookData: DbPlayerPropData
    playerName: string,
    playerId: number,
    teamName: string,
    teamId: number,
    teamAgainstName: string,
    teamAgainstId: number,
    homeAway: string,
    propType: string,
    overallChance: number,
    overallWins: number,
    overallTotal: number,
    homeAwayChance: number,
    homeAwayWins: number,
    homeAwayTotal: number,
    teamChance: number,
    teamWins: number,
    teamTotal: number
    averageOverall: number,
    averageHomeAway: number,
    averageTeam: number,
    highOverall: number,
    highHomeAway: number,
    highTeam: number,
    lowOverall: number,
    lowHomeAway: number,
    lowTeam: number,
    isDisabled: boolean,
    playerStats: any[],
    last10Overall: any[],
    last10HomeAway: any[],
    last10Team: any[],
    trends: any[]
}