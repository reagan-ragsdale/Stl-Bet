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
  pitcherStrikeouts = 0

  @Fields.number()
  pitcherRecordAWin = 0

  @Fields.number()
  pitcherHitsAllowed = 0

  @Fields.number()
  pitcherWalks = 0

  @Fields.number()
  pitcherEarnedRuns = 0

  @Fields.number()
  pitcherOuts = 0

  @Fields.createdAt()
  createdAt?: Date
}