import { SportsBookController } from "src/shared/Controllers/SportsBookController";
import { draftKingsApiController } from "../ApiCalls/draftKingsApiCalls";

export const cronSportsBookHourly = async () => {
    
    
    const listOfActiveSports: string[] = ["MLB Preseason", "NBA"] 

    for(let sport of listOfActiveSports){
        try{
            const gamesFromDraftKings = await draftKingsApiController.getDatesAndGames(sport);

            await SportsBookController.addBookData(gamesFromDraftKings);
        }
        catch(error: any){
            console.log(error.message)
        }
    }

}