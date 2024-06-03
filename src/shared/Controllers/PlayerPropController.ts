import { Allow, BackendMethod, remult } from "remult"

import { DbPlayerPropData } from "../dbTasks/DbPlayerPropData";

export class PlayerPropController {





  @BackendMethod({ allowed: true })

  //need to redo this to just put it in one more than the last instead of deleteing them 

  static async addPlayerPropData(playerData: DbPlayerPropData[]) {
    const taskRepo = remult.repo(DbPlayerPropData)
    var d = new Date;

    var dbToDelete = await taskRepo.find({ where: { sportTitle: playerData[0].sportTitle, bookId: playerData[0].bookId } })
    if (dbToDelete.length > 0) {
      for (const d of dbToDelete) {
        await taskRepo.delete(d)
      }
    }

    await taskRepo.insert(playerData)

  }

  // need to add a function to update the seq zero


  //possibly look into just pulling back ceratin game or players? instead of all by sport
  @BackendMethod({ allowed: true })
  static async loadPlayerPropData(sport: string, bookId: string): Promise<DbPlayerPropData[]> {
    const taskRepo = remult.repo(DbPlayerPropData)
    return await taskRepo.find({ where: { sportTitle: sport, bookId: bookId }, orderBy: { playerName: "asc" } })
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
          let matchedProp = databaseBookSeqZero.filter(e => e.marketKey == individualProp.marketKey && e.playerName == individualProp.playerName && e.description == individualProp.description)
          //update the databasebookseqZero
          
          await taskRepo.save({...matchedProp, price: individualProp.price, point: individualProp.point})
          console.log("after save")
        }
        
      }

    }
  }

}