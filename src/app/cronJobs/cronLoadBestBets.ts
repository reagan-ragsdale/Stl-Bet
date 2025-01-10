import { NflController } from "../../shared/Controllers/NflController"
import { PlayerPropController } from "../../shared/Controllers/PlayerPropController"
import { TeamInfoController } from "../../shared/Controllers/TeamInfoController"
import { reusedFunctions } from "../Services/reusedFunctions"
import { DbPlayerBestBets } from "../../shared/dbTasks/DBPlayerBestBets"
import { DbPlayerPropData } from "../../shared/dbTasks/DbPlayerPropData"
import { BestBetController } from "../../shared/Controllers/BestBetController"
import { NflService } from "../Services/NflService"



export const cronLoadBestBets = async () => {
    console.log("HEre is load best bets")
    let sports: string[] = ['NFL']

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
            playerProps.forEach(e => {
                let newDate = new Date(e.commenceTime)
                if (newDate < nextTuesday) {
                    newPlayers.push(e)
                }
            })

            let listOfPropsFinal = await NflService.getPlayerBestBetStats(playerProps)




            
        }
        console.log(listOfBetsToAdd.length)
        //BestBetController.addBestBet(listOfBetsToAdd)
    } catch (error: any) {
        console.log(error.message)
    }


}