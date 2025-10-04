import { MailService } from "@/config/email";
import { envConfig } from "@/config/index";
import { JwtInstance } from "@/lib/jwt";
import { verificationEmailTemplate } from "@/templates/email/verification-template";
import { Types } from "mongoose";

class Service {
  async sendVerificationLink(payload: {
    id: Types.ObjectId | string;
    name: string;
    email: string;
  }) {
    console.log(payload);
    // steps analysis
    // 1. generate jwt token with user unique credentials
    const token = await JwtInstance.generateEmailVerificationToken(payload);
    // 2. create a link with frontend domain and keep token either params (path variables or query)
    const domain =
      envConfig.app.env === "production"
        ? envConfig.clients.public_prod
        : envConfig.clients.public_dev;
    const link = `${domain}/auth/verification/email/${token}`;
    // 3. Design the email template and keep the verification link inside a linkable button
    const htmlContent = verificationEmailTemplate({
      name: payload.name,
      email: payload.email,
      link,
    });

    // 4. send email to the user mailbox
    const subject = `Verify your email address for ${envConfig.app.name}`;
    const result = await MailService.sendEmail(
      subject,
      payload.email,
      htmlContent
    );
    console.log({
      message: `Email verification email has been sent to ${payload.email}`,
      result,
    });
  }
}

export const EmailVerifyLinkService = new Service();
