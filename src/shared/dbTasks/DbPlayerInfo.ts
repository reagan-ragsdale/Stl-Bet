import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DbPlayerInfo", {
  allowApiCrud: true
})
export class DbPlayerInfo {
  @Fields.integer()
  playerId = 0

  @Fields.string()
  playerName = ""

  @Fields.string()
  teamName = ''

  @Fields.integer()
  teamId = 0

  @Fields.string()
  sport = ''

  @Fields.createdAt()
  createdAt?: Date

  @Fields.autoIncrement()
  uniqueid?:number
}