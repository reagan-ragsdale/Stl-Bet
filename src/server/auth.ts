
import express, { Router } from "express"
import  { repo } from "remult"
import { DbUsers } from "../shared/dbTasks/DbUsers"
import { api } from "./api"

export const auth = Router()

auth.use(express.json())
auth.use(api.withRemult)

