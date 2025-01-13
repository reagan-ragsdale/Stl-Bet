import { Allow, BackendMethod, remult } from "remult"

import { DbUsers, userRepo } from "../dbTasks/DbUsers";
import { getCurrentUser, setSessionUser } from "../../server/server-session";
import type { generate, verify } from 'password-hash'
import { ErrorEmailController } from "./ErrorEmailController";




export class UsersController {

  static writeToLog: (textToWrite: string) => void;

  static generate: typeof generate;
  static verify: typeof verify;

  @BackendMethod({ allowed: true })
  static async signUp(username: string, password: string, confirmPassword: string) {
    if(password != confirmPassword) throw Error('Passwords must match')
    let users = await userRepo.find({ where: { userName: username } })
    if (users.length > 0) {
      throw Error('There is someone already with that username')
    }
    else {
      if (!password) throw Error('Password is required')
        if(password.length < 8) throw Error('Password length must be at least 8 characters')
      const user = await userRepo.insert({
        userName: username,
        userPass: UsersController.generate(password)
        //userPass: generate(password)
      })
    
      return setSessionUser({
        id: user.id!,
        name: user.userName!,
        roles: user.isAdmin ? ['admin'] : []
      })
    }

  }
  @BackendMethod({ allowed: true })
  static async currentUser() {
    return getCurrentUser();
  }
  @BackendMethod({ allowed: true })
  static async login(username: string, password: string) {
    const user = await userRepo.findFirst({ userName: username })
    if (!user)
      throw Error("Invalid Credentials")
    if (!UsersController.verify(password, user.userPass))
      throw Error("Invalid Credentials")
    return setSessionUser({
      id: user.id!,
      name: user.userName!,
      roles: user.isAdmin ? ['admin'] : []
    })
  }
  @BackendMethod({ allowed: true })
  static async logout() {
    setSessionUser(null)
  }

}
