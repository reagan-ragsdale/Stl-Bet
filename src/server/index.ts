import express from "express"
import { api } from "./api"
import session from "cookie-session"
import { auth } from "./auth"
import { createKnexDataProvider } from "remult/remult-knex"
import helmet from "helmet"
import compression from "compression"
import path from "path"
import { JsonDataProvider } from "remult"
import { JsonEntityFileStorage } from "remult/server"
import { remultExpress } from "remult/remult-express"

const app = express()

app.use(
  remultExpress({
  dataProvider: async () =>
    new JsonDataProvider(new JsonEntityFileStorage("./db"))
})
    /* session({
      secret: process.env["SESSION_SECRET"] || "my secret"
    }) */
  )
//app.use(auth)
app.use(helmet())
app.use(compression())
app.use(api)

app.use(express.static(path.join(__dirname, "../remult-angular-todo")))
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../remult-angular-todo", "index.html"))
})

app.listen(process.env["PORT"] || 3002, () => console.log("Server started"))