import { Allow, Entity, Fields, Validators } from "remult"

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

  @Fields.createdAt()
  createdAt?: Date
}