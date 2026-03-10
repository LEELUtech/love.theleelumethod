import * as nodemailer from "nodemailer";
import { configs } from "../configs/env";

class EmailService {
  private transporter!: nodemailer.Transporter;

  async init() {
    const user = configs.nodemailerUser;
    const pass = configs.nodemailerPass;

    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user, pass },
    });

    return user;
  }

  async sendEmail(to: string, name: string, path: string): Promise<void> {
    if (!this.transporter) throw new Error("Transporter not initialized. Call init() first.");

    await this.transporter.sendMail({
      from: configs.nodemailerUser,
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

export const sendEmailFunction = async (to: string, name: string, path: string) => {
  await emailService.init();
  await emailService.sendEmail(to, name, path);
};
