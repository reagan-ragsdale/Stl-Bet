import { nflApiController } from "../ApiCalls/nflApiCalls";


export const cronLoadNflGameStats = async () => {

    try{
        /* let currentGameIds = await nflApiController.getDistinctGameIds(2023);
        let incomingGameIds = await nflApiController.loadAllNflGameIds(2023)

        //find the ones that don't intersect
        let newGameIds = incomingGameIds.filter(game => !currentGameIds.inclueds(game))

        for(let game of newGameIds){
            let gameStats = await nflApiController.getGameSummary(game)

        } */


    }catch(error:any){
        console.log(error.message)
    }
}