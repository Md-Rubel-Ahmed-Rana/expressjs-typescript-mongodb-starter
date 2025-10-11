import { model, Schema } from "mongoose";
import { IUserSetting } from "./user-settings.interface";
import { schemaOptions } from "@/utils/schemaOptions";
import {
  OTP_CHANNEL,
  PROFILE_VISIBILITY,
  THEME,
  VERIFICATION_METHOD,
} from "./user-settings.constants";

const userSettingSchema = new Schema<IUserSetting>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    otp_channel: {
      type: String,
      enum: Object.values(OTP_CHANNEL),
      default: OTP_CHANNEL.EMAIL,
    },
    verification_method: {
      type: String,
      enum: Object.values(VERIFICATION_METHOD),
      default: VERIFICATION_METHOD.LINK,
    },
    notification: {
      email_notifications: { type: Boolean, default: true },
      sms_notifications: { type: Boolean, default: false },
      push_notifications: { type: Boolean, default: true },
    },
    preferences: {
      language: { type: String, default: "en" },
      timezone: { type: String, default: "UTC" },
      theme: {
        type: String,
        enum: Object.values(THEME),
        default: THEME.SYSTEM,
      },
    },
    privacy: {
      profile_visibility: {
        type: String,
        enum: Object.values(PROFILE_VISIBILITY),
        default: PROFILE_VISIBILITY.PUBLIC,
      },
      two_factor_auth_enabled: { type: Boolean, default: false },
    },
  },
  schemaOptions
);

export const UserSettingModel = model("UserSetting", userSettingSchema);
