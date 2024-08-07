import { DbTeamInfo } from "src/shared/dbTasks/DBTeamInfo";


export class NflService{

    static async convertGameSummaryToDb(gameSummary: any): Promise<any[]> {
        let finalReturn: any[] = []

        for(let team of gameSummary.boxscore.teams){
            let teamName = team.team.abbreviation;
        }
        
        return finalReturn
    }

    static convertTeamInfoToDb(teamInfo: any): DbTeamInfo[]{
        let finalTeamInfo: DbTeamInfo[] = []

        for(let team of teamInfo){
            finalTeamInfo.push({
                teamId: team.teamID,
                teamNameAbvr: team.teamAbv,
                teamNameFull: team.teamCity + " " + team.teamName,
                sport: 'NFL'
            })
        }

        return finalTeamInfo
    }

    static convertGameIdsToArray(gameIds: any): number[]{
       let finalGameIds: number[] = []
        for(let gameId of gameIds.events){
            finalGameIds.push(gameId.id)
        }
        return finalGameIds
    }
}