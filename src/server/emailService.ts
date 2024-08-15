//import { env} from "src/env"
import nodemailer from 'nodemailer';

const emailer = async (errorMessage: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env['errorEmail'],
        pass: process.env['errorEmailPass']
      }
    });

    const mailOptions = {
      from: process.env['errorEmail'],
      to: process.env['errorEmail'],
      subject: 'Error',
      text: errorMessage
    };

    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
  }
}

export {emailer}