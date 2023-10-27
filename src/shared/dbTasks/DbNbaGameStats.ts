import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DbNbaGameStats", {
  allowApiCrud: true
})
export class DbNbaGameStats {
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
  gameId = 0

  @Fields.string()
  playerStarted = ""

  @Fields.integer()
  assists = 0

  @Fields.integer()
  points = 0

  @Fields.integer()
  fgm = 0

  @Fields.integer()
  fga = 0

  @Fields.number()
  fgp = 0

  @Fields.integer()
  ftm = 0

  @Fields.integer()
  fta = 0

  @Fields.number()
  ftp = 0

  @Fields.integer()
  tpm = 0

  @Fields.integer()
  tpa = 0

  @Fields.number()
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
}