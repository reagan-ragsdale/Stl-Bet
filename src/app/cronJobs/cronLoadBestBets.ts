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



export const cronLoadBestBets = async () => {
    console.log("HEre is load best bets")
    let sports: string[] = ['NFL']
    let listOfPropsFinal: DbPlayerBestBets[] = []

    let listOfBetsToAdd: DbPlayerBestBets[] = []
    try {
        for (let sport of sports) {
            let playerProps = await PlayerPropController.loadAllCurrentPlayerPropDataBySport(sport)
            let teamProps = await SportsBookController.loadAllBookDataBySport(sport)
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
            teamProps.forEach(e => {
                let newDate = new Date(e.commenceTime)
                if (newDate < nextTuesday) {
                    newTeams.push(e)
                }
            })

            listOfPropsFinal = await NflService.getPlayerBestBetStats(playerProps, teamProps)
           




            BestBetController.addBestBet(listOfPropsFinal, sport)
        }
        
    } catch (error: any) {
        console.log(error.message)
    }


}