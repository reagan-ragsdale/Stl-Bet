import { Allow, Entity, Fields, Validators } from "remult"

@Entity("dBPlayerGameStatsMlb", {
  allowApiCrud: true
})
export class DBPlayerGameStatsMlb {
  @Fields.integer()
  playerId = 0

  @Fields.string()
  playerName = ""

  @Fields.string()
  teamName = ''

  @Fields.integer()
  teamId = 0

  @Fields.string()
  player_position = ""

  @Fields.string()
  player_started = ""

  @Fields.integer()
  batter_home_runs = 0

  @Fields.integer()
  batter_hits = 0

  @Fields.integer()
  batter_total_bases = 0

  @Fields.integer()
  batter_rbis = 0

  @Fields.integer()
  batter_runs_scored = 0

  @Fields.integer()
  batter_hits_runs_rbis = 0

  @Fields.integer()
  batter_singles = 0

  @Fields.integer()
  batter_doubles = 0

  @Fields.integer()
  batter_triples = 0

  @Fields.integer()
  batter_walks = 0

  @Fields.integer()
  batter_strikeouts = 0

  @Fields.integer()
  batter_stolen_bases = 0

  @Fields.integer()
  pitcher_strikeouts = 0

  @Fields.integer()
  pitcher_record_a_win = 0

  @Fields.integer()
  pitcher_hits_allowed = 0

  @Fields.integer()
  pitcher_walks = 0

  @Fields.integer()
  pitcher_earned_runs = 0

  @Fields.integer()
  pitcher_outs = 0

  @Fields.string()
  gameId = ""

  @Fields.string()
  teamAgainst = ""

  @Fields.string()
  teamAgainstId = ''

  @Fields.createdAt()
  createdAt?: Date
}