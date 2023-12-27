import { Injectable } from '@angular/core';
import { NbaPlayerInfoDb } from 'src/shared/dbTasks/NbaPlayerInfoDb';
import { SportsNameToId } from '../sports-name-to-id';
import { DbNbaGameStats } from 'src/shared/dbTasks/DbNbaGameStats';
import { NbaController } from 'src/shared/Controllers/NbaController';
import { ArrayOfDates } from '../array-of-dates';
import { DbNbaTeamGameStats } from 'src/shared/dbTasks/DbNbaTeamGameStats';

@Injectable()
export class nbaApiController {
  arrayOfNBATeams: SportsNameToId = { Atlanta_Hawks: 1, Boston_Celtics: 2, Brooklyn_Nets: 4, Charlotte_Hornets: 5, Chicago_Bulls: 6, Cleveland_Cavaliers: 7, Dallas_Mavericks: 8, Denver_Nuggets: 9, Detroit_Pistons: 10, Golden_State_Warriors: 11, Houston_Rockets: 14, Indiana_Pacers: 15, Los_Angeles_Clippers: 16, Los_Angeles_Lakers: 17, Memphis_Grizzlies: 19, Miami_Heat: 20, Milwaukee_Bucks: 21, Minnesota_Timberwolves: 22, New_Orleans_Pelicans: 23, New_York_Knicks: 24, Oklahoma_City_Thunder: 25, Orlando_Magic: 26, Philadelphia_76ers: 27, Phoenix_Suns: 28, Portland_Trail_Blazers: 29, Sacramento_Kings: 30, San_Antonio_Spurs: 31, Toronto_Raptors: 38, Utah_Jazz: 40, Washington_Wizards: 41 }
  arrayOfDates: ArrayOfDates = { 1: 31, 2: 29, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31 }
  arrayOfNbaTeamIds: number[] = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 38, 40, 41]
  nbaPlayerStatData: DbNbaGameStats[] = []
  playerStatData: any[] = []
  nbaTeamGameStats: any[] = []
  nbaTeamGameStatsDb: DbNbaTeamGameStats[] = []

  async getNbaPlayerDataFromApi(games: string): Promise<NbaPlayerInfoDb[]> {

    var gameArray = this.splitGameString(games)
    var temp: NbaPlayerInfoDb[] = []
    for (let i = 0; i < gameArray.length; i++) {
      console.time("get nba player data from api")
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

          if(playerName == "Taj Gibson" && teamId == 41){
            return
          }
          if(playerName == "Jeremiah Robinson-Earl" && teamId == 25){
            return
          }
          if(playerName == "Nicolas Batum" && teamId == 16){
            return
          }
          if(playerName == "Daniel Theis" && teamId == 15){
            return
          }
          if(playerName == "Kenyon Martin Jr" && teamId == 16){
            return
          }
          if(playerName == "Filip Petrusev" && (teamId == 16 || teamId == 27)){
            return
          }
          if(playerName == "Robert Covington" && teamId == 16){
            return
          }
          if(playerName == "Jaylen Nowell" && teamId == 30){
            return
          }
          if(playerName == "Kevin Knox II" && teamId == 29){
            return
          }
          if(playerName == "Matt Ryan" && teamId == 22){
            return
          }
          if(playerName == "Drew Peterson" && teamId == 20){
            return
          }
          if(playerName == "PJ Tucker" && teamId == 27){
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
      console.timeEnd("get nba player data from api")
    }

    return temp;


  }

  async getAllNbaPlayerInfoFromApi(): Promise<NbaPlayerInfoDb[]> {

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

          if(playerName == "Taj Gibson" && this.arrayOfNbaTeamIds[i] == 41){
            return
          }
          if(playerName == "Jeremiah Robinson-Earl" && this.arrayOfNbaTeamIds[i] == 25){
            return
          }
          if(playerName == "Nicolas Batum" && this.arrayOfNbaTeamIds[i] == 16){
            return
          }
          if(playerName == "Daniel Theis" && this.arrayOfNbaTeamIds[i] == 15){
            return
          }
          if(playerName == "Kenyon Martin Jr" && this.arrayOfNbaTeamIds[i] == 16){
            return
          }
          if(playerName == "Filip Petrusev" && (this.arrayOfNbaTeamIds[i] == 16 || this.arrayOfNbaTeamIds[i] == 27)){
            return
          }
          if(playerName == "Robert Covington" && this.arrayOfNbaTeamIds[i] == 16){
            return
          }
          if(playerName == "Jaylen Nowell" && this.arrayOfNbaTeamIds[i] == 30){
            return
          }
          if(playerName == "Kevin Knox II" && this.arrayOfNbaTeamIds[i] == 29){
            return
          }
          if(playerName == "Matt Ryan" && this.arrayOfNbaTeamIds[i] == 22){
            return
          }
          if(playerName == "Drew Peterson" && this.arrayOfNbaTeamIds[i] == 20){
            return
          }
          if(playerName == "PJ Tucker" && this.arrayOfNbaTeamIds[i] == 27){
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



  async loadNba2022PlayerStatData(id: number) {
    console.time("load nba 2022 player stat data")
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
    await this.convertNbaStatDataToInterface(id, 2022).then(items => this.nbaPlayerStatData = items);
    console.timeEnd("load nba 2022 player stat data")
    return this.nbaPlayerStatData;

  }
  async loadNba2023PlayerStatData(id: number) {
    console.time("load nba 2023 player stat data")
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
    this.nbaPlayerStatData = await this.convertNbaStatDataToInterface(id, 2023)
    console.timeEnd("load nba 2023 player stat data")
    return this.nbaPlayerStatData;

  }

  async convertNbaStatDataToInterface(id: number, season: number) {
    console.time("convertNbaStatDataToInterface")
    var temp: DbNbaGameStats[] = []
    var games = await NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(id, season)
    var oldGames = games.map((x) => {
      return x.gameId
    })
    for (let i = 0; i < this.playerStatData.length; i++) {
      if (this.playerStatData[i].game.id >= 12478 && this.playerStatData[i].game.id <= 12548) {
        continue
      }
      console.log(oldGames.includes(this.playerStatData[i].game.id))
      if (oldGames.includes(this.playerStatData[i].game.id)) {
        continue
      }
      var game = await this.loadGameFromId(this.playerStatData[i].game.id)
      temp.push({
        playerId: this.playerStatData[i].player.id,
        playerName: this.playerStatData[i].player.firstname + " " + this.playerStatData[i].player.lastname,
        teamName: this.playerStatData[i].team.name,
        teamId: this.playerStatData[i].team.id,
        teamAgainstName: this.arrayOfNBATeams[this.addUnderScoreToName(game.teams.visitors.name)] == this.playerStatData[i].team.id ? game.teams.home.name : game.teams.visitors.name,
        teamAgainstId: this.arrayOfNBATeams[this.addUnderScoreToName(game.teams.visitors.name)] == this.playerStatData[i].team.id ? game.teams.home.id : game.teams.visitors.id,
        homeOrAway: this.arrayOfNBATeams[this.addUnderScoreToName(game.teams.visitors.name)] == this.playerStatData[i].team.id ? "Away" : "Home",
        season: season,
        gameId: this.playerStatData[i].game.id,
        gameDate: this.convertDate(game.date.start),
        playerStarted: this.playerStatData[i].min != "00:00" ? "Y" : "N",
        assists: this.playerStatData[i].assists,
        points: this.playerStatData[i].points,
        fgm: this.playerStatData[i].fgm,
        fga: this.playerStatData[i].fga,
        fgp: parseInt(this.playerStatData[i].fgp),
        ftm: this.playerStatData[i].ftm,
        fta: this.playerStatData[i].fta,
        ftp: parseInt(this.playerStatData[i].ftp),
        tpm: this.playerStatData[i].tpm,
        tpa: this.playerStatData[i].tpa,
        tpp: parseInt(this.playerStatData[i].tpp),
        offReb: this.playerStatData[i].offReb,
        defReb: this.playerStatData[i].defReb,
        totReb: this.playerStatData[i].totReb,
        pFouls: this.playerStatData[i].pFouls,
        steals: this.playerStatData[i].steals,
        turnover: this.playerStatData[i].turnovers,
        blocks: this.playerStatData[i].blocks,
        doubleDouble: this.isDoubleDouble(this.playerStatData[i]) ? 1 : 0,
        tripleDouble: this.isTripleDouble(this.playerStatData[i]) ? 1 : 0
      })

    }
    console.timeEnd("convertNbaStatDataToInterface")
    return temp
  }

  async loadGameFromId(id: number) {
    console.time("loadGameFromId")
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
    console.timeEnd("loadGameFromId")
    return result.response[0]

  }

  async loadTeamGameStats(id: number, season: number) {
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
    this.nbaTeamGameStatsDb = await this.convertNbaGameDataToInterface(id, season)
    return this.nbaTeamGameStatsDb


  }

  async convertNbaGameDataToInterface(id: number, season: number) { 
    var temp: DbNbaTeamGameStats[] = []
    var games = await NbaController.nbaLoadTeamGameStatsByTeamIdAndSeason(id, season)
    var oldGames = games.map((x) => {
      return x.gameId
    })
    for (let i = 0; i < this.nbaTeamGameStats.length; i++) {
      if (this.nbaTeamGameStats[i].id <= 12548) {
        continue
      }
      if (oldGames.includes(this.nbaTeamGameStats[i].id)) {
        continue
      }
      if(this.nbaTeamGameStats[i].status.long == "Scheduled"){
        continue
      }
      if(this.nbaTeamGameStats[i].status.long == "In Play"){
        continue
      }
      
      temp.push({
        teamName: this.nbaTeamGameStats[i].teams.visitors.id == id ? this.nbaTeamGameStats[i].teams.visitors.name : this.nbaTeamGameStats[i].teams.home.name,
        teamId: id,
        teamAgainstName: this.nbaTeamGameStats[i].teams.visitors.id == id ? this.nbaTeamGameStats[i].teams.home.name : this.nbaTeamGameStats[i].teams.visitors.name,
        teamAgainstId: this.nbaTeamGameStats[i].teams.visitors.id == id ? this.nbaTeamGameStats[i].teams.home.id : this.nbaTeamGameStats[i].teams.visitors.id,
        homeOrAway: this.nbaTeamGameStats[i].teams.visitors.id == id ? "Away" : "Home",
        season: season,
        gameId: this.nbaTeamGameStats[i].id,
        gameDate: this.convertDate(this.nbaTeamGameStats[i].date.start),
        result: this.nbaTeamGameStats[i].teams.visitors.id == id ? (this.nbaTeamGameStats[i].scores.visitors.points > this.nbaTeamGameStats[i].scores.home.points) ? "Win" : "Loss" : (this.nbaTeamGameStats[i].scores.home.points > this.nbaTeamGameStats[i].scores.visitors.points ? "Win" : "Loss"),
        pointsScoredOverall: this.nbaTeamGameStats[i].teams.visitors.id == id ? this.nbaTeamGameStats[i].scores.visitors.points : this.nbaTeamGameStats[i].scores.home.points,
        pointsScoredFirstQuarter: this.nbaTeamGameStats[i].teams.visitors.id == id ? this.nbaTeamGameStats[i].scores.visitors.linescore[0] : this.nbaTeamGameStats[i].scores.home.linescore[0],
        pointsScoredSecondQuarter: this.nbaTeamGameStats[i].teams.visitors.id == id ? this.nbaTeamGameStats[i].scores.visitors.linescore[1] : this.nbaTeamGameStats[i].scores.home.linescore[1],
        pointsScoredThirdQuarter: this.nbaTeamGameStats[i].teams.visitors.id == id ? this.nbaTeamGameStats[i].scores.visitors.linescore[2] : this.nbaTeamGameStats[i].scores.home.linescore[2],
        pointsScoredFourthQuarter: this.nbaTeamGameStats[i].teams.visitors.id == id ? this.nbaTeamGameStats[i].scores.visitors.linescore[3] : this.nbaTeamGameStats[i].scores.home.linescore[3],
        pointsAllowedOverall: this.nbaTeamGameStats[i].teams.visitors.id == id ? this.nbaTeamGameStats[i].scores.home.points : this.nbaTeamGameStats[i].scores.visitors.points,
        pointsAllowedFirstQuarter: this.nbaTeamGameStats[i].teams.visitors.id == id ? this.nbaTeamGameStats[i].scores.home.linescore[0] : this.nbaTeamGameStats[i].scores.visitors.linescore[0],
        pointsAllowedSecondQuarter: this.nbaTeamGameStats[i].teams.visitors.id == id ? this.nbaTeamGameStats[i].scores.home.linescore[1] : this.nbaTeamGameStats[i].scores.visitors.linescore[1],
        pointsAllowedThirdQuarter: this.nbaTeamGameStats[i].teams.visitors.id == id ? this.nbaTeamGameStats[i].scores.home.linescore[2] : this.nbaTeamGameStats[i].scores.visitors.linescore[2],
        pointsAllowedFourthQuarter: this.nbaTeamGameStats[i].teams.visitors.id == id ? this.nbaTeamGameStats[i].scores.home.linescore[3] : this.nbaTeamGameStats[i].scores.visitors.linescore[3]
      })

    }
    return temp
  }



  isDoubleDouble(statData: any): boolean {
    let count = 0;
    if (statData.assists >= 10) {
      count++
    }
    if (statData.points >= 10) {
      count++
    }
    if (statData.blocks >= 10) {
      count++
    }
    if (statData.steals >= 10) {
      count++
    }
    if (statData.totReb >= 10) {
      count++
    }
    return (count >= 2)
  }

  isTripleDouble(statData: any): boolean {
    let count = 0;
    if (statData.assists >= 10) {
      count++
    }
    if (statData.points >= 10) {
      count++
    }
    if (statData.blocks >= 10) {
      count++
    }
    if (statData.steals >= 10) {
      count++
    }
    if (statData.rebounds >= 10) {
      count++
    }

    return (count >= 3)
  }


  splitGameString(game: string): string[] {
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

  convertDate(fullDate: string) {
    console.log(fullDate)
    //mew
    var tempDate = fullDate?.split("T");
    console.log(tempDate)
    var time = tempDate[1].slice(0, 2)
    var subtractDay = false
    if (parseInt(time) - 6 <= 0) {
      subtractDay = true
    }

    var indexOfFirstDash = tempDate[0].indexOf("-");
    var tempDate2 = tempDate[0].slice(indexOfFirstDash + 1, tempDate[0].length + 1);
    var finalDate = tempDate2.replace("-", "/");
    if (subtractDay) {
      var newDate = finalDate.split("/")
      newDate[1] = (parseInt(newDate[1]) - 1).toString()
      if (parseInt(newDate[1]) < 10 && parseInt(newDate[1]) > 0) {
        newDate[1] = '0' + newDate[1]
      }
      if (parseInt(newDate[1]) == 0) {
        if (newDate[0] == '01') {
          newDate[0] = '12'
          newDate[1] = '31'
        }
        if (parseInt(newDate[0]) != 1) {
          newDate[0] = (parseInt(newDate[0]) - 1).toString()
          newDate[1] = this.arrayOfDates[parseInt(newDate[0])].toString()
        }

      }
      finalDate = newDate[0] + "/" + newDate[1]

    }

    return finalDate;
  }

}