import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DbNbaTeamLogos", {
    allowApiCrud: true
})
export class DbNbaTeamLogos {
    @Fields.cuid()
    id? = ''

    @Fields.string()
    teamName = ''

    @Fields.integer()
    teamId = 0

    @Fields.string()
    primaryColor = ''

    @Fields.string()
    alternateColor = ''

}