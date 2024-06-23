import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });


const sendEmail = async(options) => {
    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        // host: "sandbox.smtp.mailtrap.io",
        port: process.env.SMTP_PORT,
        // port: 2525,
        auth: {
          user: process.env.SMTP_EMAIL,
        //   user: "7c69bc83d2468a",
          pass: process.env.SMTP_PASSWORD
        //   pass: "4773a637d63f1d"
        }
    });

    const message = {
        from: `${process.env.SMTM_FROM_NAME} <${process.env.SMTM_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    await transport.sendMail(message);
};

module.exports = { sendEmail };