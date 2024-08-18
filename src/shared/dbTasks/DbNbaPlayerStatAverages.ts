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

  @Fields.number()
  assists = 0

  @Fields.number()
  points = 0

  @Fields.number()
  fgp = 0

  @Fields.number()
  ftp = 0

  @Fields.number()
  tpp = 0

  @Fields.number()
  offReb = 0

  @Fields.number()
  defReb = 0

  @Fields.number()
  totReb = 0

  @Fields.number()
  pFouls = 0

  @Fields.number()
  steals = 0

  @Fields.number()
  turnover = 0

  @Fields.number()
  blocks = 0

  @Fields.number()
  doubleDouble = 0

  @Fields.number()
  tripleDouble = 0

  @Fields.createdAt()
  createdAt?: Date

  @Fields.autoIncrement()
  uniquegameid?:number
}