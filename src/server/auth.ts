
import express, { Router } from "express"
import  { repo } from "remult"
import { DbUsers } from "../shared/dbTasks/DbUsers"
import { api } from "./api"
import { compare } from "bcrypt"

export const auth = Router()

auth.use(express.json())
auth.use(api.withRemult)

auth.post("/api/signIn", async(req, res) => {
  const user = await repo(DbUsers).findFirst({userName: req.body.userName})
  if (user &&  await compare(req.body.password, user.userPass)) {
    const result = {userName: user.userName, userPass: user.userPass}
    req.session!["user"] = result
    res.json(result)
  } else {
    res.status(404).json("Invalid user, try 'Steve' or 'Jane'")
  }
})


auth.post("/api/signOut", (req, res) => {
  req.session!["user"] = null
  res.json("signed out")
})

auth.get("/api/currentUser", (req, res) => res.json(req.session!["user"]))