import { Allow, Entity, Fields, Filter, SqlDatabase, Validators } from "remult"

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
    return SqlDatabase.rawFilter((whereFragment) => {
      whereFragment.sql = 'select * from dbgamebookdata where bookeq = (select max(bookseq) from dbgamebookdata where bookid = ' + whereFragment.addParameterAndReturnSqlToken(bookId) +') and bookid = ' + whereFragment.addParameterAndReturnSqlToken(bookId)
    })
  });

  static allSportFilterByMAxBookSeq = Filter.createCustom<DbGameBookData, { sport: string }>(async ({sport}) => {
    return SqlDatabase.rawFilter((whereFragment) => {
      whereFragment.sql = 'select * from dbgamebookdata b where b.nookSeq = (select max(c.bookSeq) from dbgamebookdata c where c.sporttitle = ' + whereFragment.addParameterAndReturnSqlToken(sport) + ' and c.bookid = b.bookid )'
    })
  });


}