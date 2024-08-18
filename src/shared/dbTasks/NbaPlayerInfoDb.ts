import { Allow, Entity, Fields, Validators } from "remult"

@Entity("NbaPlayerInfoDb", {
  allowApiCrud: true
})
export class NbaPlayerInfoDb {
  @Fields.integer()
  playerId = 0

  @Fields.string()
  playerName = ""

  @Fields.integer()
  teamId = 0

  @Fields.createdAt()
  createdAt?: Date
}