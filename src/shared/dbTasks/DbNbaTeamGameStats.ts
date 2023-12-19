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
  pointsScored = 0

  @Fields.integer()
  pointsAllowed = 0

  

  @Fields.createdAt()
  createdAt?: Date

  @Fields.integer()
  uniquegameid? = 0
}