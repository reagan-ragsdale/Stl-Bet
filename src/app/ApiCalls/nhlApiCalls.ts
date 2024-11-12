



import { DbPlayerInfo } from '../../shared/dbTasks/DbPlayerInfo';
import { DbNhlPlayerGameStats } from '../../shared/dbTasks/DbNhlPlayerGameStats';
import { NhlService } from '../Services/NhlService';
import { DbTeamInfo } from 'src/shared/dbTasks/DBTeamInfo';


export class nhlApiController {


  static async getPlayerInfo(): Promise<DbPlayerInfo[]> {
    const url = 'https://tank01-nhl-live-in-game-real-time-statistics-nhl.p.rapidapi.com/getNHLPlayerList';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '' + process.env['nhlApiKey'],
        'x-rapidapi-host': 'tank01-nhl-live-in-game-real-time-statistics-nhl.p.rapidapi.com'
      }
    };

    const response = await fetch(url, options);
    const result = await response.json();
    const processedResponse = result.body;
    return NhlService.convertPlayerInfoToDb(processedResponse)
  }


  static async getDailySchedule(date: string) {
    const url = `https://tank01-nhl-live-in-game-real-time-statistics-nhl.p.rapidapi.com/getNHLGamesForDate?gameDate=${date}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '' + process.env['nhlApiKey'],
        'x-rapidapi-host': 'tank01-nhl-live-in-game-real-time-statistics-nhl.p.rapidapi.com'
      }
    };

    const response = await fetch(url, options);
    const result = await response.json();
    const processedResponse = result.body;
    return NhlService.convertSchedule(processedResponse)
  }

  static async getGameStats(gameId: string): Promise<any[]> {
    const url = `https://tank01-nhl-live-in-game-real-time-statistics-nhl.p.rapidapi.com/getNHLBoxScore?gameID=${gameId}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '' + process.env['nhlApiKey'],
        'x-rapidapi-host': 'tank01-nhl-live-in-game-real-time-statistics-nhl.p.rapidapi.com'
      }
    };
    const response = await fetch(url, options);
    const result = await response.json();
    const processedResponse = result.body;
    console.log(processedResponse)
    return NhlService.convertGameAndPlayerStatsToDb(processedResponse)
  }

  static async getTeamInfo(): Promise<DbTeamInfo[]> {
    const url = 'https://tank01-nhl-live-in-game-real-time-statistics-nhl.p.rapidapi.com/getNHLTeams?teamStats=true&topPerformers=true&includeDefunctTeams=false';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'b66301c5cdmsh89a2ce517c0ca87p1fe140jsne708007ee552',
        'x-rapidapi-host': 'tank01-nhl-live-in-game-real-time-statistics-nhl.p.rapidapi.com'
      }
    };

    const response = await fetch(url, options);
    const result = await response.json();
    const processedResponse = result.body;
    return NhlService.convertTeamInfoToDb(processedResponse)

  }


   
}