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
    
    
      await taskRepo.insert(bookData)
  

  }

  @BackendMethod({ allowed: true })
  static async loadSportBook(sport: string): Promise<DbGameBookData[]> {
    const taskRepo = remult.repo(DbGameBookData)
    let temp = new Date()
    let date = temp.toISOString()

    return await taskRepo.find({where: {sportTitle: sport, commenceTime:{ ">": date}  }, orderBy: {commenceTime: "asc"}})
  }


  @BackendMethod({ allowed: true })
  static async loadSportBookByH2H(sport: string): Promise<DbGameBookData[]> {
    const taskRepo = remult.repo(DbGameBookData)
    let temp = new Date()
    let date = temp.toISOString()

    return await taskRepo.find({where: {sportTitle: sport, commenceTime:{ ">": date}, marketKey: "h2h"}, orderBy: {commenceTime: "asc"}})
  }

}