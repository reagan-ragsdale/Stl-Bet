import { remultExpress } from "remult/remult-express"
import { Task } from "../shared/dbTasks/Task"
import { TaskController } from "../shared/Controllers/TaskController"
import { PlayerInfoMlb } from "src/shared/dbTasks/PlayerInfoMlb"
import { MlbController } from "src/shared/Controllers/MlbController"
import { DbMlbGameBookData} from "src/shared/dbTasks/DbMlbGameBookData"
import { DbGameBookData } from "src/shared/dbTasks/DbGameBookData"
import { SportsBookController } from "src/shared/Controllers/SportsBookController"
import { DbPlayerPropData } from "src/shared/dbTasks/DbPlayerPropData"
import { PlayerPropController } from "src/shared/Controllers/PlayerPropController"
import { DbNhlPlayerInfo } from "src/shared/dbTasks/DbNhlPlayerInfo"
import { NhlPlayerInfoController } from "src/shared/Controllers/NhlPlayerInfoController"
import { DbNhlPlayerGameStats } from "src/shared/dbTasks/DbNhlPlayerGameStats"
import { NhlPlayerGameStatsController } from "src/shared/Controllers/NhlPlayerGameStatsController"
import { NbaPlayerInfoDb } from "src/shared/dbTasks/NbaPlayerInfoDb"
import { NbaController } from "src/shared/Controllers/NbaController"
import { DbNbaGameStats } from "src/shared/dbTasks/DbNbaGameStats"
import { createPostgresDataProvider } from "remult/postgres"

export const api = remultExpress({
    entities: [Task, PlayerInfoMlb, DbMlbGameBookData, DbGameBookData, DbPlayerPropData, DbNhlPlayerInfo, DbNhlPlayerGameStats, NbaPlayerInfoDb, DbNbaGameStats,],
    controllers: [TaskController, MlbController, SportsBookController, PlayerPropController, NhlPlayerInfoController, NhlPlayerGameStatsController, NbaController,] ,
   // dataProvider: createPostgresDataProvider({
       // connectionString: process.env["DATABASE_URL"] 
        //|| "your connection string"
      //})
   // getUser: req => req.session!["user"] 
})