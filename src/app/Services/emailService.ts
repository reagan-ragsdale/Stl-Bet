//import { env} from "src/env"
const nodemailer = require('nodemailer');

async function sendEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'stlbetcode@gmail.com',
        pass: 'Betstl2210'
      }
    });

    const mailOptions = {
      from: 'stlbet@gmail.com',
      to: 'stlbet@example.com',
      subject: 'Crash',
      text: 'Test'
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

sendEmail();