import { Application } from "express";
import session from "express-session";
import passport from "passport";
import { RedisStore } from "connect-redis";
import Redis from "ioredis";
import { envConfig } from ".";

// Create a new Redis client
const redisClient = new Redis({
  host: envConfig.redis.host,
  port: Number(envConfig.redis.port),
  password: envConfig.redis.password,
});

export const initiatePassportSession = (app: Application) => {
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: envConfig.google_auth.client_secret,
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize user into the session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Deserialize user from the session
  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });
  console.log("Passport/Express session initiated successfully");
};
