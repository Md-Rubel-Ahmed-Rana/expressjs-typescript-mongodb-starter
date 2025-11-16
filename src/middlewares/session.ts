import { Application } from "express";
import session from "express-session";
import passport from "passport";
import { RedisStore } from "connect-redis";
import { envConfig } from "../config";
import { redisClientConfig } from "@/config/redis";

export const initiatePassportSession = (app: Application) => {
  const redisStore = new RedisStore({
    client: redisClientConfig,
    prefix: "sess:",
  });

  app.use(
    session({
      store: redisStore,
      secret: envConfig.google_auth.client_secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: envConfig.app.env === "production" ? true : false,
        maxAge: 1000 * 60 * 60 * 24,
      },
    }) as any
  );

  app.use(passport.initialize() as any);
  app.use(passport.session());

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user: any, done) => done(null, user));

  console.log("✅ Passport session initialized successfully");
};
