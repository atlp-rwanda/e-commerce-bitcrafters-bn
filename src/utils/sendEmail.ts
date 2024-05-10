import nodemailer from 'nodemailer'
import {
  NODEMAILER_SERVICE,
  NODEMAILER_USER,
  NODEMAILER_EMAIL_PORT,
  NODEMAILER_HOST,
  NODEMAILER_SECURE,
  NODEMAILER_PASS,
} from '../config'

const Mailer = async (email: string, subject: string, mail: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: NODEMAILER_SERVICE,
      host: NODEMAILER_HOST,
      port: NODEMAILER_EMAIL_PORT,
      secure: NODEMAILER_SECURE,
      auth: {
        user: NODEMAILER_USER,
        pass: NODEMAILER_PASS,
      },
    })

    transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: email,
      subject,
      html: mail,
    })
  } catch (error) {
    throw new Error(error)
  }
}

export default Mailer
