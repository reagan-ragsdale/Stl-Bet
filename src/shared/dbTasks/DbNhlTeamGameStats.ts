import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DbNhlTeamGameStats", {
  allowApiCrud: true
})
export class DbNhlTeamGameStats {
  @Fields.cuid()
  id? = ''
  

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
  pointsScoredOverall = 0

  @Fields.integer()
  pointsScoredFirstPeriod = 0

  @Fields.integer()
  pointsScoredSecondPeriod = 0

  @Fields.integer()
  pointsScoredThirdPeriod = 0

  @Fields.integer()
  shotsOnGoal = 0

  @Fields.integer()
  saves = 0

  @Fields.integer()
  pointsAllowedOverall = 0

  @Fields.integer()
  pointsAllowedFirstPeriod = 0

  @Fields.integer()
  pointsAllowedSecondPeriod = 0

  @Fields.integer()
  pointsAllowedThirdPeriod = 0

  @Fields.integer()
  shotsAllowedOnGoal = 0

  
  @Fields.createdAt()
  createdAt?: Date
}