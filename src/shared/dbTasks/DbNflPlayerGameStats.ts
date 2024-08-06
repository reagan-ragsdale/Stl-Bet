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

    @Fields.string()
    playerPosition = ""

    @Fields.string()
    playerStarted = ""

    @Fields.number()
    completions = 0

    @Fields.number()
    passingAttempts = 0

    @Fields.number()
    passingYards = 0

    @Fields.number()
    completionPct = 0

    @Fields.number()
    yardsPerPassAttempt = 0
    
    @Fields.number()
    passingTouchdowns = 0

    @Fields.number()
    interceptions = 0

    @Fields.number()
    longPassing = 0

    @Fields.number()
    sacks = 0

    @Fields.number()
    QBRating = 0

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
    fumbles = 0


    @Fields.createdAt()
    createdAt?: Date
}