//import { env} from "src/env"
import nodemailer from 'nodemailer';

async function sendEmail() {
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
      text: 'Test'
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

sendEmail();