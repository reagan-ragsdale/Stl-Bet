import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DbMlbTeamInfo", {
  allowApiCrud: true
})
export class DbMlbTeamInfo {
  @Fields.integer()
  teamId = 0

  @Fields.string()
  teamName = ""

  @Fields.string()
  sport = ''

  @Fields.createdAt()
  createdAt?: Date

}