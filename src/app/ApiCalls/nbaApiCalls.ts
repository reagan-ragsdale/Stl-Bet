import { NbaPlayerInfoDb } from '../../shared/dbTasks/NbaPlayerInfoDb';
import { SportsNameToId } from '../sports-name-to-id';
import { DbNbaGameStats } from '../../shared/dbTasks/DbNbaGameStats';
import { NbaController } from '../../shared/Controllers/NbaController';
import { ArrayOfDates } from '../array-of-dates';
import { DbNbaTeamGameStats } from '../../shared/dbTasks/DbNbaTeamGameStats'
import { NbaService } from '../Services/NbaService';
import { reusedFunctions } from '../Services/reusedFunctions';


//const newNbaService = new NbaService(new nbaApiController)


export class nbaApiController {
  
  static arrayOfNBATeams: SportsNameToId = { Atlanta_Hawks: 1, Boston_Celtics: 2, Brooklyn_Nets: 4, Charlotte_Hornets: 5, Chicago_Bulls: 6, Cleveland_Cavaliers: 7, Dallas_Mavericks: 8, Denver_Nuggets: 9, Detroit_Pistons: 10, Golden_State_Warriors: 11, Houston_Rockets: 14, Indiana_Pacers: 15, Los_Angeles_Clippers: 16, Los_Angeles_Lakers: 17, Memphis_Grizzlies: 19, Miami_Heat: 20, Milwaukee_Bucks: 21, Minnesota_Timberwolves: 22, New_Orleans_Pelicans: 23, New_York_Knicks: 24, Oklahoma_City_Thunder: 25, Orlando_Magic: 26, Philadelphia_76ers: 27, Phoenix_Suns: 28, Portland_Trail_Blazers: 29, Sacramento_Kings: 30, San_Antonio_Spurs: 31, Toronto_Raptors: 38, Utah_Jazz: 40, Washington_Wizards: 41 }
  static arrayOfDates: ArrayOfDates = { 1: 31, 2: 29, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31 }
  static arrayOfNbaTeamIds: number[] = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 38, 40, 41]
  static nbaPlayerStatData: DbNbaGameStats[] = []
  static playerStatData: any[] = []
  static nbaTeamGameStats: any[] = []
  static nbaTeamGameStatsDb: DbNbaTeamGameStats[] = []

  
  
  

  static async getNbaPlayerDataFromApi(games: string): Promise<NbaPlayerInfoDb[]> {

    var gameArray = this.splitGameString(games)
    var temp: NbaPlayerInfoDb[] = []
    for (let i = 0; i < gameArray.length; i++) {
      //console.time("get nba player data from api")
      let teamId = this.arrayOfNBATeams[reusedFunctions.addUnderScoreToName(gameArray[i])]
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
          if (e.firstname.includes("Jr.")) {
            e.firstname = e.firstname.replace("Jr.", "")
            e.firstname = e.firstname.trim()
            e.lastname += " Jr"
          }

          if (e.firstname.includes("II")) {
            e.firstname = e.firstname.replace("II", "")
            e.firstname = e.firstname.trim()
            e.lastname += " II"
          }
          if (e.firstname.includes("III")) {
            e.firstname = e.firstname.replace("III", "")
            e.firstname = e.firstname.trim()
            e.lastname += " III"
          }
          if (e.firstname.includes("IV")) {
            e.firstname = e.firstname.replace("IV", "")
            e.firstname = e.firstname.trim()
            e.lastname += " IV"
          }
          if (e.lastname.toLowerCase() == "claxton" && e.firstname.toLowerCase() == "nic") {
            e.firstname = "Nicolas"
          }
          if (e.lastname.toLowerCase() == "thomas" && e.firstname.toLowerCase() == "cam") {
            e.firstname = "Cameron"
          }
          var playerName = e.firstname + " " + e.lastname
          if (playerName.includes(".")) {
            playerName = playerName.replaceAll(".", "")
          }

          if (playerName == "Taj Gibson" && teamId == 41) {
            return
          }
          if (playerName == "Jeremiah Robinson-Earl" && teamId == 25) {
            return
          }
          if (playerName == "Nicolas Batum" && teamId == 16) {
            return
          }
          if (playerName == "Daniel Theis" && teamId == 15) {
            return
          }
          if (playerName == "Kenyon Martin Jr" && teamId == 16) {
            return
          }
          if (playerName == "Filip Petrusev" && (teamId == 16 || teamId == 27)) {
            return
          }
          if (playerName == "Robert Covington" && teamId == 16) {
            return
          }
          if (playerName == "Jaylen Nowell" && teamId == 30) {
            return
          }
          if (playerName == "Kevin Knox II" && teamId == 29) {
            return
          }
          if (playerName == "Matt Ryan" && teamId == 22) {
            return
          }
          if (playerName == "Drew Peterson" && teamId == 20) {
            return
          }
          if (playerName == "PJ Tucker" && teamId == 27) {
            return
          }


          temp.push({
            playerId: e.id,
            playerName: playerName,
            teamId: teamId
          })
        })

      } catch (error) {
        console.error(error);
      }
      //console.timeEnd("get nba player data from api")
    }

    return temp;


  }

  static async getAllNbaPlayerInfoFromApi(): Promise<NbaPlayerInfoDb[]> {

    var temp: NbaPlayerInfoDb[] = []
    for (let i = 0; i < this.arrayOfNbaTeamIds.length; i++) {
      const url = `https://api-nba-v1.p.rapidapi.com/players?team=${this.arrayOfNbaTeamIds[i]}&season=2023`;
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
          if (e.firstname.includes("Jr.")) {
            e.firstname = e.firstname.replace("Jr.", "")
            e.firstname = e.firstname.trim()
            e.lastname += " Jr"
          }

          if (e.firstname.includes("III")) {
            e.firstname = e.firstname.replace("III", "")
            e.firstname = e.firstname.trim()
            e.lastname += " III"
          }
          if (e.firstname.includes("II")) {
            e.firstname = e.firstname.replace("II", "")
            e.firstname = e.firstname.trim()
            e.lastname += " II"
          }

          if (e.firstname.includes("IV")) {
            e.firstname = e.firstname.replace("IV", "")
            e.firstname = e.firstname.trim()
            e.lastname += " IV"
          }
          if (e.lastname.toLowerCase() == "claxton" && e.firstname.toLowerCase() == "nic") {
            e.firstname = "Nicolas"
          }

          if (e.lastname.toLowerCase() == "thomas" && e.firstname.toLowerCase() == "cam") {
            e.firstname = "Cameron"
          }
          var playerName = e.firstname + " " + e.lastname
          if (playerName.includes(".")) {
            playerName = playerName.replaceAll(".", "")
          }

          if(playerName == "Kevin Knox II"){
            playerName = "Kevin Knox";
          }

          if (playerName == "Taj Gibson" && this.arrayOfNbaTeamIds[i] == 41) {
            return
          }
          if (playerName == "Jeremiah Robinson-Earl" && this.arrayOfNbaTeamIds[i] == 25) {
            return
          }
          if (playerName == "Nicolas Batum" && this.arrayOfNbaTeamIds[i] == 16) {
            return
          }
          if (playerName == "Daniel Theis" && this.arrayOfNbaTeamIds[i] == 15) {
            return
          }
          if (playerName == "Kenyon Martin Jr" && this.arrayOfNbaTeamIds[i] == 16) {
            return
          }
          if (playerName == "Filip Petrusev" && (this.arrayOfNbaTeamIds[i] == 16 || this.arrayOfNbaTeamIds[i] == 27)) {
            return
          }
          if (playerName == "Robert Covington" && this.arrayOfNbaTeamIds[i] == 16) {
            return
          }
          if (playerName == "Jaylen Nowell" && this.arrayOfNbaTeamIds[i] == 30) {
            return
          }
          if (playerName == "Kevin Knox II" && this.arrayOfNbaTeamIds[i] == 29) {
            return
          }
          if (playerName == "Matt Ryan" && this.arrayOfNbaTeamIds[i] == 22) {
            return
          }
          if (playerName == "Drew Peterson" && this.arrayOfNbaTeamIds[i] == 20) {
            return
          }
          if (playerName == "PJ Tucker" && this.arrayOfNbaTeamIds[i] == 27) {
            return
          }


          temp.push({
            playerId: e.id,
            playerName: playerName,
            teamId: this.arrayOfNbaTeamIds[i]
          })
        })

      } catch (error) {
        console.error(error);
      }
    }

    return temp;


  }



  static async loadNba2022PlayerStatData(id: number) {
    //console.time("load nba 2022 player stat data")
    const url = `https://api-nba-v1.p.rapidapi.com/players/statistics?id=${id}&season=2022`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'b66301c5cdmsh89a2ce517c0ca87p1fe140jsne708007ee552',
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
      }
    };
    const promise = await fetch(url, options);
    const processedResponse = await promise.json();
    this.playerStatData = processedResponse.response;
    await NbaService.convertNbaStatDataToInterface(id, 2022, this.playerStatData).then(items => this.nbaPlayerStatData = items);
    //console.timeEnd("load nba 2022 player stat data")
    return this.nbaPlayerStatData;

  }
  static async loadNba2023PlayerStatData(id: number) {

    //console.time("load nba 2023 player stat data")
    const url = `https://api-nba-v1.p.rapidapi.com/players/statistics?id=${id}&season=2023`;

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'b66301c5cdmsh89a2ce517c0ca87p1fe140jsne708007ee552',
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
      }
    };

    const promise = await fetch(url, options);
    const processedResponse = await promise.json();
    this.playerStatData = processedResponse.response;
    console.log("In api call")
    this.nbaPlayerStatData = await NbaService.convertNbaStatDataToInterface(id, 2023, this.playerStatData)
    //console.timeEnd("load nba 2023 player stat data")
    return this.nbaPlayerStatData;

  }

  

  static async loadGameFromId(id: number) {
    //console.time("loadGameFromId")
    const url = `https://api-nba-v1.p.rapidapi.com/games?id=${id}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'b66301c5cdmsh89a2ce517c0ca87p1fe140jsne708007ee552',
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
      }
    };
    const response = await fetch(url, options);
    const result = await response.json();
    //console.timeEnd("loadGameFromId")
    return result.response[0]

  }

  static async loadTeamGameStats(id: number, season: number) {
    const url = `https://api-nba-v1.p.rapidapi.com/games?season=${season}&team=${id}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'b66301c5cdmsh89a2ce517c0ca87p1fe140jsne708007ee552',
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
      }
    };

    const response = await fetch(url, options);
    const result = await response.json();
    this.nbaTeamGameStats = result.response
    this.nbaTeamGameStatsDb = await NbaService.convertNbaGameDataToInterface(id, season, this.nbaTeamGameStats)
    return this.nbaTeamGameStatsDb


  }

  



 


  static splitGameString(game: string): string[] {
    var bothGames: string[] = []
    var temp = ''
    var vsIndex = 0;
    vsIndex = game.indexOf("vs")
    bothGames.push(game.slice(0, vsIndex - 1))
    bothGames.push(game.slice(vsIndex + 3, game.length))
    return bothGames
  }

  

  

}