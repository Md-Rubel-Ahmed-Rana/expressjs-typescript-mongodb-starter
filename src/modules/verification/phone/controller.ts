import BaseController from "@/shared/baseController";
import { HttpStatusCode } from "@/lib/httpStatus";
import { cookieManager } from "@/shared/cookie";
import { PhoneVerifyService } from "./service";

class Controller extends BaseController {
  verifyOtp = this.catchAsync(async (req, res) => {
    const { access_token, refresh_token, user } =
      await PhoneVerifyService.verifyOtp(req.body);
    cookieManager.setTokens(res, access_token, refresh_token);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Your account has been verified & logged in successfully",
      data: user,
    });
  });

  resendVerifyOtp = this.catchAsync(async (req, res) => {
    await PhoneVerifyService.resendVerifyOtp(req.body.phone_number);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message:
        "We've resent a verification code to your phone number. Please verify your account",
      data: null,
    });
  });
}

export const PhoneVerifyController = new Controller();
