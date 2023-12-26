import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DbNbaTeamGameStats", {
  allowApiCrud: true
})
export class DbNbaTeamGameStats {
  @Fields.cuid()
  id? = ''
  
  @Fields.string()
  teamName = ''

  @Fields.integer()
  teamId = 0

  @Fields.string()
  teamAgainstName = ''

  @Fields.integer()
  teamAgainstId = 0

  @Fields.string()
  homeOrAway = ''

  @Fields.integer()
  season = 0

  @Fields.integer()
  gameId = 0

  @Fields.string()
  gameDate = ''

  @Fields.string()
  result = ''

  @Fields.integer()
  pointsScoredOverall = 0

  @Fields.integer()
  pointsScoredFirstQuarter = 0

  @Fields.integer()
  pointsScoredSecondQuarter = 0

  @Fields.integer()
  pointsScoredThirdQuarter = 0

  @Fields.integer()
  pointsScoredFourthQuarter = 0

  @Fields.integer()
  pointsAllowedOverall = 0

  @Fields.integer()
  pointsAllowedFirstQuarter = 0

  @Fields.integer()
  pointsAllowedSecondQuarter = 0

  @Fields.integer()
  pointsAllowedThirdQuarter = 0

  @Fields.integer()
  pointsAllowedFourthQuarter = 0

  

  @Fields.createdAt()
  createdAt?: Date

  @Fields.integer()
  uniquegameid?:number
}