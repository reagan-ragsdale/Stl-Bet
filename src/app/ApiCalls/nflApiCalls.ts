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


    static async getGameSummary(gameId: string) {
        const url = `https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLBoxScore?gameID=${gameId}%40BUF&playByPlay=false&fantasyPoints=false&twoPointConversions=2&passYards=.04&passAttempts=0&passTD=4&passCompletions=0&passInterceptions=-2&pointsPerReception=.5&carries=.2&rushYards=.1&rushTD=6&fumbles=-2&receivingYards=.1&receivingTD=6&targets=0&defTD=6&fgMade=3&fgMissed=-3&xpMade=1&xpMissed=-1`;
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
        return NflService.convertGameSummaryToDb(processedResponse)

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
        const url = `https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLGamesForWeek?week=all&seasonType=reg&season=${year}`;
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
        return NflService.convertGameIdsToArray(processedResponse)
    }


}