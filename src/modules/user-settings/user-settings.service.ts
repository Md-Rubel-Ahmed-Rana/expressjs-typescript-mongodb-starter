import { Types } from "mongoose";
import { UserSettingModel } from "./user-settings.model";
import { IEmailVerifyMethod, IOtpChannel } from "./user-settings.interface";
import ApiError from "@/middlewares/error";
import { HttpStatusCode } from "@/lib/httpStatus";

class Service {
  // this is from event fire
  async initiateUserSetting(user_id: string | Types.ObjectId) {
    console.log("Initiating user settings from event fire", { user_id });
    try {
      const result = await UserSettingModel.create({ user: user_id });
      console.log("User setting initiated from event fire", result);
    } catch (error) {
      console.log("Failed to initiate user setting from event fire", error);
    }
  }

  // get setting by user id for a user
  async getMySettings(user_id: Types.ObjectId | string) {
    return await UserSettingModel.findOne({ user: user_id });
  }

  async getUserOtpChannelInfo(user_id: Types.ObjectId | string): Promise<{
    channel: IOtpChannel;
    email_method: IEmailVerifyMethod;
  }> {
    const settings = await UserSettingModel.findOne({ user: user_id });

    if (!settings) {
      throw new ApiError(
        HttpStatusCode.NOT_FOUND,
        "User settings was not found"
      );
    }

    return {
      channel: settings.otp_channel,
      email_method: settings.email_verify_method,
    };
  }

  async is2FAEnabled(user_id: Types.ObjectId | string): Promise<boolean> {
    const settings = await UserSettingModel.findOne({ user: user_id });
    if (!settings) {
      throw new ApiError(
        HttpStatusCode.NOT_FOUND,
        "User settings was not found"
      );
    }

    return settings.privacy.two_factor_auth_enabled;
  }
}

export const UserSettingService = new Service();
