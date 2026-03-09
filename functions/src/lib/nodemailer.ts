import * as nodemailer from "nodemailer";
import { defineSecret } from "firebase-functions/params";

const NODEMAILER_USER = defineSecret("NODEMAILER_USER");
const NODEMAILER_PASS = defineSecret("NODEMAILER_PASS");

class EmailService {
  private transporter!: nodemailer.Transporter;

  async init() {
    const user = await NODEMAILER_USER.value();
    const pass = await NODEMAILER_PASS.value();

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

    const from = await NODEMAILER_USER.value();
    await this.transporter.sendMail({
      from,
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
