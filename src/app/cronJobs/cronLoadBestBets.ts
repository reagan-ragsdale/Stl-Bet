import { NflController } from "../../shared/Controllers/NflController"
import { PlayerPropController } from "../../shared/Controllers/PlayerPropController"
import { TeamInfoController } from "../../shared/Controllers/TeamInfoController"
import { reusedFunctions } from "../Services/reusedFunctions"
import { DbPlayerBestBets } from "../../shared/dbTasks/DBPlayerBestBets"
import { DbPlayerPropData } from "../../shared/dbTasks/DbPlayerPropData"
import { BestBetController } from "../../shared/Controllers/BestBetController"



export const cronLoadBestBets = async () => {
    console.log("HEre is load best bets")
    let sports: string[] = ['NFL']

    let listOfBetsToAdd: DbPlayerBestBets[] = []
    try {
        for (let sport of sports) {
            let playerProps = await PlayerPropController.loadAllCurrentPlayerPropDataBySport(sport)
            console.log(playerProps.length)
            let today = new Date()
            let dayOfWeek = today.getDay()
            const daysToAdd = (2 - dayOfWeek + 7) % 7;
            const nextTuesday = new Date(today);
            nextTuesday.setDate(today.getDate() + (daysToAdd === 0 ? 7 : daysToAdd));

            let newDate = new Date(playerProps[0].commenceTime)
            console.log(newDate < nextTuesday)
            console.log(newDate)
            console.log(nextTuesday)
            let newPlayers: DbPlayerPropData[] = []
            playerProps.forEach(e => {
                let newDate = new Date(e.commenceTime)
                if (newDate < nextTuesday) {
                    newPlayers.push(e)
                }
            })
            console.log(newPlayers.length)

            for (let player of newPlayers) {
                let overallCount = 0
                let homeAwayCount = 0
                let teamCount = 0
                let homeAwayTotal = 0
                let teamTotal = 0
                let overallTotal = 0
                let teamName: string = ''
                if (sport == 'NFL') {
                    let teamInfo = await TeamInfoController.getAllTeamInfo('NFL')
                    let playerGameStats = await NflController.nflGetAllPlayerGameStatsByPlayerNameAndSeason([player.playerName], 2024)
                    overallTotal = playerGameStats.length
                    let specificTeam = teamInfo.filter(e => e.teamNameAbvr == playerGameStats[0].teamName)[0]
                    teamName = specificTeam.teamNameAbvr
                    let homeAway = player.homeTeam == specificTeam.teamNameFull ? 'Home' : 'Away'
                    let teamAgainst = player.homeTeam == specificTeam.teamNameFull ? teamInfo.filter(e => e.teamNameFull == player.awayTeam)[0] : teamInfo.filter(e => e.teamNameFull == player.homeTeam)[0]
                    for (let game of playerGameStats) {

                        if (player.marketKey == 'player_pass_tds') {
                            if (player.description == 'Over') {
                                if (game.qbPassingTouchdowns > player.point) {
                                    overallCount++;
                                }
                                if (homeAway == reusedFunctions.getHomeAwayFromGameId(game.gameId, specificTeam.teamNameAbvr)) {
                                    homeAwayTotal++
                                    if (game.qbPassingTouchdowns > player.point) {
                                        homeAwayCount++
                                    }
                                }
                                if (specificTeam.teamNameAbvr == teamAgainst.teamNameAbvr) {
                                    teamTotal++
                                    if (game.qbPassingTouchdowns > player.point) {
                                        teamCount++
                                    }
                                }

                            }
                            else if (player.description == 'Under') {
                                if (game.qbPassingTouchdowns < player.point) {
                                    overallCount++;
                                }
                                if (homeAway == reusedFunctions.getHomeAwayFromGameId(game.gameId, specificTeam.teamNameAbvr)) {
                                    homeAwayTotal++
                                    if (game.qbPassingTouchdowns < player.point) {
                                        homeAwayCount++
                                    }
                                }
                                if (specificTeam.teamNameAbvr == teamAgainst.teamNameAbvr) {
                                    teamTotal++
                                    if (game.qbPassingTouchdowns < player.point) {
                                        teamCount++
                                    }
                                }
                            }

                        }
                        else if (player.marketKey == 'player_rush_yds') {
                            if (player.description == 'Over') {
                                if (game.rushingYards > player.point) {
                                    overallCount++;
                                }
                                if (homeAway == reusedFunctions.getHomeAwayFromGameId(game.gameId, specificTeam.teamNameAbvr)) {
                                    homeAwayTotal++
                                    if (game.rushingYards > player.point) {
                                        homeAwayCount++
                                    }
                                }
                                if (specificTeam.teamNameAbvr == teamAgainst.teamNameAbvr) {
                                    teamTotal++
                                    if (game.rushingYards > player.point) {
                                        teamCount++
                                    }
                                }

                            }
                            else if (player.description == 'Under') {
                                if (game.rushingYards < player.point) {
                                    overallCount++;
                                }
                                if (homeAway == reusedFunctions.getHomeAwayFromGameId(game.gameId, specificTeam.teamNameAbvr)) {
                                    homeAwayTotal++
                                    if (game.rushingYards < player.point) {
                                        homeAwayCount++
                                    }
                                }
                                if (specificTeam.teamNameAbvr == teamAgainst.teamNameAbvr) {
                                    teamTotal++
                                    if (game.rushingYards < player.point) {
                                        teamCount++
                                    }
                                }
                            }

                        }
                        else if (player.marketKey == 'player_reception_yds') {
                            if (player.description == 'Over') {
                                if (game.receivingYards > player.point) {
                                    overallCount++;
                                }
                                if (homeAway == reusedFunctions.getHomeAwayFromGameId(game.gameId, specificTeam.teamNameAbvr)) {
                                    homeAwayTotal++
                                    if (game.receivingYards > player.point) {
                                        homeAwayCount++
                                    }
                                }
                                if (specificTeam.teamNameAbvr == teamAgainst.teamNameAbvr) {
                                    teamTotal++
                                    if (game.receivingYards > player.point) {
                                        teamCount++
                                    }
                                }

                            }
                            else if (player.description == 'Under') {
                                if (game.receivingYards < player.point) {
                                    overallCount++;
                                }
                                if (homeAway == reusedFunctions.getHomeAwayFromGameId(game.gameId, specificTeam.teamNameAbvr)) {
                                    homeAwayTotal++
                                    if (game.receivingYards < player.point) {
                                        homeAwayCount++
                                    }
                                }
                                if (specificTeam.teamNameAbvr == teamAgainst.teamNameAbvr) {
                                    teamTotal++
                                    if (game.receivingYards < player.point) {
                                        teamCount++
                                    }
                                }
                            }

                        }
                        else if (player.marketKey == 'player_pass_yds') {
                            if (player.description == 'Over') {
                                if (game.qbPassingYards > player.point) {
                                    overallCount++;
                                }
                                if (homeAway == reusedFunctions.getHomeAwayFromGameId(game.gameId, specificTeam.teamNameAbvr)) {
                                    homeAwayTotal++
                                    if (game.qbPassingYards > player.point) {
                                        homeAwayCount++
                                    }
                                }
                                if (specificTeam.teamNameAbvr == teamAgainst.teamNameAbvr) {
                                    teamTotal++
                                    if (game.qbPassingYards > player.point) {
                                        teamCount++
                                    }
                                }

                            }
                            else if (player.description == 'Under') {
                                if (game.qbPassingYards < player.point) {
                                    overallCount++;
                                }
                                if (homeAway == reusedFunctions.getHomeAwayFromGameId(game.gameId, specificTeam.teamNameAbvr)) {
                                    homeAwayTotal++
                                    if (game.qbPassingYards < player.point) {
                                        homeAwayCount++
                                    }
                                }
                                if (specificTeam.teamNameAbvr == teamAgainst.teamNameAbvr) {
                                    teamTotal++
                                    if (game.qbPassingYards < player.point) {
                                        teamCount++
                                    }
                                }
                            }

                        }
                    }
                }
                let overallChance = overallTotal == 0 ? 0 : overallCount / overallTotal
                let homeAwayChance = homeAwayTotal == 0 ? 0 : homeAwayCount / homeAwayTotal
                let teamChance = teamTotal == 0 ? 0 : teamCount / teamTotal

                if (overallChance > .9 || homeAwayChance > .9 || teamChance > .9) {
                    listOfBetsToAdd.push({
                        bookId: player.bookId,
                        sportTitle: player.sportTitle,
                        teamName: teamName,
                        commenceTime: player.commenceTime,
                        bookMaker: player.bookMaker,
                        marketKey: player.marketKey,
                        description: player.description,
                        playerName: player.playerName,
                        price: player.price,
                        point: player.point,
                        overallChance: overallChance,
                        homeAwayChance: homeAwayChance,
                        teamChance: teamChance

                    })
                }

            }
        }
        console.log(listOfBetsToAdd.length)
        BestBetController.addBestBet(listOfBetsToAdd)
    } catch (error: any) {
        console.log(error.message)
    }


}