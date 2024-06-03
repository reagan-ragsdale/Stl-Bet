import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DbPlayerPropData", {
  allowApiCrud: true
})
export class DbPlayerPropData {
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
  description = ''

  @Fields.string()
  playerName = ''

  @Fields.number()
  price = 0

  @Fields.number()
  point = 0

  @Fields.number()
  bookSeq = 0

  @Fields.createdAt()
  createdAt?: Date

  

  // create a bookseq
  // how would it work for the alternates to understand which ones would need to get updated?
}