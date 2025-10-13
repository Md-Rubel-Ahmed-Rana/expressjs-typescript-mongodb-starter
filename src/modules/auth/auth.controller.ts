import BaseController from "@/shared/baseController";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { HttpStatusCode } from "@/lib/httpStatus";
import { cookieManager } from "@/shared/cookie";
import { envConfig } from "@/config/index";

class Controller extends BaseController {
  register = this.catchAsync(async (req: Request, res: Response) => {
    await AuthService.register(req.body);

    const verificationMethod = envConfig.app.default_verification_method; // 'phone' | 'email' | undefined
    const isVerificationEnabled = !!verificationMethod;

    let dynamicMessage = "";
    let verifyData: null | {
      shouldVerify: boolean;
      method: "otp" | "link";
      channel: "email" | "phone";
    } = null;

    if (isVerificationEnabled) {
      const isPhoneVerification = verificationMethod === "phone";

      const verifySubMethod = isPhoneVerification
        ? "otp"
        : envConfig.app.default_email_verify_method === "otp"
          ? "otp"
          : "link";

      const displayMethod = isPhoneVerification ? "phone number" : "email";
      const displaySubMethod = verifySubMethod === "otp" ? "code" : "link";

      dynamicMessage = ` We've sent a verification ${displaySubMethod} to your ${displayMethod}. Please verify your account.`;

      verifyData = {
        shouldVerify: true,
        method: verifySubMethod, // 'otp' or 'link'
        channel: isPhoneVerification ? "phone" : "email",
      };
    }

    this.sendResponse(res, {
      statusCode: HttpStatusCode.CREATED,
      success: true,
      message: `Your account has been created successfully.${dynamicMessage}`,
      data: verifyData,
    });
  });

  getLoggedInUser = this.catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.getLoggedInUser(req.user?.id);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Authenticated user retrieved successfully",
      data: result,
    });
  });

  forgetPassword = this.catchAsync(async (req: Request, res: Response) => {
    await AuthService.forgetPassword(req.body.phone_number);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "We've sent a verification code to your phone number",
      data: null,
    });
  });

  resetPassword = this.catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.resetPassword(req.body);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Your password has been reset successfully",
      data: result,
    });
  });

  login = this.catchAsync(async (req: Request, res: Response) => {
    const { access_token, refresh_token, user } = await AuthService.login(
      req.body
    );
    cookieManager.setTokens(res, access_token, refresh_token);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "User has been logged in  successfully",
      data: user,
    });
  });

  changePassword = this.catchAsync(async (req: Request, res: Response) => {
    await AuthService.changePassword(req.user?.id, req.body);
    cookieManager.clearTokens(res);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Your password has been changed successfully",
      data: null,
    });
  });

  googleLogin = this.catchAsync(async (req: Request, res: Response) => {
    if (req?.user) {
      const { access_token, refresh_token } = await AuthService.googleLogin(
        req.user
      );
      cookieManager.setTokens(res, access_token, refresh_token);
      res.redirect(envConfig.google_auth.redirect_url);
    }
  });

  logout = this.catchAsync(async (req: Request, res: Response) => {
    cookieManager.clearTokens(res);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "User logged out successfully",
      data: null,
    });
  });
}

export const AuthController = new Controller();
