import { Types } from "mongoose";

export type IUserSetting = {
  user: Types.ObjectId;

  otp_channel: "email" | "sms";

  notification: {
    email_notifications: boolean;
    sms_notifications: boolean;
    push_notifications: boolean;
  };

  preferences: {
    language: string;
    timezone: string;
    theme: "light" | "dark" | "system";
  };

  privacy: {
    profile_visibility: "public" | "private" | "friends-only";
    two_factor_auth_enabled: boolean;
  };
};
