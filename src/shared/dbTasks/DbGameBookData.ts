import { Allow, Entity, Fields, Filter, SqlDatabase, Validators } from "remult"
import { TeamStatsComponent } from "src/app/team-stats/team-stats.component"

@Entity("DbGameBookData", {
  allowApiCrud: true
})
export class DbGameBookData {
    @Fields.cuid()
    id? = ''
  @Fields.string()
  bookId = ''

  @Fields.string()
  sportKey = ""

  @Fields.string()
  sportTitle = ''

  @Fields.string()
  homeTeam = ""

  @Fields.string()
  awayTeam = ""

  @Fields.date()
  commenceTime = ""

  @Fields.string()
  bookMaker = ''

  @Fields.string()
  marketKey = ''

  @Fields.string()
  teamName = ''

  @Fields.number()
  price = 0

  @Fields.number()
  point = 0

  @Fields.number()
  bookSeq = 0

  @Fields.createdAt()
  createdAt?: Date


  static bookIdFilter = Filter.createCustom<DbGameBookData, { bookId: string }>(async ({bookId}) => {
    SqlDatabase.LogToConsole = true
    return SqlDatabase.rawFilter((whereFragment) => {
      whereFragment.sql = 'bookseq = (select max(b.bookseq) from dbgamebookdata b where b.bookid = ' + whereFragment.addParameterAndReturnSqlToken(bookId) +') and bookid = ' + whereFragment.addParameterAndReturnSqlToken(bookId)
    
    })
  });

  static allSportFilterByMAxBookSeq = Filter.createCustom<DbGameBookData, { sport: string }>(async ({sport}) => {
    SqlDatabase.LogToConsole = true
    return SqlDatabase.rawFilter((whereFragment) => {
      whereFragment.sql = 'bookSeq = (select max(b.bookSeq) from DbGameBookData b where b.sportTitle = ' + whereFragment.addParameterAndReturnSqlToken(sport) + ' and b.bookId = bookId and date(commencetime) >= CURRENT_DATE) and sportTitle = ' + whereFragment.addParameterAndReturnSqlToken(sport) + ' and date(commencetime) >= CURRENT_DATE'
    })
    
    
  });

  static allSportFilterByMAxBookSeqBigThree = Filter.createCustom<DbGameBookData, { sport: string }>(async ({sport}) => {
    SqlDatabase.LogToConsole = true
    return SqlDatabase.rawFilter((whereFragment) => {
      whereFragment.sql = 'bookSeq = (select max(b.bookSeq) from DbGameBookData b where b.sportTitle = ' + whereFragment.addParameterAndReturnSqlToken(sport) + ' and b.bookId = bookId and date(commencetime) >= CURRENT_DATE) and sportTitle = ' + whereFragment.addParameterAndReturnSqlToken(sport) + ' and marketkey in ' +  whereFragment.addParameterAndReturnSqlToken('h2h, totals, spreads') + ' and date(commencetime) >= CURRENT_DATE'
    })
    
    
  });

  static allSportFilterByMaxBookSeqAndh2h = Filter.createCustom<DbGameBookData, { sport: string }>(async ({sport}) => {
    SqlDatabase.LogToConsole = true
    return SqlDatabase.rawFilter((whereFragment) => {
      whereFragment.sql = 'bookSeq = (select max(b.bookSeq) from DbGameBookData b where b.sportTitle = ' + whereFragment.addParameterAndReturnSqlToken(sport) + ' and b.bookId = bookId and date(commencetime) >= CURRENT_DATE) and sportTitle = ' + whereFragment.addParameterAndReturnSqlToken(sport) + ' and date(commencetime) >= CURRENT_DATE and marketkey = ' + whereFragment.addParameterAndReturnSqlToken('h2h')
    })
    
    
  });

  static loadAllBookDataBySportAndMaxBookSeqAndBookId = Filter.createCustom<DbGameBookData, { sport: string, bookId: string }>(async ({sport, bookId}) => {
    SqlDatabase.LogToConsole = true
    return SqlDatabase.rawFilter((whereFragment) => {
      whereFragment.sql = 'bookSeq = (select max(b.bookSeq) from DbGameBookData b where b.sportTitle = ' + whereFragment.addParameterAndReturnSqlToken(sport) + ' and b.bookId = bookId and date(commencetime) >= CURRENT_DATE) and sportTitle = ' + whereFragment.addParameterAndReturnSqlToken(sport) + ' and date(commencetime) >= CURRENT_DATE and bookid = ' +  whereFragment.addParameterAndReturnSqlToken(bookId)
    })
    
    
  });

  static loadAllBookDataBySportAndBookIdAndTeamAndProp = Filter.createCustom<DbGameBookData, { sport: string, bookId: string, teamName: string, prop: string }>(async ({sport, bookId, teamName, prop}) => {
    SqlDatabase.LogToConsole = true
    return SqlDatabase.rawFilter((whereFragment) => {
     whereFragment.sql = 'bookId = ' + whereFragment.addParameterAndReturnSqlToken(bookId) + ' and teamname = ' + whereFragment.addParameterAndReturnSqlToken(teamName) + ' and marketkey = ' + whereFragment.addParameterAndReturnSqlToken(prop)
    })
  });

  static loadAllBookDataBySportAndBookIdAndProp = Filter.createCustom<DbGameBookData, { sport: string, bookId: string, prop: string }>(async ({sport, bookId, prop}) => {
    SqlDatabase.LogToConsole = true
    return SqlDatabase.rawFilter((whereFragment) => {
      whereFragment.sql = 'bookId = ' + whereFragment.addParameterAndReturnSqlToken(bookId) + ' and marketkey = ' + whereFragment.addParameterAndReturnSqlToken(prop)
    })
  });

  

  



}