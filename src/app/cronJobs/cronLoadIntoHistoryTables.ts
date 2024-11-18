import { SportsBookController } from "../../shared/Controllers/SportsBookController";


export const cronLoadIntoHistoryTables = async () => {

    let today = new Date()
    today.setDate(today.getDate() - 1);

    try{
        let dataToMove = await SportsBookController.getAllDataLessThanDate(today)
        await SportsBookController.insertIntoGameBookHistory(dataToMove)
    
        await SportsBookController.deleteAllDataLessThanDate(today)
    }
    catch(error:any){
        console.log(error.message)
    }

}