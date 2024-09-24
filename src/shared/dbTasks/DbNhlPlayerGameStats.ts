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

  @Fields.integer()
  teamAgainstId = 0

  @Fields.string()
  teamAgainstName = ''

  @Fields.string()
  gameId = ""

  @Fields.string()
  gameDate = ''

  @Fields.integer()
  season = 0

  @Fields.string()
  homeOrAway = ''

  @Fields.string()
  result = ''

  @Fields.integer()
  goals = 0

  @Fields.integer()
  assists = 0

  @Fields.integer()
  pim = 0

  @Fields.integer()
  shots = 0

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

  @Fields.integer()
  blocks = 0

  @Fields.integer()
  saves = 0

  @Fields.createdAt()
  createdAt?: Date
}