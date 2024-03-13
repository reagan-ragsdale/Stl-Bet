import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DbMlbTeamGameStats", {
  allowApiCrud: true
})
export class DbMlbTeamGameStats {
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
  pointsScoredFirstInning = 0

  @Fields.integer()
  pointsScoredSecondInning = 0

  @Fields.integer()
  pointsScoredThirdInning = 0

  @Fields.integer()
  pointsScoredFourthInning = 0

  @Fields.integer()
  pointsScoredFifthInning = 0

  @Fields.integer()
  pointsScoredSixthInning = 0

  @Fields.integer()
  pointsScoredSeventhInning = 0

  @Fields.integer()
  pointsScoredEigthInning = 0

  @Fields.integer()
  pointsScoredNinthInning = 0

  @Fields.integer()
  pointsAllowedOverall = 0

  @Fields.integer()
  pointsAllowedFirstInning = 0

  @Fields.integer()
  pointsAllowedSecondInning = 0

  @Fields.integer()
  pointsAllowedThirdInning = 0

  @Fields.integer()
  pointsAllowedFourthInning = 0

  @Fields.integer()
  pointsAllowedFifthInning = 0

  @Fields.integer()
  pointsAllowedSixthInning = 0

  @Fields.integer()
  pointsAllowedSeventhInning = 0

  @Fields.integer()
  pointsAllowedEigthInning = 0

  @Fields.integer()
  pointsAllowedNinthInning = 0

  @Fields.integer()
  totalHomeRunsScored = 0

  @Fields.integer()
  totalHitsScored = 0

  @Fields.integer()
  totalFirstBaseScored = 0

  @Fields.integer()
  totalSecondBaseScored = 0

  @Fields.integer()
  totalThirdBaseScored = 0

  @Fields.integer()
  totalRbisScored = 0

  @Fields.integer()
  totalHomeRunsAllowed = 0

  @Fields.integer()
  totalHitsAllowed = 0

  @Fields.integer()
  totalFirstBaseAllowed = 0

  @Fields.integer()
  totalSecondBaseAllowed = 0

  @Fields.integer()
  totalThirdBaseAllowed = 0

  @Fields.integer()
  totalRbisAllowed = 0

  @Fields.createdAt()
  createdAt?: Date

  @Fields.integer()
  uniquegameid?:number
}