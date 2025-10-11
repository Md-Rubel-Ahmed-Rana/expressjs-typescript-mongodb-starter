import { MailService } from "@/config/email";
import { ILoginResponse } from "@/interfaces/common.interface";
import { HttpStatusCode } from "@/lib/httpStatus";
import ApiError from "@/middlewares/error";
import { AuthService } from "@/modules/auth/auth.service";
import { IOtpVerify } from "@/modules/otp/otp.interface";
import { OTPService } from "@/modules/otp/otp.service";
import { UserService } from "@/modules/users/users.service";
import { verificationEmailOtpTemplate } from "@/templates/email/verification-template";

class Service {
  async sendEmailVerifyOtp(payload: { name: string; email: string }) {
    console.log(payload);
    // steps analysis
    // 1. generate 6 digit otp and store on DB with dynamically set expired (auto deletion) time
    const expireDurationMs = 5 * 60; // 5 minutes
    const otp = await OTPService.createOtp(payload.email, expireDurationMs);
    // 2. design the email template
    const htmlContent = verificationEmailOtpTemplate({
      name: payload.name,
      otp,
    });
    // 3. send email to user mailbox
    const result = await MailService.sendEmail(
      "One-Time Password (OTP) to Verify Your Account",
      payload.email,
      htmlContent
    );

    console.log({
      message: "Email verification otp has been sent successfully",
      result,
    });
  }

  async verifyOtp(data: IOtpVerify): Promise<ILoginResponse> {
    const user = await UserService.getUserByDynamicKeyValue(
      "email",
      data.credential
    );
    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "User not found");
    }

    await OTPService.verifyOTP(data);

    return await AuthService.generateLoginCredentials(user._id);
  }
}

export const EmailVerifyOTPkService = new Service();
