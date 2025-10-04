import ApiError from "@/middlewares/error";
import { HttpStatusCode } from "@/lib/httpStatus";
import { SMSService } from "../sms/sms.service";
import { OTPModel } from "./otp.model";
import { IOtpVerify } from "./otp.interface";

class Service {
  async createOtp(credential: string, durationMs: number) {
    const otp = await this.generateOtp();

    const expireAt = new Date(Date.now() + durationMs);

    return await OTPModel.create({
      credential,
      otp,
      expireAt,
    });
  }

  async sendVerificationOtp(credential: string) {
    const isExist = await OTPModel.findOne({ credential });
    if (isExist) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "We've already sent an OTP to your inbox. Please check sms and verify your account"
      );
    }

    const otp = await this.generateOtp();
    await OTPModel.create({ credential, otp });

    // send sms to verify account
    await SMSService.sendOtp(credential, otp);
  }

  async verifyOTP(data: IOtpVerify) {
    const otpRecord = await OTPModel.findOne({
      credential: data.credential,
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

  async sendForgetPasswordOtp(credential: string) {
    const isExist = await OTPModel.findOne({ credential });
    if (isExist) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "We've already sent an OTP to your inbox. Please check sms and verify your account"
      );
    }

    // generate otp
    const otp = await this.generateOtp();
    await OTPModel.create({ credential, otp });

    // send sms
    await SMSService.sendOtp(credential, otp);
  }

  private async generateOtp(): Promise<number> {
    return Math.floor(100000 + Math.random() * 900000);
  }
}

export const OTPService = new Service();
