import { Allow, BackendMethod, remult } from "remult"

import { DbUsers, userRepo } from "../dbTasks/DbUsers";
import { generate, verify } from 'password-hash'

export class UsersController {

   
  
    @BackendMethod({ allowed: true })
    static async signUp(username: string, password: string) {
        let users = await userRepo.find({where:{userName: username}})
        if(users.length > 0){
            throw Error('There is someone already with that usernamne')
        }
        else{
            if (!password) throw Error('Password is required')
                const user = await userRepo.insert({
                  userName: username,
                  userPass: generate(password)
                })
        }
      
      //return setSessionUserBasedOnUser(user)
    }
  
}