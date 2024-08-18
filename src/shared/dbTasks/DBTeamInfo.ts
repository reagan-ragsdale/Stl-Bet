import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DbTeamInfo", {
  allowApiCrud: true
})
export class DbTeamInfo {
  @Fields.integer()
  teamId = 0

  @Fields.string()
  teamNameAbvr = ""

  @Fields.string()
  teamNameFull = ""

  @Fields.string()
  sport = ''

  @Fields.createdAt()
  createdAt?: Date

}