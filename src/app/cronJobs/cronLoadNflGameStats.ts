import { NflController } from "../../shared/Controllers/NflController";
import { nflApiController } from "../ApiCalls/nflApiCalls";


export const cronLoadNflGameStats = async () => {

    try{
        let currentGameIds = await NflController.nflGetDistinctGameIds(2023);
        let incomingGameIds = await nflApiController.loadAllNflGameIds(2023)

        //find the ones that don't intersect
        let newGameIds = incomingGameIds.filter(game => !currentGameIds.includes(game))

        for(let game of newGameIds){
            let gameStats = await nflApiController.getGameSummary(game)
            await NflController.addTeamGameStats(gameStats[0])
            await NflController.addPlayerGameStats(gameStats[1])

        } 


    }catch(error:any){
        console.log(error.message)
    }
}