import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DbMlbPlayerInfo", {
  allowApiCrud: true
})
export class DbMlbPlayerInfo {
  @Fields.integer()
  playerId = 0

  @Fields.string()
  playerName = ""

  @Fields.string()
  teamName = ''

  @Fields.integer()
  teamId = 0

  @Fields.createdAt()
  createdAt?: Date
}