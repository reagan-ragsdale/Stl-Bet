import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import cron from 'node-cron'


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

  cron.schedule(`*/1 * * * *`, async () => {
    console.log('running your task...');
  });
