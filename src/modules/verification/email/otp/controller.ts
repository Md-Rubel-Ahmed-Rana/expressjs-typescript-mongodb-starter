import BaseController from "@/shared/baseController";
import { HttpStatusCode } from "@/lib/httpStatus";
import { cookieManager } from "@/shared/cookie";
import { EmailVerifyOTPService } from "./service";

class Controller extends BaseController {
  verifyOtp = this.catchAsync(async (req, res) => {
    const { access_token, refresh_token, user } =
      await EmailVerifyOTPService.verifyOtp(req.body);
    cookieManager.setTokens(res, access_token, refresh_token);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Your account has been verified & logged in successfully",
      data: user,
    });
  });
}

export const EmailVerifyOtpController = new Controller();
