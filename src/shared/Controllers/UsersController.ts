import { Allow, BackendMethod, remult } from "remult"

import { DbUsers, userRepo } from "../dbTasks/DbUsers";
import { generate, verify } from 'password-hash'
import { setSessionUser } from "../../server/server-session";

export class UsersController {

   
  
    @BackendMethod({ allowed: true })
    static async signUp(username: string, password: string) {
      if (!password) throw Error('Password is required')
      const user = await userRepo.insert({
        userName: username,
        userPass: generate(password)
      })
      //return setSessionUserBasedOnUser(user)
    }
  
}