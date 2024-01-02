import { remultExpress } from 'remult/remult-express';
//import { Task } from '../shared/dbTasks/Task';
//import { TaskController } from '../shared/Controllers/TaskController';
// Changed path from `src/shared/dbTasks/PlayerInfoMlb` to `../shared/dbTasks/PlayerInfoMlb` relative path works better
import { PlayerInfoMlb } from '../shared/dbTasks/PlayerInfoMlb.js';
import { MlbController } from '../shared/Controllers/MlbController.js';
import { DbMlbGameBookData } from '../shared/dbTasks/DbMlbGameBookData.js';
import { DbGameBookData } from '../shared/dbTasks/DbGameBookData.js';
import { SportsBookController } from '../shared/Controllers/SportsBookController.js';
import { DbPlayerPropData } from '../shared/dbTasks/DbPlayerPropData.js';
import { PlayerPropController } from '../shared/Controllers/PlayerPropController.js';
import { DbNhlPlayerInfo } from '../shared/dbTasks/DbNhlPlayerInfo.js';
import { NhlPlayerInfoController } from '../shared/Controllers/NhlPlayerInfoController.js';
import { DbNhlPlayerGameStats } from '../shared/dbTasks/DbNhlPlayerGameStats.js';
import { NhlPlayerGameStatsController } from '../shared/Controllers/NhlPlayerGameStatsController.js';
import { NbaPlayerInfoDb } from '../shared/dbTasks/NbaPlayerInfoDb.js';
import { NbaController } from '../shared/Controllers/NbaController.js';
import { DbNbaGameStats } from '../shared/dbTasks/DbNbaGameStats.js';
import { createPostgresDataProvider } from 'remult/postgres';
import { DbNbaTeamGameStats } from '../shared/dbTasks/DbNbaTeamGameStats.js';
import { DbNbaTeamLogos } from '../shared/dbTasks/DbNbaTeamLogos.js';

export const api = remultExpress({
  entities: [
    PlayerInfoMlb,
    DbMlbGameBookData,
    DbGameBookData,
    DbPlayerPropData,
    DbNhlPlayerInfo,
    DbNhlPlayerGameStats,
    NbaPlayerInfoDb,
    DbNbaGameStats,
    DbNbaTeamGameStats,
    DbNbaTeamLogos
  ],
  controllers: [
    MlbController,
    SportsBookController,
    PlayerPropController,
    NhlPlayerInfoController,
    NhlPlayerGameStatsController,
    NbaController,
  ],

  //comment out below when local
  //small change
        dataProvider: createPostgresDataProvider({
    connectionString: "postgresql://postgres:eg*gE31aCf66e5A*A5G35*3d3g1fgCcC@postgres.railway.internal:5432/railway" 
  })      
  
});
