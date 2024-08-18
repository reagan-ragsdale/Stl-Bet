import { Allow, BackendMethod, remult } from "remult"




export class ErrorEmailController {


  static sendEmail: (message: string) => void

  @BackendMethod({ allowed: true })
  static async sendEmailError(error: string) {
    ErrorEmailController.sendEmail(error)

  }


}

