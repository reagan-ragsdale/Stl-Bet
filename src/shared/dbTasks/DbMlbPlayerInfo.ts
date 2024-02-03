import { Allow, Entity, Fields, Validators } from "remult"

@Entity("playerInfoMlb", {
  allowApiCrud: true
})
export class PlayerInfoMlb {
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