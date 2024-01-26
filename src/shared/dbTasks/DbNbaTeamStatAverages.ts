import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DbNbaTeamStatAverages", {
  allowApiCrud: true
})
export class DbNbaTeamStatAverages {
  @Fields.cuid()
  id? = ''
  
  @Fields.string()
  teamName = ''

  @Fields.integer()
  teamId = 0

  @Fields.integer()
  season = 0

  @Fields.number()
  wins = 0

  @Fields.number()
  losses = 0

  @Fields.number()
  pointsScored = 0

  @Fields.number()
  pointsAllowed = 0

  @Fields.createdAt()
  createdAt?: Date

  @Fields.autoIncrement()
  uniquegameid?:number
}