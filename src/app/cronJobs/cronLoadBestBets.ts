import { NflController } from "../../shared/Controllers/NflController"
import { PlayerPropController } from "../../shared/Controllers/PlayerPropController"
import { TeamInfoController } from "../../shared/Controllers/TeamInfoController"
import { reusedFunctions } from "../Services/reusedFunctions"
import { DbPlayerBestBets } from "../../shared/dbTasks/DBPlayerBestBets"
import { DbPlayerPropData } from "../../shared/dbTasks/DbPlayerPropData"
import { BestBetController } from "../../shared/Controllers/BestBetController"
import { NflService } from "../Services/NflService"
import { SportsBookController } from "../../shared/Controllers/SportsBookController"
import { DbGameBookData } from "../../shared/dbTasks/DbGameBookData"
import { remult } from "remult"



export const cronLoadBestBets = async () => {
    console.log("HEre is load best bets")
    let sports: string[] = ['NFL']
    let listOfPropsFinal: DbPlayerBestBets[] = []

    let listOfBetsToAdd: DbPlayerBestBets[] = []
    try {
        for (let sport of sports) {
            let playerProps = await PlayerPropController.loadAllCurrentPlayerPropDataBySport(sport)
            let today = new Date()
            let dayOfWeek = today.getDay()
            const daysToAdd = (2 - dayOfWeek + 7) % 7;
            const nextTuesday = new Date(today);
            nextTuesday.setDate(today.getDate() + (daysToAdd === 0 ? 7 : daysToAdd));

            let newPlayers: DbPlayerPropData[] = []
            let newTeams: DbGameBookData[] = []
            playerProps.forEach(e => {
                let newDate = new Date(e.commenceTime)
                if (newDate < nextTuesday) {
                    newPlayers.push(e)
                }
            })
            var taskRepo = remult.repo(DbGameBookData)
            let teamsData = await taskRepo.find({where: {sportTitle: sport, bookSeq: 0, commenceTime: {$gte : today.toISOString(), $lte : nextTuesday.toISOString()}}})
           
            
            let distinctBookIds = teamsData.map(e => e.bookId).filter((v,i,a) => a.indexOf(v) === i)
            console.log('distinct team best bet book ids below')
            console.log(distinctBookIds)
            listOfPropsFinal = await NflService.getPlayerBestBetStats(playerProps, teamsData)
            BestBetController.addBestBet(listOfPropsFinal, sport)
              
            
            
        }
        
    } catch (error: any) {
        console.log(error.message)
    }


}