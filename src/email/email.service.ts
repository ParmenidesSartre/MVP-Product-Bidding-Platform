import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { template } from '../utils/html';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Set up the transporter using Gmail SMTP server
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPasswordResetEmail(
    to: string,
    resetCode: string,
    userName: string,
  ) {
    const htmlContent = template(resetCode, userName);

    const mailOptions = {
      from: `"BoilerPlate Innovation" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Password Reset Request',
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  }
}
