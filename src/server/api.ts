import { remultExpress } from 'remult/remult-express';
import { DbMlbPlayerInfo } from '../shared/dbTasks/DbMlbPlayerInfo';
import { MlbController } from '../shared/Controllers/MlbController';
import { DbMlbGameBookData } from '../shared/dbTasks/DbMlbGameBookData';
import { DbGameBookData } from '../shared/dbTasks/DbGameBookData';
import { SportsBookController } from '../shared/Controllers/SportsBookController';
import { DbPlayerPropData } from '../shared/dbTasks/DbPlayerPropData';
import { PlayerPropController } from '../shared/Controllers/PlayerPropController';
import { DbNhlPlayerGameStats } from '../shared/dbTasks/DbNhlPlayerGameStats';
import { NbaPlayerInfoDb } from '../shared/dbTasks/NbaPlayerInfoDb';
import { NbaController } from '../shared/Controllers/NbaController';
import { DbNbaGameStats } from '../shared/dbTasks/DbNbaGameStats';
import { createPostgresDataProvider } from 'remult/postgres';
import { DbNbaTeamGameStats } from '../shared/dbTasks/DbNbaTeamGameStats';
import { DbNbaTeamLogos } from '../shared/dbTasks/DbNbaTeamLogos';
import { config } from 'dotenv'
import cron from 'node-cron'
import { DBMlbPlayerGameStats } from '../shared/dbTasks/DbMlbPlayerGameStats';
import { DbPlayerInfo } from '../shared/dbTasks/DbPlayerInfo';
import { PlayerInfoController } from '../shared/Controllers/PlayerInfoController';
import { cronSportsBookHourly } from '../app/cronJobs/cronSportsBookLoadHourly';
import { DBMlbPlayerGameStatTotals } from '../shared/dbTasks/DbMlbPlayerGameStatTotals';
import { cronLoadMlbPlayer } from '../app/cronJobs/cronLoadMlbPlayerPropsHorly';
import { TeamInfoController } from '../shared/Controllers/TeamInfoController';
import { DbTeamInfo } from '../shared/dbTasks/DBTeamInfo';
import { DbUsers } from '../shared/dbTasks/DbUsers';
import { UsersController } from '../shared/Controllers/UsersController';
import { initRequest } from './server-session';
import { DBNflTeamGameStats } from '../shared/dbTasks/DbNflTeamGameStats';
import { DBNflPlayerGameStats } from '../shared/dbTasks/DbNflPlayerGameStats';
import { NflController } from '../shared/Controllers/NflController';
import { cronLoadNflGameStats } from '../app/cronJobs/cronLoadNflGameStats';
import { ErrorEmailController } from '../shared/Controllers/ErrorEmailController';
import { generate, verify } from 'password-hash'
import { emailer } from './emailService';
import { DBNflTeamGameStatTotals } from '../shared/dbTasks/DbNflTeamGameStatTotals';
import { DBNflPlayerGameStatTotals } from '../shared/dbTasks/DbNflPlayerGameStatTotals';
import { cronLoadNhlStats } from '../app/cronJobs/cronLoadNhlStats';
import { DbNhlTeamGameStats } from '../shared/dbTasks/DbNhlTeamGameStats';
import { BestBetController } from '../shared/Controllers/BestBetController';
import { DbPlayerBestBets } from '../shared/dbTasks/DBPlayerBestBets';
import { cronLoadBestBets } from '../app/cronJobs/cronLoadBestBets';
import { NhlController } from '../shared/Controllers/NhlController';
import { DbGameBookDataHistory } from '../shared/dbTasks/DbGameBookDataHistory';
import { cronLoadIntoHistoryTables } from '../app/cronJobs/cronLoadIntoHistoryTables';


config()
UsersController.generate =generate;
UsersController.verify = verify
ErrorEmailController.sendEmail = emailer;


export const api = remultExpress({
  entities: [
    DbMlbPlayerInfo,
    DbMlbGameBookData,
    DbGameBookData,
    DbPlayerPropData,
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
    DBNflPlayerGameStats,
    DBNflTeamGameStatTotals,
    DBNflPlayerGameStatTotals,
    DbNhlPlayerGameStats,
    DbNhlTeamGameStats,
    DbPlayerBestBets,
    DbGameBookDataHistory
  ],
  controllers: [
    MlbController,
    SportsBookController,
    PlayerPropController,
    NbaController,
    PlayerInfoController,
    TeamInfoController,
    UsersController,
    NflController,
    ErrorEmailController,
    BestBetController,
    NhlController

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

    //cron.schedule('00 10 * * *', () => mlbCronFile())

    cron.schedule('0 */2 * * *', () => cronSportsBookHourly())
    cron.schedule('*/30 * * * *', () => cronLoadMlbPlayer())
    cron.schedule('04 13 * * *', () => cronLoadNflGameStats())
    cron.schedule('0 17 * * 2', () => cronLoadBestBets())
    cron.schedule('09 10 * * *', () => cronLoadNhlStats())
    cron.schedule('30 21 * * *', () => cronLoadIntoHistoryTables())
  }

});


