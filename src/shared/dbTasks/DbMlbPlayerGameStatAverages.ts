import { Allow, Entity, Fields, Validators } from "remult"

@Entity("dBMlbPlayerGameStatAverages", {
  allowApiCrud: true
})
export class DBMlbPlayerGameStatAverages {
  @Fields.integer()
  playerId = 0

  @Fields.string()
  playerName = ""

  @Fields.integer()
  season = 0

  @Fields.number()
  batterHomeRuns = 0

  @Fields.number()
  batterHits = 0

  @Fields.number()
  batterAtBats = 0

  @Fields.number()
  batterTotalBases = 0

  @Fields.number()
  batterRbis = 0

  @Fields.number()
  batterRunsScored = 0

  @Fields.number()
  batterHitsRunsRbis = 0

  @Fields.number()
  batterSingles = 0

  @Fields.number()
  batterDoubles = 0

  @Fields.number()
  batterTriples = 0

  @Fields.number()
  batterWalks = 0

  @Fields.number()
  batterStrikeouts = 0

  @Fields.number()
  batterStolenBases = 0

  @Fields.number()
  pitcherStrikes = 0

  @Fields.number()
  pitcherPitches = 0

  @Fields.number()
  totalGames = 0

  @Fields.createdAt()
  createdAt?: Date
}