import { Allow, Entity, Fields, Filter, SqlDatabase, Validators } from "remult"
import { TeamStatsComponent } from "src/app/team-stats/team-stats.component"



@Entity("DbGameBookDataHistory", {
  allowApiCrud: true
})
export class DbGameBookDataHistory {
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
}