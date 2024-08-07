//import { DbNflPlayerInfo } from '../../shared/dbTasks/DbNflPlayerInfo';
//import { NflService } from '../Services/NflService';
import { MlbService } from '../Services/MlbService';
import { NflService } from '../Services/NflService';
import { reusedFunctions } from '../Services/reusedFunctions';

export class nflApiController {



    // going to need to get the list of games per week from nfl-weeks-events
    // then loop thorugh each of those games calling the nfl-gamesummary
    // that endpoint has all the team and player stats
    // loop thorugh each game adding team and player

    //call the player info endpoint to get active player list and add to ploayer info


    static async getGameSummary(gameId: number) {
        const url = 'https://nfl-api-data.p.rapidapi.com/nfl-gamesummary?id=401437954';
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '' + process.env['nflApiKey'],
                'x-rapidapi-host': 'nfl-api-data.p.rapidapi.com'
            }

        };
        const response = await fetch(url, options);
        const result = await response.json();
        return NflService.convertGameSummaryToDb(result)

    }

    static async loadNflTeamINfo() {
        const url = 'https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLTeams?rosters=false&schedules=false&topPerformers=false&teamStats=false&teamStatsSeason=2023';
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '' + process.env['nflApiKey'],
                'x-rapidapi-host': 'tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com'
            }
        };


        const response = await fetch(url, options);
        const result = await response.json();
        const processedResponse = result.body;
        return NflService.convertTeamInfoToDb(processedResponse)
    }

    static async loadAllNflGameIds(year: number) {
        const url = `https://nfl-api-data.p.rapidapi.com/nfl-events?year=${year}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '' + process.env['nflApiKey'],
                'x-rapidapi-host': 'nfl-api-data.p.rapidapi.com'
            }
        };


        const response = await fetch(url, options);
        const result = await response.json();
        return NflService.convertGameIdsToArray(result)
    }


}