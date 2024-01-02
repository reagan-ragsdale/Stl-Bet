import { remultExpress } from 'remult/remult-express';
//import { Task } from '../shared/dbTasks/Task';
//import { TaskController } from '../shared/Controllers/TaskController';
// Changed path from `src/shared/dbTasks/PlayerInfoMlb` to `../shared/dbTasks/PlayerInfoMlb` relative path works better
import { PlayerInfoMlb } from '../shared/dbTasks/playerInfoMlb.js';
import { MlbController } from '../shared/Controllers/mlbController.js';
import { DbMlbGameBookData } from '../shared/dbTasks/dbMlbGameBookData.js';
import { DbGameBookData } from '../shared/dbTasks/dbGameBookData.js';
import { SportsBookController } from '../shared/Controllers/sportsBookController.js';
import { DbPlayerPropData } from '../shared/dbTasks/dbPlayerPropData.js';
import { PlayerPropController } from '../shared/Controllers/playerPropController.js';
import { DbNhlPlayerInfo } from '../shared/dbTasks/dbNhlPlayerInfo.js';
import { NhlPlayerInfoController } from '../shared/Controllers/nhlPlayerInfoController.js';
import { DbNhlPlayerGameStats } from '../shared/dbTasks/dbNhlPlayerGameStats.js';
import { NhlPlayerGameStatsController } from '../shared/Controllers/nhlPlayerGameStatsController.js';
import { NbaPlayerInfoDb } from '../shared/dbTasks/nbaPlayerInfoDb.js';
import { NbaController } from '../shared/Controllers/nbaController.js';
import { DbNbaGameStats } from '../shared/dbTasks/dbNbaGameStats.js';
import { createPostgresDataProvider } from 'remult/postgres';
import { DbNbaTeamGameStats } from '../shared/dbTasks/dbNbaTeamGameStats.js';
import { DbNbaTeamLogos } from '../shared/dbTasks/dbNbaTeamLogos.js';

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
