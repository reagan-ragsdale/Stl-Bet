import { remult } from "remult";
import { NflController } from "../../shared/Controllers/NflController";
import { PlayerPropController } from "../../shared/Controllers/PlayerPropController";
import { SportsBookController } from "../../shared/Controllers/SportsBookController";
import { draftKingsApiController } from "../ApiCalls/draftKingsApiCalls";
import { reusedFunctions } from "../Services/reusedFunctions";
import { DBNflPlayerGameStats } from "../../shared/dbTasks/DbNflPlayerGameStats";


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
    console.log('number of nfl player stats below')
    console.log(allNflPlayerStats.length)
    let taskRepo = remult.repo(DBNflPlayerGameStats)
    await taskRepo.deleteMany({where:{playerId:{ "!=":0 }}})
    let newInsertArray: DBNflPlayerGameStats[] = []
    for(let i = 0; i < allNflPlayerStats.length; i++){
        let newStat: DBNflPlayerGameStats = {
                playerId: allNflPlayerStats[i].playerId,
                playerName: allNflPlayerStats[i].playerName,
                teamName: allNflPlayerStats[i].teamName,
                teamId: allNflPlayerStats[i].teamId,
                teamAgainstName: allNflPlayerStats[i].teamAgainstName,
                teamAgainstId: allNflPlayerStats[i].teamAgainstId,
                gameId: allNflPlayerStats[i].gameId,
                gameDate: allNflPlayerStats[i].gameDate,
                homeOrAway: reusedFunctions.getHomeAwayFromGameId(allNflPlayerStats[i].gameId,allNflPlayerStats[i].teamName),
                season: allNflPlayerStats[i].season,
                qbCompletions: allNflPlayerStats[i].qbCompletions,
                qbPassingAttempts: allNflPlayerStats[i].qbPassingAttempts,
                qbPassingYards: allNflPlayerStats[i].qbPassingYards,
                qbYardsPerPassAttempt: allNflPlayerStats[i].qbYardsPerPassAttempt,
                qbPassingTouchdowns: allNflPlayerStats[i].qbPassingTouchdowns,
                qbInterceptions: allNflPlayerStats[i].qbInterceptions,
                qbsacks: allNflPlayerStats[i].qbsacks,
                qBRating: allNflPlayerStats[i].qBRating,
                adjQBR: allNflPlayerStats[i].adjQBR,
                rushingAttempts: allNflPlayerStats[i].rushingAttempts,
                rushingYards: allNflPlayerStats[i].rushingYards,
                yardsPerRushAttempt: allNflPlayerStats[i].yardsPerRushAttempt,
                rushingTouchdowns: allNflPlayerStats[i].rushingTouchdowns,
                longRushing: allNflPlayerStats[i].longRushing,
                receptions: allNflPlayerStats[i].receptions,
                receivingTargets: allNflPlayerStats[i].receivingTargets,
                receivingYards: allNflPlayerStats[i].receivingYards,
                yardsPerReception: allNflPlayerStats[i].yardsPerReception,
                receivingTouchdowns: allNflPlayerStats[i].receivingTouchdowns,
                longReception: allNflPlayerStats[i].longReception,
                totalTackles: allNflPlayerStats[i].totalTackles,
                sacks: allNflPlayerStats[i].sacks
        }
        newInsertArray.push(newStat)
        
    }
    await taskRepo.insert(newInsertArray)


}