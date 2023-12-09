import { Allow, BackendMethod, remult } from "remult"

import { DbGameBookData } from "../dbTasks/DbGameBookData";

export class SportsBookController {





  @BackendMethod({ allowed: true })
  static async addBookData(bookData: DbGameBookData[]) {
    const taskRepo = remult.repo(DbGameBookData)
   var d = new Date;
   
    var dbToDelete = await taskRepo.find({where: { sportTitle: bookData[0].sportTitle }})
    if(dbToDelete.length > 0){
      for( const d of dbToDelete){
      await taskRepo.delete(d)
    } }
    
    for (const data of bookData) {
      await taskRepo.insert({bookId: data.bookId, sportKey: data.sportKey, sportTitle: data.sportTitle, homeTeam: data.homeTeam, awayTeam: data.awayTeam, commenceTime: data.commenceTime, bookMaker: data.bookMaker, marketKey: data.marketKey, teamName: data.teamName, price: data.price, point: data.point})
    }

  }

  @BackendMethod({ allowed: true })
  static async loadSportBook(sport: string): Promise<DbGameBookData[]> {
    const taskRepo = remult.repo(DbGameBookData)
    return await taskRepo.find({where: {sportTitle: sport}, orderBy: {commenceTime: "asc"}})
  }

}