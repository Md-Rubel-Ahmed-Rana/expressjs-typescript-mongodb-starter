import BaseController from "@/shared/baseController";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { HttpStatusCode } from "@/lib/httpStatus";
import { cookieManager } from "@/shared/cookie";
import { envConfig } from "@/config/index";

class Controller extends BaseController {
  register = this.catchAsync(async (req: Request, res: Response) => {
    await AuthService.register(req.body);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.CREATED,
      success: true,
      message:
        "Your account has been created successfully. We've sent a verification code to your phone number",
    });
  });

  verifyAccount = this.catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.verifyAccount(req.body);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Your account has been verified successfully",
      data: result,
    });
  });

  resendVerificationOtp = this.catchAsync(
    async (req: Request, res: Response) => {
      await AuthService.resendVerificationOtp(req.body.phone_number);
      this.sendResponse(res, {
        statusCode: HttpStatusCode.OK,
        success: true,
        message: "We've sent a verification code to your phone number",
        data: null,
      });
    }
  );

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
    const result = await AuthService.login(req.body);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "User has been logged in  successfully",
      data: result,
    });
  });

  changePassword = this.catchAsync(async (req: Request, res: Response) => {
    await AuthService.changePassword(req.user?.id, req.body);
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
}

export const AuthController = new Controller();
