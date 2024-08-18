import { remultExpress } from 'remult/remult-express';
//import { Task } from '../shared/dbTasks/Task';
//import { TaskController } from '../shared/Controllers/TaskController';
// Changed path from `src/shared/dbTasks/PlayerInfoMlb` to `../shared/dbTasks/PlayerInfoMlb` relative path works better
import { DbMlbPlayerInfo } from '../shared/dbTasks/DbMlbPlayerInfo';
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
import { DbNbaTeamGameStats } from '../shared/dbTasks/DbNbaTeamGameStats';
import { DbNbaTeamLogos } from '../shared/dbTasks/DbNbaTeamLogos';
import { config } from 'dotenv'
import { cronTestFile } from '../app/cronTest';
import { mlbCronFile } from '../app/mlbCron';
import cron from 'node-cron'
import { DBMlbPlayerGameStats } from '../shared/dbTasks/DbMlbPlayerGameStats';
import { DbPlayerInfo } from '../shared/dbTasks/DbPlayerInfo';
import { PlayerInfoController } from '../shared/Controllers/PlayerInfoController';
import { cronSportsBookHourly } from '../app/cronJobs/cronSportsBookLoadHourly';
import { DBMlbPlayerGameStatTotals } from '../shared/dbTasks/DbMlbPlayerGameStatTotals';
import { cronLoadMlbPlayer } from '../app/cronJobs/cronLoadMlbPlayerPropsHorly';
import { repo } from 'remult';
import { TeamInfoController } from '../shared/Controllers/TeamInfoController';
import { DbMlbTeamGameStats } from '../shared/dbTasks/DbMlbTeamGameStats';
import { DbTeamInfo } from '../shared/dbTasks/DBTeamInfo';
import { DbUsers } from '../shared/dbTasks/DbUsers';
import '../server/passGenerator';
import { UsersController } from '../shared/Controllers/UsersController';
import { initRequest } from './server-session';
import { nflApiController } from '../app/ApiCalls/nflApiCalls';
import { DBNflTeamGameStats } from '../shared/dbTasks/DbNflTeamGameStats';
import { DBNflPlayerGameStats } from '../shared/dbTasks/DbNflPlayerGameStats';
import { NflController } from '../shared/Controllers/NflController';
import { cronLoadNflGameStats } from '../app/cronJobs/cronLoadNflGameStats';
import { ErrorEmailController } from '../shared/Controllers/ErrorEmailController';

config()

export const api = remultExpress({
  entities: [
    DbMlbPlayerInfo,
    DbMlbGameBookData,
    DbGameBookData,
    DbPlayerPropData,
    DbNhlPlayerInfo,
    DbNhlPlayerGameStats,
    NbaPlayerInfoDb,
    DbNbaGameStats,
    DbNbaTeamGameStats,
    DbNbaTeamLogos,
    DBMlbPlayerGameStats,
    DbPlayerInfo,
    DBMlbPlayerGameStatTotals,
    DbTeamInfo,
    DbUsers,
    DBNflTeamGameStats,
    DBNflPlayerGameStats
  ],
  controllers: [
    MlbController,
    SportsBookController,
    PlayerPropController,
    NhlPlayerInfoController,
    NhlPlayerGameStatsController,
    NbaController,
    PlayerInfoController,
    TeamInfoController,
    UsersController,
    NflController,
    ErrorEmailController
    
  ],

  

  admin: true,
  dataProvider:
    process.env['DATABASE_URL'] ?
      createPostgresDataProvider({
        caseInsensitiveIdentifiers: true,
        connectionString: process.env['DATABASE_URL']
      }) : undefined
  , initRequest
  , initApi: async () => {

        //test
    //9:15am
    //cron.schedule('30 15 * * *', () => cronTestFile())
    //1:33pm

    cron.schedule('00 10 * * *', () => mlbCronFile())

    cron.schedule('0 */2 * * *', () => cronSportsBookHourly())
    cron.schedule('0 */2 * * *', () => cronLoadMlbPlayer())
    cron.schedule('25 14 * * *', () => cronLoadNflGameStats())
  }
  
});


