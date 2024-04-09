import nodemailer, { Transporter } from 'nodemailer';
import { verificationToken, Person } from '../models/user';

export const Mailer = async (email: any, subject: any, text: any) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.NODEMAILER_SERVICE,
      host: process.env.NODEMAILER_HOST,
      port: parseInt(process.env.NODEMAILER_EMAIL_PORT || '', 10), // Convert to a number
      secure: process.env.SECURE === 'true', // Convert to a boolean
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: subject,
      text: text,
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.log('Email not sent, error: ' + error);
  }
};