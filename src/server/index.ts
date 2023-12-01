import express from "express"
import { remultExpress } from "remult/remult-express"
import { JsonDataProvider } from "remult"
import { JsonEntityFileStorage } from "remult/server"
import helmet from "helmet"
import compression from "compression"
import path from "path"

const app = express()

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'script-src-attr': ["'unsafe-inline'"],
      },
    },
  })
)
app.use(compression())

app.use(
  remultExpress({
    dataProvider: async () =>
      new JsonDataProvider(new JsonEntityFileStorage("../db"))
  })
)
app.use(express.static(path.join(__dirname, '../remult-angular-todo/browser')));
app.get('/*', (req, res) => {
  res.sendFile(
    path.join(__dirname, '../remult-angular-todo/browser', 'index.html')
  );
});