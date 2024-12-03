import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DbNhlTeamGameStatAverages", {
  allowApiCrud: true
})
export class DbNhlTeamGameStatAverages {
  @Fields.cuid()
  id? = ''

  @Fields.string()
  teamName = ''

  @Fields.integer()
  teamId = 0

  @Fields.integer()
  season = 0

  @Fields.number()
  pointsScoredOverall = 0

  @Fields.number()
  pointsScoredFirstPeriod = 0

  @Fields.number()
  pointsScoredSecondPeriod = 0

  @Fields.number()
  pointsScoredThirdPeriod = 0

  @Fields.number()
  shotsOnGoal = 0

  @Fields.number()
  saves = 0

  @Fields.number()
  pointsAllowedOverall = 0

  @Fields.number()
  pointsAllowedFirstPeriod = 0

  @Fields.number()
  pointsAllowedSecondPeriod = 0

  @Fields.number()
  pointsAllowedThirdPeriod = 0

  @Fields.number()
  shotsAllowedOnGoal = 0

  
  @Fields.createdAt()
  createdAt?: Date
}