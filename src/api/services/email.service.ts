import nodemailer from 'nodemailer';
import ejs from 'ejs';
import * as fs from 'fs/promises';
import * as path from 'path';

interface UserData {
  name: string;
  email: string;
}

export class EmailService {
  private static instance: EmailService;
  private transporter: nodemailer.Transporter;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async sendRegistrationEmail(userData: UserData): Promise<void> {
    try {
      const templatePath = path.resolve(__dirname, '../../templates/registerEmail.ejs');
      const template = await fs.readFile(templatePath, 'utf-8');
      const emailHtml = ejs.render(template, userData);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userData.email,
        subject: 'Welcome to Our Service!',
        html: emailHtml,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
