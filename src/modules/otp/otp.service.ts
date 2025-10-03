import ApiError from "@/middlewares/error";
import { HttpStatusCode } from "@/lib/httpStatus";
import { SMSService } from "../sms/sms.service";
import { OTPModel } from "./otp.model";
import { IOtpVerify } from "./otp.interface";

class Service {
  async sendVerificationOtp(phone_number: string) {
    const isExist = await OTPModel.findOne({ phone_number });
    if (isExist) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "We've already sent an OTP to your inbox. Please check sms and verify your account"
      );
    }

    const otp = await this.generateOtp();
    await OTPModel.create({ phone_number, otp });

    // send sms to verify account
    await SMSService.sendOtp(phone_number, otp);
  }

  async verifyOTP(data: IOtpVerify) {
    const otpRecord = await OTPModel.findOne({
      phone_number: data.phone_number,
    });

    if (!otpRecord) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "Your otp verification time has been expired. Please resend otp"
      );
    }

    if (otpRecord?.otp !== data.otp) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "Your provided otp was wrong. Please try with correct otp"
      );
    }
  }

  async sendForgetPasswordOtp(phone_number: string) {
    const isExist = await OTPModel.findOne({ phone_number });
    if (isExist) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "We've already sent an OTP to your inbox. Please check sms and verify your account"
      );
    }

    // generate otp
    const otp = await this.generateOtp();
    await OTPModel.create({ phone_number, otp });

    // send sms
    await SMSService.sendOtp(phone_number, otp);
  }

  private async generateOtp(): Promise<number> {
    return Math.floor(100000 + Math.random() * 900000);
  }
}

export const OTPService = new Service();
