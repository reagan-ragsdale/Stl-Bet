import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DbNhlPlayerGameStats", {
  allowApiCrud: true
})
export class DbNhlPlayerGameStats {
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

  @Fields.string()
  gameDate = ''

  @Fields.string()
  playerStarted = ""

  @Fields.integer()
  assists = 0

  @Fields.integer()
  goals = 0

  @Fields.integer()
  pim = 0

  @Fields.integer()
  shots = 0

  @Fields.number()
  shotPct = 0

  @Fields.integer()
  games = 0

  @Fields.integer()
  hits = 0

  @Fields.integer()
  powerPlayGoals = 0

  @Fields.integer()
  powerPlayPoints = 0

  @Fields.integer()
  plusMinus = 0

  @Fields.integer()
  points = 0

  @Fields.string()
  gameId = ""

  @Fields.string()
  teamAgainst = ""

  @Fields.string()
  teamAgainstId = ''

  @Fields.string()
  season = ''

  @Fields.string()
  winLossTie = ''

  @Fields.createdAt()
  createdAt?: Date
}