import { Injectable } from '@angular/core';
import { NbaPlayerInfoDb } from 'src/shared/dbTasks/NbaPlayerInfoDb';
import { SportsNameToId } from '../sports-name-to-id';

@Injectable()
export class apiController {
arrayOfNBATeams: SportsNameToId = { Atlanta_Hawks: 1, Boston_Celtics: 2, Brooklyn_Nets: 4, Charlotte_Hornets: 5, Chicago_Bulls: 6, Cleveland_Cavaliers: 7, Dallas_Mavericks: 8, Denver_Nuggets: 9, Detroit_Pistons: 10, Golden_State_Warriors: 11, Houston_Rockets: 14, Indiana_Pacers: 15, LA_Clippers: 16, Los_Angeles_Lakers: 17, Memphis_Grizzlies: 19, Miami_Heat: 20, Milwaukee_Bucks: 21, Minnesota_Timberwolves: 22, New_Orleans_Pelicans: 23, New_York_Knicks: 24, Oklahoma_City_Thunder: 25, Orlando_Magic: 26, Philadelphia_76ers: 27, Phoenix_Suns: 28, Portland_Trail_Blazers: 29, Sacramento_Kings: 30, San_Antonio_Spurs: 31, Toronto_Raptors: 38, Utah_Jazz: 40, Washington_Wizards: 41}


async getNbaPlayerDataFromApi(games: string): Promise<NbaPlayerInfoDb[]>{
    var gameArray = this.splitGameString(games)
    var temp: NbaPlayerInfoDb[] = []
    for(let i = 0; i < gameArray.length; i++){
        let teamId = this.arrayOfNBATeams[this.addUnderScoreToName(gameArray[i])]
        const url = `https://api-nba-v1.p.rapidapi.com/players?team=${teamId}&season=2023`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'b66301c5cdmsh89a2ce517c0ca87p1fe140jsne708007ee552',
                'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
            }
        };
        
        try {
            const response = await fetch(url, options);
            const result = await response.json();
            const processedResult = result.response
            
            processedResult.forEach((e: any) => {
                temp.push({
                    playerId: e.id,
                    playerName: e.firstname + " " + e.lastname,
                    teamId: teamId
                })
            })

        } catch (error) {
            console.error(error);
        }
    }
    return temp;
    
   
}

splitGameString(game: string): string[]{
    var bothGames: string[] = []
    var temp = ''
    var vsIndex = 0;
    vsIndex = game.indexOf("vs")
    bothGames.push(game.slice(0, vsIndex - 1))
    bothGames.push(game.slice(vsIndex + 3, game.length))
    return bothGames
}

addUnderScoreToName(game: string): string {
    game = game.replaceAll(" ", "_")
    return game;
}
    
}