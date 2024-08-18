import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DbMlbGameBookData", {
  allowApiCrud: true
})
export class DbMlbGameBookData {
  @Fields.string()
  bookId = ''

  @Fields.string()
  sportKey = ""

  @Fields.string()
  sportTitle = ''

  @Fields.string()
  homeTeam = 0

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

  @Fields.integer()
  price = 0

  @Fields.integer()
  point = 0

  @Fields.createdAt()
  createdAt?: Date
}