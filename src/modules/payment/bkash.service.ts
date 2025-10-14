import { envConfig } from "@/config/index";
import { HttpStatusCode } from "@/lib/httpStatus";
import ApiError from "@/middlewares/error";
import axios, { AxiosRequestConfig } from "axios";

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

  // Internal helper to ensure token is valid or refresh it
  private async ensureToken() {
    const now = Date.now();
    if (!this.id_token || !this.token_expiry || now >= this.token_expiry) {
      await this.grantToken();
    }
  }

  //  Grant Token
  private async grantToken() {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: this.username,
          password: this.password,
        },
      };

      const body = { app_key: this.app_key, app_secret: this.app_secret };

      const { data } = await axios.post(this.grant_token_url, body, config);

      if (!data?.id_token) {
        throw new ApiError(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          "Failed to get bKash grant token"
        );
      }

      this.id_token = data.id_token;
      // bKash sandbox tokens valid for 3600 seconds (1h)
      this.token_expiry =
        Date.now() + (data.expires_in ? data.expires_in * 1000 : 3500 * 1000);

      console.log("bKash grant token received ✅");
      return data;
    } catch (error: any) {
      console.log("Bkash Grant Token Error", error);
      throw new ApiError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        `bKash grantToken failed: ${error?.message}`
      );
    }
  }
}

export const BkashService = new Service();
