import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DbPlayerBestBets", {
  allowApiCrud: true
})
export class DbPlayerBestBets {
  @Fields.cuid()
  id? = ''

  @Fields.string()
  bookId = ''

  @Fields.string()
  sportTitle = ''

  @Fields.string()
  teamName = ""

  @Fields.string()
  teamAgainstName = ""

  @Fields.string()
  homeAway = ""

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
  overallChance = 0

  @Fields.number()
  homeAwayChance = 0

  @Fields.number()
  teamChance = 0

  @Fields.createdAt()
  createdAt?: Date
}