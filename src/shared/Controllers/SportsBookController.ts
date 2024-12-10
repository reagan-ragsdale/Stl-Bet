import { Allow, BackendMethod, remult } from "remult"

import { DbGameBookData } from "../dbTasks/DbGameBookData";
import { filter } from "compression";
import { DbGameBookDataHistory } from "../dbTasks/DbGameBookDataHistory";

export class SportsBookController {





  @BackendMethod({ allowed: true })
  static async addBookData(bookData: DbGameBookData[]) {
    try{
      const taskRepo = remult.repo(DbGameBookData)
      
     //let bookDataTemp = bookData
      await taskRepo.insert(bookData)
      /*
      let uniqueBookIds = bookDataTemp.map(x => x.bookId).filter((value, index, array) => array.indexOf(value) === index)
      console.log(uniqueBookIds.length)
      for(let book of uniqueBookIds){
        let bookProps = await taskRepo.find({where: {bookId: book, bookSeq: 0}})
        console.log(bookProps.length)
        if(bookProps.length != 0){
          for(let prop of bookProps){

            let filteredNewProp = bookDataTemp.filter(e =>  {
             return (e.bookId == book && e.teamName == prop.teamName && e.marketKey == prop.marketKey)
            })
            console.log(filteredNewProp.length)
            if(filteredNewProp.length != 0){
              
              if(filteredNewProp.length > 1){
                console.log("filteredNewProp Below")
              console.log(filteredNewProp)
                for(let fprop of filteredNewProp){
                  let matchedProp = bookDataTemp.filter(e =>{return e.bookId == book && e.teamName == fprop.teamName && e.marketKey == fprop.marketKey && e.point == fprop.point})
                  console.log(matchedProp)
                  console.log(prop)
                  await taskRepo.save({...prop, price: matchedProp[0].price})
                }
              }
              else{
                await taskRepo.save({...prop, price: filteredNewProp[0].price, point: filteredNewProp[0].point})
              }
              
            }
          }
        }
      }*/
    }
    catch(error: any){
      console.log(error.message)
    }
    
      
  }

  @BackendMethod({ allowed: true})
  static async updateBookSeqZero(bookData: DbGameBookData[]){
    const taskRepo = remult.repo(DbGameBookData)
    //get each individual book id
    let individualBookIds = bookData.map(e => e.bookId).filter((value, index, array) => array.indexOf(value) === index)
    //loop through each book id
    for(let book of individualBookIds){
      //find if there is already a entry in the db with bookseq 0
      let databaseBookSeqZero = await taskRepo.find({where: {bookId: book, bookSeq: 0}})
      
      if(databaseBookSeqZero.length > 0){
        //get all the incoming prop data matched on the book id
        let propDataMathcedOnBookId = bookData.filter(e => e.bookId == book)
        //loop through each of the props for that book id
        for(let individualProp of propDataMathcedOnBookId){
          //find the prop from the database that matches the incoming prop
          let matchedProp = databaseBookSeqZero.filter(e => e.marketKey == individualProp.marketKey && e.teamName == individualProp.teamName && e.point == individualProp.point && e.description == individualProp.description)[0]
          //update the databasebookseqZero
          
          await taskRepo.save({...matchedProp, price: individualProp.price, point: individualProp.point})
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
  static async loadAllBookDataByBookId(bookId: string): Promise<DbGameBookData[]> {
    const taskRepo = remult.repo(DbGameBookData)

    return await taskRepo.find({where: {bookId: bookId}})

    
  }

  @BackendMethod({ allowed: true })
  static async loadAllBookDataBySportAndMaxBookSeq(sport: string): Promise<DbGameBookData[]> {
    const taskRepo = remult.repo(DbGameBookData)
    return await taskRepo.find({where: DbGameBookData.allSportFilterByMAxBookSeq({sport: sport}), orderBy: {createdAt: "asc"}})

    
  }

  @BackendMethod({ allowed: true })
  static async loadAllSportFilterByMAxBookSeqBigThree(sport: string): Promise<DbGameBookData[]> {
    const taskRepo = remult.repo(DbGameBookData)
    return await taskRepo.find({where: DbGameBookData.allSportFilterByMAxBookSeqBigThree({sport: sport}), orderBy: {commenceTime: "asc"}})

    
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

  @BackendMethod({ allowed: true })
  static async getAllDataLessThanDate(date: Date): Promise<DbGameBookData[]> {
    const taskRepo = remult.repo(DbGameBookData)
    return await taskRepo.find({where: {createdAt: {$lt: date}}})
  }

  @BackendMethod({ allowed: true })
  static async deleteAllDataLessThanDate(date: Date) {
    const taskRepo = remult.repo(DbGameBookData)
    await taskRepo.deleteMany({where: {createdAt: {$lt: date}}})
  }



  //Game book data history controller
  @BackendMethod({ allowed: true })
  static async insertIntoGameBookHistory(data: DbGameBookDataHistory[]) {
    const taskRepo = remult.repo(DbGameBookDataHistory)
    await taskRepo.insert(data)
  }
  


  
  

}