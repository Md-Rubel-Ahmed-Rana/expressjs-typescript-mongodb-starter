import { emitter } from "./eventEmitter";

// receive event when an user register
emitter.on("user.registered", async (userId) => {
  console.log(`✅ User registered event received for userId: ${userId}`);
});
