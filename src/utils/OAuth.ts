import { envConfig } from "../config";

const google = {
  clientID: envConfig.google_auth.client_id,
  clientSecret: envConfig.google_auth.client_secret,
  callbackURL: envConfig.google_auth.callback_url,
  redirectUrl: envConfig.google_auth.redirect_url,
  scope: ["profile", "email"],
};

export const StrategyConfigs = {
  google,
};
