import BaseController from "@/shared/baseController";
import { EmailVerifyLinkService } from "./service";
import { HttpStatusCode } from "@/lib/httpStatus";
import { cookieManager } from "@/shared/cookie";

class Controller extends BaseController {
  verifyToken = this.catchAsync(async (req, res) => {
    const { access_token, refresh_token, user } =
      await EmailVerifyLinkService.verifyTokenFromLink(req.body.token);
    cookieManager.setTokens(res, access_token, refresh_token);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Your account has been verified & logged in successfully",
      data: user,
    });
  });

  resendVerificationLink = this.catchAsync(async (req, res) => {
    await EmailVerifyLinkService.sendVerificationLink(req.body);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message:
        "We have resent another verification link. Please check and verify your account",
      data: null,
    });
  });
}

export const EmailVerifyLinkController = new Controller();
