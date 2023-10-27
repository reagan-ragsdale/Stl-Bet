import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DbNhlPlayerInfo", {
  allowApiCrud: true
})
export class DbNhlPlayerInfo {
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