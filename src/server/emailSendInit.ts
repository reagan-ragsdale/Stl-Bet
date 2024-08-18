import { ErrorEmailController } from "../shared/Controllers/errorEmailController";
import { emailer } from "./emailService";
ErrorEmailController.sendEmail = async (error: string) => await emailer(error)