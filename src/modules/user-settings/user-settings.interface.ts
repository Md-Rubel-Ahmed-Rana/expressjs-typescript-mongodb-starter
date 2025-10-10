import { Types } from "mongoose";

export type IUserSetting = {
  user: Types.ObjectId;

  otp_channel: IOtpChannel;

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

export type IOtpChannel = "email" | "sms";

export type ITheme = "light" | "dark" | "system";

export type IProfileVisibility = "public" | "private" | "friends-only";
