import { envConfig } from "@/config/index";
import { ILoginResponse } from "@/interfaces/common.interface";
import { HttpStatusCode } from "@/lib/httpStatus";
import ApiError from "@/middlewares/error";
import { AuthService } from "@/modules/auth/auth.service";
import { IOtpVerify } from "@/modules/otp/otp.interface";
import { OTPService } from "@/modules/otp/otp.service";
import { SMSService } from "@/modules/sms/sms.service";
import { UserService } from "@/modules/users/users.service";
import { generateMSfromMinutes } from "@/utils/generateMSfromMinutes";

class Service {
  async sendPhoneVerifyOtp(phone_number: string) {
    const minutes = 10;
    const durationMs = generateMSfromMinutes(minutes);
    const otp = await OTPService.createOtp(phone_number, durationMs);

    // send SMS
    const message = `Your ${envConfig.app.name} verification code is ${otp}. It will expire in ${minutes} minutes. Do not share this code with anyone.`;
    await SMSService.sendGeneralMessage(phone_number, message);
  }

  async verifyOtp(data: IOtpVerify): Promise<ILoginResponse> {
    // retrieve and check user existence
    const user = await UserService.getUserByDynamicKeyValue(
      "phone_number",
      data.credential
    );
    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "User was not found");
    }

    // verify the provided OTP
    await OTPService.verifyOTP(data);

    // update user status and others
    await UserService.updateUserById(user._id, {
      status: "active",
      is_verified: true,
      last_login_at: new Date(),
    });

    // generate login credentials and keep the user as logged in
    return await AuthService.generateLoginCredentials(user._id);
  }
}

export const PhoneVerifyService = new Service();
