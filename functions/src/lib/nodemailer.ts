import * as nodemailer from "nodemailer";
import { configs } from "../configs/env";

class EmailService {
  private transporter: nodemailer.Transporter;
  private from: string;

  constructor() {
    this.from = configs.nodemailerUser;

    console.log(`EmailService configs: ${configs.nodemailerUser}, ${configs.nodemailerPass}`);

    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: configs.nodemailerUser,
        pass: configs.nodemailerPass,
      },
    });
  }

  async sendEmail(to: string, name: string, path: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to,
      subject: "Thanks for completing the form",
      html: `
        <h2>
        Hey ${name}, we’ve received your information. Your path: ${path}. 
        Your personalized reports will be calculated after you reach Modules 10-12.
        Questions? DM your Community Manager in Circle.
        </h2>
      `,
    });
  }
}

export const emailService = new EmailService();
