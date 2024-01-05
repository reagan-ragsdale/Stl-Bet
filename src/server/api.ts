import { remultExpress } from 'remult/remult-express';
//import { Task } from '../shared/dbTasks/Task';
//import { TaskController } from '../shared/Controllers/TaskController';
// Changed path from `src/shared/dbTasks/PlayerInfoMlb` to `../shared/dbTasks/PlayerInfoMlb` relative path works better
import { PlayerInfoMlb } from '../shared/dbTasks/playerInfoMlb';
import { MlbController } from '../shared/Controllers/mlbController';
import { DbMlbGameBookData } from '../shared/dbTasks/dbMlbGameBookData';
import { DbGameBookData } from '../shared/dbTasks/dbGameBookData';
import { SportsBookController } from '../shared/Controllers/sportsBookController';
import { DbPlayerPropData } from '../shared/dbTasks/dbPlayerPropData';
import { PlayerPropController } from '../shared/Controllers/playerPropController';
import { DbNhlPlayerInfo } from '../shared/dbTasks/dbNhlPlayerInfo';
import { NhlPlayerInfoController } from '../shared/Controllers/nhlPlayerInfoController';
import { DbNhlPlayerGameStats } from '../shared/dbTasks/dbNhlPlayerGameStats';
import { NhlPlayerGameStatsController } from '../shared/Controllers/nhlPlayerGameStatsController';
import { NbaPlayerInfoDb } from '../shared/dbTasks/nbaPlayerInfoDb';
import { NbaController } from '../shared/Controllers/nbaController';
import { DbNbaGameStats } from '../shared/dbTasks/dbNbaGameStats';
import { createPostgresDataProvider } from 'remult/postgres';
import { DbNbaTeamGameStats } from '../shared/dbTasks/dbNbaTeamGameStats';
import { DbNbaTeamLogos } from '../shared/dbTasks/dbNbaTeamLogos';

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
       /*  dataProvider: createPostgresDataProvider({
    connectionString: "postgresql://postgres:eg*gE31aCf66e5A*A5G35*3d3g1fgCcC@postgres.railway.internal:5432/railway" 
  })   */    
  
});
