import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DbNbaTeamLogos", {
    allowApiCrud: true
})
export class DbNbaTeamGameStats {
    @Fields.cuid()
    id? = ''

    @Fields.string()
    teamName = ''

    @Fields.integer()
    teamId = 0

    @Fields.string()
    logo = ''

}