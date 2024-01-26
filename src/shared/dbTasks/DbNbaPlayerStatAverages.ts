import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DbNbaPlayerStatAverages", {
  allowApiCrud: true
})
export class DbNbaPlayerStatAverages {
  @Fields.cuid()
  id? = ''
  
  @Fields.integer()
  playerId = 0

  @Fields.string()
  playerName = ""

  @Fields.string()
  teamName = ''

  @Fields.integer()
  teamId = 0

  @Fields.integer()
  season = 0

  @Fields.integer()
  assists = 0

  @Fields.integer()
  points = 0

  @Fields.integer()
  fgp = 0

  @Fields.integer()
  ftp = 0

  @Fields.integer()
  tpp = 0

  @Fields.integer()
  offReb = 0

  @Fields.integer()
  defReb = 0

  @Fields.integer()
  totReb = 0

  @Fields.integer()
  pFouls = 0

  @Fields.integer()
  steals = 0

  @Fields.integer()
  turnover = 0

  @Fields.integer()
  blocks = 0

  @Fields.integer()
  doubleDouble = 0

  @Fields.integer()
  tripleDouble = 0

  @Fields.createdAt()
  createdAt?: Date

  @Fields.autoIncrement()
  uniquegameid?:number
}