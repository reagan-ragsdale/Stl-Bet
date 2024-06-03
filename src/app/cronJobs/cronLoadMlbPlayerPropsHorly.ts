import { PlayerPropController } from "src/shared/Controllers/PlayerPropController";
import { SportsBookController } from "../../shared/Controllers/SportsBookController";
import { draftKingsApiController } from "../ApiCalls/draftKingsApiCalls";

export const cronSportsBookHourly = async () => {


    const listOfActiveSports: string[] = ["MLB"]

    const listOfMlbExtraGameProps: string = "alternate_spreads,alternate_totals"


        try {
            let bookIdsForToday = await draftKingsApiController.getEventsBySport('baseball_mlb')

            for(let book of bookIdsForToday){
                const playerPropsFromDraftKings = await draftKingsApiController.getPlayerProps('MLB', book);

                await PlayerPropController.addPlayerPropData(playerPropsFromDraftKings)
                await PlayerPropController.updatePlayerSeqZero(playerPropsFromDraftKings)
            }
            

            /* await SportsBookController.addBookData(gamesFromDraftKings);
            await SportsBookController.updateBookSeqZero(gamesFromDraftKings) */

             /* let individualBookIds = await SportsBookController.loadAllBookDataBySportAndMaxBookSeq(sport)
            let finalBookIds = individualBookIds.map(b => b.bookId).filter((value, index, array) => array.indexOf(value) === index)

            for (let book of finalBookIds) {
                    const propData = await draftKingsApiController.getSpecificPropByBookId(book, listOfMlbExtraGameProps, sport)
                    await SportsBookController.addBookData(propData)
                }  */
        }
        catch (error: any) {
            console.log(error.message)
        }
    

}