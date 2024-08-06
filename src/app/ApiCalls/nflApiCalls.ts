//import { DbNflPlayerInfo } from '../../shared/dbTasks/DbNflPlayerInfo';
//import { NflService } from '../Services/NflService';
import { NflService } from '../Services/NflService';
import { reusedFunctions } from '../Services/reusedFunctions';

export class nflApiController{



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
        console.log(result)


        //return NflService.convertGameSummaryToDb(processedResponse)
    
    }

    static async loadNflTeamINfo(){
        const url = 'https://nfl-api-data.p.rapidapi.com/nfl-team-list';
        const options = {
	            method: 'GET',
	            headers: {
		            'x-rapidapi-key': '' + process.env['nflApiKey'],
		            'x-rapidapi-host': 'nfl-api-data.p.rapidapi.com'
	            }
            };

	        const response = await fetch(url, options);
	        const result = await response.json();
            return NflService.convertTeamInfoToDb(result)
    }

}