import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DbUsers", {
  allowApiCrud: true
})
export class DbUsers {

  @Fields.string()
  userName = ""

  @Fields.string()
  userPass = ""

  @Fields.createdAt()
  createdAt?: Date

}