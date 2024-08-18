import { Allow, BackendMethod, remult } from "remult"
import type { emailer } from "../../server/emailService"







export class ErrorEmailController {


  static sendEmail: typeof emailer

  @BackendMethod({ allowed: true })
  static async sendEmailError(error: string) {
    console.error(error)
    ErrorEmailController.sendEmail(error)

  }


}

