import { remultExpress } from 'remult/remult-express';
import { Task } from '../shared/dbTasks/Task';
import { TaskController } from '../shared/Controllers/TaskController';
// Changed path from `src/shared/dbTasks/PlayerInfoMlb` to `../shared/dbTasks/PlayerInfoMlb` relative path works better
import { PlayerInfoMlb } from '../shared/dbTasks/PlayerInfoMlb';
import { MlbController } from '../shared/Controllers/MlbController';
import { DbMlbGameBookData } from '../shared/dbTasks/DbMlbGameBookData';
import { DbGameBookData } from '../shared/dbTasks/DbGameBookData';
import { SportsBookController } from '../shared/Controllers/SportsBookController';
import { DbPlayerPropData } from '../shared/dbTasks/DbPlayerPropData';
import { PlayerPropController } from '../shared/Controllers/PlayerPropController';
import { DbNhlPlayerInfo } from '../shared/dbTasks/DbNhlPlayerInfo';
import { NhlPlayerInfoController } from '../shared/Controllers/NhlPlayerInfoController';
import { DbNhlPlayerGameStats } from '../shared/dbTasks/DbNhlPlayerGameStats';
import { NhlPlayerGameStatsController } from '../shared/Controllers/NhlPlayerGameStatsController';
import { NbaPlayerInfoDb } from '../shared/dbTasks/NbaPlayerInfoDb';
import { NbaController } from '../shared/Controllers/NbaController';
import { DbNbaGameStats } from '../shared/dbTasks/DbNbaGameStats';
import { createPostgresDataProvider } from 'remult/postgres';

export const api = remultExpress({
  entities: [
    Task,
    PlayerInfoMlb,
    DbMlbGameBookData,
    DbGameBookData,
    DbPlayerPropData,
    DbNhlPlayerInfo,
    DbNhlPlayerGameStats,
    NbaPlayerInfoDb,
    DbNbaGameStats,
  ],
  controllers: [
    TaskController,
    MlbController,
    SportsBookController,
    PlayerPropController,
    NhlPlayerInfoController,
    NhlPlayerGameStatsController,
    NbaController,
  ],

  // getUser: req => req.session!["user"]
});
