import * as nodemailer from "nodemailer";
import { defineSecret } from "firebase-functions/params";

const NODEMAILER_USER = defineSecret("NODEMAILER_USER");
const NODEMAILER_PASS = defineSecret("NODEMAILER_PASS");

class EmailService {
  private transporter: nodemailer.Transporter;
  private from: string;

  constructor() {
    const user = NODEMAILER_USER.value();
    const pass = NODEMAILER_PASS.value();

    this.from = user;

    console.log(`EmailService configs: ${user}, ${pass}`);

    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user, pass },
    });
  }

  async sendEmail(to: string, name: string, path: string): Promise<void> {
    console.log(this.from);

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
