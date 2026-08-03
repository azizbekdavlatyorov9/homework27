import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: this.config.get<string>("EMAIL"),
        pass: this.config.get<string>("EMAIL_PASS"),
      },
    });
  }

  async sendOtp(email: string, code: string) {
    await this.transporter.sendMail({
      from: this.config.get<string>("EMAIL"),
      to: email,
      subject: "Verification Code",
      html: `
        <h2>GraphQL Auth</h2>
        <h3>Your verification code:</h3>
        <h1>${code}</h1>
        <p>This code expires in 2 minutes.</p>
      `,
    });
  }
}