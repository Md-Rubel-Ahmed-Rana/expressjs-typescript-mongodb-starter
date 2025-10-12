import { createClient } from "redis";
import { envConfig } from ".";

export const redisClientConfig = createClient({
  socket: {
    host: envConfig.redis.host,
    port: Number(envConfig.redis.port),
  },
  password: envConfig.redis.password,
});

export const redisClient = async () => {
  console.log("⏳ Connecting Redis Cache Database...");
  try {
    await redisClientConfig.connect();
    console.log("✅ Redis connected successfully");
  } catch (error) {
    console.error("❌ Redis connection error:", error);
  }
};
