import { Allow, BackendMethod, remult } from "remult"

import { DbPlayerPropData } from "../dbTasks/DbPlayerPropData";

export class PlayerPropController {





  @BackendMethod({ allowed: true })

  //need to redo this to just put it in one more than the last instead of deleteing them 

  static async addPlayerPropData(playerData: DbPlayerPropData[]) {
    const taskRepo = remult.repo(DbPlayerPropData)
    

    await taskRepo.insert(playerData)

  }

  // need to add a function to update the seq zero


  //possibly look into just pulling back ceratin game or players? instead of all by sport
  @BackendMethod({ allowed: true })
  static async loadPlayerPropData(sport: string, bookId: string): Promise<DbPlayerPropData[]> {
    const taskRepo = remult.repo(DbPlayerPropData)
    return await taskRepo.find({ where: { sportTitle: sport, bookId: bookId, bookSeq: 0 }, orderBy: { playerName: "asc" } })
  }

  @BackendMethod({ allowed: true})
  static async updatePlayerSeqZero(playerData: DbPlayerPropData[]){
    const taskRepo = remult.repo(DbPlayerPropData)
    //get each individual book id
    let individualBookIds = playerData.map(e => e.bookId).filter((value, index, array) => array.indexOf(value) === index)
    //loop through each book id
    for(let book of individualBookIds){
      //find if there is already a entry in the db with bookseq 0
      let databaseBookSeqZero = await taskRepo.find({where: {bookId: book, bookSeq: 0}})
      
      if(databaseBookSeqZero.length > 0){
        //get all the incoming prop data matched on the book id
        let propDataMathcedOnBookId = playerData.filter(e => e.bookId == book)
        //loop through each of the props for that book id
        for(let individualProp of propDataMathcedOnBookId){
          //find the prop from the database that matches the incoming prop
          let matchedProp = databaseBookSeqZero.filter(e => e.marketKey == individualProp.marketKey && e.playerName == individualProp.playerName && e.description == individualProp.description)[0]
          //update the databasebookseqZero
          
          await taskRepo.save({...matchedProp, price: individualProp.price, point: individualProp.point})
        }
        
      }

    }
  }

  @BackendMethod({ allowed: true })
  static async loadCurrentPlayerPropData(sport: string, playerName: string): Promise<DbPlayerPropData[]> {
    const taskRepo = remult.repo(DbPlayerPropData)
    let today = new Date();
    today.setHours(5,0,0,0);
    let tomorrow = new Date();
    tomorrow.setHours(29,0,0,0);
    return await taskRepo.find({ where: { playerName: playerName, sportTitle: sport, bookSeq: 0, commenceTime: {$gte: today.toDateString(), $lte: tomorrow.toDateString()}, } })
  }

}