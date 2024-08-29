import { Allow, Entity, Fields, Validators } from "remult"

@Entity("DBNflPlayerGameStats", {
    allowApiCrud: true
})
export class DBNflPlayerGameStats {
    @Fields.integer()
    playerId = 0

    @Fields.string()
    playerName = ""

    @Fields.string()
    teamName = ''

    @Fields.integer()
    teamId = 0

    @Fields.string()
    teamAgainstName = ""

    @Fields.integer()
    teamAgainstId = 0

    @Fields.string()
    gameId = ""

    @Fields.string()
    gameDate = ''

    @Fields.integer()
    season = 0

    @Fields.number()
    qbCompletions = 0

    @Fields.number()
    qbPassingAttempts = 0

    @Fields.number()
    qbPassingYards = 0

    @Fields.number()
    qbYardsPerPassAttempt = 0
    
    @Fields.number()
    qbPassingTouchdowns = 0

    @Fields.number()
    qbInterceptions = 0

    @Fields.number()
    qbsacks = 0

    @Fields.number()
    qBRating = 0

    @Fields.number()
    adjQBR = 0

    @Fields.number()
    rushingAttempts = 0

    @Fields.number()
    rushingYards = 0

    @Fields.number()
    yardsPerRushAttempt = 0

    @Fields.number()
    rushingTouchdowns = 0

    @Fields.number()
    longRushing = 0

    @Fields.number()
    receptions = 0

    @Fields.number()
    receivingTargets = 0

    @Fields.number()
    receivingYards = 0

    @Fields.number()
    yardsPerReception = 0

    @Fields.number()
    receivingTouchdowns = 0

    @Fields.number()
    longReception = 0

    @Fields.number()
    totalTackles = 0

    @Fields.number()
    sacks = 0

    @Fields.createdAt()
    createdAt?: Date
}