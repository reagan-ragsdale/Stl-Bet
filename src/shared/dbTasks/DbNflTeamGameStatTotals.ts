import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DBNflTeamGameStatTotals", {
    allowApiCrud: true
})
export class DBNflTeamGameStatTotals {
    @Fields.string()
    teamName = ''

    @Fields.integer()
    teamId = 0

    @Fields.integer()
    season = 0;

    @Fields.integer()
    wins = 0;

    @Fields.integer()
    losses = 0;

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

    @Fields.integer()
    totalYards = 0

    @Fields.integer()
    totalRushingYards = 0

    @Fields.integer()
    totalPassingYards = 0

    @Fields.integer()
    totalRushingAttempts = 0

    @Fields.integer()
    interceptionsThrown = 0

    @Fields.integer()
    interceptionsCaught = 0

    @Fields.integer()
    fumblesLost = 0

    @Fields.integer()
    firstDowns = 0

    @Fields.integer()
    sacksAgainst = 0

    @Fields.integer()
    passCompletions = 0

    @Fields.integer()
    passAttempts = 0

    @Fields.integer()
    pointsAllowedOverall = 0

    @Fields.integer()
    pointsAllowedFirstQuarter = 0

    @Fields.integer()
    pointsAllowedSecondQuarter = 0

    @Fields.integer()
    pointsAllowedThirdQuarter = 0

    @Fields.integer()
    pointsAllowedFourthQuarter = 0

    @Fields.integer()
    totalYardsAllowed = 0

    @Fields.integer()
    totalRushingYardsAllowed = 0

    @Fields.integer()
    totalPassingYardsAllowed = 0
}