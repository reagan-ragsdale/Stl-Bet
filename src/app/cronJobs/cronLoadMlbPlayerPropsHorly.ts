import { PlayerPropController } from "../../shared/Controllers/PlayerPropController";
import { SportsBookController } from "../../shared/Controllers/SportsBookController";
import { draftKingsApiController } from "../ApiCalls/draftKingsApiCalls";

export const cronLoadMlbPlayer = async () => {

    console.log("running mlb player props")
    const listOfActiveSports: string[] = ["MLB"]

    const listOfMlbExtraGameProps: string = "alternate_spreads,alternate_totals"


        try {
            let bookIdsForToday = await draftKingsApiController.getEventsBySport('baseball_mlb')

            for(let book of bookIdsForToday){
                const playerPropsFromDraftKings = await draftKingsApiController.getPlayerProps('MLB', book);

                await PlayerPropController.addPlayerPropData(playerPropsFromDraftKings)
                await PlayerPropController.updatePlayerSeqZero(playerPropsFromDraftKings)
            }
        }
        catch (error: any) {
            console.log(error.message)
        }
        console.log("finished mlb player props")

}