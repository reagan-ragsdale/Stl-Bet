import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DbNhlPlayerGameStatAverages", {
  allowApiCrud: true
})
export class DbNhlPlayerGameStatAverages {
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
  season = 0

  @Fields.number()
  goals = 0

  @Fields.number()
  assists = 0

  @Fields.number()
  pim = 0

  @Fields.number()
  shots = 0

  @Fields.number()
  hits = 0

  @Fields.number()
  powerPlayGoals = 0

  @Fields.number()
  powerPlayPoints = 0

  @Fields.number()
  plusMinus = 0

  @Fields.number()
  points = 0

  @Fields.number()
  blocks = 0

  @Fields.number()
  saves = 0

  @Fields.createdAt()
  createdAt?: Date
}