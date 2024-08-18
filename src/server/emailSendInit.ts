import { ErrorEmailController } from "../shared/Controllers/ErrorEmailController";
import { emailer } from "./emailService";
ErrorEmailController.sendEmail = async (error: string) => await emailer(error)