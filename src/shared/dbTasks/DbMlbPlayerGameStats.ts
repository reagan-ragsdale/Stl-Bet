import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DBMlbPlayerGameStats", {
  allowApiCrud: true
})
export class DBMlbPlayerGameStats {
  @Fields.integer()
  playerId = 0

  @Fields.string()
  playerName = ""

  @Fields.string()
  teamName = ''

  @Fields.integer()
  teamId = 0

  @Fields.string()
  teamAgainstName = ""

  @Fields.string()
  teamAgainstId = ''

  @Fields.string()
  gameId = ""

  @Fields.string()
  gameDate = ''

  @Fields.integer()
  season = 0

  @Fields.string()
  playerPosition = ""

  @Fields.string()
  playerStarted = ""

  @Fields.integer()
  batterHomeRuns = 0

  @Fields.integer()
  batterHits = 0

  @Fields.integer()
  batterTotalBases = 0

  @Fields.integer()
  batterRbis = 0

  @Fields.integer()
  batterRunsScored = 0

  @Fields.integer()
  batterHitsRunsRbis = 0

  @Fields.integer()
  batterDoubles = 0

  @Fields.integer()
  batterTriples = 0

  @Fields.integer()
  batterWalks = 0

  @Fields.integer()
  batterStrikeouts = 0

  @Fields.integer()
  batterStolenBases = 0

 


  @Fields.integer()
  pitcherStrikes = 0

  @Fields.integer()
  pitcherPitches = 0

  

 

  @Fields.createdAt()
  createdAt?: Date
}