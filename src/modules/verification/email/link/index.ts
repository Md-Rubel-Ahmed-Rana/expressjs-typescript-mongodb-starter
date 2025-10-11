import { MailService } from "@/config/email";
import { envConfig } from "@/config/index";
import { HttpStatusCode } from "@/lib/httpStatus";
import { JwtInstance } from "@/lib/jwt";
import ApiError from "@/middlewares/error";
import { UserService } from "@/modules/users/users.service";
import { verificationEmailTemplate } from "@/templates/email/verification-template";
import { Types } from "mongoose";

class Service {
  async sendVerificationLink(payload: { name: string; email: string }) {
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

  async verifyTokenFromLink(token: string) {
    if (!token) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "Verification token is required"
      );
    }

    // Step 1: Verify and decode token
    const result = await JwtInstance.verifyEmailVerificationToken(token);

    if (!result?.email) {
      throw new ApiError(
        HttpStatusCode.UNAUTHORIZED,
        "Invalid or malformed verification token"
      );
    }

    // Step 2: Find the user by email
    const user = await UserService.getUserByDynamicKeyValue(
      "email",
      result.email
    );

    if (!user) {
      throw new ApiError(
        HttpStatusCode.NOT_FOUND,
        "No account found for this email. Please request a new verification link."
      );
    }

    // Step 3 (Optional): Mark as verified if not already
    if (!user.is_verified) {
      await UserService.updateUserById(user._id as unknown as Types.ObjectId, {
        is_verified: true,
      });
    }
  }
}

export const EmailVerifyLinkService = new Service();
