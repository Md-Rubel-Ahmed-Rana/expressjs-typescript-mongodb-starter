import { envConfig } from "@/config/index";
import { OTPService } from "@/modules/otp/otp.service";
import { SMSService } from "@/modules/sms/sms.service";

class Service {
  async sendPhoneVerifyOtp(phone_number: string) {
    const durationMs = 10 * 60; // 10 mins
    const otp = await OTPService.createOtp(phone_number, durationMs);

    // send SMS
    const message = `Your ${envConfig.app.name} verification code is ${otp}. It will expire in 10 minutes. Do not share this code with anyone.`;
    await SMSService.sendGeneralMessage(phone_number, message);
  }
}

export const PhoneVerifyService = new Service();
