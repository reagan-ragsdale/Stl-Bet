import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DbMlbTeamGameStatAverages", {
  allowApiCrud: true
})
export class DbMlbTeamGameStatAverages {
  @Fields.string()
  teamName = ''

  @Fields.integer()
  teamId = 0

  @Fields.integer()
  season = 0

  @Fields.integer()
  wins = 0

  @Fields.integer()
  losses = 0

  @Fields.number()
  pointsScoredOverall = 0

  @Fields.number()
  pointsScoredFirstInning = 0

  @Fields.number()
  pointsScoredSecondInning = 0

  @Fields.number()
  pointsScoredThirdInning = 0

  @Fields.number()
  pointsScoredFourthInning = 0

  @Fields.number()
  pointsScoredFifthInning = 0

  @Fields.number()
  pointsScoredSixthInning = 0

  @Fields.number()
  pointsScoredSeventhInning = 0

  @Fields.number()
  pointsScoredEigthInning = 0

  @Fields.number()
  pointsScoredNinthInning = 0

  @Fields.number()
  pointsAllowedOverall = 0

  @Fields.number()
  pointsAllowedFirstInning = 0

  @Fields.number()
  pointsAllowedSecondInning = 0

  @Fields.number()
  pointsAllowedThirdInning = 0

  @Fields.number()
  pointsAllowedFourthInning = 0

  @Fields.number()
  pointsAllowedFifthInning = 0

  @Fields.number()
  pointsAllowedSixthInning = 0

  @Fields.number()
  pointsAllowedSeventhInning = 0

  @Fields.number()
  pointsAllowedEigthInning = 0

  @Fields.number()
  pointsAllowedNinthInning = 0

  @Fields.number()
  totalHomeRunsScored = 0

  @Fields.number()
  totalHitsScored = 0

  @Fields.number()
  totalFirstBaseScored = 0

  @Fields.number()
  totalSecondBaseScored = 0

  @Fields.number()
  totalThirdBaseScored = 0

  @Fields.number()
  totalRbisScored = 0

  @Fields.number()
  totalHomeRunsAllowed = 0

  @Fields.number()
  totalHitsAllowed = 0

  @Fields.number()
  totalFirstBaseAllowed = 0

  @Fields.number()
  totalSecondBaseAllowed = 0

  @Fields.number()
  totalThirdBaseAllowed = 0

  @Fields.number()
  totalRbisAllowed = 0

  @Fields.createdAt()
  createdAt?: Date

  @Fields.integer()
  uniquegameid?:number
}