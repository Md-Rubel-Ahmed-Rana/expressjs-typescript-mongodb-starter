import { envConfig } from "../config";

/**
 * Google OAuth Strategy Configuration
 * ------------------------------------
 * Contains credentials and settings required for Google OAuth 2.0 authentication.
 *
 * These values are loaded dynamically from environment variables (`envConfig`).
 *
 * @property {string} clientID - The Google OAuth client ID.
 * @property {string} clientSecret - The Google OAuth client secret.
 * @property {string} callbackURL - The backend route Google redirects to after login.
 * @property {string} redirectUrl - The frontend URL to redirect the user after authentication.
 * @property {string[]} scope - The Google OAuth scopes (data access permissions).
 *
 * @example
 * ```ts
 * import { StrategyConfigs } from "@/config/strategy.config";
 * console.log(StrategyConfigs.google.clientID);
 * // "1234567890-abcdef.apps.googleusercontent.com"
 * ```
 */
const google = {
  clientID: envConfig.google_auth.client_id,
  clientSecret: envConfig.google_auth.client_secret,
  callbackURL: envConfig.google_auth.callback_url,
  redirectUrl: envConfig.google_auth.redirect_url,
  scope: ["profile", "email"],
};

/**
 * Strategy Configurations
 * ------------------------
 * Centralized configuration object for all third-party OAuth strategies.
 *
 * Add new providers (e.g., GitHub, Facebook, Twitter) under this object in the future.
 *
 * @example
 * ```ts
 * import { StrategyConfigs } from "@/config/strategy.config";
 *
 * const githubConfig = StrategyConfigs.github;
 * const googleConfig = StrategyConfigs.google;
 * ```
 *
 * @remarks
 * This structure makes it easy to register strategies dynamically in
 * authentication services or Passport.js configurations.
 */
export const StrategyConfigs = {
  google,

  // Future providers (examples):
  // github: { clientID: "", clientSecret: "", callbackURL: "", scope: ["user:email"] },
  // facebook: { clientID: "", clientSecret: "", callbackURL: "", scope: ["email"] },
};
