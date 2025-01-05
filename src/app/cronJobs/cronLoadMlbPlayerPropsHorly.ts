import { NflController } from "src/shared/Controllers/NflController";
import { PlayerPropController } from "../../shared/Controllers/PlayerPropController";
import { SportsBookController } from "../../shared/Controllers/SportsBookController";
import { draftKingsApiController } from "../ApiCalls/draftKingsApiCalls";
import { reusedFunctions } from "../Services/reusedFunctions";


export const cronLoadMlbPlayer = async () => {
    let sportsToTitle: {[key:string]:string} = {
        NBA: "basketball_nba",
        NFL: "americanfootball_nfl",
        MLB: "baseball_mlb",
        NHL: "icehockey_nhl"
      }

    console.log("running mlb player props")
    const listOfActiveSports: string[] = ["NHL", "NFL"]

    const listOfMlbExtraGameProps: string = "alternate_spreads,alternate_totals"
    for(let sport of listOfActiveSports){

        try {
            let bookIdsForToday = await draftKingsApiController.getEventsBySport(sportsToTitle[sport])
            for(let book of bookIdsForToday){
                const playerPropsFromDraftKings = await draftKingsApiController.getPlayerProps(sport, book);

                await PlayerPropController.addPlayerPropData(playerPropsFromDraftKings)
                await PlayerPropController.updatePlayerSeqZero(playerPropsFromDraftKings)
                const alternateTeamProps = await draftKingsApiController.getAlternateTeamProps(sport, book)
                await SportsBookController.addBookData(alternateTeamProps)
                await SportsBookController.updateBookSeqZero(alternateTeamProps)
                const alternatePlayerProps = await draftKingsApiController.getAlternatePlayerProps(sport, book);
                await PlayerPropController.addPlayerPropData(alternatePlayerProps)
                await PlayerPropController.updateAlternatePlayerSeqZero(alternatePlayerProps)
            }
        }
    
        catch (error: any) {
            console.log(error.message)
        }
        console.log("finished mlb player props")
    }

    let allNflPlayerStats = await NflController.nflGetAllPlayerGameStats()
    for(let i = 0; i < allNflPlayerStats.length; i++){
        allNflPlayerStats[i].homeOrAway = reusedFunctions.getHomeAwayFromGameId(allNflPlayerStats[i].gameId, allNflPlayerStats[i].teamName)
    }


}