import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DBNflTeamGameStats", {
    allowApiCrud: true
})
export class DBNflTeamGameStats {
    @Fields.string()
    teamName = ''

    @Fields.integer()
    teamId = 0

    @Fields.string()
    teamAgainstName = ''

    @Fields.integer()
    teamAgainstId = 0

    @Fields.integer()
    gameId = ''

    @Fields.date()
    gameDate = ''

    @Fields.string()
    homeAway = ''

    @Fields.string()
    result = ''

    @Fields.integer()
    pointsScoredOverall = 0

    @Fields.integer()
    pointsScoredFirstQuarter = 0

    @Fields.integer()
    pointsScoredSecondQuarter = 0

    @Fields.integer()
    pointsScoredThirdQuarter = 0

    @Fields.integer()
    pointsScoredFourthQuarter = 0
}