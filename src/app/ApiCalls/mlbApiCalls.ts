import { DbMlbPlayerInfo } from '../../shared/dbTasks/DbMlbPlayerInfo';
import { MlbService } from '../Services/MlbService';
import { reusedFunctions } from '../Services/reusedFunctions';



export class mlbApiController {



    static async getAllMlbPlayers() {
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
        var finalReturn = MlbService.mlbConvertPlayerInfoFromApiToDb(processedResult)
        return finalReturn
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
        console.log("Here in api")
        return MlbService.mlbConvertPlayerGameStatsFromApiToDb(processedResult)







    }

    static async getTeamSchedule(teamId: number, season: number) {
        const url = `https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBTeamSchedule?teamID=${teamId}&season=${season}`;
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
        console.log("Here in api")
        return MlbService.mlbConvertTeamScheduleFromApiToDb(processedResult.schedule)
    }

     static async getTeamGameStats2023(game: string) {
        const url = `https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBBoxScore?gameID=${game}`;
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
        console.log("Here in api")
        return MlbService.mlbConvertTeamGameStatsFromApiToDb(processedResult)
    } 

    static async getMlbGamesScheduleByDate(gameDate: string) {
        const url = `https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBGamesForDate?gameDate=${gameDate}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'b66301c5cdmsh89a2ce517c0ca87p1fe140jsne708007ee552',
                'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            const processedResult = result.body
            return processedResult
        } catch (error) {
            console.error(error);
        }
    }

    static async getGameResults(gameId: string){
        const url = `https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBBoxScore?gameID=${gameId}`;
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
        return processedResult
    }

}