import express from 'express';
import { remultExpress } from 'remult/remult-express';
import { JsonDataProvider } from 'remult';
import { JsonEntityFileStorage } from 'remult/server';
import session from "cookie-session"
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { api } from './api';
import { createPostgresDataProvider } from 'remult/postgres';
const connectionString = "postgresql://postgres:eg*gE31aCf66e5A*A5G35*3d3g1fgCcC@postgres.railway.internal:5432/railway"
const app = express();

app.use(
  session({
    secret: process.env["SESSION_SECRET"] || "my secret"
  })
)

app.use(
  helmet({
    contentSecurityPolicy: false/* {
      directives: {
        'script-src-attr': ["'unsafe-inline'"],
        //defaultSrc: ["'self'"],
        contentSecurityPolicy: false,
        //connectSrc: ["'self'", 'https://api.the-odds-api.com/v4/sports/'],
      },
    }, */
  })
);
app.use(compression());
// imported the `api` from `./api.ts` and used for all the routes.
// the `JsonDataProvider` is used to store the data in a JSON file by default, so there is no need to set it
app.use(api);

app.use(
  remultExpress({
    dataProvider:
      createPostgresDataProvider({
        connectionString
      })
  })
)

// In angular 16, the `index.html` file is in the `remult-angular-todo` folder, and not in the `remult-angular-todo/browser` folder
app.use(express.static(path.join(__dirname, '../remult-angular-todo')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../remult-angular-todo', 'index.html'));
});

// Added this line to active express server on the port provided in the environment variable `PORT` or `3002`
app.listen(process.env['PORT'] || 3002, () => console.log('Server started'));
