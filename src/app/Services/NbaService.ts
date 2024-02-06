import { DbNbaPlayerStatAverages } from "../../shared/dbTasks/DbNbaPlayerStatAverages"
import { DbNbaGameStats } from "../../shared/dbTasks/DbNbaGameStats"
import { DbNbaTeamGameStats } from "../../shared/dbTasks/DbNbaTeamGameStats"
import { DbNbaTeamStatAverages } from "../../shared/dbTasks/DbNbaTeamStatAverages"
import { NbaController } from "../../shared/Controllers/NbaController"
import { reusedFunctions } from "./reusedFunctions"
import { nbaApiController } from "../ApiCalls/nbaApiCalls"


const newResusedFunctions = new reusedFunctions
const newNbaApiController = new nbaApiController


export class NbaService{

   

    convertPlayerStatDataToPlayerStatAverageData(statData: DbNbaGameStats[]) : DbNbaPlayerStatAverages {
        var dataAverage: DbNbaPlayerStatAverages = {
            playerId: 0,
            playerName: "",
            teamName: "",
            teamId: 0,
            season: 0,
            assists: 0,
            points: 0,
            fgp: 0,
            ftp: 0,
            tpp: 0,
            offReb: 0,
            defReb: 0,
            totReb: 0,
            pFouls: 0,
            steals: 0,
            turnover: 0,
            blocks: 0,
            doubleDouble: 0,
            tripleDouble: 0
        }
        statData.forEach(game => {
        
            dataAverage.playerId = game.playerId,
            dataAverage.playerName = game.playerName,
            dataAverage.teamName = game.teamName,
            dataAverage.teamId = game.teamId,
            dataAverage.season = game.season,
            dataAverage.assists += game.assists,
            dataAverage.points += game.points,
            dataAverage.fgp += game.fgp,
            dataAverage.ftp += game.ftp,
            dataAverage.tpp += game.tpp,
            dataAverage.offReb += game.offReb, 
            dataAverage.defReb += game.defReb,
            dataAverage.totReb += game.totReb,
            dataAverage.pFouls += game.pFouls,
            dataAverage.steals += game.steals,
            dataAverage.turnover += game.turnover,
            dataAverage.blocks += game.blocks,
            dataAverage.doubleDouble += game.doubleDouble,
            dataAverage.tripleDouble += game.tripleDouble
        })
        var FinalAverageData: DbNbaPlayerStatAverages = {
            playerId: dataAverage.playerId,
            playerName: dataAverage.playerName,
            teamName: dataAverage.teamName,
            teamId: dataAverage.teamId,
            season: dataAverage.season,
            assists: dataAverage.assists/statData.length,
            points: dataAverage.points/statData.length,
            fgp: dataAverage.fgp/statData.length,
            ftp: dataAverage.ftp/statData.length,
            tpp: dataAverage.tpp/statData.length,
            offReb: dataAverage.offReb/statData.length, 
            defReb: dataAverage.defReb/statData.length,
            totReb: dataAverage.totReb/statData.length,
            pFouls: dataAverage.pFouls/statData.length,
            steals: dataAverage.steals/statData.length,
            turnover: dataAverage.turnover/statData.length,
            blocks: dataAverage.blocks/statData.length,
            doubleDouble: dataAverage.doubleDouble/statData.length,
            tripleDouble: dataAverage.tripleDouble/statData.length
        }
        return FinalAverageData
    }


    convertTeamStatDataToPlayerStatAverageData(statData: DbNbaTeamGameStats[]) : DbNbaTeamStatAverages {
        var dataAverage: DbNbaTeamStatAverages = {
            teamName: "",
            teamId: 0,
            season: 0,
            wins: 0,
            losses: 0,
            pointsScored: 0,
            pointsAllowed: 0,
            
        }
        statData.forEach(game => {
            dataAverage.teamName = game.teamName,
            dataAverage.teamId = game.teamId,
            dataAverage.season = game.season,
            dataAverage.wins += game.result == "Win" ? 1 : 0,
            dataAverage.losses += game.result == "Loss" ? 1 : 0,
            dataAverage.pointsScored += game.pointsScoredOverall,
            dataAverage.pointsAllowed += game.pointsAllowedOverall
        })
        var FinalAverageData: DbNbaTeamStatAverages = {
            teamName: dataAverage.teamName,
            teamId: dataAverage.teamId,
            season: dataAverage.season,
            wins: dataAverage.wins,
            losses: dataAverage.losses,
            pointsScored: dataAverage.pointsScored/statData.length,
            pointsAllowed: dataAverage.pointsAllowed/statData.length
        }
        return FinalAverageData
    }

    async convertNbaStatDataToInterface(id: number, season: number, playerStatData: any[]) {
        //console.time("convertNbaStatDataToInterface")
        var temp: DbNbaGameStats[] = []
        var games = await NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(id, season)
        var oldGames = games.map((x) => {
          return x.gameId
        })
        for (let i = 0; i < playerStatData.length; i++) {
          if (playerStatData[i].game.id >= 12478 && playerStatData[i].game.id <= 12548) {
            continue
          }
          console.log(oldGames.includes(playerStatData[i].game.id))
          if (oldGames.includes(playerStatData[i].game.id)) {
            continue
          }
          var game = await newNbaApiController.loadGameFromId(playerStatData[i].game.id)
          temp.push({
            playerId: playerStatData[i].player.id,
            playerName: playerStatData[i].player.firstname + " " + playerStatData[i].player.lastname,
            teamName: playerStatData[i].team.name,
            teamId: playerStatData[i].team.id,
            teamAgainstName: newResusedFunctions.arrayOfNBATeams[newResusedFunctions.addUnderScoreToName(game.teams.visitors.name)] == playerStatData[i].team.id ? game.teams.home.name : game.teams.visitors.name,
            teamAgainstId: newResusedFunctions.arrayOfNBATeams[newResusedFunctions.addUnderScoreToName(game.teams.visitors.name)] == playerStatData[i].team.id ? game.teams.home.id : game.teams.visitors.id,
            homeOrAway: newResusedFunctions.arrayOfNBATeams[newResusedFunctions.addUnderScoreToName(game.teams.visitors.name)] == playerStatData[i].team.id ? "Away" : "Home",
            season: season,
            gameId: playerStatData[i].game.id,
            gameDate: newResusedFunctions.convertDate(game.date.start),
            playerStarted: playerStatData[i].min != "00:00" ? "Y" : "N",
            assists: playerStatData[i].assists,
            points: playerStatData[i].points,
            fgm: playerStatData[i].fgm,
            fga: playerStatData[i].fga,
            fgp: parseInt(playerStatData[i].fgp),
            ftm: playerStatData[i].ftm,
            fta: playerStatData[i].fta,
            ftp: parseInt(playerStatData[i].ftp),
            tpm: playerStatData[i].tpm,
            tpa: playerStatData[i].tpa,
            tpp: parseInt(playerStatData[i].tpp),
            offReb: playerStatData[i].offReb,
            defReb: playerStatData[i].defReb,
            totReb: playerStatData[i].totReb,
            pFouls: playerStatData[i].pFouls,
            steals: playerStatData[i].steals,
            turnover: playerStatData[i].turnovers,
            blocks: playerStatData[i].blocks,
            doubleDouble: this.isDoubleDouble(playerStatData[i]) ? 1 : 0,
            tripleDouble: this.isTripleDouble(playerStatData[i]) ? 1 : 0
          })
    
        }
        //console.timeEnd("convertNbaStatDataToInterface")
        return temp
      }


      async convertNbaGameDataToInterface(id: number, season: number, teamStatData: any[]) {
        var temp: DbNbaTeamGameStats[] = []
        var games = await NbaController.nbaLoadTeamGameStatsByTeamIdAndSeason(id, season)
        var oldGames = games.map((x) => {
          return x.gameId
        })
        for (let i = 0; i < teamStatData.length; i++) {
          if (teamStatData[i].id <= 12548) {
            continue
          }
          if (oldGames.includes(teamStatData[i].id)) {
            continue
          }
          if (teamStatData[i].status.long == "Scheduled") {
            continue
          }
          if (teamStatData[i].status.long == "In Play") {
            continue
          }
    
          temp.push({
            teamName: teamStatData[i].teams.visitors.id == id ? teamStatData[i].teams.visitors.name : teamStatData[i].teams.home.name,
            teamId: id,
            teamAgainstName: teamStatData[i].teams.visitors.id == id ? teamStatData[i].teams.home.name : teamStatData[i].teams.visitors.name,
            teamAgainstId: teamStatData[i].teams.visitors.id == id ? teamStatData[i].teams.home.id : teamStatData[i].teams.visitors.id,
            homeOrAway: teamStatData[i].teams.visitors.id == id ? "Away" : "Home",
            season: season,
            gameId: teamStatData[i].id,
            gameDate: newResusedFunctions.convertDate(teamStatData[i].date.start),
            result: teamStatData[i].teams.visitors.id == id ? (teamStatData[i].scores.visitors.points > teamStatData[i].scores.home.points) ? "Win" : "Loss" : (teamStatData[i].scores.home.points > teamStatData[i].scores.visitors.points ? "Win" : "Loss"),
            pointsScoredOverall: teamStatData[i].teams.visitors.id == id ? teamStatData[i].scores.visitors.points : teamStatData[i].scores.home.points,
            pointsScoredFirstQuarter: teamStatData[i].teams.visitors.id == id ? teamStatData[i].scores.visitors.linescore[0] : teamStatData[i].scores.home.linescore[0],
            pointsScoredSecondQuarter: teamStatData[i].teams.visitors.id == id ? teamStatData[i].scores.visitors.linescore[1] : teamStatData[i].scores.home.linescore[1],
            pointsScoredThirdQuarter: teamStatData[i].teams.visitors.id == id ? teamStatData[i].scores.visitors.linescore[2] : teamStatData[i].scores.home.linescore[2],
            pointsScoredFourthQuarter: teamStatData[i].teams.visitors.id == id ? teamStatData[i].scores.visitors.linescore[3] : teamStatData[i].scores.home.linescore[3],
            pointsAllowedOverall: teamStatData[i].teams.visitors.id == id ? teamStatData[i].scores.home.points : teamStatData[i].scores.visitors.points,
            pointsAllowedFirstQuarter: teamStatData[i].teams.visitors.id == id ? teamStatData[i].scores.home.linescore[0] : teamStatData[i].scores.visitors.linescore[0],
            pointsAllowedSecondQuarter: teamStatData[i].teams.visitors.id == id ? teamStatData[i].scores.home.linescore[1] : teamStatData[i].scores.visitors.linescore[1],
            pointsAllowedThirdQuarter: teamStatData[i].teams.visitors.id == id ? teamStatData[i].scores.home.linescore[2] : teamStatData[i].scores.visitors.linescore[2],
            pointsAllowedFourthQuarter: teamStatData[i].teams.visitors.id == id ? teamStatData[i].scores.home.linescore[3] : teamStatData[i].scores.visitors.linescore[3]
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





}