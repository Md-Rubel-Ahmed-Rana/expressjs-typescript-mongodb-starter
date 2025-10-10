import passport from "passport";
import googleOAuth from "passport-google-oauth20";
import { StrategyConfigs } from "@/utils/OAuth";

const GoogleStrategy = googleOAuth.Strategy;

const { google } = StrategyConfigs;

// Configure google strategy
passport.use(
  new GoogleStrategy(google, (accessToken, refreshToken, profile, done) => {
    try {
      const { displayName, emails, photos } = profile;
      if (displayName && emails && photos) {
        const user = {
          name: displayName,
          email: emails[0].value,
          profile_picture: photos[0].value,
        };
        done(null, user);
      }
    } catch (error) {
      console.log("Failed to login with Google", error);
      done(error, undefined);
    }
  })
);
