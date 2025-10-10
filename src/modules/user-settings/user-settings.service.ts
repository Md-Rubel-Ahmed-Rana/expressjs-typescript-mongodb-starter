import { Types } from "mongoose";
import { UserSettingModel } from "./user-settings.model";

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
}

export const UserSettingService = new Service();
