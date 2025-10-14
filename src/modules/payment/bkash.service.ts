import { envConfig } from "@/config/index";

class Service {
  // --- bKash URLs ---
  private readonly grant_token_url = envConfig.bkash.urls.grant_token_url;
  private readonly create_payment_url = envConfig.bkash.urls.create_payment_url;
  private readonly execute_payment_url =
    envConfig.bkash.urls.execute_payment_url;
  private readonly refund_transaction_url =
    envConfig.bkash.urls.refund_transaction_url;
  private readonly callback_url = `${envConfig.bkash.urls.callback_url}/payments/bkash/execute-callback`;

  // --- bKash Credentials ---
  private readonly username = envConfig.bkash.credentials.username;
  private readonly password = envConfig.bkash.credentials.password;
  private readonly app_key = envConfig.bkash.credentials.app_key;
  private readonly app_secret = envConfig.bkash.credentials.app_secret;

  // --- Session Token (expires hourly) ---
  private id_token: string | null = null;
  private token_expiry: number | null = null;
}

export const BkashService = new Service();
