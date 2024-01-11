

import { draftKingsApiController } from "./ApiCalls/draftKingsApiCalls"
import { nbaApiController } from "./ApiCalls/nbaApiCalls"
import { NbaController } from "../shared/Controllers/NbaController"
import { SportsBookController } from "../shared/Controllers/SportsBookController"
import { ArrayOfDates } from "./array-of-dates"
import { DbGameBookData } from "../shared/dbTasks/DbGameBookData"
import { NbaPlayerInfoDb } from "../shared/dbTasks/NbaPlayerInfoDb"
import { SportsNameToId } from "./sports-name-to-id"

const newDKController = new draftKingsApiController
const newNbaApiController = new nbaApiController

const arrayOfDates: ArrayOfDates = { 1: 31, 2: 29, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31 }
const arrayOfNBATeams: SportsNameToId = { Atlanta_Hawks: 1, Boston_Celtics: 2, Brooklyn_Nets: 4, Charlotte_Hornets: 5, Chicago_Bulls: 6, Cleveland_Cavaliers: 7, Dallas_Mavericks: 8, Denver_Nuggets: 9, Detroit_Pistons: 10, Golden_State_Warriors: 11, Houston_Rockets: 14, Indiana_Pacers: 15, Los_Angeles_Clippers: 16, Los_Angeles_Lakers: 17, Memphis_Grizzlies: 19, Miami_Heat: 20, Milwaukee_Bucks: 21, Minnesota_Timberwolves: 22, New_Orleans_Pelicans: 23, New_York_Knicks: 24, Oklahoma_City_Thunder: 25, Orlando_Magic: 26, Philadelphia_76ers: 27, Phoenix_Suns: 28, Portland_Trail_Blazers: 29, Sacramento_Kings: 30, San_Antonio_Spurs: 31, Toronto_Raptors: 38, Utah_Jazz: 40, Washington_Wizards: 41 }


export const cronTestFile = async () => {
    await loadNbaData()




    // this is going to run daily in the morning. I think it should call whichever games are slated for today in the sportsbookdb and for each of those teams,
    //pull the stats for each player and update it into the db

    // call the draft kings game and player props for the selected sport for that day and put it in the database
    // call the nba player info and load all the current player info into the database
    // the draft kings calls might not have the player props yet so just loop through each player for each team and call the stats and load into database


    //nba loads

    //get and load draft kings game props
    try{

    

    const gamesFromDraftKings = await newDKController.getDatesAndGames("NBA");

    await SportsBookController.addBookData(gamesFromDraftKings);


    console.log("Finished sports book load")

    // get and load all nba player info
    
    const allPlayerInfo = await newNbaApiController.getAllNbaPlayerInfoFromApi()
    NbaController.nbaAddPlayerInfoData(allPlayerInfo)

    console.log("Finished player info load")

    //retreive all the players for the teams playing this day
    var listOfGamesToday: DbGameBookData[] = await SportsBookController.loadSportBook("NBA")
    console.log(listOfGamesToday)
    listOfGamesToday = listOfGamesToday.filter(e => {
        convertDate(e.commenceTime) == getMonthAndDay()
    })
    console.log(listOfGamesToday)
    const uniqueListOfGamesToday: DbGameBookData[] = [...new Map(listOfGamesToday.map(game => [game['bookId'], game])).values()]
    console.log(uniqueListOfGamesToday)
    var listOfAllPlayersInGames: NbaPlayerInfoDb[] = []
    uniqueListOfGamesToday.forEach(async e => {
        var result = await NbaController.nbaLoadPlayerInfoFromTeamId(arrayOfNBATeams[addUnderScoreToName(e.homeTeam)])
        listOfAllPlayersInGames.concat(result)
        result = await NbaController.nbaLoadPlayerInfoFromTeamId(arrayOfNBATeams[addUnderScoreToName(e.awayTeam)])
        listOfAllPlayersInGames.concat(result)
    })
    console.log(listOfAllPlayersInGames)
    console.log("Line 69")
    //call each players stats api and update in database
    listOfAllPlayersInGames.forEach(async e => {
        const result = await newNbaApiController.loadNba2023PlayerStatData(e.playerId)
        await NbaController.nbaAddPlayerGameStats2023(result)

        var db2022 = await NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(e.playerId, 2022)
        if (db2022.length < 1) {
            const data2022 = await newNbaApiController.loadNba2022PlayerStatData(e.playerId)
            if (data2022.length > 0) {
                await NbaController.nbaAddPlayerGameStats2022(data2022)
            }
            else if (data2022.length == 0) {
                await NbaController.nbaAddPlayerStat2022BlankData(e.playerId, e.playerName)

            }
        }
    })
}catch(error: any){
    console.log(error)
}
console.log("line 90")   






}

var convertDate = (fullDate: string) => {
    let newFulDate = fullDate + ''
    var tempDate = newFulDate.split("T");
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
            if (parseInt(newDate[0]) == 1) {
                newDate[0] == '12'
                newDate[1] == '31'
            }
            if (parseInt(newDate[0]) != 1) {
                newDate[0] = (parseInt(newDate[0]) - 1).toString()
                newDate[1] = arrayOfDates[parseInt(newDate[0])].toString()
            }

        }
        finalDate = newDate[0] + "/" + newDate[1]

    }

    return finalDate;
}

var getMonthAndDay = () => {
    var d = new Date();
    var year = d.getFullYear().toString();
    var month = (d.getMonth() + 1).toString();
    if (month.length == 1) {
        month = "0" + month;
    }
    var day = d.getDate().toString();
    if (day.length == 1) {
        day = "0" + day;
    }
    var fullDate = month + "/" + day;
    return fullDate
}

var addUnderScoreToName = (game: string): string => {
    game = game.replaceAll(" ", "_")
    return game;




}

var loadNbaData = async () => {
    console.log("Running cron from different file")
}


