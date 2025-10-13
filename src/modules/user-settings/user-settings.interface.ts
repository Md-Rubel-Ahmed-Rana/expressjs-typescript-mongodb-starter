import { Types } from "mongoose";

export type IUserSetting = {
  user: Types.ObjectId;

  otp_channel: IOtpChannel;
  email_verify_method: IEmailVerifyMethod;

  notification: {
    email_notifications: boolean;
    sms_notifications: boolean;
    push_notifications: boolean;
  };

  preferences: {
    language: string;
    timezone: string;
    theme: ITheme;
  };

  privacy: {
    profile_visibility: IProfileVisibility;
    two_factor_auth_enabled: boolean;
  };
};

export type IOtpChannel = "email" | "phone";
export type IEmailVerifyMethod = "link" | "otp" | null;

export type ITheme = "light" | "dark" | "system";

export type IProfileVisibility = "public" | "private" | "friends-only";
