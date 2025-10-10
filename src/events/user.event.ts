import { UserSettingService } from "@/modules/user-settings/user-settings.service";
import { emitter } from "./eventEmitter";

// receive event when an user register
emitter.on("user.registered", async (user_id) => {
  console.log(`✅ User registered event received for user ID: ${user_id}`);

  // initiate user default settings
  await UserSettingService.initiateUserSetting(user_id);
});
