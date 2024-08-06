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

        for(let team of teamInfo.teams){
            finalTeamInfo.push({
                teamId: team.id,
                teamNameAbvr: team.abbreviation,
                teamNameFull: team.displayName,
                sport: 'NFL'
            })
        }

        return finalTeamInfo
    }
}