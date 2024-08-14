import { PropScreenComponent } from "../app/prop-screen/prop-screen.component";
import { emailer } from "./emailService";
 PropScreenComponent.sendEmail = async (error: string) => await emailer(error)