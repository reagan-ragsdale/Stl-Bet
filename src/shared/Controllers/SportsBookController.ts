import { Allow, BackendMethod, remult } from "remult"

import { DbGameBookData } from "../dbTasks/DbGameBookData";
import { filter } from "compression";

export class SportsBookController {





  @BackendMethod({ allowed: true })
  static async addBookData(bookData: DbGameBookData[]) {
    const taskRepo = remult.repo(DbGameBookData)
    let bookDataTemp = bookData
    console.log(bookData.length)
      await taskRepo.insert(bookData)
      let uniqueBookIds = bookDataTemp.map(x => x.bookId).filter((value, index, array) => array.indexOf(value) === index)
      for(let book of uniqueBookIds){
        let bookProps = await taskRepo.find({where: {bookId: book, bookSeq: 0}})
        if(bookProps.length != 0){
          for(let prop of bookProps){
            let filteredNewProp = bookDataTemp.filter(e =>  {
             return (e.bookId == book && e.teamName == prop.teamName && e.marketKey == prop.marketKey)
            })
            if(filteredNewProp.length != 0){
              await taskRepo.save({...prop, price: 222, point: filteredNewProp[0].point})
            }
          }
        }
      }
      
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

  @BackendMethod({ allowed: true })
  static async loadMaxBookSeqByBookId(bookId: string): Promise<DbGameBookData[]> {
    const taskRepo = remult.repo(DbGameBookData)

    return await taskRepo.find({where: DbGameBookData.bookIdFilter({bookId: bookId})})

    
  }

  @BackendMethod({ allowed: true })
  static async loadAllBookDataBySportAndMaxBookSeq(sport: string): Promise<DbGameBookData[]> {
    const taskRepo = remult.repo(DbGameBookData)
    return await taskRepo.find({where: DbGameBookData.allSportFilterByMAxBookSeq({sport: sport}), orderBy: {createdAt: "asc"}})

    
  }

  @BackendMethod({ allowed: true })
  static async loadAllSportFilterByMAxBookSeqBigThree(sport: string): Promise<DbGameBookData[]> {
    const taskRepo = remult.repo(DbGameBookData)
    return await taskRepo.find({where: DbGameBookData.allSportFilterByMAxBookSeqBigThree({sport: sport}), orderBy: {createdAt: "asc"}})

    
  }

  

  @BackendMethod({ allowed: true })
  static async loadAllBookDataBySportAndMaxBookSeqAndh2h(sport: string): Promise<DbGameBookData[]> {
    const taskRepo = remult.repo(DbGameBookData)
    return await taskRepo.find({where: DbGameBookData.allSportFilterByMaxBookSeqAndh2h({sport: sport}), orderBy: {createdAt: "asc"}})

    
  }

  @BackendMethod({ allowed: true })
  static async loadAllBookDataBySportAndMaxBookSeqAndBookId(sport: string, bookId: string): Promise<DbGameBookData[]> {
    const taskRepo = remult.repo(DbGameBookData)
    return await taskRepo.find({where: DbGameBookData.loadAllBookDataBySportAndMaxBookSeqAndBookId({sport: sport, bookId: bookId}), orderBy: {createdAt: "asc"}})

    
  }

  @BackendMethod({ allowed: true })
  static async loadAllBookDataBySportAndBookIdAndTeamAndProp(sport: string, bookId: string, teamName: string, prop: string): Promise<DbGameBookData[]> {
    const taskRepo = remult.repo(DbGameBookData)
    return await taskRepo.find({where: DbGameBookData.loadAllBookDataBySportAndBookIdAndTeamAndProp({sport: sport, bookId: bookId, teamName: teamName, prop: prop}), orderBy: {createdAt: "asc"}})

    
  }

  @BackendMethod({ allowed: true })
  static async loadAllBookDataBySportAndBookIdAndProp(sport: string, bookId: string, prop: string): Promise<DbGameBookData[]> {
    const taskRepo = remult.repo(DbGameBookData)
    return await taskRepo.find({where: DbGameBookData.loadAllBookDataBySportAndBookIdAndProp({sport: sport, bookId: bookId, prop: prop}), orderBy: {createdAt: "asc"}})

    
  }

  


  
  

}