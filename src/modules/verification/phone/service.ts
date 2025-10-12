import { envConfig } from "@/config/index";
import { OTPService } from "@/modules/otp/otp.service";
import { SMSService } from "@/modules/sms/sms.service";
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
}

export const PhoneVerifyService = new Service();
