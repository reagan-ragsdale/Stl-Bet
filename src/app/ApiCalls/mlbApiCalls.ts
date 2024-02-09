import { PlayerInfoMlb } from '../../shared/dbTasks/DbMlbPlayerInfo';
import { MlbService } from '../Services/MlbService';
import { reusedFunctions } from '../Services/reusedFunctions';



export class mlbApiController {



    static async getAllMlbPlayers() {
        console.log("here in player mlb api call")
        const url = 'https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBPlayerList';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'b66301c5cdmsh89a2ce517c0ca87p1fe140jsne708007ee552',
                'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
            }
        };


        const response = await fetch(url, options);
        const result = await response.json();
        
        const processedResult = result.body
        console.log(processedResult)
        return MlbService.mlbConvertPlayerInfoFromApiToDb(processedResult)
    }

    static async getPlayerGameStats(playerId: number, season: number) {
        const url = `https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBGamesForPlayer?playerID=${playerId}&season=${season}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'b66301c5cdmsh89a2ce517c0ca87p1fe140jsne708007ee552',
                'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
            }
        };


        const response = await fetch(url, options);
        const result = await response.json();
        const processedResult = result.body

        return MlbService.mlbConvertPlayerGameStatsFromApiToDb(processedResult)



    }

}