import { PlayerPropController } from "../../shared/Controllers/PlayerPropController"



export const cronLoadMlbPlayer = async () => {

    let sports: string[] = ['MLB', 'NFL']

    for(let sport of sports){
        let playerProps = await PlayerPropController.loadAllCurrentPlayerPropDataBySport(sport)
        let today = new Date()
        let dayOfWeek = today.getDay()
        const daysToSubtract = (dayOfWeek + 5) % 7
        const mostRecentTuesday = new Date(today);
        mostRecentTuesday.setDate(today.getDate() - daysToSubtract);

        let newPlayers = playerProps.filter(e => e.commenceTime < mostRecentTuesday.toISOString())
    }

}